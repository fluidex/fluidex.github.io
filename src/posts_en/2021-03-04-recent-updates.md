---
layout: post
title: "Fluidex Recent Updates"
description: ""
category:
tags: []
---


About us: The Fluidex team is developing the first order book DEX on Ethereum with permissionless listings. For a complete introduction to the project, please see [our previous article](/posts/2020-11-30-fluidex-a-zkrollup-layer2-dex/).

The following introduces some of the team's work in various aspects since the project was launched in early 2021.

# Technical progress

### Plonkit
 
 
 
If a worker wants to do his job well, he must first sharpen his tools.

Plonkit is a PLONK zero-knowledge proof toolkit developed by the Fluidex team. By using Plonkit, users can use the easier DSL to implement their own zero-knowledge proof circuit code, without the need to learn the complex details of the Rust language and the underlying cryptography library.

The bottom layer of Plonkit is developed based on the bellman_ce cryptography library. The current functions include local setup (for development use only, formal setup requires MPC), circuit proving and local verification, solidity verification contract generation, etc.
    
Plonkit has received a lot of attention from developers since it was open sourced, and it is now the project with the most stars on github by the team.

We are implementing server mode so that plonkit can be started as a long-running proving service. In the future, we will further implement the cluster proving server feature. In the longer term, we may add custom gates to further increase the performance limit of the system. In addition, we will continue to improve DSL specifically for PLONK and its variants.

For more, please visit github: <https://github.com/Fluidex/plonkit>

### Exchange

In the past few months, the Fluidex team has completed the first version of the exchange matching engine backend and web frontend. The backend of the matching engine has been open sourced, using Rust language to implement in-memory order matching, which can achieve thousands of TPS. This will ensure the fluency and stability of our trading system in the foreseeable future.  We are still improving this system continuously. (It hasn't been tempered by real business, it is recommended to be used only for learning and communication at present rather than production).

Currently, the back end of the exchange has been open sourced, and the front end has not yet been open sourced.
For more, please visit github: <https://github.com/Fluidex/dingir-exchange>

### Zero-knowledge proof circuit and smart contract

We have completed [the first implementation of Javascript Rescue Hash](https://github.com/Fluidex/rescue-hash-js), and also developed [the first circom implementation of Rescue Hash circuit](https://github.com/Fluidex/circuits/blob/master/src/lib/rescue.circom). Based on the Echarts sunburst chart, we have developed [a tool for profiling circuits visually](https://github.com/Fluidex/circuits/blob/master/tools/benchmark/profile_circuit.js). So users can analyze their own circuit code more conveniently, finding which parts of the circuits have big computation cost, so they can make further optimization accordingly.

We have completed the most basic circuit code for deposit, withdrawal & transfer & transaction. There are still more functions and performance details that need to be further improved, so we will not introduce it for the time being. Of course, all the code is very early, without any audit, it is not recommended for production use.


All the above results have been open sourced in our code base. For more, please visit github: <https://github.com/Fluidex/circuits>

### Awesome Plonk

This is a collection of high-quality materials about PLONK. It cover various learning materials such as papers, implementations, demos, forums, blog posts, blogs/videos, etc.

For more, please visit github: <https://github.com/Fluidex/awesome-plonk>


# Community Status

Currently we only maintain the English technical community on Telegram. More than 100 developers who are interested in our project have joined in the past two months. In the future, we will continue to update our technological progress there.

# Financing status

In the past few months, Fluidex has completed a total of more than US$500,000 in financing from several private investors. I would like to thank these seniors in the industry for their financial and other support.

The money is enough for our current development. We are not seeking further financing for the time being.

# Technical contribution to other projects

We found a [bug when the number of inputs is greater than 1](https://github.com/matter-labs/zksync/pull/284), in the open sourced PLONK solidity verification contract code of Matters Lab  and submitted an upstream pull request . (The zksync online system does not trigger this code path, and the correctness and safety are not affected by this bug.)

Fluidex is participating in the phase 2 trusted setup ceremony of the Hermez project, hoping to contribute to the wider Layer2 community through its own strength. (Explanation: What is the "phase 2 trusted setup ceremony"? The zk-rollup project that uses the Groth16 protocol will generally ensure the security of some cryptographic parameters through multi-party calculations before going online. The "phase 2 trusted setup ceremony" is such a multi-party calculation process. As long as at least one of all participants is honest, the overall cryptography system is safe.)
