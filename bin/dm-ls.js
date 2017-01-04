/**
 * Created by qeesung on 2017/1/3.
 */
var program = require('commander');
var store = require('../lib/store');
var logger = require('debug')('dm-ls');
var chalk = require('chalk');
var utils = require('../lib/utils');


program
    .description("list all bookmarks")
   
store.getAllBMs().then(function (bookmarks) {
   utils.printBookmarks(bookmarks);
}, function (err) {
   console.log("get bookmarks failed : "+chalk.red(err));
});