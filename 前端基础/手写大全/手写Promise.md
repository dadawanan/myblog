---
title: "手写Promise"
date: "2019-09-01"
permalink: "2019-09-01-promise"
---
### 手写Promise主要分为3部分
- `Promise`构造函数
- `resolvepromise`Promise解析过程
- `Promise.prototype.then`Promise原型处理

## `Promise`构造函数
```javascript
function Promise(task){
  let that=this //构造函数缓存this
  that.status='pending'//状态机
  that.value=undefined //成功值
  that.reson=undefined //失败值
  that.onfulfilledCallback=[] //成功队列
  that.onrejectedCallback=[]  //失败队列
  function resolve(value){
    //如果本身是一个Promise直接执行
    if(value instanceof Promise){
      value.then(resolve,reject)
    }
    //settimeout目的：确保回调中的函数异步执行，并且在resove执行栈结束后执行
    setTimeout(()=>{
    if(that.status==='pending'){
      that.status='fulfilled'
      that.value=value
      that.onfulfilledCallback.foreach(item=>{
        item(that.value)
      })
    }
    })
  }
  function reject(reson){
    setTimeout(()=>{
    if(that.status==='pending'){
      that.status='rejected'
      that.reson=reson
      that.onrejectedCallback.foreach(item=>{
        item(that.reson)
      })
    }
    })
  }
  try{
    task(resolve,reject)
  }catch(e){
    reject(e)
  }
}
```

## `resolvepromise`Promise解析过程
```javascript
//resolveprommise作用:对resolve返回的值的类型做不同的处理
//promsie2:新promise对象 x:onFulfilled返回结果
function resolvepromise(promsie2,x,resolve,reject){
  //先判断是否循环引用
  if(promise2===x){
    return reject(new TypeError('循环引用'))
  }
  //设置状态值，防止同一个Promise调用多次
  let called=false 
  //判断x是不是promise
  if(x instanceof Promise){
    if(x.status==='pending'){ //如果状态是pending继续解析
      x.then(y=>{
        resolvepromise(promise2,y,resolve,reject)
      },reson=>{
        reject(reson)
      })
    } else{ //否则直接执行
      x.then(resolve,reject)
    }
  } else if(x!==null&&(typeof x==='function'||typeof x==='object')){
    //保险方式写个try
    try{
      let then=x.then
      if(typeof then==='function'){
        //相当于x调用自己的then执行
        then.call(x,y=>{
          if(called)return
          called=true
          resolvepromise(promise2,y,resolve,reject)
        },reson=>{
          if(called)return
          called=true
          reject(reson)
        })
      } else{ //是个普通对象
        resolve(x)
      }
    } catch(e){
      if(called)return
      called=true
      reject(e)
    }
  } else{//普通值
    resolve(x);
  }
}
```
## `Promise.prototype.then`Promise原型处理
```javascript
Promise.prototype.then=function(onfulfilled,onrejected){
let that=this
let promise2
//保证参数类型 
onfulfilled = typeof onfulfilled==='function'?onfulfilled:(value)=>value
onrejected = typeof onrejected==='function'?onrejected:(reson)=>{
  throw reson
}
//对不同的状态做不同的处理
if(that.status==='pending'){
  promise2=new Promise((resolve,reject)=>{
    that.onfulfilledCallback.push(
      value=>{
        try{
          let x=onfulfilled(value)
          resolvepromise(promise2,x,resolve,reject)
        }catch(e){
          reject(e)
        }
      }
    )
    that.onrejectedCallback.push(
      reson=>{
        try{
          let x=onrejected(reson)
          resolvepromise(promise2,x,resolve,reject)
        }catch(e){
          reject(e)
        }
      }
    )
  })
}
if(that.status==='fulfilled'){
  promise2=new Promise((resolve,reject)=>{
    //让then方法异步执行 onFulfilled/onRejected异步执行
    setTimeout(() => {
      try{
        let x=onfulfilled(that.value)
        resolvepromise(promise2,x,resolve,reject)
      }catch(e){
        rejcet(e)
      }
    })
  })
}
if(that.status==='rejected'){
  promise2=new Promise((resolve,reject)=>{
    setTimeout(() => {
    try{
        let x = onrejected(that.reason);
        resolvePromise(promise2, x, resolve, reject);
      }catch(e){
        reject(e)
      }
    }
  })
}
return promise2
}
```