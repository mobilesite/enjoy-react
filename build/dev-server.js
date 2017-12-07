var config = require('./config');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.NODE_ENV);
};

var path = require('path');
var express = require('express');
var webpack = require('webpack');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certificate/file.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};

// https://www.npmjs.com/package/http-proxy-middleware
// app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
var proxyMiddleware = require('http-proxy-middleware');

// 测试环境，使用的配置与生产环境的配置一样
// 非测试环境，即为开发环境，因为此文件只有测试环境和开发环境使用
var webpackConfig = process.env.NODE_ENV === 'test'
  ? require('./webpack.prod.config')
  : require('./webpack.dev.config');

var port = process.env.PORT || config.dev.port;

// Define proxies
// https://github.com/chimurai/http-proxy-middleware
// 读入config目录下的proxyTable配置
var proxyTable = config.dev.proxyTable;

var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(port, function() {
    console.log('HTTP Server is running on: http://localhost:%s', port);
});

let httpsPort = 443;
httpsServer.listen(httpsPort, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', httpsPort);
});

var compiler = webpack(webpackConfig);

/**
 * webpack-dev-middleware
 *
 * 这个中间件只能在开发环境中使用！！！它处理时，没有文件写入硬盘，而是写在内存中
 *
 * @param compiler - a webpack compiler
 * @param options - 配置选项
 */
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath, //必填
  quiet: true // 为true时将不展示打包时的一些详细信息，使得终端更加简洁
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});

// force page reload when html-webpack-plugin template changes
// 页面自动刷新的入口
compiler.plugin('compilation', function (compilation) {
  //To allow other plugins to alter the HTML the html-webpack-plugin executes the following events:
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    // 发布reload事件，订阅在dev-client.js里面
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// 将 proxyTable 中的请求配置挂在到启动的 express 服务上
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  // 如果 options 的数据类型为 string，则表示只设置了 url，所以需要将url设置为对象中的 target 的值
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
})

// 使用 connect-history-api-fallback 可以匹配资源，进行重定向等
// 例如：
// {
//  rewrites: [
//    {
//      from: /^\/libs\/.*$/,
//      to: function(context) {
//        return '/bower_components' + context.parsedUrl.pathname;
//      }
// }
//  ]
// }
// https://github.com/bripkens/connect-history-api-fallback
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')(
  {
    index: '/index.html',  //覆盖默认的首页设置，默认是/index.html
    rewrites: [
      // {
      //   from: /\/help$/,
      //   to: '/help.html'
      // }
    ],
    verbose: false //为true时将会输出日志
  }
));

// 将暂存到内存中的 webpack 打包后的文件挂载到 express 服务上
app.use(devMiddleware);

// enable hot-reload and state-preserving
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath);
//console.log('>>>>>>>>>>\n staticPath:', staticPath);

// 对于访问config.dev.assetsPublicPath/config.dev.assetsSubDirectory(如/static)下的内容，都执行express.static('./static')。大意：请求文件包含/static的时候，才从./static下面提供静态文件服务
// express.static(root, [options])
// The root argument refers to the root directory from which the static assets are to be served
// Mount the middleware at “/static” to serve static content only when their request path is prefixed with “/static”:
app.use(staticPath, express.static('./static'));

var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

console.log('>>>>>>>>>>\n Starting dev server...');

// 打包成功后进行提示信息输出和启动浏览器等操作
// waitUntilValid(callback) - executes the callback if the bundle is valid or after it is valid again
// https://www.npmjs.com/package/webpack-dev-middleware
devMiddleware.waitUntilValid(() => {
  console.log('>>>>>>>>>>\n Listening at ' + uri + '\n');
  _resolve();
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

module.exports = {
  ready: readyPromise, // 抛出promise
  close: () => {  // 抛出关闭服务器方法
    httpServer.close();
    httpsServer.close();
  }
}
