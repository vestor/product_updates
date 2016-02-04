'use strict';


var config = require('./config');
const Hapi = require('hapi');
const Inert = require('inert');
const Mongo = require('mongodb');

const server = new Hapi.Server();
server.connection({
    host: config.server.hostname,
    port: config.server.port
});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./index.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/refresh',
        handler: function (request, reply) {

            reply('Done');
        }
    });

    server.route({
        method: 'GET',
        path: '/insert',
        handler: function (request, reply) {
            reply.file('./insert_update.html')
        }
    });

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
          directory: {
              path: 'app/',
              redirectToSlash: true,
              index: true
          }
      }
  });



});

var io = require("socket.io")(server.listener);

io.on("connection", function (socket) {

	var maxid = 1;
	Mongo.connect('mongodb://' + config.mongodb.connection, function (err, db) {
        var collection = db.collection('announcements');
        collection.find().sort({ _id : -1 }).limit(10).toArray(function(err, docs) {
        	if(docs.length > 0)
        		maxid = docs[0].id;
	    	io.emit('dataset',docs);
	    	io.emit('maxid',maxid);
	    });
	});

	var update = function(announcement){return upsert(announcement,true);}
	var insert = function(announcement){return upsert(announcement,false);}

    var upsert = function(announcement,toUpdate){
    	delete announcement._id;
    	console.log("Called upsert with toUpdate " + toUpdate);

    	Mongo.connect('mongodb://' + config.mongodb.connection, function(err, db) {
		    if(err) throw err;
		    console.log(announcement);
		    db.collection('announcements').update({id : announcement.id},announcement, {w:1, upsert : true}, function(err) {
		      if (err)
		       console.warn(err.message);
		      else
		       console.log('successfully updated');
		    });
		    var collection = db.collection('announcements');
		    collection.find().sort({_id : -1 }).limit(10).toArray(function(err, docs){
		    	console.log("Emitting after insert");
		    	io.emit('dataset',docs);
		    	io.emit('maxid',maxid);
		    });
		    if(insert) {
		    	io.emit('newupdate',true);

		    }

		  });

    };

    var markAsRead = function(updateObj){
    	var idList = updateObj.idList;
    	var userId = updateObj.userId;
    	Mongo.connect('mongodb://' + config.mongodb.connection, function(err, db) {
    		if(err) throw err;
    		console.log(idList);
    		db.collection('announcements').update({id: {$in : idList } }, {$addToSet: {read : userId}},{multi : true},function(err){
    			if(err) throw err;
    			console.log("Successfully marked as read " + idList);
    		});
    	});
    }

    var recommend = function(updateObj){
    	var id = updateObj.id;
    	var userId = updateObj.userId;
    	var toRecommend = updateObj.toRecommend;
    	console.log("toRecommend " + toRecommend);
    	Mongo.connect('mongodb://' + config.mongodb.connection, function(err, db) {
    		if(err) throw err;
    		console.log(id);
    		if(toRecommend){
	    		db.collection('announcements').update({id: id}, {$addToSet: {hearts : userId}},{},function(err){
	    			if(err) throw err;
	    			console.log("Successfully marked as recommended " + id);
	    		});
	    	}else{
		    	db.collection('announcements').update({id: id}, {$pull: {hearts : userId}},{},function(err){
	    			if(err) throw err;
	    			console.log("Successfully removed as recommended " + id);
	    		});
		    }
		    db.collection('announcements').find().sort({_id : -1 }).limit(10).toArray(function(err, docs){
		    	io.emit('dataset',docs);
		    });
    	});
    }

    var loadMore = function(offset){
    	Mongo.connect('mongodb://' + config.mongodb.connection, function (err, db) {
	        var collection = db.collection('announcements');
	        collection.find().sort({ _id : -1 }).skip(offset).limit(10).toArray(function(err, docs) {
	        	console.log("Returning this data");
	        	console.log(docs);
		    	io.emit('moredata',docs);
		    });
		});
    }

    socket.on("update",update);
    socket.on("insert",insert);
    socket.on("markread",markAsRead);
    socket.on("recommend",recommend);
    socket.on("loadmore",loadMore);
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
