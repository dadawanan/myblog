---
title: "JavaScript基础知识(1)"
date: "2019-08-18"
permalink: "javascript(1)"
---

## 普通函数和箭头函数的 this

还是一道经典题目，下面的这段代码的输出是什么？（为了方便解释，输出放在了注释中）

```javascript
function fn() {
  console.log(this); // 1. {a: 100}
  var arr = [1, 2, 3];

  (function() {
    console.log(this); // 2. Window
  })();

  // 普通 JS
  arr.map(function(item) {
    console.log(this); // 3. Window
    return item + 1;
  });
  // 箭头函数
  let brr = arr.map(item => {
    console.log("es6", this); // 4. {a: 100}
    return item + 1;
  });
}
fn.call({ a: 100 });
```

其实诀窍很简单，常见的基本是 3 种情况：es5 普通函数、es6 的箭头函数以及通过`bind`改变过上下文返回的新函数。

① **es5 普通函数**：

- 函数被直接调用，上下文一定是`window`
- 函数作为对象属性被调用，例如：`obj.foo()`，上下文就是对象本身`obj`
- 通过`new`调用，`this`绑定在返回的实例上

② **es6 箭头函数**： 它本身没有`this`，会沿着作用域向上寻找，直到`global` / `window`。请看下面的这段代码：

```javascript
function run() {
  const inner = () => {
    return () => {
      console.log(this.a);
    };
  };

  inner()();
}

run.bind({ a: 1 })(); // Output: 1
```

③ **bind 绑定上下文返回的新函数**：就是被第一个 bind 绑定的上下文，而且 bind 对“箭头函数”无效。请看下面的这段代码：

```javascript
function run() {
  console.log(this.a);
}

run.bind({ a: 1 })(); // output: 1

// 多次bind，上下文由第一个bind的上下文决定
run.bind({ a: 2 }).bind({ a: 1 })(); // output: 2
```

最后，再说说这几种方法的优先级：new > bind > 对象调用 > 直接调用

至此，这道题目的输出就说可以解释明白了。
延伸：this的原理
内存的数据结构中有value、writable、enumerable、configurable属性，value中存放函数的地址，
由于函数是一个单独的值，所以它可以在不同的环境（上下文）执行。函数在哪执行this会指向哪里。
若函数在全局执行会取全局的变量，若函数在对象内执行则执行会取对象内部的变量。

## 原始数据类型和判断方法

> 题目：JS 中的原始数据类型？

ECMAScript 中定义了 7 种原始类型：

- Boolean
- String
- Number
- Null
- Undefined
- Symbol（新定义）
- BigInt（新定义）

**注意**：原始类型不包含 Object 和 Function

> 题目：常用的判断方法？

在进行判断的时候有`typeof`、`instanceof`。对于数组的判断，使用`Array.isArray()`：

- typeof：

  - typeof 基本都可以正确判断数据类型
  - `typeof null`和`typeof [1, 2, 3]`均返回"object"
  - ES6 新增：`typeof Symbol()`返回"symbol"

- instanceof：

  - 专门用于实例和构造函数对应

    ```javascript
    function Obj(value) {
      this.value = value;
    }
    let obj = new Obj("test");
    console.log(obj instanceof Obj); // output: true
    ```

  - 判断是否是数组：`[1, 2, 3] instanceof Array`

- Array.isArray()：ES6 新增，用来判断是否是'Array'。`Array.isArray({})`返回`false`。

## Symbol类型在实际开发中的应用

