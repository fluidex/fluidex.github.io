---
title: "FluiDex: A ZK-Rollup layer2 DEX on Ethereum"
date: 2020-11-30
tags: [introduction]
---

# What is FluiDex

If you are familiar with cutting-edge blockchain technology, you can easily understand that FluiDex is a Layer 2 decentralized exchange on Ethereum. We use PLONK-based zkrollup technology to achieve high-performance transactions, while being able to reduce the cost of each transaction to less than 1% of normal L1 transaction. To our best knowledge, we are the first order-book exchange on Ethereum using PLONK-based validity proof.

For those who are not familiar with these buzzy words, FluiDex is a crypto asset exchange similar to Coinbase or Binance, but non-custodial. The good thing is that your assets are absolutely "SAFU". You don’t need to trust the team of the exchange to be ethical or law-abiding. You only need to trust cryptography and code. The bad thing is that it will be a bit less friendly to use, for example, transaction fees will be a bit higher in some cases.

# Why build FluiDex

“Build a safe, professional and easy-to-use digital asset trading platform" is our long-term vision.

I believe we all agree that to date Ethereum is probably the most decentralized and hence the most secure platform supporting DEX. In the following sections I will talk about what is "professional trading" in FluiDex's understanding.

We can roughly divide the traders in the market into two categories. One category is called "speculative retail investors". They don’t care about miners’ fees and handling fees, and don’t care about the slippage loss of market orders. They just want to easily buy certain assets because in their mind the value this asset will "pump" several times. The other type, we call it "professional traders", they care about miners' fees and handling fees, they are skilled in using derivative hedging, they can arbitrage through different exchanges, and they are skilled in using limit/market/stoploss/FOK/IOC/AON order as a tool for different purposes, and may use a program to do automatic trading.

On Ethereum today, exchanges based on algorithm-based automated market making, such as Uniswap, have gained high popularity. Except higher miner fees, such exchanges generally meet the needs of "speculative retail investors". However, for this type of exchange, liquidity takers can only place market price orders. For liquidity maker, there will be profit (because of rebates) when the price is stable, but losses when the price fluctuates sharply. The above shortcomings are tolerable for "speculative retail investors", but they are unacceptable for "professional traders". For traders with a traditional financial background, if you tell them "there is no order book, you can't place an order for rebates; you can only place a market order, and set a slippage threshold at most", they will be shocked.

We expect that more and more real assets will circulate in a decentralized manner in the future, and more and more types of traders will participate in trading. A simple swap exchanges will not be able to meet the needs of those advanced traders. The traditional order book exchange will be a much more favored solution.

So why hasn't the order book decentralized exchange exploded in the past few years? One of the reasons is ecology. In the early years, there were not many assets on Ethereum. The USDT stablecoin, which is well-known to traders, did not circulate on Ethereum two years ago. Another reason is technology development. Early-phase order-book exchanges make the cost of miners' fees for each commission and transaction non-negligible compared to swap exchanges. Expensive order and transaction costs hurdle the explosion of order book exchanges. Today thanks to the springing up of zero-knowledge proof technology, we finally are able to provide a trading experience with zero-cost order placings and 0.0001$-cost deals.

In summary, the development of a decentralized economy has brought up more and more traders and trading needs, and order book exchanges can better meet the needs of professional traders. In the past a few years, the development of cryptography technology has made it possible for high-performance, low-cost and secure order book transactions. In a word, it is exactly the right time to build FluiDex.

# Similar products and projects

1. Traditional centralized exchange. For quite a lot, maybe more than half, of the people, this type of exchange is good enough. However, for some people who have high requirements for fund security & anonymity, the hidden danger of black swan always exists in centralized exchanges. Even for a big exchange like OKEx, it happened not long ago that the exchange was unable to withdraw the coin because the founder lost contact for more than a month.
2. Algorithmic automated market making exchange. A typical example is Uniswap, which sets the price of buying and selling assets by always ensuring that the number of asset A \* the number of asset B == the fixed value. In the previous paragraph, we explain that such exchanges are not enough for professional traders.
3. Order book exchange based on optimistic rollup technology. This type of exchange has high performance and is easy to develop, but it has two major disadvantages. The first is that withdrawing from such exchanges requires confirmation time of weeks, which is completely unacceptable for most of the traders. Second, the security of optimistic rollup is not as good as "as safe as L1" zk rollup.
4. Other products with similar technical decisions, such as diversifi and loopring. Yes, in a nutshell, FluiDex will compete head-to-head with them. That there are already one or two players in a potential big market, is not a reason why new players should not enter. It is not true that since OKEx is running well, Binance should not start a business. In addition, FluiDex and these projects will have some different decisions both in technology and product. For example, from a technical perspective, we will use PLONK as the protocol of zero-knowledge proof, which will bring faster product iteration, from a product perspective, we are likely to implement permissionless token listing.

# About Decentralized Governance & Token

I believe that our exchange is a traditional "centralized" exchange, with a only difference that we're non-custodial. There are many interpretations of "decentralization", the decentralization of assets, the decentralization of control ("governance"), and even the decentralization of teams. Based on our vision, the decentralization of assets (ie, the self-custody of assets) is the must-have. But, at least today, we believe that decentralization of governance is neither necessary nor sufficient for building a great product. Any product team should investigate users and markets, but no team should decide the future of product only base on users' votes. Customers and shareholders are two kinds of people. You should not force or expect customers to become shareholders. For the FluiDex team, “the customer is always right“, but there will be no so-called "decentralized" governance in the future. The decision-making power of the future of the product will always be in the hands of the management team, and users will vote for our success or failure with their feet.

Based on our understanding of governance philosophy above, FluiDex will not issue "governance tokens" in the foreseeable future, but we are not against to issue tokens with dividend rights for fundraising. For example, it is entirely possible for us to issue a token and buy back this token with 10% of the monthly gross profit for the next 3 years.

# Project status & schedule & financing

FluiDex project was launched at the end of 2020. It is expected that the MVP/demo will be completed in Q2 of 2021, and the mainnet launch will probably start in Q4 of 2021.

__Update 2021.04.15:__
The project may soon launch a seed round of equity financing, and is looking for raising a total amount of around US$1 million at a valuation of US$7-10 million.

# Contact

Telegram: <https://t.me/fluid_dex>

Medium: <https://fluid-dex.medium.com>

Twitter: <https://twitter.com/fluid_dex>

Email: z@fluidex.io
