---
title: "ts基础类型(3)"
date: "2019-11-19"
permalink: "ts(3)"
---
## 类型断言
描述：有些情况下 TS 并不能正确或者准确得推断类型,这个时候可能产生不必要的警告或者报错。
```typescript
//漏写age不会报错 禁止滥用
interface Person {
  name: string;
  age: number;
}
const person = {} as Person;
person.name = 'xiaomuzhu';
person.age = 20;
```

## 双重断言
//暂时不是哪里需要用到

## 类型守卫
作用：通过一个函数来缩小类型的范围
```typescript
//字面量类型守卫
type Foo = {
  kind: 'foo'; // 字面量类型
  foo: number;
};
type Bar = {
  kind: 'bar'; // 字面量类型
  bar: number;
};
function doStuff(arg: Foo | Bar) {
  if (arg.kind === 'foo') {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}
```
## 兼容问题
多的兼容少的
少的不兼容多的
枚举的类型兼容性：双向相等
类的类型兼容性：仅仅只有实例成员和方法会相比较，
构造函数和静态成员不会被检查，私有的和受保护的成员必须来自于相同的类
泛型的类型兼容性：它的表现根据是否被成员使用而不同.被使用都都不相同 未使用则相同

## 交叉类型
描述：将多个类型合并为一个类型
```typescript
function mixin<T extends Object, U>(first: T, second: U): T & U {
    const result = <T & U>{};
    for (let id in first) {
      (<T>result)[id] = first[id];
    }
    for (let id in second) {
      if (!result.hasOwnProperty(id)) {
        (<U>result)[id] = second[id];
      }
    }
    return result;
  }
  const x = mixin({ a: 'hello' }, { b: 42 });
  
  // 现在 x 拥有了 a 属性与 b 属性
  const a = x.a;
  const b = x.b;
```

## 联合类型 
描述：可以为多种类型 它使用 | 作为标记，如 string | number
## 类型别名
描述：类型别名有时和接口很像,但是可以作用于原始值、联合类型、元组以及其它任何你需要手写的类型
type 名称=xx类型
## 类型别名和interface的区别
* interface只能作用于对象
* type 的声明方式除了对象之外还可以定义交叉、联合、原始类型等
* interface 方式可以实现接口的 extends 和 implements
* interface 可以实现接口合并声明
* interface创建了一个新的名字,可以在其它任何地方使用,类型别名并不创建新名字

## 字面量类型（Literal Type）
描述：字面量（Literal Type）主要分为 真值字面量类型（boolean literal types）,
数字字面量类型（numeric literal types）,枚举字面量类型（enum literal types）,
大整数字面量类型（bigInt literal types）和字符串字面量类型（string literal types）
字面量类型与联合类型结合的时候可以模拟一个类似于枚举的效果。
总结：字面量类型要和实际的值的字面量一一对应。
## 类型字面量 （Type Literal)
和类型别名类型都有type定义。
## 可辨识联合类型
实现这种模式的三要素：
* 具有普通的单例类型属性—可辨识的特征
* 一个类型别名包含联合类型
* 类型守卫的特性
```typescript
interface Info {
    username: string
}
interface UserAction {
    id?: number
    action: 'create' | 'delete'
    info: Info
}
const UserReducer = (userAction: UserAction) => {
    switch (userAction.action) {
        case 'delete':
            console.log(userAction.id);
            break;
        default:
            break;
    }
}
```
## 类装饰器
```typescript
//往类里面注入方法
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}

@addAge
class Person{
  name: string;
  age: number;
  constructor() {
    this.name = 'xiaomuzhu';
  }
}

let person = new Person();

console.log(person.age); // 18
```

## 属性/方法装饰器
作用:不想外界修改属性值,将方法伪装为属性，且为只读
```typescript
//给方法加入装饰器的过程
//访问同名的实例属性时，将调用该方法。
let descriptor = {
    value: function() { return 'instance method'},
    enumerable: false,
    configurable: true,
    writable: true
};

descriptor = readonly(Person.prototype, "say", descriptor) || descriptor;

Object.defineProperty(Person.prototype, "say", descriptor);
```

## 参数装饰器
参数装饰器可以提供信息，给比如给类原型添加了一个新的属性，属性中包含一系列信息，
这些信息就被成为「元数据」，然后我们就可以使用另外一个装饰器来读取「元数据」。
## 装饰器工厂
装饰器工厂就是一个简单的函数，它返回一种类型的装饰器。
```typescript
function log(...args : any[]) {
  switch(args.length) {
    case 1:
      return logClass.apply(this, args);
    case 2:
      return logProperty.apply(this, args);
    case 3:
      if(typeof args[2] === "number") {
        return logParameter.apply(this, args);
      }
      return logMethod.apply(this, args);
    default:
      throw new Error("Decorators are not valid here!");
  }
}
```
## 装饰器顺序
当多个装饰器应用在一个声明上时会进行如下步骤的操作：
* 由上至下依次对装饰器表达式求值。
* 求值的结果会被当作函数，由下至上依次调用。

类中不同声明上的装饰器将按以下规定的顺序应用：
* 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
* 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
* 参数装饰器应用到构造函数。
* 类装饰器应用到类。

## Reflect Metadata
描述：声明的时候「添加和读取元数据」
```typescript
//
@Reflect.metadata('name', 'A')
class A {
  @Reflect.metadata('hello', 'world')
  public hello(): string {
    return 'hello world'
  }
}

Reflect.getMetadata('name', A) // 'A'
Reflect.getMetadata('hello', new A()) // 'world'  new的原因是因为元数组被
//添加到了实例方法上，要向不实例化必须加在静态方法上
```
## 内置元数组
```typescript
// 获取方法的类型
const type = Reflect.getMetadata("design:type", new Person, 'say')

// 获取参数的类型,返回数组
const typeParam = Reflect.getMetadata("design:paramtypes", new Person, 'say')

//获取有关方法返回类型的信息
const typeReturn = Reflect.getMetadata("design:returntype", new Person, 'say')
```
