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
    var likes = {};
    var heights = {};
    var scroll = {};
    var msgs = {};
    msgs[sentence] = 0; //num of messages for this section
    heights[sentence] = 0;
    scroll[sentence] = 0;
    
    everyone.now.serverNumMaxSentences = function(numSentences) {
       maxSentences = numSentences;
    }
    
	everyone.now.serverGotNewChat = function(chatMessage, tag, msgID, selectedText, positive, constructive)    {
        msgNum += 1;
        likes[msgID] = 0;
        msgs[sentence] = msgs[sentence] + 1;
        console.log("pushed gnc");
        var parameter = ["gnc", chatMessage, tag, msgID, sentence, selectedText, msgs[sentence], positive, constructive];
        messages.push(parameter);
		return everyone.now.gotNewChat(chatMessage, tag, msgID, sentence, selectedText, msgs[sentence], likes[msgID], positive, constructive);
	};

	everyone.now.serverMoveMsg = function(id, pos) {
        //id includes '#'
        var parameter = ["mm", id, pos, msgNum];
        messages.push(parameter);
        var newY = pos.top;
        console.log("pushed mm");
        if (newY > maxYPos) maxYPos = newY;
		return everyone.now.moveMsg(id, pos, msgNum);
	}
    
    everyone.now.serverMergeThread = function (threadSource, threadTarget) {
        var parameter = ["mt", threadSource, threadTarget];
        console.log("pushed mt");
        messages.push(parameter);
        return everyone.now.mergeThread(threadSource, threadTarget);
    }
    
    nowjs.on("connect", function(){
        users +=1;
        return this.now.loadMessages(messages, sentence, likes);
    });
    
    everyone.on("disconnect", function(){
        users -=1;
    });
    
    everyone.now.nextSentenceServer = function() {
        return this.now.nextSentence(users, numReady);
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
        msgs[sentence] = 0;
        heights[sentence] = 0;
        scroll[sentence] = scroll[sentence - 1] + heights[sentence - 1];
        maxYPos = 0;
        console.log("pushed nmd");
//        console.log("section "+(sentence-1)+" height "+heights[sentence-1]+" last scroll "+scroll[sentence-1]+" next scroll "+scroll[sentence]);
        messages.push(["nmd", sentence, heights[sentence-1], scroll[sentence-1]])
        return everyone.now.updateSentence(sentence, heights[sentence-1], maxSentences, scroll[sentence-1]);
    }

    everyone.now.serverLikeMsg = function(msgID) {
        //msgID is the number id of the message that has been liked
        var parameter = ["ul", msgID];
        likes[msgID] = likes[msgID] + 1;
        console.log("pushed like msg");
        messages.push(parameter);
        return everyone.now.updateLikes(msgID);
    }
    
    everyone.now.serverDislikeMsg = function(msgID) {
        //msgID is the number id of the message that has been liked
        var parameter = ["ud", msgID];
        likes[msgID] = likes[msgID] - 1;
        console.log("pushed dislike msg");
        messages.push(parameter);
        return everyone.now.updateDislikes(msgID);
    }
    
    everyone.now.serverAddMsg = function(msgID, msg_id, chatText) {
        //msgID is the number id of the message that has been liked
        var parameter = ["am", msgID, msg_id, chatText];
        console.log("pushed am");
        messages.push(parameter);
        return everyone.now.addMsg(msgID, msg_id, chatText);
    }
    
    everyone.now.serverDragMsg = function(msgID, msgnumber, positive, constructive) {
        //msgID is the number id of the message that has been liked
        console.log(likes);
        console.log("msgID "+msgID);
        console.log("msgnumber"+msgnumber);
        console.log("pushed dm");
        var d = new Date();
        var msg_id = parseInt((d.getMonth()+d.getFullYear()+d.getTime()).toString());
        console.log("msg_id "+msgID);
        msgID = parseInt(msgID);
        var numLikes = likes[msgID];
        likes[msg_id] = likes[msgID];
        var parameter = ["dm", msgID, sentence, msgnumber, msg_id, numLikes, positive, constructive];
        messages.push(parameter);
        return everyone.now.dragMsg(msgID, sentence, msgnumber, msg_id, numLikes, positive, constructive);
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
    
    everyone.now.newMessageServer = function() {
        this.now.newMessage(sentence);
    }
    
    everyone.now.serverUpdateHeight = function(sentence, height) {
        if (height > heights[sentence]) heights[sentence] = height;
        console.log("section "+sentence+" height "+height);
    }
}).call(this);
