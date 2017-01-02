/**
 * Created by qeesung on 2017/1/2.
 */

var should = require('should');
var store = require('../lib/store');
var config = require('../lib/config');
var Promsie = require('bluebird');

describe('add bookmarks', function() {

    beforeEach(function(done) {
        store.removeAllBMs().then(function () {
            done();
        },function () {
            done();
        });
    });
    
    afterEach(function (done) {
        store.removeAllBMs().then(function () {
            done();
        });
    });

    it("database should be empty before insert", function (done) {
        store.getAllBMs().then(function (bookmarks) {
            (bookmarks === undefined).should.be.true;
            done();
        });
    });

    it("add a exists directory bookmark with 'default' label should be success", function (done) {
        store.addBM("book1", config.getUserHome()).then(function (data) {
            delete data._id;
            (data !== null).should.be.true;
            data.should.deepEqual({
                name: "book1",
                path: config.getUserHome(),
                label: 'default'
            });
            done();
        });
    });
    
    it("add a exists directory bookmark with specific label should be success", function (done) {
        store.addBM("book1", config.getUserHome(), 'label1').then(function (data) {
            delete data._id;
            (data !== null).should.be.true;
            data.should.deepEqual({
                name: "book1",
                path: config.getUserHome(),
                label: 'label1'
            });
            done();
        });
    });
    
    it("add a not exists directory bookmark should be failed", function (done) {
        store.addBM("book1", "/a/b/c").then(function (data) {
            (data === null).should.be.true;
            done();
        }, function (err) {
            (err !== null).should.be.true;
            done();
        });
    });
});

describe("remove all bookmarks", function () {

    var count = 10;
    beforeEach(function(done) {
        var tasks = [];
        for(var i = 0 ; i < count; ++i){
            tasks.push(store.addBM("book"+i,config.getUserHome(), "label"+i));
        }
        Promsie.all(tasks).then(function () {
            done(); 
        });
    });
    
    afterEach(function (done) {
        store.removeAllBMs().then(function () {
            done();
        });
    });
   
    it("before remove there should have "+count+" bookmarks",function (done) {
        store.getAllBMs().then(function (bookmarks) {
            bookmarks.length.should.equal(count);
            done();
        });
    });
    
    it("remove all bookmarks", function (done) {
        store.removeAllBMs().then(function (numRemoved) {
            numRemoved.should.equal(10);
            done();
        });
    });
    
    it("after remove all bookmarks, store should be empty",function (done) {
        store.removeAllBMs().then(function () {
            store.getAllBMs().then(function (data) {
                (data === undefined).should.be.true;
                done();
            });
        });
    });
});

describe("remove bookmarks with name and label", function () {
    var count = 10;
    beforeEach(function (done) {
        var tasks = [];  
        for (var i = 1; i<= count; ++i ){
            tasks.push(store.addBM("bookmark"+i,config.getUserHome(),"LABEL"+(i%3)));
        }
        /**
         * label1: 1,4,7,10
         * label2: 2,5,8
         * label3: 3,6,9
         */
        Promsie.all(tasks).then(function () {
            done();
        });
    });
    
    afterEach(function (done) {
        store.removeAllBMs().then(function () {
            done();
        });  
    });
    
    it("remove bookmark with specific label and name should work well", function (done) {
        var labelName = 'LABEL1';
        var markName = 'bookmark1';
        store.removeBM(labelName, markName).then(function (numRemoved) {
            numRemoved.should.equal(1);
            store.queryBM(labelName, markName).then(function (bookmarks) {
                (bookmarks === undefined).should.be.true;
                done();
            });
        });
    });
    
    it("remove bookmark only with specific label should remove all bookmarks under label", function (done) {
        var labelName = 'LABEL1';
        var shouldRemoveNum = parseInt(count/3)+count%3;
        store.removeBM(labelName).then(function (numRemoved) {
            numRemoved.should.equal(shouldRemoveNum);
            var queryTasks =[];
            queryTasks.push(store.queryBM(labelName).then(function (bookmarks) {
                (bookmarks === undefined).should.be.true;
            }));
            
            queryTasks.push(store.getAllBMs().then(function (bookmarks) {
                bookmarks.length.should.equal(count - shouldRemoveNum);
                bookmarks.forEach(function (bookmark) { // ensure bookmarks without removed label
                    bookmark.label.should.not.equal(labelName);
                });
            }));
            
            Promise.all(queryTasks).then(function () {
                done();
            });
        });
    });
    
    it("remove bookmark only with specific name should only remove the bookmark with the name", function (done) {
        var name = "bookmark1";
        store.removeBM(null, name).then(function (numRemoved) {
            numRemoved.should.equal(1);
            var queryTasks = [];
            queryTasks.push(store.queryBM(null, name).then(function (bookmark) {
                (bookmark == undefined).should.be.true;
            }));
            
            queryTasks.push(store.getAllBMs().then(function (bookmarks) {
                bookmarks.length.should.equal(9);
                bookmarks.forEach(function (bookmark) {
                    bookmark.name.should.not.equal(name);
                });
            }));
            
            Promsie.all(queryTasks).then(function () {
                done();
            });
        });
    });
   
    it("remove bookmark do not use specific name and label should remove nothing", function (done) {
        store.removeBM().then(function (numRemoved) {
           numRemoved.should.equal(0);
            var queryTasks = [];
            queryTasks.push(store.getAllBMs().then(function (bookmarks) {
                bookmarks.length.should.equal(10);
                done();
            }));
        });
    });
});

