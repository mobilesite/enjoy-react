const path = require('path');
const config = require('./config');
const utils = require('./utils');

let env;

if(process.env.NODE_ENV === 'development') {
    env = 'development'
} else {
    env = 'production'
};

const libFileName = utils.getFilename(
    config.dll.libFilePrefix,
    '.js',
    config.dll[env].basePath
);
const libFilePath = path.resolve(
    config.dll[env].basePath, 
    libFileName
);

const manifestFileName = utils.getFilename(
    config.dll.manifestFilePrefix,
    '.json',
    config.dll[env].basePath
);
const manifestFilePath = path.resolve(
    config.dll[env].basePath,
    manifestFileName
);

module.exports = {
    libFileName,
    libFilePath,
    manifestFileName,
    manifestFilePath
}
