const glob = require('glob');
const utils = require('./utils');

let entryObj = {};
let globArr = [];
let fileArr = [];

const typeArr = [
    {
        directory: 'src/pages',
        name: 'page',
        filename: 'main'
    },
    // {
    //     directory: 'src/utils',
    //     name: 'util',
    //     filename: 'util'
    // },
    // {
    //     directory: 'src/filters',
    //     name: 'filter',
    //     filename: 'filter'
    // },
    // {
    //     directory: 'src/directives',
    //     name: 'directive',
    //     filename: 'directive'
    // }
];

typeArr.forEach((type, index) => {
    globArr[type.name] = new glob.Glob('**/' + type.filename + '.js', {
        cwd: type.directory,
        sync: true // 这里不能异步，只能同步
    });

    globArr[type.name].found.forEach(filepath => {
        const modulenName = filepath.replace(new RegExp(`/${type.filename}.js`), '');

        entryObj[type.name][modulenName] = joinPath(type.directory, filepath);
    })
})

console.log(22222222, entryObj)

module.exports = entryObj;