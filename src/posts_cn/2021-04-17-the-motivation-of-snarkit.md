---
title: "WASM 在用于 cryptogrphy 时的限制 -- 兼谈我们为什么想开发 snarkit"
description: ""
category:
tags: []
---

现在许多项目开始喜欢使用用 WebAssembly (WASM)，因为可以在浏览器中达到像运行 native CPU 指令一样快的效率：WASM 指令和 真正 CPU 指令之间不需要太多的 解释 (interpretation) 和转换。这对于支持多平台大有裨益。并且 WASM 支持从 C/C++/Jave/Rust/GoLang... 等语言编译过去，方便现有开发人员迁移。

但这只是理想的情况，事实上对于密码学相关代码来说这一切并没有那么美好：因为现代 CPU 有很多针对密码学的黑魔法/优化，如果在 WebAssembly 虚拟机里则无法利用这一点。一般来说在 WASM 里面跑 SNARK 会比在 native CPU 上慢 8 倍。

而且 WASM 还有各种各样的限制：
+ 不支持多线程并行。
+ 能使用的内存有限制。一般来说 最多提供 1-4 G 内存供使用。否则的话你就要编译你自己版本的 WASM，像[这样](https://github.com/emscripten-core/emscripten/issues/8755#issuecomment-499682033)。但这又会造成移植和使用上的不便。一般来说如果你在使用 [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) 编译 大型电路时遇到 `[CompileError: WebAssembly.compile(): data segments count of 104626 exceeds internal limit of 100000` 的话就是这个问题导致的。

上面的种种原因使我们下定决心开发并开源 https://github.com/Fluidex/snarkit 。我们在使用 [circom wasm port](https://github.com/iden3/circom/tree/master/ports/wasm) 和 [snarkjs](https://github.com/iden3/snarkjs) 开发大型电路时总是遇到 data segments 或者 内存不够 等类似的报错，电路开发无法继续进行。使用 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 可以解决这样的问题。但 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 并没有得到很好的封装，每次都需要写脚本以调用来编译电路和生成 witness，这其实对于其他没有这些脚本的开发者并不方便。（有一些问题并不是 WASM 带来的，而是 node 默认参数带来的，但使用 snarkit 正好一并解决了这些问题。）https://github.com/Fluidex/snarkit 对 [circom c port](https://github.com/iden3/circom/tree/master/ports/c) 进行了封装，使得开发者终于可以方便地使用 [circom 语言](https://github.com/iden3/circom) 开发大型电路，witness generation 也可以更加快。

这就是我们开发 https://github.com/Fluidex/snarkit 的初衷，欢迎大家使用。

