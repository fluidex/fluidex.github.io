---
title: "ZK-Rollup development experience sharing, Part I"
description: ""
category:
tags: []
---

_Acknowledgement: we would like to thank barryWhiteHat, Koh Wei Jie for their insightful feedbacks._

Prerequisites: basic programming and blockchain knowledge, no cryptography background needed.

Currently, major expectations on blockchain technology are further scaling, higher performance and lower costs. In this post, we will dive into ZK-Rollup, which is one of the [Ethereum layer 2 scaling solutions](https://ethereum.org/nl/developers/docs/layer-2-scaling/). It exquisitely applies a zero knowledge proof technique (known as ZK-SNARK) to reduce the on-chain costs, and thus, is able to improve Ethereum TPS considerably (~10x-100x). ZK-Rollup is considered as the most important Ethereum Layer 2 scaling solution in the long term by many people, including Vitalik, the founder of Ethereum.

> In general, my own view is that in the short term, optimistic rollups are likely to win out for general-purpose EVM computation and ZK rollups are likely to win out for simple payments, exchange and other application-specific use cases, but in the medium to long term ZK rollups will win out in all use cases as ZK-SNARK technology improves. -- Vitalik

In this series of posts, we will share our experience on developing a ZK-Rollup system. The motivation of these posts is that, currently there are many high quality resources introducing the cryptography behind ZK-SNARK, with a lot of math details. In the meantime, there are also many non-technical blogs looking into the impact and prospect of ZK-Rollup. Very few will dive into questions like, how does ZK-Rollup boost performance exactly? Or, how does a complete ZK-Rollup system look like? Or, is there any important but usually overlooked details in a ZK-Rollup system?

[Fluidex](https://github.com/Fluidex/), as one of the very few teams that are independently developing a ZK-Rollup system from scratch, is happy to share some experience gained from ZK-Rollup system development. We hope this could benefit other developers in the field. We will talk about some important but rarely mentioned topics, like where the performance bottleneck is in a ZK-Rollup system, where does the economic cost lie, etc.

## Overview of ZK-SNARK & ZK-Rollup

Again, we won't focus on the cryptographic details of ZK-SNARK proof, because as stated, there are enough high quality resources explaining it. In this chapter, we will briefly answer the following questions: What can ZK-SNARK do? Why does it become the core of ZK-Rollup, and help boost Ethereum performance along with "rollup"? What does "rollup" mean exactly?

### The Nature of ZK-SNARK

Generally speaking, in a blockchain ecosystem, each node will execute the same computation for each transaction in the block, then verify that their results are the same as those of other nodes. In other words, for each transaction to be on chain, it will be executed by every node. That's one major reason why blockchain have relatively low performance.

However, is "computing again" the only way to verify a transaction? To put it differently: is it necessary that the cost of verifying is as much as the cost of computing?

The answer is NO. Verifying could be cheaper than computing. Let's take Sudoku for example. The complexity of solving a Sudoku is quite different from that of verifying a Sudoku solution. To "compute again" is the least efficient verification method. If you happen to have a computer science background, just consider the P vs NP problems in computational complexity theory.

Therefore, in blockchain, it's worthwhile to have a technical solution that can lower the verification cost, even by increasing the computation cost. The reason is that, for each transaction, computation will only happen once, while verification will happen on every node. **ZK-SNARK by nature is such a technique that significantly lowers the verification cost.** Generally, ZK-SNARK can make the verification cost several orders of magnitude less than the computational cost. To be precise, reducing the verification complexity from linear to constant (or logarithmic), that is what "succinctness", the "S" in "SNARK", stands for.

Let's look at how ZK-SNARK works.

For a particular program, it will first be preprocessed. After the one-off preprocessing, for each input, a prover will need to compute the result corresponding to the input, as well as generate a "proof" (usually in form of big integers) with relatively larger costs. Any verifier could use this "proof" and input to quickly verify the correctness of the result without actually running the program.

A more detailed description in pseudo code:

```js
// here is the the application code
// it is usually called 'circuit code'
function some_function(inputs):
   // no global vars allowed here
   outputs = some_calculation(inputs)
   return outputs


// preprocessing only runs once for every 'some_function'
// we deliberately ignore 'setup' here to make it easier for understanding
// for a more precise and detailed description, you can have a look at the references at the end of this article
const preprocess_result = zksnark_preprocess(some_function)
const verification_key = preprocess_result.verification_key;
const proving_key = preprocess_result.proving_key;

// for every 'inputs', generate 'proof'. The following codes run off chain
// we deliberately ignore 'witness' here to make it easier for understanding
// we will make more explanation on what consists of inputs/outputs of a realworld ZK-Rollup system in the following sections
const outputs = some_function(inputs);
// the 'prove' will need a lot of computing resource to finish
const proof = zksnark_prove(proving_key, input, output);

// verify the input/output is correct
// The following codes usually run on chain
const is_correct = zksnark_verify(verification_key, input, output, proof);
assert(is_correct == true);
```

### Real-world Design of a Rollup System

In a normal Rollup system, we will maintain a global merkle tree. All states in the Rollup system (including the balance of each token of the account, nonce of the account, etc.) will become a leaf node on the tree.

ZK-SNARK will guarantee mathematically that every update to the merkle tree satisfies some "predetermined rules". Those rules are determined by the ZK-Rollup developers' settings. For example, for a ZK-Rollup transfer system, the developers could demand that:

1. Transfer amount is less than the balance of the sender account;
2. The signature of the sender account is valid, and nonce is correct;
3. The amount reduced in the sender account equals the amount increased in the receiver account.

Additionally, the hash of the merkle root will be computed from the new leaf.

To guarantee security in the worst case (that is, even if the operators of the Rollup system run off, users can still withdraw their assets in one piece), the system should make sure users are able to rebuild the tree from scratch (known as "data availability"), and are able to make assertions  like "Alice actually has 3 ETH in this tree" by merkle proof. To achieve this, the system should make the data of each transaction public, and stored on chain.

For a batch of hundreds or thousands of transactions, after we executed them in a particular order and updated the merkle tree, we will use ZK-SNARK to prove the correctness of the result (i.e., the new root of the merkle tree). Note that the number of transactions here is determined by a predefined config, which is fixed during runtime. This batch of transactions will be proved and verified together, known as a "L2 Block".

Again, let's use pseudo code to demonstrate the data flow in a real-world ZK-Rollup system:


```js
// the following code runs as smart contract
// 'global_merkle_tree_root' is the only state needed to be stored inside smart contract
let global_merkle_tree_root = ...;
const verification_key = ...;
function init() {
  // set global_merkle_tree_root and verification_key
}

function verify_txs(proof, txs, old_merkle_root, new_merkle_root) {
   assert(old_merkle_root == global_merkle_tree_root);
   // in fact we will hash of txs/old_merkle_root/new_merkle_root as a single input to 'zksnark_verify' for performance. We will not discuss this detail here as it does not block understanding
   assert(zksnark_verify(proof, txs, old_merkle_root, new_merkle_root);
   global_merkle_tree_root = new_merkle_root;
}
```

We can see that apart from the merkle root, the contract won't store any states. For every state update, it needs the off-chain module to prepare the complete transaction input and proof. For those who are familiar with Stateless Ethereum, ZK-Rollup is actually very similar to Stateless Ethereum in this way.

## System Architecture of ZK-Rollup

One ZK-Rollup system needs at least the following modules:

1. Smart Contract on Chain:
  + To verify the validity of each merkle tree update, and maintain the correct merkle tree root;
  + In a situation where Rollup system is down, to make sure users are able to withdraw their rightful assets by directly calling the contract;
  + To coordinate between L1 and L2, ensuring users' deposits can be processed in time and updated into the merkle tree.

2. Prover Cluster: To do immense cryptographic calculations to generate ZK-SNARK proof for each L2 Block. Usually a large-scale cluster is required, which consumes more than 99% of the computing resources in the system.
3. State Manager: To maintain the complete merkle tree. For each transaction, it updates the merkle tree and provides necessary data for Prover Cluster (e.g., merkle proof).
4. Other Business Modules: like a L2 browser. Besides, each Rollup system has their own specialized business modules. For example, Fluidex has a [order matching engine](https://github.com/Fluidex/dingir-exchange), which generates matched transactions from users' orders, then sends them to the State Manager.

## TPS limit of ZK-Rollup

What is the main constraint on TPS of a ZK-Rollup system?

### Speed of proving

Proving is the most resource consuming part of a ZK-Rollup system. Those who are new to ZK-Rollup usually mistakenly believe that speed of proving is the main constraint on TPS. Actually, as the proving of each L2 Block can be done completely in parallel, using a prover cluster with size of hundreds is a common practice. Therefore, although ZK-SNARK proofs do take long, it will mostly lead to a longer latency of withdrawing from L2 to L1, as well as a higher server cost for operators, but not a limitation on TPS.

### Storing data on-chain and ETH GAS limitations

Well this is a real constraint on TPS. Let's look back at the ZK-Rollup overall design. To ensure security/data availability, each transaction should be stored on chain. This part of data will be stored in ETH transaction history as CALLDATA, with an average cost of 16 gas/byte. For a normal transfer/matched order, each transaction is estimated to be 40 bytes.

Let's try estimating the TPS limit by gas limitations.

It takes ~13s for each ETH block to be mined, with maximum gas of 12.5 Million. Suppose a ZK-SNARK verify costs 0.3-0.5 Million gas, then each ETH block could contain at most 12,000,000 / (40\*16) ~= 20,000 transactions. So in this way, the TPS limit of ZK-Rollup would be 1500-2000. This is also the performance upper-bound claimed by many Rollup systems in whitepapers.

### Global state update on Merkle Tree

This is a rarely discussed but crucial perspective. **The TPS of a real-world ZK-Rollup system is actually more limited by this module, rather than proving speed or gas limitations discussed above**.

To support a large number of users and assets, we need the Merkle Tree to have a certain depth. Assuming we are using a binary dense merkle tree, and we intend to support 1 Million users and 1000 types of assets, then the depth of the merkle tree is required to be 30. Suppose each transaction will cause updates on 5-10 leaf nodes, then there'll be ~200 hash calculations in total.

For performance considerations, we won't use normal hash like SHA3 in a ZK-Rollup merkle tree. Instead, we'll use a more ZK-SNARK compatible one like poseidon or rescue. According to [test results from Fluidex](https://github.com/Fluidex/state_keeper/blob/a80c40015984886b68a295a810c64a682ba13135/src/types/merkle_tree.rs#L326), each poseidon hash takes about 30us (tree depth of each test is 20, thus, each hash would be 57ms / 100 / 20 ~= 30us). So estimating from merkle tree perspective, the limit of a ZK-Rollup system would be 1 / 0.00003 / 200 = 160 TPS.

Therefore, [parallel updating](https://github.com/Fluidex/state_keeper/blob/a255043cbe7c899c6a8d9cc46b170a40f20623c9/src/types/merkle_tree.rs#L127) on the merkle tree is essential to break through the 100-300 TPS level. Unlike computing ZK-SNARK proofs, which could be parallelized completely, to parallelize merkle tree updates requires more discretion, and is very hard to apply distributed computing on it. This is also a technical challenge.

The 100-300 TPS calculated above is close to many real-world ZK-Rollup system's actual performance upper-bound.

## Economic Cost Analysis

### ZK-Rollup normally needs thousands of CPU cores for proving

Let's still take [PLONK](https://github.com/fluidex/awesome-plonk) [circuits](https://github.com/Fluidex/circuits) used by Fluidex as a typical ZK-Rollup case. In our latest test, for each L2 Block with 100 transactions, it takes ~20min to run a proof on a 24 core server. To reach 100 TPS performance, we will need ~300 EC2 c5.12xlarge instances, which costs ~500 USD/h. This means each Layer 2 transaction will cost 0.001 USD in off-chain calculations. Note that we haven't invested a lot on performance optimization yet, we expect there'll be a lot to improve here in the future.

### On-chain gas cost much higher than off-chain server cost

The cost of off-chain calculations mentioned above is actually a drop in the bucket compared to the on-chain GAS cost. Assuming each Layer 2 transaction needs 40 bytes of on-chain data, ETH is ~2000 USD, GAS price is 200 Gwei, then the cost of each transaction on-chain is ~2.6USD. This is much higher than the 0.001 USD off-chain. However, this is also much lower than a complex Layer 1 transaction, where GAS cost is normally tens of USD. That's why we often say ZK-Rollup could bring at least two orders of magnitude cost saving.

### Low cost-efficiency Cloud GPU services

Many developers might wonder what GPU could bring to computing power. In ZK-SNARK proving, GPUs could accelerate computing by ~3x-5x. But on the other hand, due to immaturity of virtualization, GPU from cloud services are disproportionately expensive compared to the cost of CPU. Such that there are even cases where [CPU is cheaper than GPU](https://minimaxir.com/2017/07/cpu-or-gpu/) in deep learning model training. Therefore, if you are not building your own data center but using cloud services, using GPU for ZK proofs would be a low marginal utility choice.

Of course, all the above analysis data will be affected by system efficiency and ETH GAS price, but unlikely to deviate in orders of magnitude in a foreseeable future.

## Miscellaneous development experience

#### Why are ZK-SNARK logic descriptions called "circuits"?

For anyone with software engineer experience, in the following code, only one of the if- branch and else- branch will be executed, rather than both executed and only one chosen.

```js
function binaryOp(op, arg1, arg2) {
  if (op == "add") {
    return arg1 + arg2;
  } else {
    // assert(op == 'mul');
    return arg1 * arg2;
  }
}
```

Such concept that "only one conditional branch will be executed" seems natural for software development, but it's not the case for the design of hardware chip circuits. In development of sequential logic circuits in hardware, logics of all "branches" (if still called "branch") will be executed at the time the sequence is triggered. The developer needs to choose and maintain correct global states from different "branches".

In a ZKP system, program logic will eventually be converted into some immense polynomials (probably with hundreds of millions of terms), which is called arithmetization, such that proving of the program will be converted to proving of the polynomials. The polynomials are then constrained in the form of gate circuit. That's also one of the reason why we call ZKP programs as circuits. Thus, the code has the same property as hardware circuits: code from all branches will be executed together. That's why ZK proof code is called "circuits". In addition, similar to hardware circuits, there are no recursion and complex loops in the ZK proof circuits, and the number of loops can only be constant (actually, loops will be unrolled as syntactic sugars, i.e., loop unrolling).

Therefore, when developing ZK proof circuits, developers need to reconsider their habits from software development. For example, when optimizing softwares, we could focus on the most frequently executed branch, and deprioritize the non-frequent ones. But in ZK proof circuits, as all branches will be executed, the non-frequent branches need to be considered as well.


### Opinions on DSL

There are several choices for ZK proof circuit development, such as low-level computing libraries like [ethsnarks](https://github.com/HarryR/ethsnarks) / [bellman](https://github.com/zkcrypto/bellman), or DSL like [ZoKrates](https://github.com/Zokrates/ZoKrates) / [Circom](https://github.com/iden3/circom) / [Zinc](https://github.com/matter-labs/zinc).

We chose Circom, which provides a just right level of abstraction. On the one hand, it improves the efficiency of reading/writing code, on the other hand, it doesn't distort the details of the underlying circuits.

In comparison, developing with ethsnarks and bellman is of lower efficiency. Also, when the code is being reviewed, no matter internally or externally, too much "syntactic noise" prevents the reviewer from focusing on the core logic. Additionally, ZoKrates and Zinc provide a too high level of abstraction. For example, python-style control flow syntax in ZoKrates conceals the underlying circuits, and is not conducive to lower level optimizations (such as inline assembly of C/Rust).

As an analogy,  ethsnarks / bellman is like assembly language in traditional development, while cirom is like C, and ZoKrates is like Python. However, ZoKrates toolchain is not as mature as Python interpreter. That's why we'd rather use "C" (cirom in this case) as the our development language, instead of maintaining both "Python" (ZoKrates in this case) code and "CPython interpreter" (ZoKrates interpreter in this case) code.

However, Circom is essentially still a R1CS DSL. Fluidex actually uses PLONK proof system. We probably would make major changes on Circom to better utilize PLONK, including supports for custom gate, plookup, aggregation & recursion, etc.

## Further Readings

### Techinical Blogs

+ [vitalik blog on rollup](https://vitalik.ca/general/2021/01/05/rollup.html)
+ [vitalik blog on ZK-SNARK](https://vitalik.ca/general/2021/01/26/snarks.html)
+ [Stateless Ethereum](https://docs.ethhub.io/ethereum-roadmap/ethereum-2.0/stateless-clients/)

### Projects

ZK-Rollup projects launched:

+ [zksync](https://github.com/matter-labs/zksync): the most complete open source code of ZK-Rollup, containing all modules for a ZK-Rollup system. It uses PLONK protocol, bellman for circuits, and Rust for off-chain code.
+ [hermez](https://github.com/hermeznetwork/): similar to zksync. It uses Groth16 protocol, Circom for circuits, and Go for off-chain code.
+ [loopring](https://github.com/Loopring/protocols/tree/master/packages/loopring_v3): only has circuit code and contract in open source. It uses Groth16 protocol, ethsnark for circuits. Off-chain code is not open sourced yet.

ZK-Rollup projects under developing:

+ [fluidex](https://github.com/Fluidex): circuits, state manager, and matching engine in open sourced. It uses PLONK protocol, circom for circuits, and Rust for off-chain code.

Non ZK-Rollup projects that use ZK-SNARK:

+ [MACI](https://github.com/appliedzkp/maci/)
+ [Tornado Cash](https://github.com/tornadocash)

## About Us

We are the development team of [Fluidex: A Layer 2 ZK-Rollup DEX on Ethereum](https://www.fluidex.io/posts/2020-11-30-fluidex-a-zkrollup-layer2-dex/).
