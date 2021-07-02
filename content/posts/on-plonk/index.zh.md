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

PlonK 的特点就是可以支持 通用的 和 可更新的设置。

> 这意味着两点：首先，你不需要再为每一个想要证明的程序进行单独的可信设置，而只需要进行一次可信设置，然后就可以用于任何（不超过一定大小的）程序。第二，在可信设置中可以有多方参与，那么只要有一个人是诚实的，协议就是安全的。并且这个多方参与的过程可以是一个个来的：首先第一个人参与进来，然后第二个，然后第三个......事先不需要知道都有谁参与进来；新的加入者完全可以加入到队伍的末尾。这就使得可信设置能很简单地就能有很多参与者，使得实践中达到很高的安全度。 --- 译 [Vitalik 的博客](https://vitalik.ca/general/2019/09/22/plonk.html)

Groth16 等非通用的证明系统中使用 rank-1 constraint system (R1CS) 作为 intermediate representation 来对电路进行抽象表示。PlonK 是基于 gate 而不是基于 R1CS 的，所以从 R1CS 转译不会那么高效。比如说，R1CS 中加法门电路的开销比较低，但在 PlonK 中则不是如此。

R1CS 形如 ([[WZC+ 18]](https://eprint.iacr.org/2018/691.pdf) 和 [[CWC+ 21]](https://eprint.iacr.org/2021/651.pdf) 有对其进行形式化定义):
<!-- 
$$\sum_{i\in [N]}(a_{i,j}\ x_i) \cdot \sum_{i\in [N]}(b_{i,j}\ x_i) = \sum_{i\in [N]}(c_{i,j}\ x_i)$$
 -->
<img src="https://latex.codecogs.com/svg.image?\sum_{i\in&space;[N]}(a_{i,j}\&space;x_i)&space;\cdot&space;\sum_{i\in&space;[N]}(b_{i,j}\&space;x_i)&space;=&space;\sum_{i\in&space;[N]}(c_{i,j}\&space;x_i)" title="\sum_{i\in [N]}(a_{i,j}\ x_i) \cdot \sum_{i\in [N]}(b_{i,j}\ x_i) = \sum_{i\in [N]}(c_{i,j}\ x_i)" />

PlonK 则形如：
<!-- 
$$(q_L)_i \cdot x_{a_i} + (q_R)_i \cdot x_{b_i} + (q_O)_i \cdot x_{c_i} + (q_M)_i \cdot (x_{a_i} x_{b_i}) + (q_C)_i = 0$$
 -->
<img src="https://latex.codecogs.com/svg.image?(q_L)_i&space;\cdot&space;x_{a_i}&space;&plus;&space;(q_R)_i&space;\cdot&space;x_{b_i}&space;&plus;&space;(q_O)_i&space;\cdot&space;x_{c_i}&space;&plus;&space;(q_M)_i&space;\cdot&space;(x_{a_i}&space;x_{b_i})&space;&plus;&space;(q_C)_i&space;=&space;0" title="(q_L)_i \cdot x_{a_i} + (q_R)_i \cdot x_{b_i} + (q_O)_i \cdot x_{c_i} + (q_M)_i \cdot (x_{a_i} x_{b_i}) + (q_C)_i = 0" />

PlonK 着重于固定输入数的电路，且它的线性约束可以归约到一个 permutation check（置换检查），比起一般的线性约束，结合起来简单很多。[From AIRs to RAPs - how PLONK-style arithmetization works](https://hackmd.io/@aztec-network/plonk-arithmetiization-air#How-does-all-this-relate-to-R1CS) 讨论了 R1CS 和 PlonK 中 gate 约束的优缺点。简单来说，PlonK 更加灵活（比如说它可以支持高次的约束）并使得针对应用写专用电路成为可能。

所以，如果采用 PlonK 的话，从 gates 构造会比从 R1CS 转译实现起来高效很多。

在此基础上，PlonK 的性能还有提升的空间，比如我们可以从前面提到的 3 个 layer 来进行优化。


## IOP layer 的优化

在 IOP layer，我们可以使用 custom gate，以进行自定义 bit arithmetic operations，包括 EC point addition、Poseidon hashes、Pedersen hashes、8-bit 逻辑异或。这一切会使得运算变得很高效。

[Plookup](https://eprint.iacr.org/2020/315.pdf) (PlonK with lookup table) 是通过 custom 实现的进一步的优化。Plookup 找到了一种方式在 PlonK 的电路中高效实现 lookup table，你可以预先计算一个 lookup table，并证明一个 witness 在这个表中，而不需要再去证明这个 witness 本身。这样 lookup tables 就可以用来改善原本是 SNARK-unfriendly 的计算。简单来说，SNARK 本身对于位运算并不友好：你需要一个个 bit 地操作。但 lookup tables 就可以解决这个问题：你不必再每一位每一位地运算，你可以比如说将你的 8-bit 的计算结果储存在一个大表中进行查找，这样就可以一次运算 8-bit 而不必每一 bit 每一 bit 地运算。

Plookup 还可以用于实现动态内存（vector / 动态数组），对于更灵活的电路编程模型大有裨益：比如实现零知识证明电路虚拟机，可以用于证明执行了指令及执行的正确性，以支持智能合约。

AZTEC 的 Turbo-PlonK 就是在 PlonK 的基础上加上 custom gate，然后再在此之上实现 Plookup 就是 AZTEC 的 Ultra-PlonK。AZTEC 的 benchmarks([[1]](https://medium.com/aztec-protocol/plonk-benchmarks-2-5x-faster-than-groth16-on-mimc-9e1009f96dfe), [[2]](https://medium.com/aztec-protocol/plonk-benchmarks-ii-5x-faster-than-groth16-on-pedersen-hashes-ea5285353db0), [[3]](https://medium.com/aztec-protocol/aztecs-zk-zk-rollup-looking-behind-the-cryptocurtain-2b8af1fca619), [[4]](https://www.youtube.com/watch?v=Vdlc1CmRYRY&t=1560s)) 表明他们通过 custom gates and Plookup 得到了很可观的性能提升。


## Accumulation layer 的优化

Recursive-SNARK 的良好特性也被人注意到，越来越多协议想要使用。使用 recursive proof composition 你可以将多个 proof 归集到一个 proof 中，一次性对所有 proof 进行证明/验证，并保持证明的简洁性。

[Halo](https://eprint.iacr.org/2019/1021.pdf) 可以说是第一个有实践意义的 recursive 零知识证明协议，启发了很多后续的工作。[[BCMS20]](https://eprint.iacr.org/2020/499.pdf) 对其进行了形式化、扩展，并将其命名为 "accumulation scheme"。

PlonK 对于想要改造并使用 Halo-style recursion 其实也挺友好，因为可以用 custom gate 来做 Halo 中的 prime field operations（质数域算术运算）。

这属于 accumulation layer 的优化。

## Polynomial commitment layer 的优化

[SHPLONK](https://eprint.iacr.org/2020/081.pdf) 是对 polynomial commitment layer 的优化，能结合在 PlonK 上使用，达到减小 proof 体积和证明所需要的时间。别的一些论文也有对 polynomial commitment 进行的优化。（或者，如果你采用受 FRI 启发、用了 List Polynomial Commitment 的 [REDSHIFT](https://eprint.iacr.org/2019/1400.pdf) 的话，就可以将 PlonK 变成一个 zkSTARK。虽然会增加 proof 体积，但能减少证明所需要的时间，并免除可信设置。）