describe("query bookmarks with  name and label",function () {
    var count = 10;
    beforeEach(function (done) {
        var tasks = [];
        for (var i = 1; i<= count; ++i ){
            tasks.push(store.addBM("bookmark"+i,config.getUserHome(),"LABEL"+(i%3)));
        }
        /**
         * label1: 1,4,7,10
         * label2: 2,5,8
         * label3: 3,6,9
         */
        Promsie.all(tasks).then(function () {
            done();
        });
    });

    afterEach(function (done) {
        store.removeAllBMs().then(function () {
            done();
        });
    });
    
    it("query bookmarks with specific name and label should only return an array contains one item", function (done) {
        var labelName = 'LABEL1';
        var markName = 'bookmark1';
        store.queryBM(labelName, markName).then(function (bookmark) {
            (bookmark != null).should.be.true;
            bookmark.length.should.equal(1);
            delete bookmark[0]._id;
            bookmark[0].should.deepEqual({
                name: markName,
                label: labelName,
                path: config.getUserHome()
            });
            done();
        });
    });
    
    it("query bookmarks with specific label should get a array that with label",function (done) {
        var labelName = 'LABEL1';
        var label1Count = parseInt(count/3)+count%3;
        store.queryBM(labelName).then(function (bookmarks) {
            bookmarks.length.should.equal(label1Count);
            bookmarks.forEach(function (bookmark) {
                bookmark.label.should.equal(labelName);
            });
            done();
        });
    });

    it("query bookmarks with specific name should only return a array contain one item", function (done) {
        var markName = 'bookmark1';
        store.queryBM(null, markName).then(function (bookmarks) {
            bookmarks.length.should.equal(1);
            bookmarks.forEach(function (bookmark) {
                bookmark.name.should.equal(markName);
            });
            done();
        });
    });
    
    it("query bookmarks without specific name and label should return empty array",function (done) {
        store.queryBM().then(function (bookmarks) {
            bookmarks.length.should.equal(0);
            done();
        });
    });
    
    it("query an not exists bookmark should return an empty array", function (done) {
        var queryTasks = [];
        queryTasks.push(store.queryBM('label4').then(function (bookmarks) {
            bookmarks.length.should.equal(0);
        }));
        queryTasks.push(store.queryBM(null, 'bookmark11').then(function (bookmarks) {
            bookmarks.length.should.equal(0);
        }));
        queryTasks.push(store.queryBM('label1', 'bookmark11').then(function (bookmarks) {
            bookmarks.length.should.equal(0);
        }));
        queryTasks.push(store.queryBM('label4', 'bookmark1').then(function (bookmarks) {
            bookmarks.length.should.equal(0);
        }));
        
        Promsie.all(queryTasks).then(function () {
            done();
        });
    });
});