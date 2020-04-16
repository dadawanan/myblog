## commomJS规范基本内容
- 所有代码都运行在模块作用域中，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一加载的时候运行一次，然后运行结果就被缓存了，以后在加载就直接读取缓存结果，要想重新运行必须先清除缓存。
- 模块加载的顺序必须是按代码中出现的顺序。

## module对象
- module内部提供了一个Module的构建函数，所有模块都是Module的实例。
- 每个模块都module属性，代表当前模块。

```javascript
{
    module.id,// 模块标识符，通常是模块的绝对路径的文件名
    module.filename， // 文件名，绝对路径
    module.loaded, //是否已加载
    module.parent, // 被调用的模块
    module.children, // 将要调用的模块
    module.exports  // 模块对外输出的值
```

#### exports和module.exports
- node为了方便每个模块都有一个exports变量，指向module.exports。因此不能在同一模块使用了exports后在使用module.exports。

## AMD规范和CMD规范
目前这2规范基本不怎么用到。  
commonJS规范是同步的，也就是说只有加载完成后才可以执行后面的代码，而node一般代码都在服务端只需要读文件不需要请求适合同步。  
而其他2种规范是异步的，适合在浏览器端使用，因为浏览器需要向服务端请求，然后考虑一个异步的问题。

## require的实现


## 模块的加载机制

