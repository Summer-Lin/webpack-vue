const webpack = require('webpack');
const path = require("path");
const { resolve } = require('path');
// vue-loader 版本15.+都要用这个插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//多线程打包
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// 构建进度
const WebpackBar = require('webpackbar');


module.exports = {
    entry: './src/index.js', //入口
    module: {
        
        rules: [
            {
                test: /\.js$/,
                //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
                loader: 'happypack/loader?id=happyBabel',
                //排除node_modules 目录下的文件
                exclude: /node_modules/,
            },
        
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            // 处理字体
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader',
            }
        ]
    },

    watchOptions : {
        //不监听的 node_modules 目录下的文件
        ignored : /node_modules/,
    },

    resolve: {
        extensions: ['.js', '.vue'],
        //先去当前目录的 node_modules 目录下去找我们想找的模块，如果没找到就去上一级目录 ../node_modules 中找，再没有就去 ../../node_modules 中找，以此类推
        modules: [path.resolve( __dirname,'../node_modules')],
        alias: {
            vue: 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        },
    },

    // 插件
    plugins: [
        new VueLoaderPlugin(),

        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            isProd: process.env.NODE_ENV === "development" ? false : true
        }),

        // 使用dll动态链接库才打卡
        // new webpack.DllReferencePlugin({
        //     manifest: path.resolve(__dirname, '../dist/dll/vendor.manifest.json'),
        //
        // }),

        // js css都可以用happyPack 开启多线程
        new HappyPack({
            //用id来标识 happypack处理类文件
            id: 'happyBabel',
            //如何处理 用法和loader 的配置一样
            loaders: [
                {
                    loader: 'babel-loader?cacheDirectory=true',
                },
            ],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),

        new WebpackBar()
    ],
};



/**
 * 

development:

process.env.NODE_ENV 的值设为 development
默认开启以下插件，充分利用了持久化缓存。参考基于 webpack 的持久化缓存方案

NamedChunksPlugin ：以名称固化 chunk id
NamedModulesPlugin ：以名称固化 module id

production:

process.env.NODE_ENV 的值设为 production
默认开启以下插件，其中 SideEffectsFlagPlugin 和 UglifyJsPlugin 用于 tree-shaking


FlagDependencyUsagePlugin ：编译时标记依赖
FlagIncludedChunksPlugin ：标记子chunks，防子chunks多次加载
ModuleConcatenationPlugin ：作用域提升(scope hosting),预编译功能,提升或者预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度
NoEmitOnErrorsPlugin ：在输出阶段时，遇到编译错误跳过
OccurrenceOrderPlugin ：给经常使用的ids更短的值
SideEffectsFlagPlugin ：识别 package.json 或者 module.rules 的 sideEffects 标志（纯的 ES2015 模块)，安全地删除未用到的 export 导出
UglifyJsPlugin ：删除未引用代码，并压缩


 */