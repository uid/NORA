(function() {
	var app, everyone, express, http, httpserver, httpapp, nowjs;
    
    express = require('express');

	http = require('http');

	app = express();

	httpserver = http.createServer(app);

	httpserver.listen(8080);

	nowjs = require('now');

	everyone = nowjs.initialize(httpserver);

	app.configure(function() {
		return app.use(express["static"](__dirname + '/static/'));
	});

	everyone.now.sendNewChat = function(chatMessage, tag, msg_id, selectedText) {
		return everyone.now.gotNewChat(chatMessage, tag, msg_id, sentence, selectedText);
	};

	everyone.now.serverMoveMsg = function(id, pos) {
		return everyone.now.moveMsg(id, pos);
	}
    
    var users = 0; 
    var numReady = 0;
    var sentence = 0;
    everyone.on("connect", function(){
        users+=1;
        sentence = 0;
    });
    
    everyone.on("disconnect", function(){
        users -=1;
    });
    
    everyone.now.nextSentenceServer = function() {
        return everyone.now.nextSentence(users, numReady);
    }
    
    everyone.now.incrementUsersReady = function() {
        numReady +=1;
    }

    everyone.now.updateServer = function() {
        numReady = 0;
        return everyone.now.updateSentence(sentence);
    }
    
    everyone.now.updateSentenceNumServer = function(sentenceNum) {
        sentence = sentenceNum;
    }
}).call(this);
