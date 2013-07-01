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

    var users = 0; 
    var numReady = 0;
    var numReadyES = 0;
    var sentence = 0;
    var msgNum = -1;
    var messages = new Array();
    var maxYPos = 0;
    var maxSentences;
    
    everyone.now.serverNumMaxSentences = function(numSentences) {
       maxSentences = numSentences;
    }
    
	everyone.now.serverGotNewChat = function(chatMessage, tag, msgID, selectedText)    {
        msgNum += 1;
        var parameter = ["gnc", chatMessage, tag, msgID, sentence, selectedText, msgNum];
        messages.push(parameter);
		return everyone.now.gotNewChat(chatMessage, tag, msgID, sentence, selectedText, msgNum);
	};

	everyone.now.serverMoveMsg = function(id, pos) {
        var parameter = ["mm", id, pos];
        messages.push(parameter);
        var newY = pos.top;
        if (newY > maxYPos) maxYPos = newY;
		return everyone.now.moveMsg(id, pos);
	}
    
    everyone.now.serverMergeThread = function (threadSource, threadTarget) {
        var parameter = ["mt", threadSource, threadTarget];
        messages.push(parameter);
        return everyone.now.mergeThread(threadSource, threadTarget);
    }
    
    nowjs.on("connect", function(){
        users+=1;
        return this.now.loadMessages(messages, sentence);
    });
    
    everyone.on("disconnect", function(){
        users -=1;
    });
    
    everyone.now.nextSentenceServer = function() {
        return everyone.now.nextSentence(users, numReady);
    }
    
    everyone.now.endSessionServer = function() {
        return everyone.now.endSession(users, numReadyES);
    }
    
    everyone.now.incrementUsersReady = function() {
        numReady +=1;
    }
    
    everyone.now.incrementUsersReadyES = function() {
        numReadyES +=1;
    }
    
    everyone.now.updateServerES = function() {
        messages = new Array();
        numReadyES = 0;
        msgNum = 0;
        return everyone.now.updateES(sentence);
    }
    
    everyone.now.reinitializeServer = function() {
        sentence = 0;
        return everyone.now.reinitializeES();
    }

    everyone.now.updateServer = function() {
        numReady = 0;
        sentence+=1;
        height = maxYPos;
        maxYPos = 0;
        messages.push(["nmd", sentence, height])
        return everyone.now.updateSentence(sentence, height, maxSentences);
    }

    everyone.now.serverLikeMsg = function(msgID) {
        //msgID is the number id of the message that has been liked
        var parameter = ["ul", msgID];
        messages.push(parameter);
        return everyone.now.updateLikes(msgID);
    }
    
    everyone.now.serverAddMsg = function(msgID, chatText) {
        //msgID is the number id of the message that has been liked
        var parameter = ["am", msgID, chatText];
        messages.push(parameter);
        return everyone.now.addMsg(msgID, chatText);
    }
    
    everyone.now.serverDragMsg = function(msgID) {
        //msgID is the number id of the message that has been liked
        var parameter = ["dm", msgID];
        messages.push(parameter);
        return everyone.now.dragMsg(msgID);
    }
    
    everyone.now.serverChangeText = function(text) {
        //text is the new text the person wants to review
        var parameter = ["ct", text];
        messages.push(parameter);
        everyone.now.changeText(text);
    }
    
    everyone.now.serverLastSentence = function() {
        var parameter = ["ls", maxSentences];
        messages.push(parameter);
        everyone.now.lastSentence(maxSentences);
    }
}).call(this);
