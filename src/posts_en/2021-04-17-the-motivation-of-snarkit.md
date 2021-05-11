---
title: "The inconveniences in developing Cryptography using WASM, and the motivation of snarkit"
description: ""
category:
tags: []
---

More and more projects start to look into including WebAssembly (WASM) into their tech stacks, because there is not much interpretation between WASM instructions and CPU instructions, so that even running WASM codes in a browser we can still achieve similar performance to running native CPU instructions. This could mean huge for supporting multiple platforms while remaining efficient. Nevertheless, we can compile C/C++/Java/Rust/GoLang ... into WASM, reducing the learning curve.

But this is just an ideal case. In fact, when it comes to Cryptography, there are some more factors needed to be taken into considerations. 

In modern CPUs, there are many optimizations for Cryptography, but they cannot be utilized inside WASM VMs. Usually running SNARKs inside WASM VMs will be several times slower than on a native CPU.

And there are a couple of limitations when using WASM:
+ It doesn't support multi-thread parallelism.
+ Available memory is limited. Usually you only have 1~4 G available (If you encounter `[CompileError: WebAssembly.compile(): data segments count of 104626 exceeds internal limit of 100000` when using [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) to compile a large circuit, it's because of this reason). Otherwise you will have to compile your own WASM by yourself, like in [here](https://github.com/emscripten-core/emscripten/issues/8755#issuecomment-499682033). But again, this brings inconvenience for other contributors/developers.

When we develop large circuits using [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) 和 [snarkjs](https://github.com/iden3/snarkjs) we often encounter error messages like `data segments count exceeds internal limit` or `insufficient memory`, which bother our developments. It's true that we can use [circom c port](https://github.com/iden3/circom/tree/master/ports/c) to solve this kind of problems. But there is no good wrapper existed. So it turns out to be a bit inconvenient: we would have to write a script to 



可以解决这样的问题。但 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 并没有得到很好的封装，每次都需要写脚本已调用来编译电路和生成 witness，这其实对于其他没有这些脚本的开发者并不方便。（有一些问题并不是 WASM 带来的，而是 node 默认参数带来的，但使用 snarkit 正好一并解决了这些问题。）https://github.com/Fluidex/snarkit 对 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 进行了封装，使得开发者终于可以方便地使用 [circom 语言](https://github.com/iden3/circom) 开发大型电路，witness generation 也可以更加快。

Due to the reasons mentioned above, we decide to develop and open-source https://github.com/Fluidex/snarkit. It's a wrapper for [circom c port](https://github.com/iden3/circom/tree/master/ports/c), but it also adds better error detection. We believe this can benefit the circom ecosystem, and can make circom developing more friendly.

We hope you all enjoy using it!

