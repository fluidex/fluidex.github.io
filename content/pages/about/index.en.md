---
title: "About Fluidex"
profile_image: '/media/profile-image.jpg'
template: "about-template"
---

**FluiDex is a ZK-Rollup Layer2 DEX on Ethereum.**

## Technology

Fluidex aims at using PLONK-based ZK-Rollup to build a high-performance DEX on Ethereum. It [can save the cost of each transaction to 1/100](/en/blog/zkrollup-intro1/) while still offering the same security level as layer 1.


## Features

### Uncompromising security

Fluidex uses Zero-knowledge Proof schemes so that users don't need to trust the exchange being ethical, the Math/Cryptography behind it can guarantee that users' funds always stay "SAFU". The exchange has no way to steal users' funds or creat unauthorized orders. Even in the worst case that the exchange shuts down, users can still withdraw their funds safely.


### Trading without latency

In a DEX on layer 1, users need to interact with smart contracts and a trade is viewed valid only after it's included in a block and submitted on chain. However, FluiDex offers a CEX-ish trading experince and can process users' orders immediately. Users don't need to wait to know whether a trade succeed or not.


### Lower costs

ZK-Rollup compresses transaction data so as to have lower average gas fee. User don't need to pay high transaction fee as on layer 1, which is quite friendly to retail users and frequent traders.


### Professional trading experience

FluiDex is a orderbook AMM-hybrid DEX. A retail user may choose to trade through orderbook webpage or AMM webpage. A quant trader / market maker / Liquidity Provider (LP) may choose to monitor the tickers and place/cancel orders via APIs. FluiDex provides professional trading experience, for example it supports limit / market / post-only / IOC / stoploss... order types, and market maker can gain rebates.


### Flexible and efficient AMM algorithm

FluiDex uses the [Differential AMM](/en/blog/damm/) we propose, which can noticeably increase the capital efficiency and optimize orderbook depth, can can support both orderbook and AMM seamlessly. FluiDex team itself can also brigde external liquidity from other DEXs/CEXs, to offer better liquidity.


### Permissionless listing

Anyone can list a ERC20 token on FluiDex permissionlessly. And a project team can adjust liquidity distribution by AMM parameters, for 
automated market making (AMM) or initial DEX offering (IDO).


## Co-founders

CEO: [Zhuo ZHANG](https://www.linkedin.com/in/zhuo-zhang-75340152/). CS, THU. Previously Speech Recognition Team Lead in [YITUTech](https://www.yitutech.com/), and Tech Lead in [IOST](https://iost.io/).

CTO: [Haoyu LIN](https://www.linkedin.com/in/haoyu-lin-239474123/). Co-author oc [VRF-mining](https://vrf-mining.github.io/), [RandChain](https://eprint.iacr.org/2020/1033.pdf) and [fair-atomic-swap](https://dl.acm.org/doi/10.1145/3318041.3355460). Researcher in [ZenGo-X](https://zengo.com/research/).


## Contact

Website: <https://www.fluidex.io/>

Telegram: <https://t.me/fluid_dex>

Medium: <https://fluid-dex.medium.com>

Twitter: <https://twitter.com/fluid_dex>

Email: <mailto:contact@fluidex.io> or <mailto:z@fluidex.io> 

Wechat Official Account: "FluiDex"


## Footnote

[1]: We would like to save the effort of discussing chain re-organizations for now. Becaue that's what layer 1 should consider and handle.