---
title: "JavaScript基础知识(3)"
date: "2019-10-28"
permalink: "javascript(3)"
---


### JavaScript 中的变量在内存中的具体存储形式

JavaScript中的变量分为基本类型和引用类型 基本类型是保存在栈内存中的简单数据段，它们的值都有固定的大小，保存在栈空间、通过按值访问
引用类型是保存在堆内存中的对象，值大小不固定，栈内存中存放的该对象的访问地址指向堆内存中的对象，JavaScript不允许直接访问堆内存的位置，因此操作对象时，实际操作对象的引用

```javascript
let a=0 //栈内存
let b='a' //栈内存
let c=null //栈内存
let d={a:'1'} //变量d存在于栈中，{a:'1'}作为对象存在于堆中
let e=[1] //变量e存在于栈中，[1]作为对象存在于堆中
```
栈内存：存储基本数据类型、按值访问、存储大小固定、由系统自动分配内存空间、空间小、运行效率高、先进后出、后进先出
堆内存：存储引用数据类型、按引用访问、存储的值大小不定、课动态调整、由代码进行指定分配、空间大、运行效率较低、无序存储、可以根据引用直接获取

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

