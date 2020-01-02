const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    
    output: { // 输出
        filename: 'js/[name].[hash:8].js', // 每次保存 hash 都变化
        path: path.resolve(__dirname, '../dist')
      },

    // 开发服务器
    devServer: { 
        port: 8088,
        contentBase: '../dist',
        host: 'localhost',
        //compress: true // 可以读取gzip文件
    },
   
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 5000,
                            name: 'imgs/[name].[ext]',
                            //启用CommonJS模块语法, img src路径不会显示 object module
                            esModule: false
                            // publicPath: '../'
                        },
                    },
                ],
            },
        ],
    },  
 
});