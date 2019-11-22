---
title: "useEffect"
date: "2019-11-23"
permalink: "useEffect"
---


## effect 的执行时机
与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，
传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，
比如如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。(不要写同步代码)

然而，并非所有 effect 都可以被延迟执行。例如，在浏览器执行下一次绘制前，用户可见的 DOM 变更就必须同步执行，
这样用户才不会感觉到视觉上的不一致。（概念上类似于被动监听事件和主动监听事件的区别。）
React 为此提供了一个额外的 useLayoutEffect Hook 来处理这类 effect。
它和 useEffect 的结构相同，区别只是调用时机不同。

虽然 useEffect 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。
React 将在组件更新前刷新上一轮渲染的 effect。
## effect 条件执行
默认情况下，effect 会在每轮组件渲染完成后执行。这样的话，一旦 effect 的依赖发生变化，它就会被重新创建。

## componentdidmount/
```javascript
//只在组件mounte的时候执行,只执行一次
  useEffect(()=>{
    console.log(100)
  },[])
```

```javascript
//会在组件初始化和值发生改变的时候执行
  useEffect(()=>{
    console.log(100)
  },[name])
```
## hook回收机制 
```javascript
useEffect(() => {
  const timer=setInterval()
  return () => {
    cleartimeOut(timer)
  };
});
```

## 如何获取实时数据
```javascript
  const countRef = useRef(null);
  const setfasga=()=>{
    countRef.current = name + 1;
    setname(name+1)
  }
  const reduce=()=>{
    countRef.current = name - 1;
    setname(name-1)
  }
  const handleAlertClick = useCallback(()=>{
    setTimeout(() => {
      alert('You clicked on: ' + countRef.current);
    }, 2000)
  }, []);
```

## Capture Value
hooks获取的值是当时的值，不是实时的值

