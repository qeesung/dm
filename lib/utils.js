/**
 * Created by qeesung on 2017/1/4.
 */

var CLI = require('clui'),
    clc = require('cli-color');
var Line          = CLI.Line,
    LineBuffer    = CLI.LineBuffer;
var util = require('util');
var chalk = require('chalk');

var labelIndent = 2;
var bmIndent = 8;
/**
 * print bookmarks that do not have same label
 * @param bookmarks
 */
function printBookmarks(bookmarks){
    if(util.isUndefined(bookmarks) || !util.isArray(bookmarks))
        return;
    var outputBuffer = new LineBuffer({
        x: 0,
        y: 0,
        width: 'console',
        height: 'console'
    });
    var groupedBMs = groupBookmarks(bookmarks);
    groupedBMs.forEach(function (group) {
        printOneGroupBM(group, outputBuffer);
    });
    outputBuffer.output();
}

function printOneGroupBM(group, outputBuffer) {
    var labelLine = new Line(outputBuffer)
        .padding(labelIndent)
        .column(chalk.green.bold(group['label']))
        .fill()
        .store();

    var blankLine = new Line(outputBuffer)
        .fill()
        .store();
    
    var line;
    group.bookmarks.forEach(function (bookmark) {
        line = new Line(outputBuffer) 
            .padding(bmIndent)
            .column(bookmark.name, group['name-max-length']+2,[clc.cyan])
            .column(chalk.yellow(bookmark.path))
            .fill()
            .store();
    });

    var blankLine1 = new Line(outputBuffer)
        .fill()
        .store();
}

/**
 * group the bookmarks base on label
 * @param bookmarks bookmarks that have no grouped
 * @returns {Array} grouped array
 */
function groupBookmarks(bookmarks){
    if(!util.isUndefined(bookmarks) &&
        !util.isArray(bookmarks))
        return;
    var groupedBookmarks = [];
    var label = null;
    var group = null;
    bookmarks.forEach(function (bookmark) {
        if(bookmark.label != label) {
            label = bookmark.label;
            if(group != null)
                groupedBookmarks.push(group);
            group = {}; 
            group['name-max-length'] = 0;
            group['label'] = label;
            group['bookmarks'] = [];
        }
        if(util.isUndefined(bookmark.name))
            return;
        var nameLength = bookmark.name.length;
        if(nameLength > group['name-max-length']) 
            group['name-max-length'] = nameLength;
        group['bookmarks'].push(bookmark);
    });
    return groupedBookmarks;
}

module.exports ={
    groupBookmarks: groupBookmarks,
    printBookmarks: printBookmarks
};