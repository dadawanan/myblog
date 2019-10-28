---
title: "JavaScript基础知识(3)"
date: "2019-10-28"
permalink: "javascript(3)"
---


### JavaScript 中的变量在内存中的具体存储形式

JavaScript中的变量分为基本类型和引用类型 基本类型是保存在栈内存中的简单数据段，它们的值都有固定的大小，
保存在栈空间、通过按值访问
引用类型是保存在堆内存中的对象，值大小不固定，栈内存中存放的该对象的访问地址指向堆内存中的对象，
JavaScript不允许直接访问堆内存的位置，因此操作对象时，实际操作对象的引用

```javascript
let a=0 //栈内存
let b='a' //栈内存
let c=null //栈内存
let d={a:'1'} //变量d存在于栈中，{a:'1'}作为对象存在于堆中
let e=[1] //变量e存在于栈中，[1]作为对象存在于堆中
```
栈内存：存储基本数据类型、按值访问、存储大小固定、由系统自动分配内存空间、空间小、运行效率高、先进后出、后进先出
堆内存：存储引用数据类型、按引用访问、存储的值大小不定、课动态调整、由代码进行指定分配、
空间大、运行效率较低、无序存储、可以根据引用直接获取

延伸:深拷贝、浅拷贝、js数据基本类型、垃圾回收机制

### 基本数据类型对应的内置对象以及它们之间的装箱、拆箱操作

常见的内置对象：
1、Object 
hasOwnProperty()
toLocaleString()
toString()
valueOf()
isPrototypeof() //检查传入对象是否当前对象的原型
2.String
indexOf()
lastIndexOf()
slice()
substring()
substr()
splite()
toUpperCase() toLowerCase() 
3.Boolean
toString()
valueOf()
4.Number
toFixed()
toLocaleString()
toString()
valueOf()
toPrecision() //指定数字长度

装箱：装箱就是把基本类型转为对于的对象。装箱分为隐式和显示。
隐式装箱：
```javascript
num.toFixed(2) 
//以上的代码执行过程
 var c=new Number(111) //创建一个number类型的实例
 c.toFiexed(2) //在实例上调用方法
 c=null //销毁实例
```
显示装箱：
```javascript
var obj =new String('123')
```

拆箱：把对象转变为基本类型的值，拆箱过程内部调用了抽象操作Topremitive。
该操作接收2个参数，第一个参数是要转变的对象，第二个参数是对象期待被转换的类型。
默认情况下Topremitive先检查是否有ValueOf方法，如果有则在检查ValueOf方法是否有基本类型的返回值。
如果没有valueof或者valueof没有返回值就会调用tostring,如果tostring方法也没有就会返回TypeError错误。
第二个参数会影响调用顺序。
```javascript
var obj = {
    valueOf : () => {console.log("valueOf"); return []},
    toString : () => {console.log("toString"); return []}
}

String(obj)
// toString
// valueOf
// Uncaught TypeError: Cannot convert object to primitive value

obj+' '
//valueOf
//toString
// Uncaught TypeError: Cannot convert object to primitive value

Number(obj)
//valueOf
//toString
// Uncaught TypeError: Cannot convert object to primitive value
```
null

### 为什么0.1+0.2！==0.3

因为JS采用的是IEEE754双精度版本（64位）。计算机是通过二进制来存储东西的，那么0.1在二进制中会表示为
`0.1 = 2^-4 * 1.10011(0011)` //0011表示循环
我们还可以发现0.1在二进制中事是无限循环的一些数字，但是JS采用的浮点数标准却会裁剪掉我们的数字。

在双精度版本中将54位分为来三段
* 第一个用来表示符号
* 接下去的11位用来表示指数
* 其余的位数用来表示有效位

console.log(0.1)===0.1 //true 
过程：在输入的时候，二进制被转为十进制，十进制又被转为字符串，在这个转换的过程中发生了取近视值的过程，
所以打印出来的其实是一个近视值。
如何解决：`parseFlot((0.1+0.2).toFixed(10)) === 0.3`
延伸：JS能精准表示的最大安全整数 Math.pow(2,53)

### instanceof的底层实现原理,手动实现一个instanceof

原理：instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。

```javascript
function instanceof(left,right){
    //获取类型的原型
    let prototype = right.prototype
    //获取对象的原型
    left = left.__proto__
    //循环判断对象的原型是否等于类型的原型，直到对象原型为null，因为原型链最终为null.
  while (true) {
    if (left === null || left === undefined)
      return false
    if (prototype === left)
      return true
      //既不是null也不相等继续向上寻找
    left = left.__proto__
  }
}
```

### new一个对象的详细过程及手动实现一个new操作符

* 创建空对象 
* 实用新对象调用函数，函数中的this被指向新实例对象
* 设置新对象的constructor属性为构造函数名称 设置新对象的_proto_属性指向构造函数的prototype对象
* 将初始化完毕的新对象地址保存到等号左边的变量中
```javascript
function new(func){
    //创建一个继承func.prototype的对象
    var newObj=Object.create(func.prototype)
    //截取new函数第二个以及之后的参数，在newObj作用域内执行改造函数func
    var returnObj=func.apply(newObj,Array.prototype.slice.call(argument,1))
    if((typeof returnObj==="object"||typeof returnobj==="function")&&returnobj !==null){
        return returnObj
    }
    return newObj
}
```