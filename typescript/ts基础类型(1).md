---
title: "ts基础类型(1)"
date: "2019-11-19"
permalink: "ts(1)"
---

## 原始类型
```typescript
let value:'number|string|boolean|void|null|undefined|Symbol|bigint'
```

## 其他类型
```typescript
let value:'any|unknown|never|object|Array|Tuple'
```

## 枚举类型 enmu
何时使用：声明一组命名的常数,当一个变量有几种可能的取值时,可以将它定义为枚举类型。
##### 数字枚举
作用：值其实是默认的数字类型,而且默认从0开始依次累加，并且一个值赋值后,后面也会根据第一个值进行累加
##### 字符串枚举
描述：值是字符串
##### 异构枚举
描述：字符串和数字混用
##### 反向映射
描述：因为默认值是数字类型,name <=> value //双向绑定
##### 枚举的本质
```typescript
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 10] = "Up";
    Direction[Direction["Down"] = 11] = "Down";
    Direction[Direction["Left"] = 12] = "Left";
    Direction[Direction["Right"] = 13] = "Right";
})(Direction || (Direction = {}));
```
##### 常量枚举
描述：枚举被const定义
作用：编译完后可以把枚举删除，提高性能。
用法：const emum 
##### 联合枚举
描述：类型系统可以知道枚举里的值的集合
作用：让类型更加精确
用法：
```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right
}
declare let a: Direction
a = Direction.Up
```
##### 枚举成员的类型
描述：当所有枚举成员都拥有字面量枚举值时，枚举成员成为了类型。
用法：
```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right
}
const a = 0
console.log(a === Direction.Up) // true
type c = 0
declare let b: c
b = 1 // 不能将类型“1”分配给类型“0”
b = Direction.Up // 
```
##### 枚举合并
描述：相同类型会合并

##### 为枚举添加静态方法
```typescript
enum Month {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}
namespace Month {
    export function isSummer(month: Month) {
        switch (month) {
            case Month.June:
            case Month.July:
            case Month.August:
                return true;
            default:
                return false
        }
    }
}
console.log(Month.isSummer(Month.January)) // false
```
## 接口 interface
描述：对值所具有的结构进行类型检查，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
作用：扩展基本类型。
##### 接口可选属性、只读属性、函数属性
```typescript
interface User {
    name: string
    age?: number
    readonly isMale: boolean
    say: (words: string) => string
}
```
##### 属性检查 
```typescript
interface Config {
  width?: number;
}
function  CalculateAreas(config: Config): { area: number} {
    return {area:width}
}
let mySquare = CalculateAreas({ widdth: 5 });
//这时候因为widdth不在config里面会报错， error: 'widdth' not expected in type 'Config'
//在config里面没有预期的widdth
```
对于这种情况有三种方法：
* 使用类型断言 
```
let mySquare = CalculateAreas({ widdth: 5 } as Config);
```
* 添加字符串索引签名 
```typescript
interface Config {
   width?: number;
   [propName: string]: any
}
```
* 第三种将字面量赋值给另一个变量 （不建议采用）
```typescript
let options = { widdth: 5 };
let mySquare = CalculateAreas(options);
```
##### 可索引类型
描述：可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。
作用：描述对象索引类型，索引返回值类型
用法：
```typescript
interface Phone {
    [name: string]: string
}
```
##### 继承接口
描述：扩展原有的接口类型
作用：扩展原有的接口类型
用法：
```typescript
interface VIPUser extends User {
    broadcast: () => void
}
```