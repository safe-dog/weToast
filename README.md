使用：

在`app.wxss`中引用：

@import "libs/weToast/weToast.wxss";

在`index.wxml`中引用：

<include src="../../libs/weToast/weToast.wxml" />

在`index.js`中引用：

const weToast = require('../../libs/weToast/weToast.js');
var toast;

page({
 onload: function(){
   toast = new weToast(this);
 }..
});
