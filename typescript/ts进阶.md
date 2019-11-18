---
title: "ts进阶(1)"
date: "2019-11-19"
permalink: "ts(4)"
---
## 赋值断言
何时使用：在变量初始化之前调用变量就得加赋值断言。
作用：告诉编译器这个值初始化过了。
用法:将!放置在实例属性和变量声明之后。

## is 关键字
何时使用：在联合类型中不确定变量类型
作用：is 为关键字的「类型谓语」把参数的类型范围缩小了,判断test是不是 string 类型，并根据结果返回 boolean 相关类型
用法：test is String 
```typescript
function isString(test: any): test is string{
    return typeof test === 'string';
}

function example(foo: number | string){
    if(isString(foo)){
        console.log('it is a string' + foo);
        console.log(foo.length); // string function
    }
}
example('hello world');
```
## 可调用类型注解
何时使用：注解为可执行的接口
作用：可执行的接口
用法：
```typescript
interface ToString {
  new (): string
}
declare const sometingToString: ToString;
new sometingToString() // ok
```

## 索引类型 keyof的妙用 
```typescript
interface Itest{
  webName:string;
  age:number;
  address:string
}
type ant=keyof Itest;  //webName | age | address  Itest的属性名称字符串字面量类型构成的联合类型
type anttype = Itest[ant] //获得索引值对应的类型

let user={
  username:'111',
  password:'2222',
  token:'111',
  id:'121'
}
// 我们通过类型访问符T[K]便可以取得对应属性值的类型，他们的数组T[K][]正是返回值的类型。
function pick<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}
const res = pick(user, ['token', 'id', ])

```

## 映射类型 [ley in keys]
```typescript
//重写类型把所有类型变成可选类型
interface User {
    username: string
    id: number
    token: string
    avatar: string
    role: string
}
type partial<T> = { [K in keyof T]?: T[K] }

type partialUser = partial<User>
```
## 条件类型 三目运算

```typescript
//声明一个函数f,传入泛型T若参数为true，返回string类型反之返回number类型。
declare function f<T extends boolean>(x: T): T extends true ? string : number;
const x = f(Math.random() < 0.5) //联合类型string| number
const y = f(false)
const z = f(true)

//定义diff类型，传入联合类型，若T中类型存在U,则不返回，不存在则返回该类型
type Diff<T, U> = T extends U ? never : T;
type R = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
```
##  条件类型结合映射类型
```typescript
interface Part {
    id: number;
    name: string;
    subparts: Part[];
    updatePart(newName: string): void;
}
//泛型传入接口Part遍历他们的key，取值是否是函数类型，若是函数就返回key，不是就返回never。
//对于泛型参数并确定是否返回
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

type R = FunctionPropertyNames<Part>;
```
## 强大的infer 
```typescript
//infer P表示待推断的函数参数  
//如果T能赋值给 (param: infer P) => any就返回参数P反之返回T。
type ParamType<T> = T extends (param: infer P) => any ? P : T;
//获取函数的返回类型
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;

class TestClass {
    constructor(public name: string, public age: number) {}
}
//获取类构造函数的参数类型
type R2 = ConstructorParameters<typeof TestClass> // [string, number]
//实现ConstructorParameters
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any? P: never;

//元组转联合类型
type ElementOf<T> = T extends Array<infer E> ? E : never;
type TTuple = [string, number];
type ToUnion = ElementOf<TTuple>; // string | number
//联合类型转交叉类型
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type Result = UnionToIntersection<string | number>;
```
