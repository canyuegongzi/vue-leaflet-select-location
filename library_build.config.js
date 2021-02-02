const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    mode: 'production ',
    entry: "./src/packages/index.ts",
    output: {
        path: path.resolve(__dirname, './library'),
        filename: "vueLeafletLocationSelect.min.js",
        publicPath: '/library/',
        library: 'vue-leaflet-location-select', // 指定的就是使用 import 时的模块名
        libraryTarget: 'umd', // libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的
        umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
    },
    externals: {},
    optimization: {
        minimizer: [
            new UglifyJSPlugin(),
            new TerserPlugin({
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                        drop_console: true,
                        drop_debugger: false,
                        pure_funcs: ['console.log'] // 移除console
                    }
                },
            }),
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions:['.js','.ts']
    },
    // devtool: '#eval-source-map',
    module: {
        rules: [
            { // 添加tsloader
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.pug$/, use: ['pug-plain-loader'] 
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]', // 保持名称不变
                        limit: 20 * 1024, // 小于20k的图片 打包成base64
                        outputPath: 'assets/' // 打包后的存放路径 dist/assets
                    }
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    limit: 5000,
                    name: 'fonts/[name].[ext]?[hash:8]'
                }
            },
            {
                test: /\.css$/,
                use: [ // 由后向前加载
                    {loader: "style-loader"},
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"}
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {loader: "style-loader"},
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"},
                    {loader: 'less-loader'}
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    {loader: "style-loader"},
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"},
                    {loader: 'sass-loader'}
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    {loader: "style-loader"},
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"},
                    {loader: 'stylus-loader'}
                ]
            },
        ]
    }
}