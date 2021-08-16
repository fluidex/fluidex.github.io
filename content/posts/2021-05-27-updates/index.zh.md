---
title: "FluiDex 2021年5月 开发进展"
date: 2021-05-28 09:00:00
tags: [updates]
---

关于我们：FluiDex 团队正在开发 Ethereum 上第一个无许可上币的 ZK-Rollup layer2 订单簿 DEX。项目的完整介绍可以看[这篇文章](/zh/blog/fluidex-a-zkrollup-layer2-dex/)。

下面介绍最近两个月，团队在各方面的工作进展。

<!--
## 新版官网上线

我们重新设计了 FluiDex 项目的风格样式，新的官网已经更新在了 <https://www.fluidex.io/>

![](/media/new_website_0528.png)

-->

## 更多的零知识证明开发工具

我们开发了一些新的开发工具包，这些工具已经成为 FluiDex 团队日常开发流程的一部分，极大地提升了团队的开发效率。

### 电路开发调试工具 snarkit

我们希望零知识证明电路的开发最终能够像普通软件开发一样简单，例如代码能够允许较高层次的复用和抽象，出错时能够给出准确的报错位置和原因。这就是我们开发 snarkit 的初衷。snarkit 目前仅支持 circom 语言，最重要的功能是电路测试，即给定电路代码和预期的输入输出，检查输入是否满足电路约束，输出是否满足预期。如果出现任何未预期的错误，则会显示出报错的模块和行号，也会显示报错位置相关的具体变量值。

snarkit 支持两种 backend，wasm 的 backend 不需要安装任何依赖方便快速上手使用，c++ 的 backend 支持大型电路并且性能更高，仅支持较新的 x64 CPU。（感谢circom/ffwasm/ffiasm 的高性能底层有限域代码）

代码位置：<https://github.com/fluidex/snarkit>

### 零知识证明集群 PLONK Prover Cluster

ZK-Rollup 系统一般会需要 [多达几百台服务器来完成证明计算](/zh/blog/zkrollup-intro1/)。这需要一个完善的资源编排调度平台。我们开发了 Plonk Prover Cluster，能够按照配置启动一个大规模的集群完成证明计算。系统采用了单 master + 多 slave 的架构设计，基于 k8s 完成动态伸缩和调度，也支持本地使用 docker-compose 来做单机开发调试。目前较适合于部署在 Aliyun Serverless Kubernetes 这种弹性平台上，我们未来会进一步考虑使用 cloud platform native API (如 EC2 Auto Scaling） 来实现更灵活和有性价比的方案。

Plonk Prover Cluster 适合结合 FluiDex 团队之前的 PLONK DSL 开发工具 [Plonkit](https://github.com/fluidex/plonkit) 使用。

代码位置：<https://github.com/fluidex/prover-cluster>

## FluiDex 交易所的开发

### 电路

充值/转账/交易/提币 等基础功能已经基本完成。我们通过把不同 l2 交易中共用的计算逻辑（如 merkle proof）提取到外层，优化掉了超过 1/3 的电路规模。对于一个一百万(2\*\*20)用户数量，一百万 token (2\*\*20)数量的 ZK-Rollup 系统，2**28 个 plonk 门约束的容量下能够容纳超过 600 个 l2 交易，单个交易需要的门约束目前为 420k 门约束。我们未来会进一步优化 layer2 tx 的资源消耗量。

代码位置：<https://github.com/fluidex/circuits>

### Rollup Operator

Rollup 需要一个半中心化的后台节点，用来收集所有的 layer2 交易，更新状态，并且生成 layer2 block，一般可以被称为 Operator / Sequencer / StateUpdater 等。我们使用 Rust 实现了配合 FluiDex 电路使用的 Operator，目前在 2**20 个用户和 token 的系统中，通过 [并行更新 merkle tree](https://github.com/fluidex/rollup-state-manager/blob/b6c049208e17a4916b12ff0ab23e7699df7f231e/src/state/global.rs#L270) 能够达到约 250 TPS。

代码位置：<https://github.com/fluidex/rollup-state-manager>

### 撮合引擎

增加了 post-only order 以允许做市商限制自己的做市订单类型，避免因为盘口价格波动造成返佣和手续费损失。
增加了 inner transfer 功能。

代码位置：<https://github.com/fluidex/dingir-exchange>



## 算法设计研究

我们完成了[《Differential AMM: 一种基于微观指标设计的灵活 AMM 算法》](/zh/blog/damm/)。这是一种从微观指标（如盘口中间价和盘口深度）入手的灵活 AMM 设计，AMM 资金池的创建者能够任意调整设定 自动做市价格范围/流动性深度/做市资金量/资金效率 等指标。我们还给出了 DAMM 转化为订单簿的参考代码实现。FluiDex 最终完成版本中将会集成 DAMM，每种交易对的流动性都由 Orderbook 和 AMM 混合而成 。

## 社区交流

在 4 月 20 日的 上海前沿技术研讨会 以零知识证明为专题。FluiDex 创始人张卓和安比实验室创始人郭宇，Mina 亚洲技术大使姚翔分别做了题目《ZK-Rollup 工程实践》《ZKCP+ 零知识证明与公平数据交易协议》和 《Snapps架构和应用》三场分享。

