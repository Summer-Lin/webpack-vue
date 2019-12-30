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


let mergePlugins = []
if (process.env.NODE_ENV === "analyzer") {
  mergePlugins.push(new BundleAnalyzerPlugin())
}

module.exports = merge(common, {
  mode: "production",
  output: {
    // chunkhash是针对entry的每一个入口文件，独立的hash。如果entry里面的其中一个文件内容改变，只会改变这个入口文件build之后的文件名，而不会影响到其他文件
    filename: "js/[name].[chunkhash].js", //contenthash 若文件内容无变化，则contenthash 名称不变
    path: path.resolve(__dirname, "../dist")
  },

  optimization: {
    // 分离chunks
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        //打包的 js 文件夹中会多一个 vendor.js
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        },

        default: {
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
            drop_console: true,
            drop_debugger: true, // 去除debugger
            pure_funcs: ["console.log"] // 移除console
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
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
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
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: "../"
            }
          },
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 5000,
              //启用CommonJS模块语法, img src路径不会显示 object module
              esModule: false,
              name: "imgs/[hash].[ext]"
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
      filename: "css/[name].[contenthash].css"
    })
  ].concat(mergePlugins)
});
