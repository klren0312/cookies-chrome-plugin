# 谷歌插件获取Cookie与UserAgent

## 功能
### 1.右键复制当前页Cookies

>演示图片
![](./imgs/1.gif)


### 2.右键复制当前页UserAgent

>演示图片
![](./imgs/2.gif)


### 3.右键将Cookies和UserAgent发送到主页面
主页面需要先发送 message 给插件, 缓存页面 tabId
```javascript
window.parent.postMessage({type: 'tab', level: 'main'}, '*');
```

>演示图片
![](./imgs/3.gif)