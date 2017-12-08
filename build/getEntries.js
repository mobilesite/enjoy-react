const glob = require('glob');
const path = require('path');
const utils = require('./utils');
const joinPath = utils.joinPath;

let entryObj = {};
let globArr = [];
let fileArr = [];

const typeArr = [
    {
        directory: './src/pages',
        name: 'page',
        filename: 'main'
    },
    // {
    //     directory: 'src/utils',
    //     name: 'util',
    //     filename: 'main'
    // },
    // {
    //     directory: 'src/filters',
    //     name: 'filter',
    //     filename: 'main'
    // },
    // {
    //     directory: 'src/directives',
    //     name: 'directive',
    //     filename: 'main'
    // }
];

typeArr.forEach((type, index) => {
    globArr[type.name] = new glob.Glob('**/' + type.filename + '.js', {
        cwd: type.directory,
        sync: true // 这里不能异步，只能同步
    });

    globArr[type.name].found.forEach(filepath => {
        const moduleName = filepath.replace(new RegExp(`/${type.filename}.js`), '');

        if(!entryObj[type.name]) {
            entryObj[type.name] = [];
        }

        entryObj[type.name][moduleName] = path.resolve(__dirname, '..', joinPath(type.directory, filepath));
    })
})

module.exports = entryObj;