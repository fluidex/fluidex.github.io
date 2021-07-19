---
title: "FluiDex: 基于 ZK-Rollup 的专业去中心化交易所"
date: 2020-11-28
tags: [introduction]
---


FluiDex 是一个以太坊上的 ZK-Rollup Layer2 去中心化交易所。


# 技术 

Fluidex 使用基于 PLONK 的 ZK-Rollup 技术，在以太坊上实现高性能的去中心化交易，每笔交易的成本会被压缩到传统 Layer1 去中心化交易所的 [1/100 以下](https://www.fluidex.io/en/blog/zkrollup-intro1/)。同时提供等价于 Layer1 的安全性。


# 特性

### 不妥协的安全性

零知识证明技术会保护用户资产的绝对安全。用户无需信任交易所的道德，只需要信任数学和代码。

交易所作恶可行性为0，无法偷走用户的钱，也无法做恶意的交易。即使在最坏可能性下，交易所意外关停，用户也可以提出自己拥有的资产。

### 无延迟的交易

在 Layer1 交易所中，交易需要被打包到块中，才能算作完成[附注1]。 Fluidex 作为 Layer2 交易所，用户的交易订单会被立刻处理，用户能够在一秒之内确认自己的订单状态。

### 低成本

用户不需要支付 Layer1 昂贵的 GAS 费即可完成交易。对于资金量小和交易频繁的交易者极为友好。

### 专业的交易服务

Fludiex 提供订单簿和 AMM 混合交易模式。普通用户可以使用 AMM 页面或者订单簿页面完成交易，职业交易者可以使用交易 API 完成行情更新和交易委托。专业流动性提供者 (LP)，可以使用 limit / order / post-only / IOC /  stopless 等丰富的交易种类，并且获得做市商返佣。

### 灵活高效的流动性算法

Fluidex 使用 [自己提出的 Differential AMM 算法](https://www.fluidex.io/en/blog/damm/)，能够极大地提升资本利用效率和交易盘口深度，并且无缝融合 AMM 与订单簿。此外，Fluidex 也将扮演外部流动性映射角色，能够使用外部 DEX / CEX 增强自身的流动性。

### 无许可上币

任何代币发行方能够向 Fluidex 提交自己的代币。Fluidex 会自动增加这个交易币种。此外，代币发行方可以通过设置自己的 AMM 参数，灵活调整交易对的流动性分布，满足普通自动做市 / 单边代币拍卖等多种不同场景需求。

<!--
# 项目历史

Fluidex 在 2021 年初启动，我们曾写过[打造一个最好的非托管交易所的初心](https://www.fluidex.io/en/blog/fluidex-a-zkrollup-layer2-dex/)。

2021.Q1 Fluidex 开源了 PLONK DSL 工具包 [Plonkit](https://github.com/Fluidex/plonkit) 和 Circom 开发工具包 [Snarkit](https://www.fluidex.io/en/blog/the-motivation-of-snarkit/)。

2021.Q2 Fluidex 开源了[后端代码](https://github.com/Fluidex/fluidex-backend)，这将是第一个完全开源的 ZK-Rollup DEX 项目。我们希望能够和社区携手努力，共同推动去中心化世界的边界。

# Roadmap

2021.Q4 测试网部署

2022.Q1 主网上线
主网
-->

# 创始团队

CEO: [张卓](https://www.linkedin.com/in/zhuo-zhang-75340152/)。毕业于清华大学计算机系，曾任人工智能独角兽依图科技的语音识别负责人，曾负责 IOST 公链的研发。

CTO: [林浩宇](https://www.linkedin.com/in/haoyu-lin-239474123/)。[VRF-mining](https://vrf-mining.github.io/), [RandChain](https://eprint.iacr.org/2020/1033.pdf), [fair-atomic-swap](https://dl.acm.org/doi/10.1145/3318041.3355460) 共同发明人。ZenGo 研究员。曾负责比原链研发。


# 联系方式

官网：<https://www.fluidex.io/>

Telegram 技术群: <https://t.me/fluid_dex>

Medium: <https://fluid-dex.medium.com>

Twitter: <https://twitter.com/fluid_dex>

邮箱：<mailto:contact@fluidex.io> 和 <mailto:z@fluidex.io> 

公众号: 搜索 "Fluidex".



# 附注

[1]: 暂不考虑链重组。因为这个因素对于 Layer1 Layer2 相同。

