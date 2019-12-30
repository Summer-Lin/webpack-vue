[webpack参考链接](https://juejin.im/post/5b7d350951882542f3278b11#heading-0)
[对应的github项目](https://github.com/zxpsuper/createVue)
[webpack详细配置](https://juejin.im/post/5de87444518825124c50cd36)
[elementUI动态加载多语言](https://segmentfault.com/a/1190000020740061)

[另外一种多语言解决方法](https://github.com/kazupon/vue-i18n/issues/223)

[面试题](https://juejin.im/post/5e083e17f265da33997a4561?utm_source=gold_browser_extension)

[尝试这种多语言方法](https://blog.csdn.net/ange2017/article/details/102818341)
#浅谈前端性能优化

前端性能优化,一般是利用浏览器缓存,压缩代码, CDN......

下面以一个简单项目为例:
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
    - 类似的用法  - 预加载 把相关的资源文件预先加载好 <link rel="preload" href="/styles.css" as="style">
  - 建立连接
  - 发送请求
  - 等待响应
  - 接收数据 
   
    - http2协议: 如图,现在很多网站都开启http2
        - 兼容性, 如图, 大部分浏览器都可以兼容
        - http1.0 和 http1.1 简单区别: 
            - http1.0不会复用tcp链接，每次请求都会打开、断开一条链接.
            - http/1.1版本 一段时间内，一个tcp链接会等到同一个域名下的所有资源加载完后再断开(Keep-Alive)。
        - http2 比 http1.1 简单区别:
            - 二进制分帧层: 二进制传输代替原本的明文传输
            - 头部压缩
            - 多路复用: 如图, 像上面说的将  css, img, js分开不同域名 也就可以不用这么做了.同一域名不管访问多少文件，也只建立一路连接
            - 举个例子: Apache设置了最大并发数为300，因为浏览器限制，浏览器发起的最大请求数为6，也就是服务器能承载的最高并发为50个人去使用，当第51个人访问时，就需要等待前面某个请求处理完成.
                       使用了http2 最大的并发就可以提升到300.
            - 服务器推送 
                - 如图
                - 一次通信获得所有资源.
                - 速度提升8%
                - 推动注意事项: 所要推送的资源文件，如果浏览器已经有缓存，推送就是浪费带宽。即使推送的文件版本更新，浏览器也会优先使用本地缓存
                    - 解决: 只对第一次访问的用户开启服务器推送。如图是 Nginx 官方给出的示例，根据 Cookie 判断是否为第一次访问
                         
        - 使用http2, htpp1的优化可以弃用: 合并文件、内联资源、雪碧图、域名分片, 使用 http2 尽可能将资源细粒化，文件分解地尽可能散，不用担心请求数多
        - 配置,非常简单, 如图, 目前http2浏览器仅支持https, 配置后重启即可
            - 测试连接 https://tools.keycdn.com/http2-test

- 打包工具 
    - css抽离 (mini-css-extract-plugin 抽离/optimize-css-assets-webpack-plugin 压缩)
        - 使用 contenthash, 这样打包只修改改变的文件
    - js代码压缩(terser-webpack-plugin)  
    - filename采用 chunkhash, 打包hash只改变更改的文件,利用浏览器缓存  