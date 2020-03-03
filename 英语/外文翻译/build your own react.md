---
title: "搭建自己的react"
date: "2020-01-18"
permalink: "buildyourownreact"
---

## 搭建自己的react
We are going to rewrite React from scratch. Step by step. Following the architecture from the real React code but without all the optimizations and non-essential features.

我们正准备去从头开始一步一步重写react。跟着原react体系结构但没有所有的优化和非本质的特征。

If you’ve read any of my previous “build your own React” posts, the difference is that this post is based on React 16.8, so we can now use hooks and drop all the code related to classes.

如果你已经读过任何我之前“搭建你自己的React”的文章，但这篇不同的是这篇文章是建立在React 16.8版本上的。所以我们可以使用hooks然后重写所有class的代码。

You can find the history with the old blog posts and the code on the Didact repo. There’s also a talk covering the same content. But this is a self-contained post.

你可以在Didact的项目里找到以前老的文章和代码。那里也有说过一样的内容，但是这是一个自己的文章。

Starting from scratch, these are all the things we’ll add to our version of React one by one:
Step I: The createElement Function
Step II: The render Function
Step III: Concurrent Mode
Step IV: Fibers
Step V: Render and Commit Phases
Step VI: Reconciliation
Step VII: Function Components
Step VIII: Hooks

从头开始，以下这些所有都是我们将要一项项添加到react里面。
步骤1:创建元素的方法
步骤2:渲染的方法
步骤3:并发模式
步骤4:时间分片
步骤5:渲染和提交阶段
步骤6:和解
步骤7:Components方法
步骤8:Hooks

## 步骤0：检查
But first let’s review some basic concepts. You can skip this step if you already have a good idea of how React, JSX and DOM elements work.

首先让我们先回顾一些简单的概念。如果你已经知道React、JSX、DOM元素如何工作的话可以跳过这个步骤。

We’ll use this React app, just three lines of code. The first one defines a React element. The next one gets a node from the DOM. The last one renders the React element into the container.
```javascript
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
```
我们将会使用这个React项目，就三行代码。第一行定义了一个React元素。下一行是从DOM中获取一个节点。最后一行渲染React元素到容器中。

Let’s remove all the React specific code and replace it with vanilla JavaScript.
让我们移除所有React代码然后用原生js替代它。

On the first line we have the element, defined with JSX. It isn’t even valid JavaScript, so in order to replace it with vanilla JS, first we need to replace it with valid JS.

在第一行我们有这个元素定义了JSX。这不是一个原生的JavaScript，所以为了去替换这个用原生的JS。所以我们需要替代它用原生的JS。

JSX is transformed to JS by build tools like Babel. The transformation is usually simple: replace the code inside the tags with a call to createElement, passing the tag name, the props and the children as parameters.

JSX是被转换成JS是通过构建工具类似Babel。这个转换通常是简单的:用CreatElement的调用替换标记中的,通过标签名，props和子元素都是参数。

React.createElement creates an object from its arguments. Besides some validations, that’s all it does. So we can safely replace the function call with its output.

React.cerateElement 创建了一个对象从他的参数中。除了一些验证，这就是所有做的内容。所以我们能安全的代替这个方法将函数调用替换为其输出。

And this is what an element is, an object with two properties: type and props (well, it has more, but we only care about these two).

然后这是一个元素对象包含2个特点：type和props（当然，它还有更多，但是我们只关心这两个）

The type is a string that specifies the type of the DOM node we want to create, it’s the tagName you pass to document.createElement when you want to create an HTML element. It can also be a function, but we’ll leave that for Step VII.

这种类型是一个字符串然后我们将会创建具体类型的DOM节点。这是一个标签名称，这将是传递文档的标记名。创建节点元素当你想要穿件一个HTML的元素。这也是一个方法但是我们将会在第8步。

props is another object, it has all the keys and values from the JSX attributes. It also has a special property: children.

props是另外一个对象。它包含所有的keys和values从JSX属性。它还有一个特殊的属性：children。

children in this case is a string, but it’s usually an array with more elements. That’s why elements are also trees.

children在这种情况下应该是一个字符串，但是通常它是一个数组包含更多的elements。这也是为什么元素也是树结构。

The other piece of React code we need to replace is the call to ReactDOM.render.render is where React changes the DOM, so let’s do the updates ourselves.

另一块react代码我们需要代替的被叫做ReactDOM.render。render是React修改DOm的地方，所以让我们自己做些修改吧。

First we create a node* using the element type, in this case h1.
Then we assign all the element props to that node. Here it’s just the title.
* To avoid confusion, I’ll use “element” to refer to React elements and “node” for DOM elements.

首先我们用元素类型创建一个节点，在这个h1上。然后我们分配所有的元素到这个节点上。这个就是title.
为了避免混乱，将会使用元素来参考React元素，node来参考DOM元素。

Then we create the nodes for the children. We only have a string as a child so we create a text node.
Using textNode instead of setting innerText will allow us to treat all elements in the same way later. Note also how we set the nodeValue like we did it with the h1 title, it’s almost as if the string had props: {nodeValue: "hello"}.

然后为子元素创建节点，我们仅仅想要一个字符串作为子节点用来创建一个文本节点。
用文本节点而不是设置innerText将允许我们以相同的方式对待所有元素。还要注意我们是如何设置nodevalue的，就像我们对H1标题所做的一样，这个几乎就像字符串有props:{nodeValue:"hellow"}。


