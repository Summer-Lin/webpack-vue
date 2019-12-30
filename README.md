[webpack参考链接](https://juejin.im/post/5b7d350951882542f3278b11#heading-0)
[对应的github项目](https://github.com/zxpsuper/createVue)
[webpack详细配置](https://juejin.im/post/5de87444518825124c50cd36)
[elementUI动态加载多语言](https://segmentfault.com/a/1190000020740061)

[另外一种多语言解决方法](https://github.com/kazupon/vue-i18n/issues/223)

[面试题](https://juejin.im/post/5e083e17f265da33997a4561?utm_source=gold_browser_extension)

[尝试这种多语言方法](https://blog.csdn.net/ange2017/article/details/102818341)
#浅谈前端性能优化



### 技术框架

- vue 2+框架
- iview UI 4+ 组件库
- webpack4 + 打包工具

### 性能优化方向
- 代码层级
 - 公共组件
 - 多语言懒加载
 - 路由懒加载
 - 图片懒加载
 - 压缩图片
 - 字体图标和SVG图标

### 浏览器请求
  - 阻挡（浏览器根据同个域名下有限制并发连接数，不同浏览器限制不同，同个域名请求数一般是4~8个）
    - 解决： 比如将css, img, js分开不同域名
  - 域名解析
    - 用户若没有该域名缓存， 一般开始会先域名查询对应的IP
    - 可以使用DNS预获取 dns-prefetch： 1.减少DNS的请求次数； 2.进行DNS预先获取，减少用户等待时间
    - <link rel="dns-prefetch" href="//domain.com">， 推荐放在<meta http-equiv="x-dns-prefetch-control" content="on">（告知浏览器, 当前页面要做DNS预解析）后面
    - 一次DNS解析需要耗费 20-120 毫秒
    - 浏览器对网站第一次的域名DNS解析查找流程依次为：浏览器缓存——系统缓存——路由器缓存——ISP DNS缓存——递归搜索
    - 注意： 多页面重复DNS预解析会增加重复DNS查询次数。
    
  - 建立连接
  - 发送请求
  - 等待响应
  - 接收数据 
    - http2

- 打包工具 
 - css抽离 (mini-css-extract-plugin 抽离/optimize-css-assets-webpack-plugin 压缩)