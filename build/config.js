const path = require('path');
const utils = require('./utils');
const joinPath = utils.joinPath;
const entryObj = require('./getEntries');

module.exports = {
    assetsRoot: '../static',
    assetsPublicPath: '/',
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
        publicPath: '/js/dll/',
        dev: {
            basePath: path.resolve(__dirname, '../dll/dev') // 执行NODE_ENV=dev webpack --config  build/webpack.dll.conf.js --progress时的输出目录
        },
        prod: {
            basePath: path.resolve(__dirname, '../dll/prod') // 执行NODE_ENV=prod webpack --config build/webpack.dll.conf.js --progress时的输出目录
        }
    },
    dev: {
        env: {
            NODE_ENV: JSON.stringify('dev'),
            PORT: 80
        },
        proxyTable: {
            '/dll/libs.js': {
                target: 'http://127.0.0.1:9090',
                changeOrigin: true,
                pathRewrite: {
                    '^/dll/': 'dll/dev/'
                }
            }
        }
    },
    test: {
        env: {
            NODE_ENV: JSON.stringify('test')
        }
    },
    prod: {
        env: {
            NODE_ENV: JSON.stringify('prod')
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
