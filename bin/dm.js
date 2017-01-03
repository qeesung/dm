#!/usr/bin/env node

/**
 * Created by qeesung on 2017/1/2.
 */
var program  = require('commander');

program
    .version('0.0.1')
    .command('add <name> [path]', 'add a directory bookmark with name and path').alias('a')
    .command('ls [expression]', 'list all bookmarks or bookmarks match regex').alias('l')
    .parse(process.argv);


