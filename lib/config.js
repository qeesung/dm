/**
 * Created by qeesung on 2017/1/1.
 * load the config from config file
 * and export some basic configurations
 */

var config = require('../config/default.json');
var path = require('path');
var configDirName = '.dm';

/**
 * get the user home directory
 * @returns {*} return the user home string
 */
function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 * get user config dir
 * @returns {*} user configuration dir
 */
function getConfigDir(){
    return path.join(getUserHome(), configDirName);
}

/**
 * get the db file full path
 * @returns {*} db file full path
 */
function getStoreFilePath() {
    return path.join(getConfigDir(), config.dbFile);
}

module.exports = {
    getUserHome: getUserHome,
    getStoreFilePath: getStoreFilePath
};
