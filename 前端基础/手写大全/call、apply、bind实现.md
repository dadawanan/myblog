---
title: "apply、call、bind实现"
date: "2019-09-01"
permalink: "2019-09-01-apply..."
---
### apply、call、bind实现
- `apply`实现
- `call`实现
- `bind`实现

## `apply`实现
```javascript
//context myApply指向的对象
Function.prototype.myApply = function (context = window, args = []) {
    //给context新增一个独一无二的属性以免覆盖原属性
    const key = Symbol()
    //this指的是func方法
    console.log(this)
    context[key] = this
    //通过隐式绑定的方式调用函数
    const result = context[key](...args)
    //删除添加的属性
    delete context[key]
    //返回函数调用的返回值
    return result
}
let thisArg = {
    abc: 3
}
function func(...args) {
    console.log(args)
    console.log(this.abc)
}
func.myApply(thisArg, [4, 2, 3])
func()
```

## `call`实现
```javascript
//apply和call差不多
Function.prototype.myCall = function (context = window, ...args) {
    //args不传参时默认为[]
    console.log(args)
    //给context新增一个独一无二的属性以免覆盖原属性
    const key = Symbol()
    //this指的是func方法
    console.log(this)
    context[key] = this
    //通过隐式绑定的方式调用函数
    const result = context[key](...args)
    //删除添加的属性
    delete context[key]
    //返回函数调用的返回值
    return result
}
func.myCall(thisArg)
func()
```
## `bind`实现
```javascript
//bind
Function.prototype.mybind = function (context, ...args) {
    const fn = this
    console.log(args)
    return function newFn(...newFnArgs) {
        //考虑返回的函数可能被new 调用
        if (this instanceof newFn) {
            return new fn(...args, ...newFnArgs)
        }
        return fn.apply(context, [...args, ...newFnArgs])
    }
}
const newFun = func.mybind(thisArg, 1, 2, 3, 4, 5)
newFun()
```