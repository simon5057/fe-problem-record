#### [2020-4-16] XSS解决方案——响应头Content-Security-Policy（网页安全政策，CSP）
- 通过浏览器自动禁用外部注入恶意脚本
  - [阮一峰博文](http://www.ruanyifeng.com/blog/2016/09/csp.html)
  - [MDN Web docs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)

#### [2020-5-11] from表单元素中的button点击事件触发提交事件，并重置页面
- 问题起因：在接入一个业务组件时（组件的html部分有button元素），组件插入到了一个form表单元素中，组件中的button按钮的点击事件中没有阻止浏览器的默认行为，导致到点击button元素是将表单提交到`/?name1=value1&name2=value2`上
- 页面的表现：重置当前页面并且url中带有form中表单元素的name和value
- 解决方案：
  - 将外部的元素from换成其他元素，如div
  - 在button点击事件中阻止默认行为，e.preventDefault()