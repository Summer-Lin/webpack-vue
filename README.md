[对应的github项目](https://github.com/zxpsuper/createVue)
[webpack详细配置](https://juejin.im/post/5de87444518825124c50cd36)






#浅谈前端性能优化

### 推荐链接
[前端性能优化之旅](https://alienzhou.github.io/fe-performance-journey/#%E5%89%8D%E7%AB%AF%E9%9C%80%E8%A6%81%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%B9%88%EF%BC%9F)

前端性能优化,一般是利用浏览器缓存,压缩代码, CDN......

下面以一个简单项目为例:
### 技术框架

- vue 2+框架
- iview UI 4+ 组件库
- webpack4 + 打包工具

### 性能优化方向
- 代码层级
 - 预加载
    - quicklink轻量库: 预加载,类似滚动懒加载,执行
 - 公共组件
 - 多语言懒加载
 - 路由懒加载
 - 图片
    - 雪碧图
    - 懒加载
    - SVG
    - 字体图标
    - webp
        - 兼容性相对较差,有损压缩质量相对好
    - 熊猫压缩
    - imagemin 插件
    

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
    - hash/chunkhash/contenthash区别
        - hash:每次改变都会统一成一样的hash值.
        - chunkhash:根据entry, child chunk改变,main.js会跟着改. 其他的不变.
        - contenthash: 内容改变,hash也改变, webpack 4以前用在 css
            - 同个组件的样式更改,css 的hash改变, 对应的js 和 main.js也改变
            - 只改变公共样式,引入main.js的样式, 则main.css 和 main.js改变
        
    - css抽离 (mini-css-extract-plugin 抽离/optimize-css-assets-webpack-plugin 压缩)
        - 使用 contenthash, 这样打包只修改改变的文件.
     
    - js代码压缩(terser-webpack-plugin/uglifyjs-webpack-plugin)
    
    - Tree-Shaking 不打包没使用的代码 
        - ES6 import 和 export 语法才有用
        - mode模式为 "production"
        - 以上会显示 /* unused harmony export toBindCard */ 等这样的注释,但代码还是会显示出来,如图
        - 最后得 通过 uglifyjs-webpack-plugin 和 terser-webpack-plugin 这样的插件去剔除多余代码
    
    - gizp 
        - 目的: 压缩代码体积.
        - 原理: 是在一个文本文件中找出一些重复出现的字符串、临时替换它们，从而使整个文件变小。文件中代码的重复率越高，那么压缩的效率就越高.
        - 以服务器压缩的时间开销和 CPU 开销（以及浏览器解析压缩文件的开销）为代价，省下了一些传输过程中的时间开销。
        - webpack prod配置
        - nginx配置,如图
        - 注意: 图片不要压缩,因为我们都已经压缩过了,采用gzip会变大,如图
    
    - 提取Vendor包, 分为splitChunks, cdn, dllplugin
        - 差别：
          - splitChunks 每次都会构建，但有hash值
          - CDN速度快，但计费，整个包得下载
          - dllplugin，不用构建，开发比较快

        - splitChunks: 直接打包成一个vendor.js, 所有依赖包都在这里
        
        - CDN
            - index.html 不要被缓存
            - 静态资源需要加上hash
            - 如果要将图片,js放到指定CDN ,一般都加上publicPath, 如 publicPath : ’ // js.cdn . com/id / ’
            - 但我一般只放vue vuex axios ivew等静态资源, 采用externals
            - 在 htmlwebpackplugin 配置变量,生产环境再添加script资源
            - CDN需要计费,所以本地开发调试我们就不使用 externals
            - 弊端: 如果使用外人的CDN,CDN有问题那就项目就挂了; CDN需要计费

        - dllplugin(DllPlugin 和 DllReferencePlugin 搭配), 生成 动态链接库, 不用每次打包,
        提升构建速度(作用和splitChunks一样,只是不用每次都构建)
            - webpack.base.js/ index.html 对应内容打开;  打包webpack.prod.js external splitChunks注释; 本地开发 webpack.dev.js
            - 1）先执行npm run dll, 打包 webpack.dll.config.js 文件
            - 2）在 webpack.base.js 添加 DllReferencePlugin 插件，引入json
            - 3）在 index.html文件引入dll文件

            
        