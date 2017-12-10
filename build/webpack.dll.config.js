const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const os = require('os');
const { joinPath } = require('./utils');

const utils = require('./utils');
const config = require('./config');
const isDev = process.env.NODE_ENV === 'development';
const UglifyJsParallelPlugin = require('webpack-uglify-parallel'); // 并行uglify

const outputPath = isDev
    ? `${config.dll.development.basePath}`
    : `${config.dll.production.basePath}`;

rimraf.sync(outputPath);

const plugins = [
    new webpack.DllPlugin({
        path: process.env.NODE_ENV === 'development' ? 
            path.join(outputPath, config.dll.manifestFilePrefix + '.[hash:7].json') : 
            path.join(outputPath, config.dll.manifestFilePrefix + '.[chunkhash:7].json')
        , // 定义 manifest 文件生成的位置
        name: '[name]', // dll bundle 输出到哪个全局变量上，和 output.library 一样即可。[name]的部分由entry的名字替换
        context: __dirname
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
];

if (!isDev) {
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': config.production.env
        })
    );

    plugins.push(
        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            mangle: true,
            compressor: config.production.compressor,
            sourceMap: config.production.SourceMap
        })
    );
}

let ret = {
    entry: {
        [config.dll.libFilePrefix]: config.dll.libFileModules
    },
    output: {
        path: outputPath,
        filename: process.env.NODE_ENV === 'development' ? '[name].[hash:7].js' : '[name].[chunkhash:7].js',
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

if(isDev) {
    ret.devtool = 'eval-source-map';
} else {
    ret.devtool = 'cheap-module-inline-source-map';
}

module.exports = ret;
