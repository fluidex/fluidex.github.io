---
title: "浅谈提升 PlonK"
date: 2021-06-15
tags: [technical]
---

_致谢：感谢 Ariel Gabizon, Daira Hopwood, Kobi Gurkan, Pratyush Mishra 给我们提供的宝贵意见！（名字按字母序排序）_

在这篇文章中，我们简要阐述了优化 PlonK 的三个方向。PlonK 是一个 polynomial interactive oracle proofs (IOP) zkSNARK system。其他非 IOP 的 zkSNARK system 也存在，参见 [A Survey of Progress in Succinct Zero-Knowledge Proofs](https://telaviv2019.scalingbitcoin.org/files/a-survey-of-progress-in-succinct-zero-knowledge-proofs-towards-trustless-snarks.pptx)。

## Polynomial IOP zkSNARK system 的三个 layer

+ Accumulation layer: _用于 Recursive Proof Composition （递归证明）_
+ IOP layer: _PlonK 的核心_
+ Polynomial commitment layer: _快速验证多项式_

https://electriccoin.co/blog/explaining-halo-2/ 是一篇有助于理解各层级之间关系的很好的文章（虽然讲的是 Halo 2，但对于理解层级关系亦有帮助），在此不再赘述。


## PlonK 的源起

出于对通用的、可编程的 zkSNARK 的需要，[AZTEC](https://aztec.network/) 发明并推动了 [PlonK](https://eprint.iacr.org/2019/953.pdf)。PlonK 能用于灵活地构建专用的约束，在理论和工程之间取得了极好的平衡。V 神 的 [Understanding PLONK](https://vitalik.ca/general/2019/09/22/plonk.html) 一文是 PlonK 很好的入门文章，更多的资料也可以访问 https://github.com/Fluidex/awesome-plonk 。

PlonK 面世之后很受欢迎，[zkSync](https://zksync.io/)、[Dusk Network](https://dusk.network/)、[Mina](https://minaprotocol.com/)、[Mir](https://mirprotocol.org/) 和 [Zcash's Halo 2](https://zcash.github.io/halo2/concepts/arithmetization.html) 都在使用 PlonK 或者 PlonK 的变种。


## PlonK 的特点

Universal and updateable setup 已是老生常谈，此处不再赘述。

Groth16 等 non-universal 的 proof system 中使用 rank-1 constraint system (R1CS)，也就是一堆线性的加法乘法，作为 intermediate representation 来对电路进行抽象表示。R1CS 对这些协议很高效，但对于 universal 的协议（比如 PlonK）则并不高效。PlonK 中使用的是 gate 的概念。

所以如果从 R1CS 到 PlonK 则不能很好地发挥 PlonK 的性能，最好能通过 gate 来实现 PlonK 中的约束。


## PlonK 的性能还有提升空间

在此基础上，PlonK 的性能还有提升的空间。

如果使用了 custom gate，就可以自定义 bit arithmetic operations，包括 EC point addition、Poseidon hashes、Pedersen hashes、8-bit 逻辑异或。这一切运算会变得很高效。可以将 custom gate 理解为小 gadget。

[PLookup](https://eprint.iacr.org/2020/315.pdf) (PlonK with lookup table) 找到了一种方式在 PlonK 的电路中高效实现 lookup table （的访问）。然后就可以构建 dynamic memory，对需要使用 vectors、dynamic array 的场景极为有利。

简单的理解就是，SNARK 本身对于位运算并不友好：你需要一个个 bit 地操作。但 lookup tables 就可以解决这个问题：你不必再每一位每一位地运算，你可以比如说将你的 8-bit 的计算结果储存在一个大表中进行查找，这样就可以一次运算 8-bit 而不必每一 bit 每一 bit 地运算。

由于这个原因，lookup tables 可以用来改善原本是 SNARK-unfriendly 的计算。

AZTEC 的 Turbo-PlonK 就是在 PlonK 的基础上加上 custom gate，然后再在此之上实现 PLookup 就是 AZTEC 的 Ultra-PlonK。


## Recursive Proof

Recursive-SNARK 的良好特性也被人注意到，越来越多协议想要使用。Recursion 这一特性应该可以认为是从 [Halo](https://eprint.iacr.org/2019/1021.pdf) 中开始发展起来的。

PlonK 对于想要改造并使用 Halo-style recursion 其实也挺友好，因为可以用 custom gate 来做 Halo 中的 prime field operations（质数域算术运算）。

但值得注意的是，Ethereum 目前支持的/将来将要支持的 pairing-friendly curve（BN254, BLS12-381...），都不是 Halo-friendly 的。这将导致 verify 时的 gas 耗费过高。

这属于 aggregation layer 的优化。

## Polynomial commitment layer 的优化

[SHPLONK](https://eprint.iacr.org/2020/081.pdf) 是对 polynomial commitment layer 的优化，能结合在 PlonK 上使用，达到更好的 proof size 和 prover run time。别的一些论文也有对 polynomial commitment 进行的优化。但他们的问题是，他们需要的 cryptographic primitives 普遍在 Ethereum 上还没有。