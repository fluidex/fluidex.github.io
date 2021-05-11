---
title: "The motivation of snarkit"
description: ""
category:
tags: []
---

More and more projects start to look into including WebAssembly (WASM) into their tech stacks, because there is not much interpretation between WASM instructions and CPU instructions, so that even running WASM codes in a browser we can still achieve similar performance to running native CPU instructions. This could mean huge for supporting multiple platforms while remaining efficient.

But this is just an ideal case. In fact, when it comes to Cryptography, there are some more factors needed to be taken into considerations. 

In modern CPUs, there are many optimizations for Cryptography, but they cannot be utilized inside WASM VMs. Usually running SNARKs inside WASM VMs will be several times slower than on a native CPU.

And there are a couple of limitations when using WASM:
+ It is inconvenient for multi-thread parallelism: you have to __TODO:__
+ 能使用的内存有限制。一般来说 最多提供 1-4 G 内存供使用。否则的话你就要编译你自己版本的 WASM，像[这样](https://github.com/emscripten-core/emscripten/issues/8755#issuecomment-499682033)。但这又会造成移植和使用上的不便。一般来说如果你在使用 [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) 编译 大型电路时遇到 `[CompileError: WebAssembly.compile(): data segments count of 104626 exceeds internal limit of 100000` 的话就是这个问题导致的。

Due to the reasons mentioned above, we decide to develop and open-source https://github.com/Fluidex/snarkit.


 。我们在使用 [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) 和 [snarkjs](https://github.com/iden3/snarkjs) 开发大型电路时总是遇到 data segments 或者 内存不够 等类似的报错，电路开发无法继续进行。使用 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 可以解决这样的问题。但 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 并没有得到很好的封装，每次都需要写脚本已调用来编译电路和生成 witness，这其实对于其他没有这些脚本的开发者并不方便。（有一些问题并不是 WASM 带来的，而是 node 默认参数带来的，但使用 snarkit 正好一并解决了这些问题。）https://github.com/Fluidex/snarkit 对 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 进行了封装，使得开发者终于可以方便地使用 [circom 语言](https://github.com/iden3/circom) 开发大型电路，witness generation 也可以更加快。

We hope you all enjoy using it!

