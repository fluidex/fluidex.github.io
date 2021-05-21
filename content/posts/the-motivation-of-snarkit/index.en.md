---
title: The inconveniences in developing Cryptography using WASM, and the motivation of snarkit
date: 2021-04-17
tags: []
---

More and more projects start to look into including WebAssembly (WASM) into their tech stacks, because there is not much interpretation between WASM instructions and CPU instructions, so that even running WASM codes in a browser we can still achieve similar performance to running native CPU instructions. This could mean huge for supporting multiple platforms while remaining efficient. Nevertheless, we can compile C/C++/Java/Rust/GoLang ... into WASM, and therefore reduce the learning curve.

But this is just an ideal case. In fact, when it comes to Cryptography, there are some more factors needed to be taken into considerations. 

In modern CPUs, there are many optimizations for Cryptography, but they cannot be utilized inside WASM VMs. Usually running SNARKs inside WASM VMs will be several times slower than on a native CPU.

Moreover, there are a couple of other limitations when using WASM:
+ It doesn't support multi-thread parallelism.
+ Memory is limited. Usually you only have 1~4 G available (If you encounter `[CompileError: WebAssembly.compile(): data segments count of 104626 exceeds internal limit of 100000` when using [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) to compile a large circuit, it's out of this reason). Otherwise you will have to compile your own WASM by yourself, like in [here](https://github.com/emscripten-core/emscripten/issues/8755#issuecomment-499682033). But again, this brings inconvenience for other contributors/developers.

When we develop large circuits using [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) 和 [snarkjs](https://github.com/iden3/snarkjs) we often encounter error messages like `data segments count exceeds internal limit` or `insufficient memory`, which bother our developments (the latter problem is not caused by WASM, but `node.js` default configurations though). It's true that we can use [circom c port](https://github.com/iden3/circom/tree/master/ports/c) to solve this kind of problems. But there is no good wrapper existed, we would have to write a script to make use of [circom c port](https://github.com/iden3/circom/tree/master/ports/c) to compile the circuit and generate the witness. This may not be convenient for other developers who do not have this script.

Due to the reasons mentioned above, we decide to develop and open-source https://github.com/Fluidex/snarkit. It's a wrapper for [circom c port](https://github.com/iden3/circom/tree/master/ports/c), but it also adds better error detection. With https://github.com/Fluidex/snarkit, people can use [circom](https://github.com/iden3/circom) to develop large circuits, the witness generation speed can also be boosted up. We believe this can make [circom](https://github.com/iden3/circom) circuit developments more friendly, and thus benefit zk-SNARKs ecosystem. 

We hope you all enjoy using it!
