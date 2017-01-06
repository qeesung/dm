/**
 * Created by qeesung on 2017/1/4.
 */
var program = require('commander');
var store = require('../lib/store');
var chalk = require('chalk');
var util = require('util');
var prompt = require("prompt");
prompt.message = "";

program
    .description('remove bookmarks with given name and label')
    .arguments("[name]")
    .option('-l, --label [label]', "remove bookmarks that with specific label, default is 'default' label", "default")
    .option('-L, --remove-label <label>', "remove all bookmarks under the label, cautiously use")
    .option('-a, --remove-all', "remove all bookmarks, cautiously use")
    .option('-f, --force', "remove forcibly")
    .action(function (name, options) {
        program.dmName = name;
    })
    .parse(process.argv);

var promptProperty = {
    name: 'yesno',
    message: '',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'no'
};

/**
 * call this function if removed successfully
 * @param numRemoved num removed
 */
function removeSuccCB(numRemoved){
    console.log("Removed "+chalk.green.bold(numRemoved)+" bookmarks!");
}

/**
 * call this function if remove failed
 * @param err failed err information 
 */
function removeFailed(err){
    console.log(chalk.red("Remove failed : \n")+err)
}

/**
 * remove all bookmarks
 */
function removeAllBMs() {
    store.removeAllBMs().then(removeSuccCB, removeFailed);
}

/**
 * remove part bookmarks base on label and name
 * @param label bookmarks's label
 * @param name bookmarks's name
 */
function removePart(label , name){
    store.removeBM(label, name).then(removeSuccCB, removeFailed);
}

/**
 * before remove all bookmarks , user need make sure
 */
function askIfRemoveAll(){
    prompt.start();
    promptProperty.message = "are you sure remove all bookmarks?";
    prompt.get(promptProperty, function (err, result) { // ask user if remove all bookmarks
        if(result.yesno == 'yes'){
            removeAllBMs();
        }
    });
}

/**
 * before remove some bookmarks with the label the name, user need make sure
 * @param label specified label
 * @param name specified name
 */
function askIfRemoveLabel(label, name){
    prompt.start();
    promptProperty.message = "are you sure remove all bookmarks under the label?";
    prompt.get(promptProperty, function (err, result) { // ask user if remove all bookmarks
        if(result.yesno == 'yes'){
            removePart(label, name);
        }
    });
}


if(!util.isUndefined(program.removeAll)){ // remove all bookmarks here
    if(!program.force){
        askIfRemoveAll();
    }
    else{
        removeAllBMs();
    }
}
else if(!util.isUndefined(program.removeLabel)){
    if(!program.force){ // remove label and not force 
       askIfRemoveLabel(program.removeLabel, null);
    }
    else{
        removePart(program.removeLabel, null);
    }
}
else{
    if(util.isUndefined(program.label) || util.isUndefined(program.dmName)){
        console.log(chalk.red("Usage : ")+" please specify a bookmark's name");
        process.exit(1);
    }
    removePart(program.label, program.dmName);
}
