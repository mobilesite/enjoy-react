const config = require('./config');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
};

const { libFileName } = require('./getDllFiles');

const path = require('path');
const express = require('express');
const webpack = require('webpack');

const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './certificate/file.crt'), 'utf8');
const credentials = {key: privateKey, cert: certificate};

// https://www.npmjs.com/package/http-proxy-middleware
// app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
const proxyMiddleware = require('http-proxy-middleware');

// 测试环境，使用的配置与生产环境的配置一样
// 非测试环境，即为开发环境，因为此文件只有测试环境和开发环境使用
const webpackConfig = process.env.NODE_ENV === 'test'
  ? require('./webpack.prod.config')
  : require('./webpack.dev.config');

const port = process.env.PORT || config.dev.env.PORT;

// Define proxies
// https://github.com/chimurai/http-proxy-middleware
// 读入config目录下的proxyTable配置
const proxyTable = config.dev.proxyTable;

const app = express();

const compiler = webpack(webpackConfig);

/**
 * webpack-dev-middleware
 *
 * 这个中间件只能在开发环境中使用！！！它处理时，没有文件写入硬盘，而是写在内存中
 *
 * @param compiler - a webpack compiler
 * @param options - 配置选项
 */
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath, //必填
  quiet: true // 为true时将不展示打包时的一些详细信息，使得终端更加简洁
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
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
// Object.keys(proxyTable).forEach(function (context) {
//   let options = proxyTable[context];
//   // 如果 options 的数据类型为 string，则表示只设置了 url，所以需要将url设置为对象中的 target 的值
//   if (typeof options === 'string') {
//     options = { target: options };
//   }
//   app.use(proxyMiddleware(options.filter || context, options));
// })

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

console.log(config.dll.publicPath, new RegExp(config.dll.publicPath + libFileName + '$', 'g'))

app.use(require('connect-history-api-fallback')(
  {
    index: '/index.html',  //覆盖默认的首页设置，默认是/index.html
    rewrites: [
      {
        from: new RegExp(config.dll.publicPath + libFileName + '$', 'g'),
        to: config.dll.publicPath + libFileName
      }
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
const staticPath = path.posix.join(config.assetsPublicPath);
//console.log('>>>>>>>>>>\n staticPath:', staticPath);

// 对于访问config.dev.assetsPublicPath/config.assetsSubDirectory(如/static)下的内容，都执行express.static('./static')。大意：请求文件包含/static的时候，才从./static下面提供静态文件服务
// express.static(root, [options])
// The root argument refers to the root directory from which the static assets are to be served
// Mount the middleware at “/static” to serve static content only when their request path is prefixed with “/static”:
app.use(staticPath, express.static('./static'));

const uri = 'http://localhost:' + port;

let _resolve;
const readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, function() {
    
});

httpsServer.listen(443, function() {
    
});

// 打包成功后进行提示信息输出和启动浏览器等操作
// waitUntilValid(callback) - executes the callback if the bundle is valid or after it is valid again
// https://www.npmjs.com/package/webpack-dev-middleware
devMiddleware.waitUntilValid(() => {
  console.log('HTTP Server is running on: http://localhost:%s', port);
  console.log('HTTPS Server is running on: https://localhost:%s', 443);
  _resolve();
})

module.exports = {
  ready: readyPromise, // 抛出promise
  close: () => {       // 抛出关闭服务器方法
    httpServer.close();
    httpsServer.close();
  }
}
