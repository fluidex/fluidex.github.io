---
title: Fluidex Recent Updates
date: 2021-03-04
tags: [updates]
---

About us: The Fluidex team is developing the first zk-rollup layer2 order-book DEX with permissionless listings on Ethereum. For a more comprehensive introduction to the project, please see [our previous article](/posts/2020-11-30-fluidex-a-zkrollup-layer2-dex/).

In this post, We are happy to explain what we have achieved since the early 2021, at what time the project was launched.

# Technical progress

### Plonkit

As the saying goes, good tools are prerequisite to the success of a job.

Plonkit is a PLONK zero-knowledge proof toolkit developed by the Fluidex team. By using Plonkit, users can use an easier DSL (Circom) to implement their own zero-knowledge proof circuit code, without the need to learn the underlying cryptography library and how to write circuits in C or Rust (which is way more complicated).

The core of Plonkit is developed based on the bellman_ce cryptography library. The current functions include local setup (for development use only, in production better to use MPC ceremony), circuit proving and verification, solidity verification contract generation, etc.

Plonkit has received a lot of attention from developers since being open sourced, and it is now the project with the most stars on github by the team.

We are implementing server mode so that plonkit can serve for continuously-running proving service. In the future, we will further implement the cluster proving server feature. In a longer term, we may add custom gates to further improve the performance of the system. In addition, we will continue to improve DSL specifically for PLONK and its variants.

For more, please visit github: <https://github.com/Fluidex/plonkit>

### Exchange

In the past a few months, the Fluidex team has finished the first version of the exchange matching engine backend and web frontend. The backend of the matching engine has been open sourced, using Rust language to implement in-memory order matching, which can achieve thousands of TPS. This will ensure the fluency and stability of our trading system in the foreseeable future. We are still improving this system continuously. (It hasn't been tempered by real business, so it is only recommended to be used only for learning and communication at present rather than production).

Currently, the back end of the exchange has been open sourced, and the front end has not yet been open sourced.
For more details, please visit github: <https://github.com/Fluidex/dingir-exchange>

### Zero-knowledge proof circuit and smart contract

We have delivered [the first implementation of Javascript Rescue Hash](https://github.com/Fluidex/rescue-hash-js), and also developed [the first circom implementation of Rescue Hash circuit](https://github.com/Fluidex/circuits/blob/master/src/lib/rescue.circom). Based on the Echarts sunburst chart, we have developed [a tool for profiling circuits visually](https://github.com/Fluidex/circuits/blob/master/tools/benchmark/profile_circuit.js). So users can analyze their own circuit code more conveniently, finding which parts of the circuits lead to the major computation overhead, so they can make further optimization accordingly.

We have prototyped the most basic circuit code for deposit, withdrawal & transfer & trading. There are still many functions and performance details that need to be further improved, so we will not introduce it for the time being. Of course, all the code is at a very early stage, without any audit, it is not recommended for production use.

All the above results have been open sourced in our code base. For more details, please visit github: <https://github.com/Fluidex/circuits>

### Awesome Plonk

This is a collection of high-quality materials about PLONK. It covers various learning materials such as papers, implementations, demos, forums, blog posts, videos, etc.

For more details, please visit github: <https://github.com/Fluidex/awesome-plonk>

# Community Status

Currently we only maintain the English technical community on Telegram. More than 100 developers who are interested in our project have joined in the past two months. In the future, we will continue to update our technological progress there.

# Financing status

In the past few months, Fluidex has raised a total of more than US$500,000 from several private investors. We would like to thank these seniors in the industry for their financial and other support.

The money is sufficient for our current development. We are not seeking further financing for the time being.

# Technical contribution to other projects

We found a [bug when the number of inputs is greater than 1](https://github.com/matter-labs/zksync/pull/284), in the open sourced PLONK solidity verification contract code of Matters Lab, and submitted an upstream pull request. (The zksync online system does not trigger this code path, and the correctness and safety are not affected by this bug.)

Fluidex is participating into the phase 2 trusted setup ceremony of the Hermez project, hoping to contribute to the wider Layer2 community through its own strength. (Explanation: What is the "phase 2 trusted setup ceremony"? The zk-rollup projects that use Groth16 protocol need to ensure the security of some cryptographic parameters by using multi-party computations. The "phase 2 trusted setup ceremony" is one of such multi-party computations. As long as at least one of the participants is honest, the entropy and hence randomness can be guaranteed. Provers then cannot forge a proof.)
