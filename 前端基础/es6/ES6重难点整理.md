---
title: "ES6重难点整理"
date: "2019-04-09"
permalink: "2019-04-09-es6"
---

### let 和 const

ES6 新增了`let`和`const`，它们声明的变量，都处于“块级作用域”。并且不存在“变量提升”，不允许重复声明。

同时，`const`声明的变量所指向的内存地址保存的数据不得改变：

- 对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
- 对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的（即总是指向另一个固定的地址），不能保证指向的数据结构不可变。

如果要保证指向的数据结构也不可变，需要自行封装：

```javascript
/**
 * 冻结对象
 * @param {Object} obj
 * @return {Object}
 */
function constantize(obj) {
  if (Object.isFrozen(obj)) {
    return obj;
  }

  Reflect.ownKeys(obj).forEach(key => {
    // 如果属性是对象，递归冻结
    typeof obj[key] === "object" && (obj[key] = constantize(obj[key]));
  });

  return Object.freeze(obj);
}

/********测试代码 **********/

const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      a: 1
    }
  },
  d: [1, 2]
};

const fronzenObj = constantize(obj);
try {
  fronzenObj.d = [];
  fronzenObj.b.c = 3;
} catch (error) {
  console.log(error.message);
}
```

### Set 和 Map

> 题目：解释下`Set`和`Map`。

- Set 元素不允许重复
- Map 类似对象，但是它的键（key）可以是任意数据类型

**①Set 常用方法**

```javascript
// 实例化一个set
const set = new Set([1, 2, 3, 4]);

// 遍历set
for (let item of set) {
  console.log(item);
}

// 添加元素，返回Set本身
set.add(5).add(6);

// Set大小
console.log(set.size);

// 检查元素存在
console.log(set.has(0));

// 删除指定元素，返回bool
let success = set.delete(1);
console.log(success);

set.clear();
```

其他遍历方法：由于没有键名，`values()`和`keys()`返回同样结果。

```javascript
for (let item of set.keys()) {
  console.log(item);
}

for (let item of set.values()) {
  console.log(item);
}

for (let item of set.entries()) {
  console.log(item);
}
```

**②Map 常用方法**

Map 接口基本和 Set 一致。不同的是增加新元素的 API 是：`set(key, value)`

```javascript
const map = new Map();

// 以任意对象为 Key 值
// 这里以 Date 对象为例
let key = new Date();
map.set(key, "today");

console.log(map.get(key));
```

### Generator 与 yield

`generator`函数是 es6 提供的新特性，它的最大特点是：**控制函数的执行**。让我们从网上最火的一个例子来看：

```javascript
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }
```

通俗的解释下为什么会有这种输出：

1. 给函数 foo 传入参数 5，但由于它是 generator，所以执行到**第一个 yield 前**就停止了。
1. 第一次调用 next()，**这次传入的参数会被忽略**暂停\*\*。
1. 第二次调用 next(12)，**传入的参数会被当作上一个 yield 表达式的返回值**。因此，y = 2 \* 12 = 24。执行到第二个 yield，返回其后的表达式的值 24 / 3 = 8。然后函数在此处暂停。
1. 第三次调用 next(13)，没有 yield，只剩 return 了，按照正常函数那样返回 return 的表达式的值，并且`done`为`true`。

**难点**：在于为什么最后的`value`是 42 呢？

首先，`x`的值是刚开始调用 foo 函数传入的 5。而最后传入的 13 被当作第二个 yield 的返回值，所以`z`的值是 13。对于`y`的值，我们在前面第三步中已经计算出来了，就是 24。

所以，`x + y + z = 5 + 24 + 13 = 42`

看懂了上面的分析，再看下面这段代码就很好理解了：

```javascript
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}
```

只有第一次调用 next 函数的时候，输出的 value 是 6。其他时候由于没有给 next 传入参数，因此 yield 的返回值都是`undefined`，进行运算后自然是`NaN`。

### Promise 介绍

简单归纳下 Promise：**三个状态、两个过程、一个方法**

- 三个状态：`pending`、`fulfilled`、`rejected`
- 两个过程（**单向不可逆**）：
  - `pending`->`fulfilled`
  - `pending`->`rejected`
- 一个方法`then`：`Promise`本质上只有一个方法，`catch`和`all`方法都是基于`then`方法实现的。

请看下面这段代码：

