const webpack = require('webpack');
const path = require('path');
const { joinPath } = require('./utils');

const utils = require('./utils');
const config = require('./config');
const isDebug = process.env.NODE_ENV === 'development';

const outputPath = isDebug
    ? `${config.dll.dev.basePath}`
    : `${config.dll.prod.basePath}`;

const plugins = [
    new webpack.DllPlugin({
        path: path.join(outputPath, 'manifest.json'), // 定义 manifest 文件生成的位置
        name: '[name]', // dll bundle 输出到哪个全局变量上，和 output.library 一样即可。[name]的部分由entry的名字替换
        context: __dirname
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
];

if (!isDebug) {
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': config.prod.env
        })
    );
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$', 'Zepto', 'exports', 'require']
            },
            exclude: /\.min\.js$/,
            compress: { warnings: false },
            output: { comments: false }
        })
    );
}

let ret = {
    entry: {
        lib: config.libEntry
    },
    output: {
        path: outputPath,
        filename: '[name].js',
        library: '[name]', // output.library将会定义为 window.${output.library}
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js', '.jsx'], // 这里如果写错，会导致所有node_modules下的文件都找不到的报错
        alias: config.alias
    },
    plugins: plugins
}

if(isDebug) {
    ret.devtool = 'eval-source-map';
}

module.exports = ret;
