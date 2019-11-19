---
title: h5的部分总结
date: 2019-11-20
permalink: "html5(7)"
---
## HTML5 表单元素
#### datalist、keygen、output
datalist自带索引和默认展开所有列表
keygen 已废弃
output根据传如的值输出结果
## canvas
#### svg canvas大比拼
canvas
* 基于js绘图
* 依赖分辨率
* 不支持事件处理器
* 弱的文本渲染能力
* 能够以 .png 或 .jpg 格式保存结果图像
* 最适合图像密集型的游戏，其中的许多对象会被频繁重绘
svg
* XML文档来描述绘图
* 不依赖分辨率
* 支持事件处理器
* 最适合带有大型渲染区域的应用程序（比如谷歌地图）
* 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
* 不适合游戏应用
#### canvas绘制矩阵
```javascript
//querySelector和getElementById的区别
//前者为静态在Dom改变后使用该变量不会改变，后者为动态
var c =document.querySelector("#app")
c.height=200
c.width=200
var ctx=c.getContext('2d')
ctx.fillStyle = "#FF0000"; // 颜色
ctx.fillRect(0, 0, 150, 75); // 形状
```
#### canvas绘制路径
```javascript
//moveto lineto stroke
var c =document.querySelector("#app")
ctx.moveTo(0, 0); // 开始坐标
ctx.lineTo(200, 100); // 结束坐标
ctx.stroke(); // 立即绘制
```
#### canvas绘制圆形
```javascript
//stroke beginPath arc(x,y,r,start,stop)
// x,y圆心坐标 r:半径 start,stop 弧度制
var c = document.querySelector("#app");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.arc(95, 50, 40, 0, 2 * Math.PI);
ctx.stroke();
```
#### canvas绘制文字
```javascript
//font filltext
var c = document.getElementById("app");
var ctx = c.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("Hello World", 10, 50);
```
#### canvas包裹图片
```javascript
    var img = new Image() // 声明新的Image对象
    img.src = "./image.jpeg"
    // 图片加载后
    img.onload = function () {
        var canvas = document.querySelector("#app");
        var ctx = canvas.getContext("2d");

        // 根据image大小，指定canvas大小
        canvas.width = img.width
        canvas.height = img.height

        // 绘制图像
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
```
## Drag&Drop
#### 对应事件
* onDragEnter进入区域触发
* onDragOver放到何处
* onDragLeave离开区域触发
* onDrop进行放置触发
#### 断点续传
核心思路：将文件分片上传，并写入缓存，断开连接读取缓存
从断开的开始上传，可以获取上传百分比，完成后删除缓存。

## 地理定位
navigator.geolocation.getCurrentPosition()
获取经纬度
## web存储
cookie：一般由服务器生成，可以设置过期时间 4K
每次都会在header中，对于请求性能影响。
indexDB：除非被清理，否则一直存在 无限
h5新增：
sessionStorage:页面关闭就清理，5M
localStorage:除非被清理，否则一直存在 5M
#### 如何设置cookie安全
* value 如果用于保存用户登入状态，应该将该值加密，不能使用明文
* http-only 不能通过JS访问cookie，减少xss攻击
* secure 设置只能在https请求中携带
* same-site 规定浏览器不能在跨域中携带Cookie，减少csrf攻击

## 离线缓存
定义：能在断网的情况访问页面
优势：1、减轻压力 2、速度更快 3、离线使用
manifest来指向缓存地址
## 服务器发送事件
#### Server-Sent 单项消息传递
允许网页获得来自服务器的更新
```javascript
var source=new EventSource("发送更新的页面的URL");
source.onmessage=function(event)
{
	//to do something
};
```

## web workers
#### 什么是web worker
* web worker 是运行在后台的 JavaScript，不会影响页面的性能
* 当在 HTML 页面中执行脚本时，页面的状态是不可响应的，直到脚本已完成
* web worker 是运行在后台的 JavaScript，独立于其他脚本，不会影响页面的性能。
您可以继续做任何愿意做的事情：点击、选取内容等等，而此时 web worker 在后台运行
#### web work实例
```javascript
    //WEB页主线程
    var worker = new Worker("worker.js"); //创建一个Worker对象并向它传递将在新线程中执行的脚本的URL
    worker.postMessage("hello world");     //向worker发送数据
    worker.onmessage = function (evt) {
        //接收worker传过来的数据函数
        console.log(evt.data);              //输出worker发送来的数据
    }
```
```javascript
   //要处理的内容
     onmessage =function (evt){
       var d = evt.data;//通过evt.data获得发送来的数据
       postMessage( d );//将获取到的数据发送会主线程
     }

```
#### web worker用途
jsonp是通过插入script标签来加载json数据的，
而script元素在加载和执行过程中都是阻塞式的，
如果能利用web worker实现异步加载将会非常不错。
