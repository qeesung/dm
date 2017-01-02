#!/usr/bin/env node

/**
 * Created by qeesung on 2017/1/2.
 */
var program  = require('commander');

program
    .version('0.0.1')
    .command('add [name]', 'add a directory bookmark with name and path').alias('a')
    .parse(process.argv);


