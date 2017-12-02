const webpack = require('webpack');
const path = require('path');
const os = require('os');
const webpackMerge = require('webpack-merge');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); //显示打包进度条
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel'); // 并行uglify
// const HappyPack = require('happypack');
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const entryObj = require('./getEntries');
const config = require('./config');
const utils = require('./utils');
const joinPath = utils.joinPath;
const baseConfig = require('./webpack.base.config');

let ret = {
    module: {},
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.prod.NODE_ENV
        }),

        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            mangle: true,
            compressor: config.prod.compressor,
            sourceMap: config.prod.productionSourceMap
        }),

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../src/assets'),
                to: path.resolve(__dirname, config.assetsRoot),
                ignore: ['.*']
            }
        ])
    ]
}

if (config.prod.productionGzip) {
    ret.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' + config.prod.productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

if (config.prod.bundleAnalyzerReport) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

ret.module.rules = utils.styleLoaders({ 
    sourceMap: false, 
    extract: true 
});

ret = webpackMerge(baseConfig, ret);

module.exports = ret;