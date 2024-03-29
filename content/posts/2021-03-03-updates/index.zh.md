---
title: FluiDex 近况更新
date: 2021-03-03
tags: [updates]
---

关于我们：FluiDex 团队正在开发 Ethereum 上第一个无许可上币的 zk-rollup layer2 订单簿 DEX。项目的完整介绍可以看[这篇文章](/zh/blog/fluidex-a-zkrollup-layer2-dex/)。

下面介绍从 2021 年初项目启动以来，团队在各方面的一些工作。

# 技术进展

### Plonkit

工欲善其事，必先利其器。

Plonkit 是一个 FluiDex 团队开发的 PLONK 零知识证明工具包。通过使用 Plonkit，用户可以使用更容易上手的 DSL 来实现自己的零知识证明电路代码，而不需要学习 Rust 语言和底层密码学库的复杂细节。

Plonkit 底层基于 bellman_ce 密码学库开发。目前的功能有，本地 setup（仅限开发使用，正式的 setup 最好还是进行 MPC ceremony），电路证明和本地验证，solidity 验证合约生成等。

Plonkit 开源以来收到了很多开发者的关注，现在是团队在 github 上获得标星最多的项目。

我们正在实现 server 模式，以便 plonkit 能够被作为长期运行的证明服务启动。未来我们会进一步实现集群证明服务功能。更长远地，我们可能会加入 custom gates 来进一步提升系统的性能上限，此外我们还会专门为 PLONK 及其变种持续改进 DSL。

更多请访问 github: <https://github.com/fluidex/plonkit>

### 交易所

FluiDex 团队在过去几个月中，完成了交易所撮合引擎后端和网页端的第一个版本。后端撮合引擎部分已经开源，使用 Rust 语言实现了纯内存撮合，能够达到数千 TPS 的性能，这将保证我们交易系统在可见未来系统的流畅性和稳定性。项目已经在 github 开源。我们仍在持续完善中。（没有经过真实业务的锤炼，目前建议仅作学习交流使用）。

目前交易所后端已经开源，前端暂未开源。
更多请访问 github: <https://github.com/fluidex/dingir-exchange>

### 零知识证明电路和智能合约

我们完成了[第一个 Javascript Rescue Hash 的实现](https://github.com/fluidex/rescue-hash-js)，也开发了[第一个 circom 语言版本的 Rescue Hash 电路代码](https://github.com/fluidex/circuits/blob/master/src/lib/rescue.circom)。基于 Echarts 旭日图，我们开发了[可视化 profile 电路的工具](https://github.com/fluidex/circuits/blob/master/tools/benchmark/profile_circuit.js)，用户可以快速分析出自己电路代码中 cost 最大的是哪部分，便于进一步做细致的优化。

我们完成了最基础的充提&转账&交易的电路代码，尚有较多功能和性能细节需要进一步完善，暂不展开介绍。当然，所有代码都在很早期，没有任何审计，不建议生产使用。

上述所有成果都已经开源在我们的代码库中。更多请访问 github: <https://github.com/fluidex/circuits>

### Awesome Plonk

这是我们收集的 PLONK 相关的优质资料的汇编。涵盖论文，实现，Demo，论坛，博客文章， 博客/视频等多方面的学习资料。

更多请访问 github: <https://github.com/fluidex/awesome-plonk>

# 社群状态

目前我们仅在 Telegram 上维护了英文技术社群。两个月来已经有 100 多位对我们感兴趣的开发者加入。未来我们会在那里持续更新我们的技术进展。

# 融资状态

过去几个月，FluiDex 从几位私人投资者中已经完成共计超过 50 万美元的融资。在此感谢这些业界前辈在财务和其他方面给予我们的支持。

这些钱够我们目前的开发使用。我们暂时不寻求进一步的融资。

__2021.04.15 更新:__
项目最近会寻求规模为 US$1M （估值 US$7-10 M）左右的融资。

# 对其他项目的技术贡献

我们发现了 matters lab 开源的 PLONK solidity 验证合约代码中 [当输入个数大于 1 时的 bug](https://github.com/matter-labs/solidity_plonk_verifier/pull/3) ([这个代码也用在 zksync 中](https://github.com/matter-labs/zksync/pull/284))，并且提交了上游 pull request。（zksync 线上系统不触发这条代码路径，正确性和安全性不受这个 bug 影响。）

FluiDex 正在参与 Hermez 项目的 phase 2 trusted setup ceremony，希望通过自己的力量，为更广泛的 Layer2 社区做出贡献。（解释：“phase 2 trusted setup ceremony”是什么？ 使用 Groth16 协议的 zk-rollup 的项目在上线前，一般会通过多方计算保证一些密码学参数的安全，“phase 2 trusted setup ceremony” 就是这样一个多方计算的过程。只要所有参与的用户有一个是不作恶的，整体的密码学系统就是安全的。）

# 其他

在国贸租了个小办公室～ 可以开心刷夜干活啦～
欢迎对我们项目有兴趣的朋友[加入团队](/zh/blog/joinus/)～
