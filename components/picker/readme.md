### 使用

> 到 [GitHub](https://github.com/Rattenking/WXTUI-DEMO) 下载 WX-RUI 的代码，将 component 目录拷贝到自己的项目中。然后按照如下的方式使用组件，以 dtpicker 为例，其它组件在对应的文档页查看：

#### 1. 添加需要的组件。在页面的 json 中配置（路径根据自己项目位置配置）：

```
"usingComponents": {
  "rui-dtpicker": "../../component/picker/picker"
}
```

#### 2. 在 wxml 中使用组件：

2.1 时间粒度为second的实例

```
<rui-dtpicker 
  start="2018-03-15 10:45:00" 
  end="2050-03-15 10:45:00" 
  value="{{value}}" 
  fields="second" 
  bindchangedatepicker="changeDate"
  bindcanceldatepicker="cancelDate"
></rui-dtpicker>
```
2.2 时间粒度为year的实例

```
<rui-dtpicker 
  start="2018" 
  end="2050" 
  value="{{value}}" 
  fields="year" 
  bindchangedatepicker="changeDate"
  bindcanceldatepicker="cancelDate"
></rui-dtpicker>
```
### 效果图
<img src="https://img-blog.csdnimg.cn/20190325095929896.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM4MDgyNzgz,size_16,color_FFFFFF,t_70" width="320px"/>

<img src="https://img-blog.csdnimg.cn/20190325100352104.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM4MDgyNzgz,size_16,color_FFFFFF,t_70" width="320px"/>


### 参数说明
**rui-dtpicker 属性说明：**

|属性名		|类型	|默认值	                    |说明					|
|---		|----	|---	                    |---					|
|start		|String	|'1900-00-00 00:00:00'		|限制选择器选择的最小时间	|
|end		|String	|'2500-12-30 23:59:59'		|限制选择器选择的最大时间	|
|value		|String	|'2019-03-15 10:45:00'	    |当前时间选择器显示的时间	|
|fields		|String	|'second'		            |时间选择器的粒度			|
|disabled	|Boolean|false						|是否为禁用状态			|

**fields 值说明：**

|值 		|类型	|说明					|
|---		|----	|---					|
|year		|String	|选择器粒度为年			|
|month		|String	|选择器粒度为月份			|
|day		|String	|选择器粒度为天			|
|hour		|String	|选择器粒度为小时			|
|minute	    |String |选择器粒度为分钟			|
|second	    |String |选择器粒度为秒			|

**事件说明：**

|事件名称	|说明		|
|---|---|
|change	|时间选择器点击【确定】按钮时时触发的事件，参数为picker的当前的 value|
|cancel	|时间选择器点击【取消】按钮时时触发的事件|

### WXRUI体验二维码
![WXRUI体验码](https://img-blog.csdnimg.cn/20190220140113256.jpg)
##### 如果文章对你有帮助的话，请打开微信扫一下二维码，点击一下广告，支持一下作者！谢谢！

### 其他

[我的博客，欢迎交流！](http://rattenking.gitee.io/stone/index.html)

[我的CSDN博客，欢迎交流！](https://blog.csdn.net/m0_38082783)

[微信小程序专栏](https://blog.csdn.net/column/details/18335.html)

[前端笔记专栏](https://blog.csdn.net/column/details/18321.html)

[微信小程序实现部分高德地图功能的DEMO下载](http://download.csdn.net/download/m0_38082783/10244082)

[微信小程序实现MUI的部分效果的DEMO下载](http://download.csdn.net/download/m0_38082783/10196944)

[微信小程序实现MUI的GIT项目地址](https://github.com/Rattenking/WXTUI-DEMO)

[微信小程序实例列表](http://blog.csdn.net/m0_38082783/article/details/78853722)

[前端笔记列表](http://blog.csdn.net/m0_38082783/article/details/79208205)

[游戏列表](http://blog.csdn.net/m0_38082783/article/details/79035621)