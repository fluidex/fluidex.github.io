---
title: "Fluidex 2021-05 Updates"
date: 2021-05-28 09:00:00
tags: [updates]
---

About Us: FluiDex team is working on building the first zk-rollup layer2 order-book DEX with permissionless listings on Ethereum. For a more comprehensive introduction to the project, please see our [previous article](/en/blog/fluidex-a-zkrollup-layer2-dex/).

In this post, we are happy to share our progress in the last two months.

##  Added more zkp development toolkits
[__Plonkit__](https://github.com/Fluidex/plonkit), the PLONK zero-knowledge proof toolkit developed by the Fluidex team, has become an important part of the team’s daily development life, and boosts our outputs considerably. In the past a few months, we have also added more new tools into our development ecosystem.

### Snarkit: an enhanced circom compiler & debugger 
__Snarkit__ is aiming at making the development of circuits as easy as in other programming languages. We hope that, with __Snarkit__'s ability to report errors with higher accuracy and in details, people can easily abstract and reuse circuit codes in a high level. Currently, __Snarkit__ is only available in Circom, and its features concentrate on circuit testing. For example, for any given circuit codes and anticipated input/output, __Snarkit__ will check whether the input fits into the circuit and whether the output fulfills the expectation. If __Snarkit__ detects any unexpected errors, it will list out the module location and the Line Number of Error, as well as the variables related to the errors. __Snarkit__ supports two types of backend: wasm and C++. The  wasm backend can work without any other prerequisites, while C++ backend can support larger circuits with higher performance. Please note that the C++ backend only supports the latest x64 CPU. (Thanks to the high-performance finite field operation codes in circom, ffwasm, ffiasm.)

Github link: https://github.com/Fluidex/snarkit

### PLONK Prover Cluster
A ZK-Rollup system usually [needs hundred of servers to perform cryptography computations when proving](/en/blog/zkrollup-intro1/). Such a burden of computation asks for a comprehensive platform for task coordination. In this context, we developed __PLONK Prover Cluster__, to deploy a mass cluster of nodes for proving tasks according to specific settings. __PLONK Prover Cluster__ uses “master-slaves” architecture and uses k8s for coordination and resilience; it also support debugging using docker-compose locally. For now it suits the best with elastic cloud services such as Aliyun Serverless Kubernetes. But we are also considering applying cloud platform native API (such as EC2 Auto Scaling) for more flexible and cost-effective solutions.

Github link: https://github.com/Fluidex/prover-cluster

## Progress on Fluidex Exchange
### Circuits
Essential functions of the exchange (such as deposit, transfer, trade, withdrawal, etc.) are almost finished. By merging common logic of L2 transactions (such as the Merkle proof), we manage to reduce over 1/3 of the overhead. After this optimization, our system, if assuming with one million (2\*\*20) users and one million (2\*\*20) tokens, can handle more than 600 L2 transactions, with 2\*\*28 circuit constraints. At present, a single transaction comes with 420k circuit constraints. We will keep working on the optimization.

Github link: https://github.com/Fluidex/circuits

### Rollup Operator
A Rollup needs semi-decentralized node(s) to collect all layer2 transactions, update rollup state, and generate layer-2 blocks. Such a node is usually called an Operator, a Sequencer, or a State-Updaters. Recently, we implement an operator in Rust to work with our Fluidex circuits. For a system with 2\*\*20 users and 2\*\*20 tokens, the operator can update the Merkle trees concurrently with a speed up to 250 TPS. 

Github link: https://github.com/Fluidex/rollup-state-manager

### Matching Engine
We integrated "post-only order" feature so that market-makers can avoid undesirable loss on transaction fees or commissions due to price fluctuation. We also added an inner transfer feature to the existing engine. 

Github link: https://github.com/Fluidex/dingir-exchange

## Research 
We published an aricle ["Differential AMM: a highly flexible AMM algorithm based on micro indicators"](/zh/blog/damm/). To put it simply, DAMM is a flexible AMM design that built from micro-indicators, such as the average market price and market depth. Creators of the AMM pool can freely adjust the market-making parameters (such as price range, liquidity depth, market cap, capital efficiency) according to their strategies. Besides, we gave out a reference implementation (only an PoC) on translating DAMM into orderbook. Fluidex will integrate this DAMM feature, and the liquidity of each trade pair will be supported by both orderbook and AMM.

## Community Activities
On April 20th, Shanghai Advanced Technology Seminar was held under the theme of “Zero-Knowledge Proof”. Zhuo ZHANG, Founder of the Fuildex, was invited to deliver a keynote on "ZK-Rollup Development Experience Sharing". Also invited to the seminar were Yu GUO, Founder of the SECBIT Labs, and YAO Xiang, Tech Ambassador of Mina in Asia. Guo and Yao talked about “ZKCP+ Zero-knowledge Proof and Fair (Data) Exchange Protocol" and “Snapps Architecture and its Application”, respectively.