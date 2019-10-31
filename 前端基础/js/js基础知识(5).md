---
title: "JavaScript基础知识(4)"
date: "2019-10-29"
permalink: "javascript(4)"
---


### 使用Promise实现串行
```javascript
//promises是一个数组保存许多个promise对象
let parallelPromises = promises.reduce(
  (total, currentValue) => total.then(() => currentValue.then(print)),Promise.resolve()
)
```

### 如何在保证页面运行流畅的情况下处理海量数据



### setInterval需要注意的点，使用settimeout实现setInterval

1.setInterval不能在预期的时间执行任务
2.存在执行累计的问题

如何解决不能在预期的时间执行任务
```javascript
let startTime = new Date().getTime() //获取现在的时间
let count = 0 
let interval = 1000
let currentInterval = interval

function loop() {
    count++
    // 代码执行所消耗的时间
    let offset = new Date().getTime() - (startTime + count * interval);
    // 得到下一次循环所消耗的时间
    currentInterval = interval - offset
    console.log('代码执行时间：' + offset,'下次循环间隔' + currentInterval)
    setTimeout(loop, currentInterval)
}
setTimeout(loop, currentInterval)
```
使用settimeout实现setInterval
```javascript
function mysetInterval(fn, time) {
    function refresh() {
        fn()//具体功能实现
        setTimeout(refresh, time);
    }
    refresh();
}
mysetInterval(() => {
    console.log(1)
}, 1000)
```
有循环定时器的需求，其实完全可以通过 requestAnimationFrame 来实现,
requestAnimationFrame 自带函数节流功能,并且该函数的延时效果是精确的

### 正则表达式


