---
title: "Differential AMM: 一种基于微观指标设计的灵活 AMM 算法"
date: 2021-05-19
tags: [technical]
---

__摘要：__ 本文提出了一种基于微观指标 (资金量、价格区间[^1]、深度等) 设计的 AMM 算法。
比起传统的常函数做市商（CFMM）算法（及它们的变种）来说，它能更直观地反应市场、更契合流动性提供者的做市需求。

AMM 策略通常使用宏观指标来定义，宏观指标是指描述总量的指标，包括 AMM 池中的交易币种数量(base amount)和计价币种数量(quote amount)等。例如，最常见的 AMM 做市算法——恒定乘积算法——要求 base 数量 和 quote 数量的乘积在每次交易前后相等。但是实际上对于每个具体交易者而言，微观指标对单次的交易行为更有意义。微观指标是指刻画变化，或者叫刻画边际效应的指标，如当前的买卖盘口价和盘口深度。盘口价格刻画了当前状态下做一笔小交易的平均成交价格，而盘口深度刻画了指定交易价格内最大的成交量。盘口深度可以通俗解释为，假设现在 ETH-USDT 价格为 3450，我希望以不超过 3451 的价格购买尽可能多的 ETH，我最多能买到多少 ETH？

盘口价格和盘口深度也是 orderbook 视角下更直观的指标。我们希望能从这两个微观指标出发，更好地理解和设计 AMM 算法。

# 数学原理-宏观指标和微观指标的关系

本章节会给出价格和深度这两个指标，和 base/quote 量的关系。我们将会看到，价格和深度函数，都可以从 base/quote 函数经过若干次求导/反函数变换推导出来。

假设交易池中 base 数量和 quote 数量满足如下关系:

```
quote = f(base)
```

则显然有 quote > 0, base > 0. f 单调递减，即 f' < 0（因为交易中，一种 token 增多，另一种当然减少）

按照定义，价格就是 f 的导数的绝对值（正负原因需要取相反数）。

```
price = abs(f'(base)) = -f'(base)
```

