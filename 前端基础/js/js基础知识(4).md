---
title: "JavaScript基础知识(4)"
date: "2019-10-28"
permalink: "javascript(4)"
---

### 为什么要使用模块化？哪几种方式可以实现模块化？有啥特点

**模块化的优点**
* 解决命令问题
* 提供复用性
* 提高代码可维护性

**立即执行函数**
```javascript
(function test(){
    //声明内容不会影响全局变量
})()
```
**commonjs**
```javascript
// a.js
module.exports = {
    a: 1
}
// or 
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```
其中require的过程就是包装了一层立即执行函数，这样就达到了不会污染全局变量了
module是Node独有的一个变量，module内部主要是一个唯一ID和exports对象，
其中module.exports和exports是指向同一个地址。

**ES Moudle**
```javascript
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}
```
**ES Moudle和Common JS的区别**
* CommonJS 支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案
* CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。
而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
* CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，
必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
* ES Module 会编译成 require/exports 来执行的

### 如何处理循环的异步操作

看代码：
```javascript
let arr = []
  for (let i = 0; i < 5; i++) {
    Promise.resolve(1).then(() => {
        console.log(i)
        arr.push(i)
    })
}
//者时候arr是空的[]
console.log(arr)
```
如果我们想一种同步执行的方式让arr取到[0,1,2,3,4]可以这么写：
```javascript
const test = async ()=>{
  let arr = []
  for (let i = 0; i < 5; i++) {
    const j = await new Promise(resolve=>{
      Promise.resolve(1).then(() => {
        console.log(i);
        resolve(i)
      })
    })
    arr.push(j)
  }
console.log(arr)
}
test();
```
这里有一个事件循环的概念还有async和await的执行过程，执行过程中
遇见await会先暂停async函数，原函数继续执行（指的是test之后的内容),
当前执行栈结束后回到await,若此时await诺已处理完则继续循环，反之则等待。

### 事件循环

**浏览器中的事件循环**
当遇到异步的代码时，会被挂起并在需要执行的时候加入到 Task（有多种 Task） 队列中。
一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，
所以本质上来说 JS 中的异步还是同步行为。
不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）。
在 ES6 规范中，microtask 称为 jobs，macrotask 称为 task。
 Event Loop 执行顺序如下所示：
* 首先执行同步代码，这属于宏任务
* 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
* 执行所有微任务
* 当执行完所有微任务后，如有必要会渲染页面
* 然后开始下一轮 Event Loop，执行宏任务中的异步代码，也就是 setTimeout 中的回调函数

微任务包括 process.nextTick ，promise ，MutationObserver，其中 process.nextTick 为 Node 独有。
宏任务包括 script ， setTimeout ，setInterval ，setImmediate ，I/O ，UI rendering。

**Node中的事件循环**
Node 的 Event Loop 分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，
都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

***timer***
timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。
***I/O***
I/O 阶段会处理一些上一轮循环中的少数未执行的 I/O 回调
***idle, prepare***
idle, prepare 阶段内部实现
***poll***
poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情
1.回到 timer 阶段执行回调
2.执行 I/O 回调
并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情
1.如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
2.如果 poll 队列为空时，会有两件事发生
 1.如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
 2.如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去
当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。
***check***
check 阶段执行 setImmediate
***close callbacks***
close callbacks 阶段执行 close 事件

setImmediate和setTimeout如果不再I/O模块执行，返回结果的速度取决于进入事件循环的时间
但若在I/O模块的回调用就永远是setImmediate先执行。因为IO 回调是在 poll 阶段执行，当回调执行完毕后队列为空，
发现存在 setImmediate 回调，所以就直接跳转到 check 阶段去执行回调了。

对于微任务来说，它会在每个阶段完成前清空微任务队列，微任务在每次宏任务之前执行。

`process.nextTick`，这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，
如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。
