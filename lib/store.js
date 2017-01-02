/**
 * Created by qeesung on 2017/1/1.
 * load the db file
 */

var logger = require('debug')('store');
var config = require('./config');
var DataStore = require('nedb');
var Promise = require('bluebird');
var fs = require('fs');
var store = new DataStore({ filename: config.getStoreFilePath(), autoload: true });

/**
 * add a new directory bookmark
 * @param name directory key name
 * @param path directory full path
 * @param label directory label
 */
function addBM(name, path, label){
   return new Promise(function (resolve, reject) {
      logger("Inserting bookmark "+label+"-->"+name+" : "+path);
      if (!fs.existsSync(path)) {
         reject(path +" is not exists, insert failed");
      }
      store.insert({
         name: name,
         path: path,
         label: label || "default"
      }, function (err, data) {
         if(err){
            logger("insert bookmark failed : "+err)
            reject(err);
         }
         else{
            logger("Insert bookmark "+label+"-->"+name+" : "+path+" successfully");
            resolve(data);
         }
      });
   });
}

/**
 * get all directory bookmarks
 */
function getAllBMs(){
   logger("fetching all bookmarks");
   return new Promise(function (resolve, reject) {
      store.find({},function (err, data) {
         if(err){
            logger("fetch all bookmarks failed : " +err);
            reject(err);
         }
         else{
            logger("fetch all bookmarks successfully");
            resolve(data);
         }
      });
   });
}

/**
 * remove all directory bookmarks
 */
function removeAllBMs(){
   logger("removing all bookmarks");
   return new Promise(function (resolve, reject) {
      store.remove({}, { multi: true }, function (err, numRemoved) {
         if(err){
            logger("removing all bookmarks failed : "+ err);
            reject(err);
         }
         else{
            logger("removing all bookmarks successfully");
            resolve(numRemoved);
         }
      })
   });
}

function removeBM(name, label){
   return new Promise(function (resolve, reject) {
   });
}

function updateBM(){
    
}

module.exports ={
   addBM: addBM,
   getAllBMs: getAllBMs,
   removeAllBMs: removeAllBMs
};