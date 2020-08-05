const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    mode: 'production ',
    entry: "./src/lib/selectLocation/index.ts",
    output: {
        path: path.resolve(__dirname, './library'),
        filename: "vueLeafletLocationSelect.min.js"
    },
    externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'element-ui': 'ElementUI',
    },
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
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions:['.js','.ts']
    },
    devtool: '#eval-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
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