---
title: "On the optimization of PlonK"
date: 2021-04-17
tags: [technical]
---

# On the optimization of PlonK

_Acknowledgement: we thank Ariel Gabizon, Daira Hopwood, Kobi Gurkan, Pratyush Mishra (in alphabetical order) for their kindly reviews and insightful comments._

In this article we focus on polynomial interactive oracle proofs (IOP) zkSNARK systems, proof systems other than using IOP also exist, for comparisons please refer to: [A Survey of Progress in Succinct Zero-Knowledge Proofs](https://telaviv2019.scalingbitcoin.org/files/a-survey-of-progress-in-succinct-zero-knowledge-proofs-towards-trustless-snarks.pptx).

## The 3 layers of a polynomial IOP zkSNARK system

+ Accumulation layer: _for Recursive Proof Composition_
+ IOP layer: _PlonK core is here_
+ Polynomial commitment layer: 

Readers can gain a basic idea on the relationships between each layers from https://electriccoin.co/blog/explaining-halo-2/ (although it's about Halo 2, it's still helpful for understanding the relationships), so we would like to skip redundant explanations here.


## The origin of PlonK

Out of the desire for a universal, programmable SNARK, [AZTEC](https://aztec.network/) invents and promotes the industry use of [PlonK](https://eprint.iacr.org/2019/953.pdf). PlonK is flexible to build application-specific constraints, so that it strikes a balance between theoretical properties and engineering needs. Vitalik also wrote an awesome article explaining PlonK: [Understanding PLONK](https://vitalik.ca/general/2019/09/22/plonk.html). You may also find some useful resources on https://github.com/Fluidex/awesome-plonk.

PlonK has been popular since it went published. [zkSync](https://zksync.io/), [Dusk Network](https://dusk.network/), [Mina](https://minaprotocol.com/), [Mir](https://mirprotocol.org/), and [Zcash's Halo 2](https://zcash.github.io/halo2/concepts/arithmetization.html), are projects using PlonK or its variants.


## The features of PlonK

PlonK supports universal and updateable setup, so 

> This means two things: first, instead of there being one separate trusted setup for every program you want to prove things about, there is one single trusted setup for the whole scheme after which you can use the scheme with any program (up to some maximum size chosen when making the setup). Second, there is a way for multiple parties to participate in the trusted setup such that it is secure as long as any one of them is honest, and this multi-party procedure is fully sequential: first one person participates, then the second, then the third... The full set of participants does not even need to be known ahead of time; new participants could just add themselves to the end. This makes it easy for the trusted setup to have a large number of participants, making it quite safe in practice. --- taken from [Vitalik's website](https://vitalik.ca/general/2019/09/22/plonk.html)

Groth16 and other non-universal proof systems use rank-1 constraint system (R1CS) as the intermediate representation for their zkp circuits. PlonK is gate-based instead of R1CS-based, and transpiling from R1CS will likely be inefficient if using PlonK. For example, addition gates are cheap in R1CS-based systems, however which is not the case in gate-based systems.

R1CS has the form (see the definitions in [[WZC+ 18]](https://eprint.iacr.org/2018/691.pdf) or [[CWC+ 21]](https://eprint.iacr.org/2021/651.pdf)):
$$\sum_{i\in [N]}(a_{i,j}\ x_i) \cdot \sum_{i\in [N]}(b_{i,j}\ x_i) = \sum_{i\in [N]}(c_{i,j}\ x_i)$$

However, PlonK using a constraint system in the form of:
$$(q_L)_i \cdot x_{a_i} + (q_R)_i \cdot x_{b_i} + (q_O)_i \cdot x_{c_i} + (q_M)_i \cdot (x_{a_i} x_{b_i}) + (q_C)_i = 0$$

PlonK focuses on constant fan-in circuits, and its linear constraints can be reduced to a permutation check, which can be more simply combined than general linear constraints. [From AIRs to RAPs - how PLONK-style arithmetization works](https://hackmd.io/@aztec-network/plonk-arithmetiization-air#How-does-all-this-relate-to-R1CS) discusses the advantanges and disadvantanges of them. In a word, PlonK is more flexible (e.g., it allows constraints of degree larger than two, comparing to R1CS) and allows writing application-specific programs.

Therefore, it'd be more efficient if construting from gates in PlonK, instead of transpiling from R1CS.



## Optimizing PlonK on IOP layer

We could also work from the three layers mentioned above to optimize PlonK.

For example, on the IOP layer, we could use custom gates (in Plonk you could flexibly DIY constraints) to define bit arithmetic operations, including EC point addition, Poseidon hashes, Pedersen hashes, 8-bit XOR, and so on, to save the proving computations.

[Plookup](https://eprint.iacr.org/2020/315.pdf) (PlonK with lookup table) is a further optimization. It enables lookup table in PlonK circuits, so that you can precompute a lookup table of the legitimate (input, output) combinations, and prove a witness existing in the table, instead of proving the witness itself. This means we can use lookup tables to help the computations that were SNARK-unfriendly originally. For example, without lookup tables, SNARKs is not friendly to bit operations: because we will have to compute bit-by-bit; but with lookup tables, we can now store the result of an 8-bit operation in a table to lookup and access, avoiding computing bit-by-bit again. (You can think it as compute 8 bits at a time.)

Plookup can also be extended to vector lookups and multiple tables, bringing huge benefits to circuit programming models involving dynamic memory (e.g., vectors & dynamic array).

AZTEC's "Turbo-PlonK" is "PlonK + custom gate", and its "Ultra-PlonK" is "PlonK (+ custom gate) + Plookup". According to their benchmarks([[1]](https://medium.com/aztec-protocol/plonk-benchmarks-2-5x-faster-than-groth16-on-mimc-9e1009f96dfe), [[2]](https://medium.com/aztec-protocol/plonk-benchmarks-ii-5x-faster-than-groth16-on-pedersen-hashes-ea5285353db0), [[3]](https://medium.com/aztec-protocol/aztecs-zk-zk-rollup-looking-behind-the-cryptocurtain-2b8af1fca619), [[4]](https://www.youtube.com/watch?v=Vdlc1CmRYRY&t=1560s)), they achieve considerable improvements by integrating custom gates and Plookup.


## Optimization on accumulation layer

Another great technique is recursive proof composition: it has such a nice feature that you can recursively aggregate several proofs into a single proof while still keeping it succinct, and you can verify them all in one go.

[Halo](https://eprint.iacr.org/2019/1021.pdf) is probably the first notable efficient recursive zkp scheme without requiring a trusted setup, which inspires many future works. [[BCMS20]](https://eprint.iacr.org/2020/499.pdf) formalizes&generalizes this technique and calls it "accumulation scheme".

PlonK can use custom gate for prime field arithmetic, which means it will be quite convenient and efficient to implement Halo-style recursion in PlonK. This is an optimization technique on accumulation layer.

## Optimization on polynomial commitment layer

[SHPLONK](https://eprint.iacr.org/2020/081.pdf) is an optimization on polynomial commitment layer, which can work with PlonK to acheive smaller proof size and shorter proving time. Other protocols aiming at optimizing polynomial commitment also exist.