一般我们要求价格(即 -f')单调递减，即 base 越少，价格越高。因此 f'' > 0。综上，合理的 f，必然是一个定义在第一象限的下凸的单调递减函数。

相应的，盘口深度(depth)实际上是总 base 量对于价格的导数。 

```
depth = f2'(price)
f2 = Inverse(f') 

Inverse 表示反函数
```

上式中，f2 是价格函数的反函数，它的导数就是深度对于价格的函数。

以上就是 盘口价格/盘口深度 和 base/quote 函数的关系。

# 数学原理-求解


对于 AMM 交易池的创建者而言，他最关心的是初始的价格(price0)和深度(depth0)。数学上看，他需要给出一个形如 quote = f(base) 的 AMM 函数，使得这个函数存在一点能够同时满足价格为 price0 且深度为 depth0。  

换言之，创建者需要解以下的式子：

```
已知 depth0, price0。
f 是描述 base 和 quote 数量的函数 quote = f(base)，求 f ，使其能够满足：

存在 base0 使得 f'(base0) = price0
(Inverse(f'))'(price0) = depth0

此外要求 f > 0 且 f' < 0 且 f'' > 0，即 f 为第一象限的下凸的单减函数。
```

上面式子约束太少，实际上有无数组解。f 可以是倒数函数，f 可以是更一般的双曲函数，f 可以是指数函数，f 可以是幂函数。但是下一节我们会看到，如果我们指定某种具体的 f 形式并且控制可以改变的系数，则可能可以确定函数的唯一解。

### 一种解：f 为平移倒数函数时的解 

如果 f 为倒数函数，形式如下

```
quote = f(base) = C / (base + BASE_DELTA) - QUOTE_DELTA 

或者等价地，用多个变量表示
vQuote = C / vBase
vQoute = quote + QUOTE_DELTA
vBase = base + BASE_DELTA
其中 C BASE_DELTA QUOTE_DELTA 为正的常数
```

f 为这种形式时，求导得到价格和深度为

```
price = -f'(base) = C / (vBase**2) = vQuote / vBase
depth = vBase**2 / (2 * vQuote)
```

按照 price0 处深度为 depth0 的条件，可以解得：

```
C = vBase0 * vQuote0 = 4 * price0**3 * depth0**2
vQuote0 = 2 * price0**2 * depth0 = quote0 + QUOTE_DELTA
vBase0 = 2 * price0 * depth0 = base0 + BASE_DELTA
```

则最终 AMM 函数 quote = f(base) 为

```
quote = f(base) = C / (base + BASE_DELTA) - QUOTE_DELTA,
其中 C = 4 * price0**3 * depth0**2, BASE_DELTA QUOTE_DELTA 为任意常数。
```

综上，我们展示了如果指定 f 为倒数函数，则可以通过 price 和 depth 得到唯一函数解。虽然 f 实际上可以是无数多种函数类型，但是简化起见，我们后文都将使用倒数函数来作为我们的最终 AMM 函数。

# Differential AMM 的公式定义

将上一节中所有的推导汇集在一起，我们可以得到 Differential AMM 的完整定义：

```
quote = f(base) = C / (base + BASE_DELTA) - QUOTE_DELTA
```

DAMM 所有相关参数含义：

| 名称 | 含义 |
| --- | --- | 
| price0 | 初始盘口价 |
| depth0 |  初始盘口深度 |
| lowPrice |  最低自动做市价，最低可以是0 |
| highPrice |  最高自动做市价，最高可以是正无穷 |
| quote0 |  初始真实 quote 资金量 |
| base0 |  初始真实 base 资金量 |
| QUOTE_DELTA |  虚拟 quote 资金量 |
| BASE_DELTA |  虚拟 base 资金量 |
| C |  恒定乘积 |
| vQoute0  | 初始总体 quote 量，真实加虚拟 |
| vBase0 | 初始总体 base 量，真实加虚拟 |

相关参数关系：

```
(1) C = 4 * price0**3 * depth0**2
(2) lowPrice = QUOTE_DELTA**2 / C
(3) highPrice = C / BASE_DELTA**2
(4) price0 = vQuote0 / vBase0
(5) depth0 = vBase**2 / (2 * vQuote)
(6) vQoute0 = 2 * price0**2 * depth0
(7) vBase0 = 2 * price0 * depth0
(8) vQoute0 = quote0 + QUOTE_DELTA
(9) vBase0 = base0 + BASE_DELTA
```

注意1: 值得指出的是，上述式子中，(4)(5) 和 (6)(7) 是等价的。

注意2: 同等 price0 depth0 时，QUOTE\_DELTA 和 BASE\_DELTA 越小，base0 quote0 越大，即提供同样盘口流动性的资金量越大，所谓“资金效率”越低，但是做市的价格范围（lowPrice到highPrice）也越大。极端地，当 QUOTE\_DELTA 和 BASE\_DELTA 为 0 时，lowPrice 将为 0，highPrice 为无穷大，此时 DAMM 蜕化为普通恒定乘积 AMM。我们可以通过调节 lowPrice highPrice，任意地调节资金效率。

实际使用中，我们对于以下三组六个参数 (1) depth price (2) lowPrice highPrice (3) quote0 base0，已知任意两组，都可以推导出第三组参数和完整的做市函数。

下面三种不同初始条件对应的 DAMM 应用场景。

### 给定盘口价格深度，和初始做市资金量

即在方程组中，已知 price0 depth0, 和 quote0，base0，需要计算做市价格范围和其他所有剩余参数。

具体求解见： <https://github.com/fluidex/differential-amm/blob/673b2801c822bc5e75dc63f1def0204b8d57bb03/main.ts#L39>

### 给定盘口价格深度，和做市价格范围

即在方程组中，已知 price0 depth0, 和 lowPrice（可以为 0），highPrice（可以为  Infinity），需要计算出初始做市资金量和其他所有剩余参数。

具体求解见：<https://github.com/fluidex/differential-amm/blob/673b2801c822bc5e75dc63f1def0204b8d57bb03/main.ts#L53>

### 给定做市价格范围，和初始做市资金量

此种情况最为复杂。实际上等价于解一个二元二次方程。通过解这个方程我们也可以得到所有剩余参数。

具体求解：<https://github.com/fluidex/differential-amm/blob/673b2801c822bc5e75dc63f1def0204b8d57bb03/main.ts#L72>

从上面三种应用场景可以看到 DAMM 具有极大的灵活性。灵活性一方面体现在，不同的场景可能有不同的做市需求和不同的初始条件，在以上三种不同的初始条件情况下，我们都能求解出一个正确的 DAMM 策略。灵活性另一方面体现在，**我们可以通过价格范围或初始资金量，任意调节做市资金效率**。




# 其他 

## 从 AMM 到 orderbook 的转化

将 AMM 曲线分段近似，就可以得到一份离散化 orderbook。在 [参考实现代码](https://github.com/fluidex/differential-amm/blob/673b2801c822bc5e75dc63f1def0204b8d57bb03/main.ts#L156) 中，我们可以指定价格 interval 和 order 数量，通过计算 base delta 和 quote delta，得到订单大小和平均价格。

## 数学等价性

容易看出 DAMM 在数学上等价于 (x + a)(y + b) = k 的做市算法。不同之处在于我们给了很多的微观诠释，也指出了多种不同的从初识条件求解的可能性。

[^1]: 虽然 Uniswap V3 也支持在一定价格区间内做市，但它们不支持在确定区间内调节配资比例，更无法支持单边做市。
