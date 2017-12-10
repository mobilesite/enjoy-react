const path = require('path');
const glob = require('glob');
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
            minimize: process.env.NODE_ENV !== 'development',
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

        // 当options.extract选项为true时，要进行ExtractTextPlugin，在production环境构建会传入options.extract=true
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders
            });
        } else {
            return loaders;
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

// get filename with some prefix and aome suffix in some directory
function getFilename(prefix, suffix, directory) {
    return new glob.Glob('**/' + prefix + '*' + suffix, {
        cwd: directory,
        sync: true // 这里不能异步，只能同步
    }).found[0]
}

module.exports = {
    joinPath,
    styleLoaders,
    getFilename
}