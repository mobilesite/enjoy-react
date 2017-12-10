const path = require('path');
const utils = require('./utils');
const joinPath = utils.joinPath;
const entryObj = require('./getEntries');

module.exports = {
    assetsRoot: '../static',
    assetsPublicPath: '//static.test.com/',
    alias: {
        actions: joinPath('src/actions'),
        assets: joinPath('src/assets'),
        containers: joinPath('src/containers'),
        components: joinPath('src/components'),
        constants: joinPath('src/constants'),
        pages: joinPath('src/pages'),
        reducers: joinPath('src/reducers'),
        sagas: joinPath('src/sagas'),
        services: joinPath('src/services'),
        styles: joinPath('src/styles'),
        utils: joinPath('src/utils')
    },
    postcss: {
        plugins: [
            require('autoprefixer')
        ]
    },
    
    dll: {
        libFilePrefix: 'lib',
        libFileModules: [
            'react', 
            'react-dom', 
            'history', 
            'react-router', 
            'react-router-dom', 
            'react-router-redux', 
            'redux', 
            'react-redux', 
            'redux-saga'
        ],
        manifestFilePrefix: 'manifest',
        outputPath: '/js/dll/', // 生成目录，是相对于assetsRoot的目录
        publicPath: '//static.test.com/js/dll/',
        development: {
            basePath: path.resolve(__dirname, '../dll/development') // 执行NODE_ENV=development webpack --config  build/webpack.dll.conf.js --progress时的输出目录
            
        },
        production: {
            basePath: path.resolve(__dirname, '../dll/production') // 执行NODE_ENV=production webpack --config build/webpack.dll.conf.js --progress时的输出目录
        }
    },
    development: {
        env: {
            NODE_ENV: JSON.stringify('development'),
            PORT: 80
        },
        proxyTable: {
            '/js/dll/lib*.js': {
                target: 'http://127.0.0.1:9090',
                changeOrigin: true,
                pathRewrite: {
                    '^/js/dll/': '/dll/development/'
                }
            }
        }
    },
    test: {
        env: {
            NODE_ENV: JSON.stringify('test')
        }
    },
    production: {
        env: {
            NODE_ENV: JSON.stringify('production') //必须用production，否则会报错：Warning: It looks like you're using a minified copy of the development build of React. When deploying React apps to production, make sure to use the production build which skips development warnings and is faster. 
        },
        Gzip: false, // 是否开启Gzip
        GzipExtensions: ['js', 'css'], // Gzip后缀名
        bundleAnalyzerReport: process.env.npm_config_report, // ??process.env.npm_config_report获取的是--report参数吗
        compressor: {
            warnings: false,
            drop_console: true,
            drop_debugger: true
        },
        SourceMap: false // 是否生成source map
    },
    entryObj
}