1.使用Symbol来替代常量,省去唯一写值的麻烦
```javascript
const TYPE=Symbol()
```
2.设置私有属性,无法遍历键值
```javascript
let size = Symbol('ksizeey')
class Collection {
    constructor() {
        this[size] = 0
    }
    add(item) {
        this[this[size]] = item
        this[size]++
    }
    static sizeOf(instance) {
        return instance[size]
    }
}
let x = new Collection()
console.log(Collection.sizeOf(x))//0
x.add('foo')
console.log(Collection.sizeOf(x))//1
console.log(x)  //Collection { '0': 'foo', [Symbol(ksizeey)]: 1 }
console.log(Object.keys(x)) //[ '0' ]
console.log(Object.getOwnPropertyNames(x)) //[ '0' ]
console.log(Object.getOwnPropertySymbols(x))//[ Symbol(ksizeey) ]
```
3.注册和捕获全局Symbol
```javascript
let sl1=Symbol.for('foo')
let sl2=Symbol.for('foo')
sl1 === sl2 //true  其中foo既是symbol注册表中键名，又是对自身的描述
Symbol('bar') === Symbol('bar') //false  Symbol函数每次都会返回一个新的Symbol
```

## 实现一个简单版的Symbol

```javascript


(function () {
    var root = this
    var generateName = (function () {
        //给key做唯一处理
        var postfix = 0;
        return function (descString) {
            postfix++
            return '@@' + descString + '_' + postfix
        }
    })()
    var SymbolPolyfill = function Symbol(description) {
        //不能实用new
        if (this instanceof SymbolPolyfill) throw new TypeError('Symbol is not a constructor')
        //如果symbol是一个对象应该转为字符串保存
        var descString = description === undefined ? undefined : String(description)
        //创建一个没有副作用的能转字符串的对象
        var symbol = Object.create({
            //对象的时候转字符串
            toString: function () {
                return this.__Name__
            },
            valueOf: function () {
                throw new Error('Cannot convert a Symbol value')
            }
        })
        //劫持对象设置值 不可枚举 不可写入 不能配置
        Object.defineProperties(symbol, {
            '_Description_': {
                value: description,
                writable: false,
                enumerable: false,
                configurable: false
            },
            '__Name__': {
                value: generateName(descString),
                writable: false,
                configurable: false,
                enumerable: false
            }
        })
        return symbol
    }
    root.SymbolPolyfill = SymbolPolyfill
})()

var a = SymbolPolyfill('foo');
var b = SymbolPolyfill('foo');

console.log(a === b); // false
console.log(a)
console.log(b)
var o = {};
o[a] = 'hello';
o[b] = 'hi';

console.log(o); // Object { "@@foo_1": "hello", "@@foo_2": "hi" }
```


## 原始类型转化

当我们对一个“对象”进行数学运算操作时候，会涉及到对象 => 基础数据类型的转化问题。

事实上，当一个对象执行例如加法操作的时候，如果它是原始类型，那么就不需要转换。否则，将遵循以下规则：

1. 调用实例的`valueOf()`方法，如果有返回的是基础类型，停止下面的过程；否则继续
2. 调用实例的`toString()`方法，如果有返回的是基础类型，停止下面的过程；否则继续
3. 都没返回原始类型，就会报错

请看下面的测试代码：

```javascript
let a = {
  toString: function() {
    return "a";
  }
};

let b = {
  valueOf: function() {
    return 100;
  },
  toString: function() {
    return "b";
  }
};

let c = Object.create(null); // 创建一个空对象

console.log(a + "123"); // output: a123
console.log(b + 1); // output: 101
console.log(c + "123"); // 报错
```

除了`valueOf`和`toString`，es6 还提供了`Symbol.toPrimitive`供对象向原始类型转化，并且**它的优先级最高**！！稍微改造下上面的代码：

```javascript
let b = {
  valueOf: function() {
    return 100;
  },
  toString: function() {
    return "b";
  },
  [Symbol.toPrimitive]: function() {
    return 10000;
  }
};

console.log(b + 1); // output: 10001
```

最后，其实关于`instanceof`判断是否是某个对象的实例，es6 也提供了`Symbol.hasInstance`接口，代码如下：

```javascript
class Even {
  static [Symbol.hasInstance](num) {
    return Number(num) % 2 === 0;
  }
}

const Odd = {
  [Symbol.hasInstance](num) {
    return Number(num) % 2 !== 0;
  }
};

console.log(1 instanceof Even); // output: false
console.log(1 instanceof Odd); // output: true
```

## 深拷贝和浅拷贝

> 题目：实现对象的深拷贝。

