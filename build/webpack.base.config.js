console.log(1111)
const webpack = require('webpack');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); //显示打包进度条
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const HappyPack = require('happypack');
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const entryObj = require('./getEntries');
const config = require('./config');
const utils = require('./utils');
const joinPath = utils.joinPath;
const isDebug = process.env.NODE_ENV === 'development';

let ret = {
    entry: {
        ...config.libEntry,
        ...entryObj.page
    },
    output: {
        path: path.resolve(__dirname, config.assetsRoot),
        filename: '[name].js',
        publicPath: config.assetsPublicPath,
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: config.alias
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                // include: [
                //     joinPath('src'), 
                //     joinPath('dll'), 
                //     joinPath('test'),
                //     joinPath('node_modules')
                // ], 
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.js|jsx$/,
                loader: 'babel-loader',
                // loader: 'happypack/loader?id=happybabel',
                // include: [
                //     joinPath('src'), 
                //     joinPath('dll'), 
                //     joinPath('test'),
                //     joinPath('node_modules')
                // ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: './images/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: './media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: './fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new ProgressBarPlugin(),
        new FriendlyErrorsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),//webpack2处理后的每个模块均被一个函数包裹,这样会带来一个问题：降低浏览器中JS执行效率，这主要是闭包函数降低了JS引擎解析速度。于是webpack 3参考Closure Compiler和Rollup JS，将一些有联系的模块，放到一个闭包函数里面去，通过减少闭包函数数量从而加快JS的执行速度。 Concatenation串联
        // new HappyPack({
        //     id: 'happybabel',
        //     loaders: ['babel-loader'],
        //     threadPool: happyThreadPool,
        //     cache: true,
        //     verbose: true
        // }),
        // webpack dllplugin
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.resolve(
                config.dll.prod.basePath,
                config.dll.manifestFileName
            ))
        }),

        new AddAssetHtmlPlugin([
            {
                filepath: path.resolve(config.dll.prod.basePath, config.dll.fileName),
                outputPath: path.posix.join(config.dll.outputPath),
                publicPath: config.dll.publicPath,
                includeSourcemap: false
            }
        ]),

        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            }
        }),

        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),

        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
    ]
}

if(isDebug){
    ret.devtool = '#eval-source-map';
}

console.log(ret);

module.exports = ret;