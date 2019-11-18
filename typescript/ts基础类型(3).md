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