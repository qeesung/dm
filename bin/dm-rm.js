/**
 * Created by qeesung on 2017/1/4.
 */
var program = require('commander');
var store = require('../lib/store');
var logger = require('debug')('dm-ls');
var chalk = require('chalk');
var util = require('util');

program
    .description('remove bookmarks with given name and label')
    .arguments("[name]")
    .option('-l, --label [label]', "remove bookmarks that with specific label, default is 'default' label", "default")
    .option('-L, --remove-label <label>', "remove all bookmarks under the label, cautiously use")
    .action(function (name, options) {
        program.dmName = name;
    })
    .parse(process.argv);

if(!util.isUndefined(program.removeLabel)){ 
    program.dmName = null; // ignore the name , removeBM will remove all bookmarks under label
}

store.removeBM(program.label, program.dmName).then(function (numRemoved) {
    console.log("Removed "+chalk.green.bold(numRemoved)+" bookmarks!");
}, function (err) {
    console.log(chalk.red("Remove failed : \n")+err)
});
