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
      store.find({}).sort({label: 1}).exec(function (err, data) {
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

/**
 * remove bookmarks with condition
 * @param label bookmark label 
 * @param name bookmark name
 */
function removeBM(label, name){
   logger("removing bookmarks "+label+"-->"+name);
   return new Promise(function (resolve, reject) {
      var condition = {};
      if(label != null)
          condition.label = label;
      if(name != null)
          condition.name = name;
      if(condition.label == null && condition.name == null)
      {
         return resolve(0);
      }
      store.remove(condition, { multi: true },function (err, numRemoved) {
         if(err){
            logger("remove bookmarks "+label+"-->"+name+" failed");
            reject(err);
         }
         else{
            logger("remove bookmarks "+label+"-->"+name+" successfully");
            resolve(numRemoved);
         }
      });
   });
}

/**
 * query bookmarks with condition
 * @param label bookmark label
 * @param name bookmark name
 */
function queryBM(label, name){
   logger("querying bookmarks "+label+"-->"+name);
   return new Promise(function (resolve, reject) {
      var condition = {};
      if(label != null)
         condition.label = label;
      if(name != null)
         condition.name = name;
      if(condition.label == null && condition.name == null)
      {
         return resolve([]);
      }
      store.find(condition, function (err, bookmarks) {
         if(err) {
            logger("query bookmarks "+label+"-->"+name+" failed");
            reject(err);
         }
         else{
            logger("query bookmarks "+label+"-->"+name+" successfully");
            resolve(bookmarks);
         }
      });
   });
}

function updateBM(){
    
}

module.exports ={
   addBM: addBM,
   removeBM: removeBM,
   queryBM: queryBM,
   getAllBMs: getAllBMs,
   removeAllBMs: removeAllBMs
};