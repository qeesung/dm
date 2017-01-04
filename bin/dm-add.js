/**
 * Created by qeesung on 2017/1/2.
 * dm add sub command
 */

var program = require('commander');
var store = require('../lib/store');
var logger = require('debug')('dm-add');
var chalk = require('chalk');

function parseLabel(label) {
    return label.trim();
}

program
    .option('-l, --label [label]', 'add bookmark with specific label', parseLabel, "default") // default label is default
    .arguments('<name> [path]')
    .action(function (name, path) {
        program.dmName = name;
        program.dmPath = path;
    })
    .parse(process.argv);

if (typeof program.dmName === 'undefined') {
    console.error('No name given. please see detail usage with command "dm add --help"');
    process.exit(1);
}

// if no path , use current command directory
if(typeof program.dmPath === 'undefined') {
    program.dmPath = process.cwd();
}

logger("parse and got the args: name-->"+program.dmName+" path-->"+program.dmPath+" label-->"+program.label);

store.queryBM(program.label, program.dmName).then(function (bookmarks) {
    // check if the name already exists in label
    if(bookmarks.length != 0){
        console.log(chalk.red.bold("Add failed : ")+"'"+
            chalk.yellow.italic(program.dmName)+"' is already exists in label '"+
            chalk.yellow.italic(program.label)+"', please try another name");
        process.exit(1);
    }
    
    // add the bookmark to database
    store.addBM(program.dmName, program.dmPath, program.label).then(function (bookmark) {
        console.log(chalk.green("Done!"));
    }, function (err) {
        console.log(chalk.red("Add failed : \n")+err);
    });
}, function (err) {
    console.log(chalk.red("Add failed : \n")+err);
});
