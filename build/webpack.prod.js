const path = require('path');
// 合并配置文件
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
// 打包之前清除文件
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// 分离CSS插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩CSS
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 压缩JS代码
// uglifyjs-webpack-plugin 换成 terser-webpack-plugin 进行压缩代码, 
//webpack 5开始支持这个选项
const TerserPlugin = require('terser-webpack-plugin');
//代码分析器
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// gzip压缩
const CompressionPlugin = require('compression-webpack-plugin');
// PWA配置
const WorkboxPlugin = require('workbox-webpack-plugin');

let mergePlugins = []
if (process.env.NODE_ENV === "analyzer") {
    mergePlugins.push(new BundleAnalyzerPlugin())
}

if (process.env.NODE_ENV === "gzip") {
    mergePlugins.push(new CompressionPlugin({
        filename: '[path].gz[query]', // 目标文件名
        algorithm: 'gzip', // 使用 gzip 压缩
        test: /\.js$|\.css$/, // 压缩 js 与 css
        deleteOriginalAssets: false, //不删除源文件,用来保留服务器不支持gzip
        threshold: 10240, // 资源文件大于 10240B = 10kB 时会被压缩
        //minRatio: 0.8,   // 最小压缩比达到 0.8 时才会被压缩
    }),)
}

module.exports = merge(common, {
    mode: "production",
    output: {
        // hash: 每次构建,生成唯一的哈希值
        // chunkhash: 是针对entry的每一个入口文件，独立的hash。如果entry里面的其中一个文件内容改变，只会改变这个入口文件build之后的文件名，而不会影响到其他文件
        // contenthash:根据文件内容计算而来。
        filename: "js/[name].[chunkhash:8].js",
        path: path.resolve(__dirname, "../dist")
    },

    // 排除将以下资源打包到bundle
    // 这样理解: import Vue from 'vue'; 这样会被打包到chunk里面
    // 所以用externals , 将导入语句里的 vue 替换成运行环境里的全局变量Vue
    // 左边就是package.json dependencies的值,  右边是代码  export 出来的值或者 全局的值,就是我们import的值
    // view-design 有个坑, 需要转成 iview 再转成 ViewUI
    externals: {
        "vue": 'Vue',
        "axios": 'axios',
        "vue-router": 'VueRouter',
        "view-design": 'iview',
        "iview": 'ViewUI',
        "vue-i18n": 'VueI18n',
    },

    optimization: {
        // 使用了 externals , 就不打包 vendor 了

        // 分离chunks, 根据入口文件作为拆分
        splitChunks: {
            chunks: "all",
            cacheGroups: {


                //打包的 js 文件夹中会多一个 vendor.js
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 100,
                    chunks: "initial" // 只打包初始时依赖的第三方
                },

                default: {
                    // 进行耕细粒度的拆分
                    minChunks: 2,
                    priority: 90, // 优先级配置项
                    reuseExistingChunk: true
                }
            }
        },

        minimizer: [
            // 压缩JS
            new TerserPlugin({
                parallel: true, // 多线程平行压缩
                cache: true, // 开启缓存
                terserOptions: {
                    ecma: undefined, // 指定ES6,7,8... 版本
                    warnings: false, // 去除警告
                    parse: {},
                    compress: {
                        warnings: false,
                        //drop_console: true,
                        drop_debugger: true, // 去除debugger
                        //pure_funcs: ["console.log"] // 移除console
                    },
                    comments: false
                }
            }),

            // 压缩css
            new OptimizeCSSAssetsPlugin()
        ]
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ]
            },

            //url-loader 一般与file-loader搭配使用，如果文件小于限制的大小。则会返回 base64 编码，
            // 否则使用 file-loader 将文件移动到输出的目录中
            // {
            //   test: /\.(jpe?g|png|gif)$/,
            //   use: [
            //     {
            //       loader: 'url-loader',
            //       options: {
            //         limit: 10240,
            //         fallback: {
            //           loader: 'file-loader',
            //           options: {
            //             name: 'img/[name].[hash:8].[ext]'
            //           }
            //         }
            //       }
            //     }
            //   ]
            // },
            //
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            limit: 5000,
                            //启用CommonJS模块语法, img src路径不会显示 object module
                            esModule: false,
                            name: "imgs/[name].[hash:8].[ext]"
                        }
                    }
                    // 图片压缩
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         //   bypassOnDebug: true,
                    //         mozjpeg: {
                    //             progressive: true,
                    //             quality: 65,
                    //         },
                    //         optipng: {
                    //             enabled: false,
                    //         },
                    //         pngquant: {
                    //             quality: '65-90',
                    //             speed: 4,
                    //         },
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //     },
                    // },
                ]
            }
        ]
    },
    plugins: [
        //删除之前打包好的内容
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            // contenthash 只改变修改的内容文件的哈希值
            filename: "css/[name].[contenthash:8].css"
        }),

        // new WorkboxPlugin.GenerateSW({
        //     clientsClaim: true,   // Service Worker 被激活后使其立即获得页面控制权
        //     skipWaiting: true,   // 强制等待中的 Service Worker 被激活
        //     importWorkboxFrom: 'local',  // 将所有Workbox运行时库复制到service worker的带版本的目录中，然后配置service worker来使用这些文件
        //     include: [/\.js$/, /\.css$/, /\.html$/,/\.jpg/,/\.jpeg/,/\.svg/,/\.webp/,/\.png/],
        // })


    ].concat(mergePlugins)
});
