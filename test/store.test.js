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

describe("remove bookmarks", function () {

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

