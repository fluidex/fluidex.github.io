---
layout: post
title: "Fluidex: A zkrollup layer2 DEX"
description: ""
category: 
tags: []
---

# What is FluiDex
For those familiar with cutting-edge technology, FluiDex is a Layer 2 decentralized exchange on Ethereum. We will use PLONK-based zkrollup technology to achieve high-performance transactions, while being able to reduce the cost of each transaction to less than 0.0001 USD. We will be the first order book exchange on Ethereum to use PLONK based validity proof.

For the general public, FluiDex is a crypto asset exchange similar to Coinbase or Huobi. The advantage is that your assets are absolutely safe. You don’t need to trust the team of the exchange to be ethical or law-abiding. You only need to trust cryptography and code. The disadvantage is that it will be more difficult to use, for example, transaction fees will be higher in some cases.

# Why build FluiDex
“Build a safe, professional and easy-to-use digital asset trading platform" is our long-term vision.

In the scope of technology products that exist today, "security" means Ethereum, which requires almost no explanation. I will talk about how FluiDex understands "professional trading" in the below paragraph.

We roughly divide the traders in the market into two categories. One category is called "speculative retail investors". The feature is that they don’t care about miners’ fees and handling fees, and don’t care about the slippage loss of market orders. They just want to be able to easily buy certain assets. Because they bet that this asset will increase several times, the other type, we call it "professional traders", they care about miners' fees and handling fees, they are skilled in using derivative hedging, they can arbitrage through different exchanges, and they are skilled in using limit/market/stoploss/FOK/IOC/AON order as a tool for different purposes, may use a program to do automatic trading.

On today's Ethereum, exchanges such as Uniswap based on algorithm-based automated market making have gained high popularity. Except higher miner fees, such exchanges generally meet the needs of "speculative retail investors". However, for this type of exchange, liquidity takers can only list market price orders. For liquidity maker, there will be profit due to rebates when the price is stable, and losses when the price fluctuates sharply. The above shortcomings can be tolerated for "speculative retail investors", but they are unimaginable for "professional traders". For every trader with a traditional financial background, if you tell them "there is no order book, you can't place an order for rebates; you can only place a market order, and set a slippage threshold at most", they will be shocked.

We expect that more and more real assets will circulate in a decentralized manner in the future, and more and more types of traders will participate in trading. Too simple swap exchanges will not be able to meet the needs of quite a few advanced traders. The traditional order book exchange will be a much easier solution.

So why hasn't the order book decentralized exchange exploded in the past few years? On the one hand, it is the ecological environment. In the early years, there were not many assets carried on Ethereum. The USDT stablecoin, which is well-known to traders, did not circulate on Ethereum two years ago. On the other hand, technology. The early and simple implementation of order book exchanges will make the cost of miners' fees for each commission and transaction comparable to swap exchanges. Expensive order and transaction costs constrain the explosion of order book exchanges. Today Thanks to the springing up of zero-knowledge proof technology in the past two years, we are finally able to provide a trading experience with zero-cost listing orders and 0.0001$-cost transaction.

In summary, the development of a decentralized economy has brought more and more traders and trading needs, and order book exchanges can better meet the needs of professional traders. In the past few years, the development of cryptography technology has made it possible for high-performance, low-cost and secure order book transactions. Therefore, it is time to build FluiDex now.

# Similar products and projects

1. Traditional centralized exchange. For quite a few, even more than half of the people, this type of exchange is good enough to use. However, for some people who have high requirements for fund security & anonymity, the hidden danger of black swan always exists in centralized exchanges. Even for a big exchange like OKEx, it happened not long ago that the exchange was unable to withdraw the coin because the founder lost contact for more than a month.
2. Algorithmic automated market making exchange. Typical is Uniswap, which sets the price of buying and selling assets by always ensuring that the number of asset A * the number of asset B == the fixed value. In the previous paragraph, we believe that such exchanges are not enough for professional traders. But it must be acknowledged that the composability of such swap exchanges is an advantage that Layer2 DEX does not have, and Layer2 DEX is more difficult to become part of the "Defi building block".
3. Order book exchange based on optimistic rollup technology. This type of exchange has high performance and is easy to develop, but it has two major disadvantages. The first is that withdrawing from such exchanges requires confirmation time of weeks, which is completely unacceptable for many traders. Second, the security of optimistic rollup is not as good as "as safe as L1" zk rollup.
4. Other products with similar technical decisions, such as diversifi and loopring. Yes, in a nutshell, FluiDex will compete head-to-head with them. That there are already one or two players in a potential big market, is not a reason why new players should not enter. It is not true that since OKEx is running well, Binance should not start a business. In addition, FluiDex and these projects will have some different decisions both in technology and product. For example, from a technical perspective, we will use PLONK as the protocol of zero-knowledge proof, which will bring faster product iteration, from a product perspective, we are likely to implement permissionless token listing.

# Decentralized Governance & Token 

I believe that our exchange is a traditional "centralized" exchange, the only difference is the self-custody of assets. There are many interpretations of "decentralization", the decentralization of assets, the decentralization of control ("governance"), and even the decentralization of teams. Based on our vision, the decentralization of assets (ie, the self-custody of assets) is necessary for us. But, at least today, we believe that decentralization of governance is neither necessary nor sufficient for building a great product. Any team that does a product will investigate users and markets, but no team will decide the future of product only through user votes. Customers and shareholders are two kinds of people. You should not force or expect customers to become shareholders. For the FluiDex team, the customer is supreme, but there will be no so-called "decentralized" governance in the future. The decision-making power of the future of the product will always be in the hands of the management team, and users are expected to vote for our success or failure with their feet.

Based on our understanding of governance philosophy above, FluiDex will not issue "governance tokens" in the foreseeable future, but we are not opposed to issuing tokens with dividend rights for fundraising. For example, it is entirely possible for us to issue a token and guarantee to buy back this token with 10% of the monthly gross profit for the next 3 years.

# Project status & schedule & financing

We have completed a relatively small seed round of financing. According to estimates, we should be able to support us to make a minimal demo. It is estimated that it will take 4-5 months to make this minimum demo, and then we will make a second round of much larger financing to support us in making a complete product. In the next six months, I may continue to contact investors, but in principle, I may not seek further investment unless the valuation and terms are close to the second round price of my expectation.

# Contract & Recruitment 

FluiDex Labs is committed to building the next generation of professional decentralized exchanges. We will use PLONK zero-knowledge proof technology on Ethereum to develop a high-performance order book digital asset spot exchange. The core team members are from  several well-known blockchain and exchange teams. Among our investors, there are experienced entrepreneurs who have worked in the cryptocurrency industry for many years, as well as the founders of the traditional high-frequency trading funds. Any friends who are interested in our products, or want to join us or invest in us, are welcome to contact us for further communication. You can join our telegram group: <https://t.me/fluid_dex>
