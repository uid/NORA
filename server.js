(function() {
	var app, everyone, express, http, httpserver, nowjs, io;
    
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

	everyone.now.sendNewChat = function(chatMessage, tag, msg_id) {
		return everyone.now.gotNewChat(chatMessage, tag, msg_id);
	};

	everyone.now.serverMoveMsg = function(id, pos) {
		return everyone.now.moveMsg(id, pos);
	}

}).call(this);