在 JS 中，函数和对象都是浅拷贝（地址引用）；其他的，例如布尔值、数字等基础数据类型都是深拷贝（值引用）。

值得提醒的是，ES6 的`Object.assign()`和 ES7 的`...`解构运算符都是“浅拷贝”。实现深拷贝还是需要自己手动撸“轮子”或者借助第三方库（例如`lodash`）：

- 手动做一个“完美”的深拷贝函数：[https://godbmw.com/passages/2019-03-18-interview-js-code/](https://godbmw.com/passages/2019-03-18-interview-js-code/)

- 借助第三方库：jq 的`extend(true, result, src1, src2[ ,src3])`、lodash 的`cloneDeep(src)`

- `JSON.parse(JSON.stringify(src))`：这种方法有局限性，如果属性值是函数或者一个类的实例的时候，无法正确拷贝

- 借助 HTML5 的`MessageChannel`：这种方法有局限性，当属性值是函数的时候，会报错

  ```html
  <script>
    function deepClone(obj) {
      return new Promise(resolve => {
        const { port1, port2 } = new MessageChannel();
        port2.onmessage = ev => resolve(ev.data);
        port1.postMessage(obj);
      });
    }

    const obj = {
      a: 1,
      b: {
        c: [1, 2],
        d: "() => {}"
      }
    };

    deepClone(obj).then(obj2 => {
      obj2.b.c[0] = 100;
      console.log(obj.b.c); // output: [1, 2]
      console.log(obj2.b.c); // output: [100, 2]
    });
  </script>
  ```

## JS 事件流

#### 事件冒泡和事件捕获

事件流分为：**冒泡**和**捕获**，顺序是先捕获再冒泡。

**事件冒泡**：子元素的触发事件会一直向父节点传递，一直到根结点停止。此过程中，可以在每个节点捕捉到相关事件。可以通过`stopPropagation`方法终止冒泡。

**事件捕获**：和“事件冒泡”相反，从根节点开始执行，一直向子节点传递，直到目标节点。

`addEventListener`给出了第三个参数同时支持冒泡与捕获：默认是`false`，事件冒泡；设置为`true`时，是事件捕获。

```html
<div id="app" style="width: 100vw; background: red;">
  <span id="btn">点我</span>
</div>
<script>
  // 事件捕获：先输出 "外层click事件触发"; 再输出 "内层click事件触发"
  var useCapture = true;
  var btn = document.getElementById("btn");
  btn.addEventListener(
    "click",
    function() {
      console.log("内层click事件触发");
    },
    useCapture
  );

  var app = document.getElementById("app");
  app.onclick = function() {
    console.log("外层click事件触发");
  };
</script>
```

#### DOM0 级 和 DOM2 级

**DOM2 级**：前面说的`addEventListener`，它定义了`DOM`事件流，捕获 + 冒泡。

**DOM0 级**：

- 直接在 html 标签内绑定`on`事件
- 在 JS 中绑定`on`系列事件

**注意**：现在通用`DOM2`级事件，优点如下：

1. 可以绑定 / 卸载事件
2. 支持事件流
3. 冒泡 + 捕获：相当于每个节点同一个事件，至少 2 次处理机会
4. 同一类事件，可以绑定多个函数

## 常见的高阶函数

没什么好说的，跑一下下面的代码就可以理解了：

```javascript
// map: 生成一个新数组，遍历原数组，
// 将每个元素拿出来做一些变换然后放入到新的数组中
let newArr = [1, 2, 3].map(item => item * 2);
console.log(`New array is ${newArr}`);

// filter: 数组过滤, 根据返回的boolean
// 决定是否添加到数组中
let newArr2 = [1, 2, 4, 6].filter(item => item !== 6);
console.log(`New array2 is ${newArr2}`);

// reduce: 结果汇总为单个返回值
// acc: 累计值; current: 当前item
let arr = [1, 2, 3];
const sum = arr.reduce((acc, current) => acc + current);
const sum2 = arr.reduce((acc, current) => acc + current, 100);
console.log(sum); // 6
console.log(sum2); // 106
```