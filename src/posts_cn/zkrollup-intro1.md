---
title: "ZK-Rollup 开发经验分享 Part I"
description: ""
category:
tags: []
---

_致谢：感谢 barryWhiteHat、Koh Wei Jie 给我们提供的宝贵意见！_

对读者的期待：需要有基础的编程知识和区块链知识，可以没有任何密码学背景。

很多用户期待区块链能进一步扩容，提升性能，降低使用成本。本文将谈到的 ZK-Rollup 是 [以太坊 Layer 2 扩容方案](https://ethereum.org/nl/developers/docs/layer-2-scaling/) 中的一种，它精巧地使用零知识证明(ZK-SNARK)这种密码学技术来完成链上计算资源消耗的压缩，从而能够极大地(~10x-100x)提升 Ethereum 的性能。包括 Ethereum 创始人 Vitalik 在内的很多人 认为 ZK-Rollup 是长期来看最重要的 Layer 2 扩容方案。

> In general, my own view is that in the short term, optimistic rollups are likely to win out for general-purpose EVM computation and ZK rollups are likely to win out for simple payments, exchange and other application-specific use cases, but in the medium to long term ZK rollups will win out in all use cases as ZK-SNARK technology improves. -- Vitalik

本文会分享一些 ZK-Rollup 开发中的经验。撰写本文的动机在于，互联网有大量高质量的资料介绍 ZK-SNARK （零知识证明）理论本身，这些文章会介绍详细的密码学细节，另一些不太偏向技术的文章则会展望 ZK-Rollup 的作用和前景。较少见有文章会深入地介绍 ZK-Rollup 到底是怎么提升性能的？一个完整的 ZK-Rollup 系统是长什么样的？ZK-Rollup 系统中有什么少被人讨论但是重要的常识经验吗？

[Fluidex 团队](https://github.com/Fluidex/) 作为全世界少数几个在独立开发完整 ZK-Rollup 系统的团队，希望能够分享一些自己在开发 ZK-Rollup 系统中的经验，能够反哺业界的其他参与者。我们想分享一些重要但是很少被谈到的话题，比如 ZK-Rollup 系统的性能瓶颈在哪里，它的成本又是如何构成的等。

## ZK-SNARK& ZK-Rollup 概述

本文重点不会在于零知识证明（ZK-SNARK） 的理论本身，因为这个话题你可以在互联网上搜到足够多高质量的资料，在此不多重复。本章节会简要介绍：ZK-SNARK 能做什么？它何以能够成为 ZK-Rollup 的核心部分，和 "rollup" 一起协助以太坊提升性能？rollup 又是什么意思？

### ZK-SNARK 本质是什么？

在区块链系统中，一般而言每个节点会做完全相同的计算，每个节点都会执行区块中每个交易，并且验证它自己的执行结果和其他节点的执行结果完全相同。换言之，每个链上交易，都会被区块链的每一个参与节点执行一遍，这是为什么区块链系统性能较低的一个重要原因。

只有重新计算一遍才能验证交易吗？换言之，验证的计算量一定得等于计算吗？

不是的，验证可以比计算容易。举个例子，对于数独游戏而言，解数独的复杂性和验证数独游戏解的复杂性是完全不同的。“把计算重做一遍”是最差的验证方式。如果读者有计算机科学的背景，你可以回忆计算复杂度中 P vs NP 的问题。

所以，在区块链中，如果有一种技术，能够降低验证的代价，即使增加了计算的代价，也是值得的。因为计算只发生一次，而验证会发生在每个节点上。**ZK-SNARK 的本质正是这样一种压缩验证计算量的技术**，通常 ZK-SNARK 能够使得验证交易的计算量比执行交易少几个数量级，准确地说，是把验证的复杂度从线性变成常数(或对数)。

对于一段特定的程序，ZK-SNARK 首先对这段程序做预处理，一次预处理完成之后，对于每份输入(input)，都首先计算输入的执行结果，再花费较大的计算资源生成一份 proof ( proof 实际上是很多大数 )。任何验证者，可以通过这份 proof 和本次执行使用的 input，快速验证执行的结果是正确的。

更加精细的伪代码描述：

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

### 真实世界 Rollup 系统的设计

在一般 Rollup 系统的设计中，我们会维护一颗全局的 merkle tree。Rollup 系统中的所有状态（一般至少包括每个账户每种 token 的余额，账户的 nonce 等）都会成为这棵树中的一个叶子结点。

zksnark 会在数学上保证，每次对于 merkle tree 的更新都满足“预定规则”。这些“预定规则”是由 ZK-Rollup 的开发者的代码决定的。例如，对于一个 ZK-Rollup 转账系统，开发者可以在代码中要求，1. 转账金额小于转账发起账户的余额 2. 转账发起账户签名有效且 nonce 正确 3. 转账发起账户减少的金额等于转账接收账户增加的金额 ，此外，根结点的hash会从新的叶子结点重新计算出来。

为了保证最坏情况下的安全性（即 ZK-Rollup 的运营者在跑路之后，用户的资金能不受损失地提出来），一般要求用户能够重建整棵树(这叫 data availability) ，能够证明 “张三确实有 3 个 ETH 在这颗树中”（通过 merkle proof 等手段）。这要求系统处理的每一笔交易的数据都是完整公开的，存在区块链上。

我们通常对于数百甚至数千笔交易，按照指定顺序在这颗 merkle tree 上执行完成后，使用 ZK-SNARK 证明执行的结果（即新 merkle tree 的 root）是正确的。这数百或数千是一个预先决定的配置，而不能被动态更改。这批交易会被统一地证明和验证，它们被称为一个 "L2 Block"。

我们来使用伪代码解释，一个真实世界 ZK-Rollup 系统中的数据流形态：

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

可以看到，合约自身除 merkle root 外，并不储存任何状态。每次状态更新都需要链下模块来准备完整的交易输入和 proof。熟悉 Stateless Ethereum 的读者会意识到 Stateless Ethereum 和 ZK-Rollup 这两者的本质是非常相似的。

<!---
这里要不要解释下 witness / merkle proof 这些东西？
-->

## ZK-Rollup 系统架构

ZK-Rollup 系统至少需要以下几个组件：

1. 链上智能合约：负责验证 Merkle tree 的每次状态更新都是有效的，维护正确的 merkle tree root；在 Rollup 系统完全停机时，能够保证用户可以直接调用合约提取自己应有的资产；协调 L1 和 L2，保证用户向合约的充值能被及时处理并被更新在 Merkle tree 中。
2. Prover Cluster：对每个 L2 Block 做大量密码学计算获得 zksnark proof。通常需要一个大规模集群，会占用了系统中超过 99% 的计算资源。
3. State Manager：维护完整的 merkle tree。对于每个 tx，更新 merkle tree 并且为 prover cluster 提供必要的数据（如 merkle proof）。
4. 其他业务模块：如 L2 浏览器；此外，不同的具体 Rollup 系统还会有自己专门的业务模块，如 Fluidex 会有一个[订单簿撮合引擎](https://github.com/Fluidex/dingir-exchange)，从用户的委托订单生成匹配的交易，发送给 State Manager。

## ZK-Rollup 的 TPS 能力上限

一个 ZK-Rollup 系统的 TPS 能力上限被什么制约？

### 证明速度

证明是 ZK-Rollup 系统中最消耗计算资源的部分。刚刚接触 ZK-Rollup 的人常常会误认为证明速度限制了 TPS 的上限。实际上每个 L2 Block 的证明是可以完全并行的，使用几百台服务器来搭建证明集群是 common practice。zksnark 证明耗时长，会使得从 L2 向 L1 提现完成需要的时间更久，会给运营方造成更高的服务器成本，但不会限制 TPS。

### 数据上链和 ETH GAS 限制

这是一个真正限制 ZK-Rollup TPS 的因素。我们回顾刚才介绍的 ZK-Rollup 整体设计，可以看到为了安全性/data availability，每笔 layer 2 的交易都要有数据会上链。这部分数据会作为 CALLDATA 存入 ETH 的交易历史中，平均价格可以按照 16gas/byte 来估计。对于一般的转账&撮合等交易，每笔交易可以按照 40 bytes 来估计。

每个 ETH 块大约需要 13s，最高允许 gas 为 12.5 Million。按照单次 zksnark verify 成本为 0.3-0.5 Million gas 推算，单个 ETH block 内能容纳的 tx 数量上限为 12,000,000 / (40\*16) ~= 20000。因此按照链上 gas 限制估算的 ZK-Rollup TPS 上限约为 1500-2000。这也是很多 Rollup 系统在白皮书中声称的性能上限。

### Merkle Tree 全局状态的更新

这是一个很少被讨论但是至关重要的角度，**真实 ZK-Rollup 系统的性能上限实际上更被这个模块限制，而不是上面讨论的证明速度和 gas 限制**。

容纳较多用户和资产对于 Merkle tree 的深度有一定要求。假设使用 binary dense merkle tree ，我们打算容纳 1 Million 用户和 1000 种资产，则需要的 merkle tree 深度为 30。对于每笔交易，假设会导致 5-10 个叶子结点状态的更新，则总计约需要 200 次 hash。ZK-Rollup Merkle tree 中的 hash 出于 zksnark 证明性能考虑，不会使用 sha3 等普通 hash，而会使用 poseidon / rescue 等适用于 zksnark 的 hash 方式。按照 [Fluidex 团队的测试结果](https://github.com/Fluidex/state_keeper/blob/a80c40015984886b68a295a810c64a682ba13135/src/types/merkle_tree.rs#L326)，单次 poseidon hash 按照 30us 计算（每个test的树深度为20，故每个hash操作是57ms / 100 / 20 ~= 30us），则从 Merkle tree 角度估算的 ZK-Rollup 系统性能上限为 1 / 0.00003 / 200 = 160 TPS。

因此，必须实现 merkle tree 的 [并行更新](https://github.com/Fluidex/state_keeper/blob/a255043cbe7c899c6a8d9cc46b170a40f20623c9/src/types/merkle_tree.rs#L127)， ZK-Rollup 的 TPS 才会突破 100-300 这个层次。和 zksnark proving 可以完美分布式多机多核并行不同，使用并行加速 merkle tree 的更新需要较精细的代码控制，而且非常难以实现多机分布式加速。这也是个工程上的挑战。

上面推算的 100-300 TPS，接近不少实际运行中的 ZK-Rollup 系统的真实性能上限。

## 经济成本分析

### ZK-Rollup 一般需要几千个 CPU cores 做 proving

我仍然拿 Fluidex 的 [PLONK](https://github.com/fluidex/awesome-plonk) [电路](https://github.com/Fluidex/circuits) 作为一个典型 ZK-Rollup 系统的例子。在我们最新的一次性能测试中，每个包含 100 个交易的 L2 Block 的单次电路证明需要在 24core 服务器上消耗约 20min。因此如果需要达到 100 TPS 的性能，需要大约 300 台 EC2 c5.12xlarge，这意味着每小时 500 USD 左右的成本。此时每个 Layer 2 tx 链下计算成本为 0.001 USD。不过目前我们做性能优化的投入还很少，预计未来有较多提升空间。

### 链上的 gas 成本比链下服务器成本至少高两个数量级

以上所说的链下计算成本，比起链上的 GAS 成本来说是九牛一毛。假设每个 Layer 2 tx 需要 40 bytes 的上链数据，ETH 价格 2000USD，GAS 价格 200GWEI，则每个 tx 需要的链上 GAS 成本约为 2.6 USD。这个成本远远高于链下 0.001 USD 的成本，但是又远远低于链上 Layer 1 复杂交易动则几十 USD 的 GAS 成本，这也是我们常常说 ZK-Rollup 能够带来至少两个数量级成本下降的数字来源。

### 云服务中 GPU 非常没有性价比

不少开发者会关心 GPU 带来的计算能力提升。在 zk snark prove 上，GPU 能带来的计算加速常在 3x-5x 这个层次。但是另一方面，由于虚拟化的不成熟，云服务商的 GPU 成本比起 CPU 成本会不成比例的昂贵，以至于出现了训练深度学习模型，[CPU 比起 GPU 更便宜的奇观](https://minimaxir.com/2017/07/cpu-or-gpu/)。因此，如果不是自建数据中心而是使用云服务，那么使用 GPU 来加速零知识电路证明是边际效用不高的选择。

当然，以上所有的推算数据，会收系统代码效率和 ETH GAS 价格影响，但是预计可见未来内不太会出现量级偏差。

## 其他开发经验碎片

### ZK-SNARK 的逻辑描述为何被称为“电路”？

对于任何有软件开发经验的人来说，如下代码中，if 分支和 else 分支只会执行一个，而不是两个都执行后选择其中一个作为结果。

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

“不同代码分支下，计算量不会同时发生”对于软件开发似乎是天经地义的，但是对于数字芯片电路的硬件设计却并非如此。在硬件时序电路代码开发中，一般所有“分支”（如果这还叫“分支”的话）的逻辑都会在时序触发时全部执行，开发者需要自己从不同“分支”的计算结果中，正确地选择和维护全局状态。

在零知识证明系统中，代码逻辑会被转换成一些巨大（可能是几亿项）的多项式（称之为“算术化”），于是，问题就从“证明程序”转化为“证明多项式”。而多项式又会以门电路的方式被表达，以进行约束。这也是零知识证明电路被称之为“电路”的原因。因此零知识证明的代码具有和硬件电路相同的属性：所有分支的代码同时执行。这也就是“零知识证明电路”之所以被称为“电路”的原因。此外，和硬件电路类似，零知识证明电路中，没有递归和复杂循环，循环次数只能是常数（实际上最终这个循环会被作为语法糖展开，即 loop unrolling）。

因此在开发零知识证明电路代码时，开发者要重新思考自己在编写软件代码时养成的认知和习惯。例如，优化软件时，我们可以专注于代码最常执行的路径，而对于代码少走的分支则可以不优先处理。但是在零知识电路开发中，每一个分支都是会被执行的，因此不常执行的分支也需要投入同样的精力来优化。

<!---
这里有必要说吗？

在零知识证明电路中，最重要的元素是所谓“约束”，即我们要求一个多项式的值为0。在电路中常会有不同的模块，例如充值/转账等，他们各自有不同的约束条件，https://github.com/Fluidex/circuits/blob/aaa488149c293b1e847c732e93f9841d5715d141/src/lib/binary_merkle_tree.circom#L76

-->

### 对于 DSL 的看法

零知识证明电路的开发语言有不同的选择，既可以直接使用 C++/Rust 实现的底层计算库如 [ethsnarks](https://github.com/HarryR/ethsnarks) / [bellman](https://github.com/zkcrypto/bellman)，也可以使用一些 DSL 如 [ZoKrates](https://github.com/Zokrates/ZoKrates) / [Circom](https://github.com/iden3/circom) / [Zinc](https://github.com/matter-labs/zinc)。

我们最终的选择是 circom。 Circom 提供了恰到好处的抽象，一方面提升了读写代码的效率，另一方面也没有扭曲底层的真实细节。相比起来，ethsnarks 和 bellman 编写电路代码开发效率略低一点，而且代码被团队内部或者外部审计时，很多代码上的“语法噪音”会不利于代码读者的注意力集中到真正的核心逻辑上。ZoKrates 和 Zinc 提供的抽象层次又太高，例如 ZoKrates 中的类似 python 的控制流语法，掩盖了底层电路的本质，也不利于做一些深入底层的优化（好比 C/Rust 中内嵌汇编）。

如果用传统开发来类比，ethsnarks / bellman 更像是汇编，circom 是 C 语言，ZoKrates 是 Python。但是 ZoKrates 的工具链又没有真的成熟到 Python 解释器的程度，因此我们宁愿用 C 来作为唯一的开发语言，也不想自己同时维护 Python 代码和 CPython 解释器代码。

不过，Circom 本质上还是一种 R1CS 的 DSL，但是 Fluidex 实际使用了 PLONK proof system，因此我们有可能未来会对 Circom 做较大的改动，来更好的支持 PLONK 的 custom gate / plookup / aggregation & recursion 等特性。

## 更多阅读材料

### 技术文章

+ [vitalik blog on rollup](https://vitalik.ca/general/2021/01/05/rollup.html)
+ [vitalik blog on ZK-SNARK](https://vitalik.ca/general/2021/01/26/snarks.html)
+ [深入浅出零知识证明之 ZK-SNARKs](https://www.yuque.com/u428635/scg32w/edmn74)
+ [Stateless Ethereum](https://docs.ethhub.io/ethereum-roadmap/ethereum-2.0/stateless-clients/)

### 项目代码

已经上线的 ZK-Rollup 项目：

+ [zksync](https://github.com/matter-labs/zksync): 最完整的 ZK-Rollup 开源项目代码，涵盖了一个 ZK-Rollup 系统需要的每个组件。使用 PLONK 机制，电路代码使用 bellman，链下代码使用 Rust。
+ [hermez](https://github.com/hermeznetwork/): 和 zksync 类似。使用 Groth16 机制，电路代码使用 circom，链下代码使用 Go。
+ [loopring](https://github.com/Loopring/protocols/tree/master/packages/loopring_v3): 仅开源了电路代码和合约代码，没有开源 State Manager 模块。使用 Groth16 机制，电路代码使用 ethsnark，链下代码不开源。

开发中的 ZK-Rollup 项目：

+ [fluidex](https://github.com/Fluidex): 开源了电路代码，State Manager，交易所撮合引擎。 使用 PLONK 机制，电路代码使用 circom，链下代码使用 Rust。

使用 zksnark 技术但是不属于 ZK-Rollup 的项目：

+ [MACI](https://github.com/appliedzkp/maci/)
+ [Tornado Cash](https://github.com/tornadocash)

## 关于我们

我们是 [Fluidex: 基于 ZK-Rollup 的专业去中心化交易所](https://www.fluidex.io/posts_cn/2020-11-28-fluidex-/index.html) 的开发团队。
