const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Eslint = require('eslint-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')

/** entry 介绍
 *  入口起点
 *  1. string 类型 --> './src/index.js'
 *      1.1 打包形成一个chunk 输出bundle 文件,
 *      1.2 此时chunk 默认名称是main
 *  2. array 类型 --> ['./src/index.js','./src/index.js']
 *      2.1 多入口
 *      2.2 所有文件只会形成一个chunk 输出出去只有一个built 文件
 *  3. object 类型 -- > {index: './src/index.js' , add: ./src/index.js'}
 *      3.1 多入口
 *      3.2 有几个chunk 就输出几个  通过键值区分
 * **/


module.exports = {
    entry: './src/index.js',
    output: {
        //文件名称(指定名称+目录)
        filename: 'built.js',
        //输出文件目录(将来所有资源输出的公共目录)
        path: resolve(__dirname, 'build'),
        //生产环境中使用 默认将 路径换成 './'模式
        // publicPath: '/'
        //非入口chunk 文件  统一命名
        // chunkFilename: '[name]_chunk.js'
        //整个库向外暴露的变量名称
        // library: '[name]',
        //将变量名称添加到那个node 上
        // libraryTarget: 'window'
    },
    module: {
        rules: [
            // loader 配置
            {
                test: /\.css$/,
                //多个loader
                use: ['style-loader', 'css-loader']
            },
            {
                //单个loader用loader
                test: /\.js$/,
                //排除不需要加载的模块文件
                exclude: /node_modules/,
                // 只检查 src 下的js文件
                include: resolve(__dirname, 'src'),
                //优先执行
                // enforce: 'pre'
                //延后执行
                // enforce: 'post'
            },
            {
                //一下配置只会生成一次
                oneOf: []
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new Eslint({
            fix: true
        })
    ],
    mode: 'development',
    //解析模块规则
    resolve: {
        //配置模块的别名: 优点简化 缺点路径没有提示
        alias: {
            $css: resolve(__dirname, 'src/css')
        },
        //配置省略文件路径的后缀名称
        // extensions: ['.js','.json']
        //告诉webpackd解析模块是去那个目录
        modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
    },
    //服务器配置
    devServer: {
        // 运行代码目录
        contentBase: resolve(__dirname, 'build'),
        //监视 contentBase 目录下的所有文件 , 一旦文件变化 reload
        watchContentBase: true,
        //忽略监视文件
        watchOptions: {
            //忽略文件
            ignored: /node_modules/
        },
        // 启动gzip 压缩
        compress: true,
        // 端口号
        port: 5000,
        //域名端口号
        host: 'localhost',
        //自动打开浏览器
        open: true,
        //开启HDR 功能
        hot: true,
        // 不要显示启动服务器的日志信息
        clientLogLevel: 'none',
        // 除了一些基本的信息 其他内容不要打印
        quiet: true,
        //如果出现错误不要全屏提示
        overlay: true,
        //服务器代理 --> 解决跨域问题
        proxy: {
            // devServe 服务器接受到 /api/xxx 的请求 就会请求转发到另外一个服务器(3000)
            '/api': {
                target: 'http://localhost:3000',
                //发送请求时 请求路径重写 // 将api 转换成空的字符串
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    //生产环境应用的
    optimization: {
        //代码分割
        splitChunks: {
            chunks: 'all',
            //下面都是默认值
            //     minSize: 30 * 1024, //分割chunk最小为30kb
            //     maxSize: 0, // 最大没有限制
            //     minChunks: 1, // 要提取的chunks 最少调用一次
            //     maxAsyncRequests: 5, // 按需加载时并行加载的文件最大数量
            //     maxInitialRequests:3, //入口js文件最大请求数量
            //     automaticNameDelimiter: '~', // 名称连接符
            //     name: true, // 开启可重命名
            //     cacheGroups: { // 分割chunk 的组
            //         // node_modules 文件会被打包到 vendors 组的chunk 中 --> vendors --xxx.js
            //         // 满足上面的规则 如大小超过30kb 等
            //         vendors: {
            //             test: /[\\/]node_modules[\\/]/,
            //             //优先级
            //             priority: -10,
            //             default: {
            //                 //要提取的chunk至少被引用两次
            //                 minChunks: 2,
            //                 //优先级
            //                 priority: -20,
            //                 //如果当前要打包的模块, 和之前已经提取的模块是同一个就会被复用, 而不是要打包模块
            //                 reuseExistingChunk: true
            //             }
            //         }
            //     }
        },
        //将当前文件的记录其他模块hash 单独打包为一个文件 runtime
        runtimeChunk: {
            name: entrypoint => `runtime - ${entrypoint.name}`
        },

        minimizer: [
            //配置生产环境压缩方案: js和css
            new TerserWebpackPlugin({
                //开启缓存
                cache: true,
                //开启多线程打包
                parallel: true,
                //启动source-map
                sourceMap: true
            })
        ]
    }
}
