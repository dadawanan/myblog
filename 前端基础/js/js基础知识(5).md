---
title: "JavaScript基础知识(5)"
date: "2019-10-29"
permalink: "javascript(5)"
---


## 使用Promise实现串行
```javascript
//promises是一个数组保存许多个promise对象
let parallelPromises = promises.reduce(
  (total, currentValue) =>
   total.then(() =>
   currentValue.then(print)),Promise.resolve()
)
```

## 如何在保证页面运行流畅的情况下处理海量数据

* 建立一个海量数据的高度
* Dom中只显示合理的部分数据(数据多余可是窗口的高度解决白屏问题)
* 监听滚动改变数据并让数据偏移对应的量


## setInterval需要注意的点，使用settimeout实现setInterval

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

## 正则表达式

正则表达式通常分为2类：
* 字符串上调用：进行正则规则匹配，操作对象是正则表达式。常见的有 search/match/replace
* 正则表达式上调用：操作对象是字符串。常见的有test/exect

#### 实现千分位标注
```javascript
/**
 * 实现千分位标注位
 * @param {*} str 待标注的字符串
 * @param {*} sep 标注符号
 */
const addSeparator = (str = "", sep = ",") => {
  str += "";
  const arr = str.split("."),
    re = /(\d+)(\d{3})/;

  let integer = arr[0],
    decimal = arr.length <= 1 ? "" : `.${arr[1]}`;

  while (re.test(integer)) {
    integer = integer.replace(re, "$1" + sep + "$2");
  }

  return integer + decimal;
};

console.log(addSeparator(-10000.23)); // -10,000.23
console.log(addSeparator(100)); // 100
console.log(addSeparator(1234, ";")); // 1;234
```

