---
title: "ts基础类型(2)"
date: "2019-11-19"
permalink: "ts(2)"
---

## 类 class
##### 抽象类 abstract
描述：抽象类做为其它派生类的基类使用,它们一般不会直接被实例化,不同于接口,抽象类可以包含成员的实现细节。
作用：作为基类描述抽象的部分，子类继承基类创建实例。
```typescript
//创建抽象类animal
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```
##### 访问限定符 public、private、protected
* public成员都默认为 public, 被此限定符修饰的成员是可以被外部访问。
* private 此限定符修饰的成员是只可以被类的内部访问
* protected 被此限定符修饰的成员是只可以被类的内部以及类的子类访问
##### class可以作为接口
```typescript
// props的类型
export default class Props {
  public children: Array<React.ReactElement<any>> | React.ReactElement<any> | never[] = []
  public speed: number = 500
  public height: number = 160
  public animation: string = 'easeInOutQuad'
  public isAuto: boolean = true
  public autoPlayInterval: number = 4500
  public afterChange: () => {}
  public beforeChange: () => {}
  public selesctedColor: string
  public showDots: boolean = true
}
//当需要设置defaultProps
public static defaultProps = new Props()
```
作用：方便同一管理，减少代码量。
## 函数
函数是 JavaScript 应用程序的基础,它帮助你实现抽象层、模拟类、信息隐藏和模块。
###### 定义函数类型
* 隐式定义
和类型推断类似，会推断出函数的类型。
* 显示定义 
`（a:number,b:number）`为参数类型`=>`来连接参数和返回值,最后是返回值的类型
## 函数的参数
基本与ES6语法类似
##### 可选参数
```typescript
const add = (a: number, b?: number) => a + (b ? b : 0)
```
##### 默认参数
```typescript
const add = (a: number, b = 10) => a + b
```
##### 剩余参数
```typescript
const add = (a: number, ...rest: number[]) => rest.reduce(((a, b) => a + b), a)
```
## 重载（Overload）
描述：规范函数的参数
```typescript
// 重载
interface Direction {
    top: number
    right: number
    bottom: number
    left: number
}
function assigned(all: number): Direction
function assigned(topAndBottom: number, leftAndRight: number): Direction
function assigned(top: number, right: number, bottom: number, left: number): Direction
// 代码实现函数不可被调用
function assigned (a: number, b?: number, c?: number, d?: any) {
    if (b === undefined && c === undefined && d === undefined) {
      b = c = d = a
    } else if (c === undefined && d === undefined) {
      c = a
      d = b
    }
    return {
      top: a,
      right: b,
      bottom: c,
      left: d
    }
}
```
## 泛型
描述：不确定的类型
##### 简单的使用
```typescript
//传入一个确定的类型，返回这个类型
function returnItem<T>(para: T): T {
    return para
}
```
##### 多个类型参数
```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}
swap([7, 'seven']); // ['seven', 7]
```
##### 泛型变量
```typescript
function getArrayLength<T>(arg: Array<T>) {
  console.log((arg as Array<any>).length) // ok
  return arg
}
```
##### 泛型接口
```typescript
interface ReturnItemFn<T> {
    (para: T): T
}
```
##### 泛型类
```typescript
class Stack<T> {
    private arr: T[] = []
    public push(item: T) {
        this.arr.push(item)
    }
    public pop() {
        this.arr.pop()
    }
}
```
##### 泛型约束 
```typescript
//新建实例的时候只能传入number和string类型
type Params=number|string
class Stack<T extends Params> {
    private arr: T[] = []
}
```
##### 泛型约束与索引类型
```typescript
//这个函数接受两个参数，一个参数为对象，另一个参数为对象上的属性，我们通过这两个参数返回这个属性的值
//1.对obj泛型进行约束 
//2.对key泛型约束 索引约束
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key] // ok
}
```

##### 使用多重类型进行泛型约束
```typescript
//中间转发一层
interface ChildInterface extends FirstInterface, SecondInterface {
}
class Demo<T extends ChildInterface> {
  private genericProperty: T
  useT() {
    this.genericProperty.doSomething()
    this.genericProperty.doSomethingElse()
  }
}
```
##### 泛型与 new
```typescript
//声明type是对象包含new()属性，值为泛型的类型，返回值为泛型
function factory<T>(type: {new(): T}): T {
  return new type() // ok
}
```
