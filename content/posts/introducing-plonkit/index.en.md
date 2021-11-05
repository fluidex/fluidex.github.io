---
title: "Introducing plonkit"
date: 2021-10-19 20:00:00
tags: [technical]
description: "When PLONK and Circom meet each other."
---

We are proud to annouce that, FluiDex has received an [ESP grant](https://blog.ethereum.org/2021/11/04/esp-allocation-update-q2-2021/) from Ethereum Foundation for our [plonkit](https://github.com/fluidex/plonkit). And since this work now gets completed, we would like to share more information about it.

## TL;DR
Plonkit is a zkSNARK toolkit to work with [Circom](https://github.com/iden3/circom), a developer-friendly ZKP circuit language, in [PLONK proof system](https://eprint.iacr.org/2019/953.pdf). It allows generating proof, verifying and exporting verifier smart contract.

## The motivation of plonkit
To date, [PLONK](https://eprint.iacr.org/2019/953.pdf) is one of the most performant zk-SNARKS proof systems in terms of proving time and proof size. [As explained by Vitalik Buterin](https://vitalik.ca/general/2019/09/22/plonk.html), by being benefited from “universal and updateable” setup, PLONK is more secure when compared to [Groth16](https://eprint.iacr.org/2016/260.pdf), without introducing much performance loss.

However, it is inefficient to write circuits in pure C++/Rust/… , which requires writing a lot of constraints by hand. By using developer-friendly Circom DSL, people can then write circuits more efficiently and more conveniently. Aiming at bringing PLONK to Circom ecosystem, plonkit is designed. [^1]

## Functionalities
The functionalities of plonkit include:

+ Local Structured-Reference-String (SRS) setup
+ Verification Key Generation (corresponding to a given circuit)
+ Proof Generation
+ Proof Verfication
+ Verifier Smart Contract Generation
+ Proof Aggregation

### Local SRS setup

To export a verification key and to generate a proof (both explained later), we need a Structured-Reference-String. In [test\_poseidon\_plonk.sh](https://github.com/fluidex/plonkit/blob/master/test/test_poseidon_plonk.sh), we provide a download link [^2] for a SRS file previously set up. According to [matter-labs](https://github.com/matter-labs/bellman/blob/f551a55d83d2ea604b2dbfe096fd9dcfdaedb189/src/kate_commitment/mod.rs#L1090), this SRS file is parsed from [AZTEC's ignition setup](https://medium.com/aztec-protocol/aztec-announcing-our-ignition-ceremony-757850264cfe).

For the convenience for testing, we add the support for genenrating SRS locally.

### Verification Key Generation

Users can export a verification key for a circuit. The verification key is needed for future proof verification.

### Proof Generation

A prover can generate a proof proving he knows a witness satisfying the circuit.

### Proof Verfication

Proof verfication is to verified a proof using a verification key.

### Verifier Smart Contract Generation

Users can generate a verifier smart contract based on a verification key, then a proof can be verified on EVM using this smart contract.

### Proof Aggregation

Plonkit wraps up [recursive\_aggregation\_circuit](https://github.com/matter-labs/recursive_aggregation_circuit) to achieve proof aggregation. Proof aggregation is based on "Recursive Proof Composition" described in [Halo](https://eprint.iacr.org/2019/1021.pdf) paper.

Some points worth noting (in the following explanations "we" stands for both "plonkit" and [recursive\_aggregation\_circuit](https://github.com/matter-labs/recursive_aggregation_circuit)):
+ Unlike Halo, we don't use cyclic curves but simulate base field operations [^3], because on Ethereum we only have one curve (BN_254).
+ We aggregate multiple proof into an aggregated proof in one step, instead of iterating and aggregating one by one.
+ We don't check the pairing in the circuit. Instead, we aggregate the pairing points and check the pairing in smart contract.

## Workflow / Usecase
The diagram below demonstrates a typical workflow of using plonkit:

![](plonkit.png)

The [test\_poseidon\_plonk.sh](https://github.com/fluidex/plonkit/blob/master/test/test_poseidon_plonk.sh) script is also a comprehensive example of the whole workflow.

## Acknowledgements
+ Plonkit builds on top of the awesome libraries written by matter-labs:
    * [bellman_ce](https://github.com/matter-labs/bellman)
    * [solidity\_plonk\_verifier](https://github.com/matter-labs/solidity_plonk_verifier)
    * [recursive\_aggregation\_circuit](https://github.com/matter-labs/recursive_aggregation_circuit)
+ Plonkit also borrows some "R1CSFile reader" codes from [zkUtil](https://github.com/poma/zkutil).
+ Furthermore, thanks to the great work and effort from the team behind [Circom](https://github.com/iden3/circom), developers can benefit from a friendly ZKP development language.

Thanks the great work of these teams/individuals!

Try out plonkit [here](https://github.com/fluidex/plonkit) and have fun!


[^1]: By the time of starting plonkit project, Circom/snarkJS didn't support PLONK but [it does now](https://blog.iden3.io/circom-snarkjs-plonk.html). Still, proving in plonkit is more efficient than in snarkJS (plonkit uses Rust and snarkJS uses JS, and their PLONK implementations are different), whereas snarkJS can be run in browsers but plonkit cannot.
[^2]: Taken from https://github.com/matter-labs/zksync/blob/master/infrastructure/zk/src/run/run.ts#L77
[^3]: We simulate base field elements as "limb"s.
