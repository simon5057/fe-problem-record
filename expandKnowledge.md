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

#### [2020-6-22] 跨域XHR请求set-cookie不生效
- 在发送到其他域的XMLHttpRequest之前，需要设置`withCredentials`为true，这时在response中的cookie才能设置成功
  - [jQuery中ajax中配置xhrFields](https://jquery.cuishifeng.cn/jQuery.Ajax.html)
  - [MDN Web docs](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials)

#### [2020-8-8] CDN 缓存问题
- 问题描述：
  - 现象：在用户信息页中，展示的是非当前登录用户的信息，如绑定手机号、邮箱等
  - 分析原因：该用户为境外用户，判断为该页面 CDN 缓存策略有误
  - 复现场景：由于用户为境外用户，通过代理到境外后访问目标页面时复现
- 解决方案：
  - 通过添加缓存策略 `<meta http-equiv="Cache-Control" content="private">`，其含义为中继服务器不得缓存该请求，只能被单个用户缓存（未解决）
    - 未解决原因猜测有：
      - CDN 未按规则实现或隐形代理服务器仍进行了缓存
      - `Pragma: no-cache` 和 `Cache-Control: no-cache` 未尝试添加
  - 通过在访问目标页的路径中加上（如 `_t=1596617124716`）时间戳等信息，以保证每次请求地址唯一，每次请求都不会拿CDN缓存