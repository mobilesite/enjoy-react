 /**
   * 自动生成src/utils/main.js、src/filters/main.js、src/directives/main.js文件，避免每添加一个util、filter、directive时都要进行的烦人手工import，而直接挂载在全局实例上
   */

const entryObj = require('./getEntries');

(function(){
    Object.keys(entryObj).map(type => {
        const lineEnd = '\n'; // 换行符
        const entryFileContent = [];
        const temp = {
            importContent: [],
            registerContent: [],
            exportContent: []
        };
    
        Object.keys(entryObj[type]).map(key => {
            let fileName = entryObj[type][key]
                .replace(/\//g, '/')
                .replace(/\\/g, '\\\\'); // 对路径进行转义
            let camelCaseKey = key.replace(
                /-([a-z])?/g, 
                function(all, letter) {
                    return letter.toUpperCase();
                }
            );
    
            if (type.name !== 'util') {
                temp.importContent.push(
                    `import ${camelCaseKey} from '../../${fileName}';`
                );
                temp.registerContent.push(
                    `Vue.${type.name}('${camelCaseKey}', ${camelCaseKey});`
                );
            } else {
                temp.importContent.push(
                    `import {${camelCaseKey}} from '../../${fileName}';`
                );
            }
            temp.exportContent.push(`${camelCaseKey},`);
        });
    
        if (type.name !== 'util') {
            entryFileContent.push('import Vue from \'vue\';');
            entryFileContent.push(temp.importContent.join(lineEnd));
            entryFileContent.push(temp.registerContent.join(lineEnd));
        } else {
            entryFileContent.push(temp.importContent.join(lineEnd));
        }
    
        entryFileContent.push('export default {');
        entryFileContent.push(temp.exportContent.join(lineEnd));
        entryFileContent.push('};');
    
        fs.writeFile(
            utils.joinPath(config.alias[`${type.name}s`], 'main.js'),
            entryFileContent.join(lineEnd),
            function(err) {
                if (err) throw err;
                console.log(
                    `【自动生成文件：】src\/${type.name}s\/main.js is saved!`
                );
            }
        );
    });    
})()
