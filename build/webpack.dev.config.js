const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('./config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { libFilePath, manifestFilePath } = require('./getDllFiles');

let plugins = [
  new webpack.DefinePlugin({
    'process.env': config.dev.env
  }),

  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(manifestFilePath)
  }),

  new AddAssetHtmlPlugin([
      {
          filepath: libFilePath,
          outputPath: path.posix.join(config.dll.outputPath),
          publicPath: config.dll.dev.publicPath,
          includeSourcemap: false
      }
  ]),

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

  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new FriendlyErrorsPlugin()
];

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

Object.keys(config.entryObj.page).map((item) => {
  /**
   * 将抽取好的js和css公用文件插入到html页面中
   * 文档：https://github.com/ampedandwired/html-webpack-plugin
   */
  console.log('【每一个页面的名称】:', item);
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: `${item}.html`, // 若要修改在地址栏中访问的地址，则需要修改这里。比如如果想用localhost/html/xxx.html访问，则这里要写成html/${item}.html
    template: path.resolve(config.alias.pages, `./${item}/main.html`),
    chunks: ['vendor', 'manifest', item], // 指定包含哪些chunk(含JS和CSS)，不指定的话，它会包含打包后输出的所有chunk
    hash: false, // 为静态资源生成hash值
    chunksSortMode: 'dependency', // 这个选项决定了 script 标签的引用顺序，'dependency' 指按照不同文件的依赖关系来排序
    inject: true
  });

  plugins.push(htmlPlugin);
});

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  devtool: 'eval-source-map',
  plugins: plugins
})