```javascript
// 构造 Promise 时候, 内部函数立即执行
new Promise((resolve, reject) => {
  console.log("new Promise");
  resolve("success");
});
console.log("finifsh");

//  then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装
Promise.resolve(1)
  .then(res => {
    console.log(res); // => 1
    return 2; // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res); // => 2
  });
```

### async/await 介绍

`async`函数返回一个`Promise`对象，可以使用`then`方法添加回调函数。

当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

这也是它最受欢迎的地方：**能让异步代码写起来像同步代码，并且方便控制顺序**。

可以利用它实现一个`sleep`函数阻塞进程：

```javascript
function sleep(millisecond) {
  return new Promise(resolve => {
    setTimeout(() => resolve, millisecond);
  });
}

/**
 * 以下是测试代码
 */
async function test() {
  console.log("start");
  await sleep(1000); // 睡眠1秒
  console.log("end");
}

test(); // 执行测试函数
```

虽然方便，**但是它也不能取代`Promise`，尤其是我们可以很方便地用`Promise.all()`来实现并发**，而`async/await`只能实现串行。

```javascript
function sleep(second) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(Math.random());
      resolve();
    }, second);
  });
}

async function chuanXingDemo() {
  await sleep(1000);
  await sleep(1000);
  await sleep(1000);
}

async function bingXingDemo() {
  var tasks = [];
  for (let i = 0; i < 3; ++i) {
    tasks.push(sleep(1000));
  }

  await Promise.all(tasks);
}
```

运行`bingXingDemo()`，几乎同时输出，它是并发执行；运行`chuanXingDemo()`，每个输出间隔 1s，它是串行执行。

### ES6 对象和 ES5 对象

> 题目：es6 class 的 new 实例和 es5 的 new 实例有什么区别？

在`ES6`中（和`ES5`相比），`class`的`new`实例有以下特点：

- `class`的构造参数必须是`new`来调用，不可以将其作为普通函数执行
- `es6` 的`class`不存在变量提升
- **最重要的是：es6 内部方法不可以枚举**。es5 的`prototype`上的方法可以枚举。

为此我做了以下测试代码进行验证：

```javascript
console.log(ES5Class()); // es5:可以直接作为函数运行
// console.log(new ES6Class()) // 会报错：不存在变量提升

function ES5Class() {
  console.log("hello");
}

ES5Class.prototype.func = function() {
  console.log("Hello world");
};

class ES6Class {
  constructor() {}
  func() {
    console.log("Hello world");
  }
}

let es5 = new ES5Class();
let es6 = new ES6Class();

// 推荐在循环对象属性的时候，使用for...in
// 在遍历数组的时候的时候，使用for...of
console.log("ES5 :");
for (let _ in es5) {
  console.log(_);
}

// es6:不可枚举
console.log("ES6 :");
for (let _ in es6) {
  console.log(_);
}
```

**参考/推荐**：[《JavaScript 创建对象—从 es5 到 es6》](https://fed.renren.com/2017/08/07/js-oop-es52es6/)

### Proxy 代理器

他可以实现 js 中的“元编程”：在目标对象之前架设拦截，可以过滤和修改外部的访问。

它支持多达 13 种拦截操作，例如下面代码展示的`set`和`get`方法，分别可以在设置对象属性和访问对象属性时候进行拦截。

```javascript
const handler = {
  // receiver 指向 proxy 实例
  get(target, property, receiver) {
    console.log(`GET: target is ${target}, property is ${property}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`SET: target is ${target}, property is ${property}`);
    return Reflect.set(target, property, value);
  }
};

const obj = { a: 1, b: { c: 0, d: { e: -1 } } };
const newObj = new Proxy(obj, handler);

/**
 * 以下是测试代码
 */

newObj.a; // output: GET...
newObj.b.c; // output: GET...

newObj.a = 123; // output: SET...
newObj.b.c = -1; // output: GET...
```

运行这段代码，会发现最后一行的输出是 `GET ...`。也就是说它触发的是`get`拦截器，而不是期望的`set`拦截器。**这是因为对于对象的深层属性，需要专门对其设置 Proxy**。

**更多请见**：[《阮一峰 ES6 入门：Proxy》](http://es6.ruanyifeng.com/#docs/proxy)

### EsModule 和 CommonJS 的比较

目前 js 社区有 4 种模块管理规范：AMD、CMD、CommonJS 和 EsModule。 ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别：

- CommonJS 支持动态导入，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案：`import(xxx)`
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- commonJs 输出的是值的浅拷贝，esModule 输出值的引用
- ES Module 会编译成 `require/exports` 来执行的
