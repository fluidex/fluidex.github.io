---
title: "打磨第一个完全开源的 ZK-Rollup DEX: Fluidex 架构介绍"
date: 2021-07-14 20:00:00
tags: [technical]
---

摘要：本文将介绍 Fluidex 团队开源的 ZK-Rollup DEX 后端的架构设计。


> The cryptography underlying zero knowledge proofs has undergone a Moore’s Law-like trajectory over the last few years, and it shows no sign of slowing down.
> 
> -- [Dragonfly Research](https://medium.com/dragonfly-research/im-worried-nobody-will-care-about-rollups-554bc743d4f1)

ZK-Rollup 以其出色的去中心化和安全性优势，被包括 Ethereum 创始人 Vitalik 在内的很多人认为是长期最重要的 Layer 2 扩容方案。但另一方面，技术优势的反面恰恰是高门槛，无论是技术基础设施，还是用户可见的产品，相关项目实际上都屈指可数。[Fluidex](https://github.com/Fluidex) 作为全世界少数几个在独立开发完整 ZK-Rollup 系统的团队，希望能够持续分享一些自己的经验和成果，和业界一起共同推动 ZK-Rollup 生态边界的不断扩张。

我们曾在 [ZK-Rollup 开发经验分享 Part I](/zh/blog/zkrollup-intro1/) 中对 ZK-Rollup 做了一个概括的介绍，读者可以先从这篇文章获得更多的背景知识。作为“开发经验分享”系列文章的第二篇，本文将会介绍我们团队 [近期开源的 ZK-Rollup DEX 后端](https://github.com/Fluidex/fluidex-backend) 的整体架构，希望帮到更多的开发者，能够为 ZK-Rollup 的大规模应用出一份力。

## 整体架构

下图是 Fluidex 后端的整体架构图。概括地说，用户把交易请求（包括订单委托和 AMM 请求）发送到撮合引擎，撮合引擎将所有完成的交易发送到消息队列，Rollup 模块将消息队列中的交易在 Merkle tree 上更新，打包成 L2 blocks。之后  l2 blocks  由 prover cluster 生成证明，就可以最终被发布在链上。

<p align="center">
  <img src="Fluidex Architecture.svg" width="600" >
</p>

我们将先分模块地介绍每个服务模块的作用，最后介绍 ZK-Rollup 系统设计的一般原则。

## 各服务介绍

### Gateway

Gateway 接受从 网页端 / 移动端 / 客户交易机器人发送来的交易请求，路由之后发送到不同的具体服务。Gateway 也会将内部的行情和委托状态更新，变成适配于请求方的格式推送给请求方[^1]。 考虑到 Envoy 在性能/动态配置等方面都有良好表现，我们使用 Envoy 作为系统的网关组件。此外，Fluidex 内部大量使用 GRPC 来完成单向的 RPC 和 双向的 streaming，Envoy 对 GRPC 也有出色的支持。

### 撮合引擎

[dingir exchange](https://github.com/Fluidex/dingir-exchange) 是一个高性能交易所撮合引擎。它在内存中完成用户订单的撮合。我们使用 BTreeMap[^2] 来实现 Orderbook，因为撮合引擎订单簿既需要 key-value 查询（查询订单信息），也需要有序遍历（撮合），这要求一种类似 AVL tree / skip list 这类有序关联数组，我们考虑到现代 CPU 的缓存特性，使用了对缓存更有好的 BTreeMap。

服务状态的持久化通过定期 dump 和 operation log 实现。服务通过定期的 fork 后，新进程会进行全局状态的持久化。比起 stop-world and deep-copy 的方式，fork 提供了更好的请求延迟指标。此外，所有的写请求作为 operation logs 被**批量地**（否则会给数据库造成很大的压力）追加写入数据库中。全局状态定期持久化 + operation log 两种持久化方式结合在一起，即使在最坏的宕机情况下，也仅仅需要回滚几秒的交易。

行情的计算通过 TimescaleDB 时序数据库完成。完成的交易在 TimescaleDB 中被按照预定的时间间隔按照 bucket 统计，生成 K 线指标。

### Rollup State Manager

ZK Rollup 系统中，链上合约只需要储存全局状态的 Merkle root，而不需要记录完整的系统状态信息。维护 Merkle tree 的工作由链下的 Rollup State Manager 完成。Rollup State Manager 从消息队列接收每个完成的交易，在 Merkle tree 上更新。并且对于多个交易，批量的生成 L2 Block。

Rollup 定时 dump 出 checkpoint，checkpoint 中会包含消息队列的 offset。服务重启时，加载上一次  checkpoint 的 Merkle tree 状态，并且 seek 到上次状态对应的消息队列 offset，之后重新处理消息队列中的交易。

### Proving Cluster

L2 blocks 被 Rollup State Manager 生成后，上链被合约验证时还需要一份对应的密码学证明。这需要一个证明集群来提供大量算力。此外，由于 DEX 业务不同时段的交易量可能变化很大，因此这个证明集群必须是高拓展性和高弹性的。

我们采用了 Master-Worker 架构。一个有状态的 master 节点管理证明任务的元信息，众多无状态的 Worker 节点从 master 获取任务，证明完成后向 master 提交。和 PoW 挖矿相似， 长远来看，由于 ZK-Rollup 验证的计算量远远小于证明的计算量，这使得我们未来能够转换到一种更加“无信任”的架构，即外部的无需可节点（矿工）可以自由的加入和退出证明集群，验证节点能够快速确认矿工诚实地完成了计算，没有作恶。

目前 Proving Cluster 提供单机 Docker Compose 和 K8S 两种不同部署方式，能够同时支持本地开发调试和正式生产部署。

## 通用架构设计原则

### CQRS & 全局消息总线

Rollup 系统的状态更新需要确保强一致性，不能允许分毫的误差。所有的状态更新操作，最好是可追溯可重放的。我们采用了 [CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) 设计模式来提供这种可靠的状态更新。**所有对于全局状态的写操作，都由 Message Queue 完成同步。** 具体地，我们使用 Kafka 作为全局消息总线。Rollup 系统以 message queue 作为 ground truth，从 message queue 中获得每一个表示状态更新的消息，将其在全局的Merkle Tree 上执行。

### 以内存为中心的数据组织

一般的互联网服务以数据库作为数据的 ground truth。通过数据的分片和服务的无状态性来实现整体系统的拓展性和伸缩性。 

与此相反，在我们 ZK-Rollup 系统中，很多服务都需要在内存中维护大量复杂的数据结构（如 Rollup 和 Matching Engine 服务，分别维护 Merkle Tree 和 Orderbook）。这要求一种以内存数据为中心的架构设计。这导致我们很多的设计原则可能和互联网业务推崇的 [12 Factor](https://12factor.net/) 不一致，反而更接近于游戏服务端。

### 单一的技术栈

由于 Rust 语言在类型安全和所有权检查的优异特性，以及不输于 C++ 的性能，Rust 成为了不少密码学库的首选，生态也日益繁荣。我们的 Rollup State Manager 和 Prover Cluster 很自然地使用了 Rust 语言开发。此外，考虑到统一的技术栈无论从技术还是团队管理角度都能极大减小摩擦， 系统中的其他服务模块目前也都是用 Rust 语言实现。

## 代码 & 运行

目前 Fluidex-backend 已经 [开源到 Github](https://github.com/Fluidex/fluidex-backend)。目前仅支持本机启动。具体的代码说明和运行方式见 Github 代码库页面 。

[^1]: grpc->websocket, 目前尚未实现
[^2]: https://doc.rust-lang.org/stable/std/collections/struct.BTreeMap.html



