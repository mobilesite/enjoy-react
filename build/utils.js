const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * 获取相对当前路径的相对路径
 */
function joinPath(currentDir, subDir) {
    if (arguments.length > 1) {
        return path.join(currentDir, subDir);
    } else {
        return path.join(__dirname, '..', currentDir);
    }
}

/**
 * 生成样式处理的相关loader
 * @param { Object } options - 一些配置参数
 * @returns {{css: *, postcss: *, less: *, sass: *, scss: *, stylus: *, styl: *}}
 */
function cssLoaders(options) {
    options = options || {};

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    };


   /**
   * 生成loader
   * generate loader string to be used with extract text plugin
   * @param loader - loader名，不带-loader
   * @param loaderOptions - loader的相应配置信息
   * @returns {*}
   */
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader];
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        // 当options.extract选项为true时，要进行ExtractTextPlugin
        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                // vue-style-loader是style-loader的fork，和style-loader类似, 也能动态地将CSS以style标签的形式插入到HTML文档中. https://www.npmjs.com/package/vue-style-loader
                // 存疑：?? 不用vue的时候是否可以用这个loader
                fallback: 'vue-style-loader'
            });
        } else {
            return ['vue-style-loader'].concat(loaders);
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    };
};

// Generate loaders for standalone style files (outside of .vue)
function styleLoaders(options) {
    var output = [];
    var loaders = cssLoaders(options);
    for (var extension in loaders) {
        var loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }
    return output;
};


module.exports = {
    joinPath,
    styleLoaders
}