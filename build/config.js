const path = require('path');
const utils = require('./utils');
const joinPath = utils.joinPath;

module.exports = {
    assetsRoot: '../static',
    assetsPublicPath: '/',
    alias: {
        actions: joinPath('src/actions'),
        assets: joinPath('src/assets'),
        blocks: joinPath('src/blocks'),
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
    libEntry: ['react', 'react-dom', 'history', 'react-router', 'react-router-dom', 'react-router-redux', 'redux', 'react-redux', 'redux-saga'],
    dll: {
        
        fileName: 'lib.js',
        manifestFileName: 'manifest.json',
        outputPath: '/js/dll/', // 生成目录，是相对于assetsRoot的目录
        publicPath: '//static.test.com/js/dll/',
        dev: {
            basePath: path.resolve(__dirname, '../dll/dev'), //执行NODE_ENV=development webpack --config  build/webpack.dll.conf.js --progress时的输出目录
        },
        prod: {
            basePath: path.resolve(__dirname, '../dll/prod'), //执行NODE_ENV=production webpack --config  build/webpack.dll.conf.js --progress时的输出目录
        }
    },
    dev: {
        NODE_ENV: '"development"'
    },
    test: {
        NODE_ENV: '"test"'
    },
    prod: {
        NODE_ENV: '"production"',
        productionGzip: false, // 是否开启Gzip
        productionGzipExtensions: ['js', 'css'], // Gzip后缀名
        bundleAnalyzerReport: process.env.npm_config_report, // ??process.env.npm_config_report获取的是--report参数吗
        compressor: {
            warnings: false,
            drop_console: true,
            drop_debugger: true
        },
        productionSourceMap: false, // 是否生成source map
    }
}