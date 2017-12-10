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
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const entryObj = require('./getEntries');
const config = require('./config');
const utils = require('./utils');
const joinPath = utils.joinPath;
const baseConfig = require('./webpack.base.config');

const { libFilePath, manifestFilePath } = require('./getDllFiles');

let ret = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.production.env
        }),

        new CleanWebpackPlugin(['./static'], {
            root: path.resolve(__dirname, '..')
        }),

        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(manifestFilePath)
        }),
    
        new AddAssetHtmlPlugin([
            {
                filepath: libFilePath,
                outputPath: path.posix.join(config.dll.outputPath),
                publicPath: config.dll.publicPath,
                includeSourcemap: false
            }
        ]),

        /**
         * 如果嫌一进页面加载的js过多，可以考虑把下面这两个plugin去掉，因为他们会多增加两个js文件：
         * vendor.xxx.js和manifest.xxx.js
         * 他们是在dll的基础上进行的，不会与dll的提取相冲突
         */
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        // extract css into its own file
        new ExtractTextPlugin({
            filename: 'css/[name].[contenthash:7].css'
        }),

        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            mangle: true,
            compressor: config.production.compressor,
            sourceMap: config.production.SourceMap
        }),

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../src/assets'),
                to: config.assetsRoot,
                ignore: ['.*']
            }
        ])
    ]
};

Object.keys(entryObj.page).map(item => {
    /**
     * 将抽取好的js和css公用文件插入到html页面中
     */
    // https://github.com/ampedandwired/html-webpack-plugin
    let htmlPlugin = new HtmlWebpackPlugin({
        filename: `html/${item}.html`, // 这里如果以斜杠开头，则前面那个.不能少（即以./开头，而不能以/开头），少了会报错：build 95% emitting Error: EACCES: permission denied, mkdir '/html'
        template: path.resolve(config.alias.pages, `./${item}/main.html`),
        chunks: ['vendor', 'manifest', item], //指定包含哪些chunk(含JS和CSS)，不指定的话，它会包含打包后输出的所有chunk
        hash: false, 
        chunksSortMode: 'dependency',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        }
    });

    ret.plugins.push(htmlPlugin);
});

if (config.production.Gzip) {
    ret.plugins.push(
        // 在打包时Gzip，这样可以减少Nginx编码带来的性能消耗
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' + config.production.GzipExtensions.join('|') + ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

if (config.production.bundleAnalyzerReport) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

if(!ret.module){
    ret.module = {};
}

ret.module.rules = utils.styleLoaders({
    sourceMap: false,
    extract: true
});

ret.devtool = 'cheap-module-inline-source-map';

ret = webpackMerge(baseConfig, ret);

module.exports = ret;
