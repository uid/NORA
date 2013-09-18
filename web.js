(function() {
	var app, everyone, express, http, httpserver, httpapp, nowjs;
    fileSys = require('fs');
    
    express = require('express');

	http = require('http');

	app = express();
    
	httpserver = http.createServer(app);

//	httpserver.listen(8080);
//    httpserver.listen(3000);
    httpserver.listen(3369);
	nowjs = require('now');
    
	everyone = nowjs.initialize(httpserver);

	app.configure(function() {
		return app.use(express["static"](__dirname + '/static/'));
	});
    
    var source = "Malcolm Gladwell:";
        //'Martin Luther King, Jr. "Letter from Birmingham Jail":';
    var excerpt = "There is no direct way to measure the quality of an institution—how well a college manages to inform, inspire, and challenge its students. So the U.S. News algorithm relies instead on proxies for quality—and the proxies for educational quality turn out to be flimsy at best." 
//        "Be not afraid of greatness. Some are born great, some achieve greatness, and some have greatness thrust upon ‘em."
        //"We must come to see that human progress never rolls in on wheels of inevitability. It comes through the tireless efforts and persistent work of men willing to be coworkers with God, and without this hard work time itself becomes an ally of the forces of social stagnation.";
    var hints = ["Is your language new and different from the original?", "Is your structure different from the original?", "Do you capture the meaning of the original passage?"];
    var tags = {language: "Is the language sufficiently new and original?", structure: "Does the structure convey the idea from the source in the writers' own words?", meaning: "Does the paraphrase accurately reflect the meaning of the original passage?"};
    var paraphrases = ['Malcolm Gladwell argues that the quality of a college—how well it educates, challenges, and inspires its students—cannot be measured directly. For this reason, he thinks that U.S. News’ algorithm’s reliance on proxies to measure educational quality yields results that are “flimsy at best.”', 'Gladwell argues that the proxies that U.S. News uses to measure a college’s quality are insufficient because educational quality cannot really be measured.'];
//        ["Don't fear greatness. Either you were born great, you will achieve greatness, or it will be forced onto you.", "Anyone can become great.", "Some people are born into a prosperous family or fortunate situation, some work hard to achieve success, while others become successful through sheer luck."];
        //["We need to understand that progress doesn't necessarily come on its own. Human progress arrives when people work with God, and if they don't, time works against them to prevent progress.", "According to Martin Luther King, Jr., time can do two things: if people do God's work, then time will promote progress, but if they don't, time makes things static.", "Martin Luther King Jr. argues that progress is the direct result of human action toward a moral goal, that without this action societal change will not occur, and that we misunderstand progress when we imagine it as a self-propelled force."];
    var msgIDCounter = 0;
    
    var hintNum = 0; //keeps track which hint to give next in the hint area on the generate page from the hints array
    
    var log = []; //keeps track of every action taken (for help in reloading page as well as a record for teacher)
    
    var games = {}; 
    // gameID is key
    // each game keeps track of usersingame{}, messagesingame{}, and paraphrasesingame{}
        // usersingame{username: [password, scoreInGame, paraphraseInGame, messagesByUserInGame[msgIDs], msgsLikedByUserInGame[msgIDs] ]}  
        // messagesingame{msgID: [paraphrase, message, tag, likes, selectedText, username]}
        // paraphrasesingame [] where order is the order in game where first ones are the examples provided by teacher       
    var usersInGame = {'denzil':['denzil',[]]};
    //username is key
        //[password, [listofGamesUserIsIn] ]
    
    nowjs.on("connect", function(){
        return this.now.loadMessages(source, excerpt, tags, hints, paraphrases);
    });

//  *************************************************  rightCol stage *************************************************
    var logString = "";
    
    everyone.now.logCSV = function() {
        for (each in log) {
            var parameter = log[each];
            logString = parameter.join(",")+ "\n" +logString + "\n";
        }
        fileSys.writeFileSync("log.csv", logString);
    }
    
    everyone.now.serverLikeMsg = function(username, gameID, msgID) { //*
//        console.log(games);
//        console.log( "msgID "+msgID);
        var currentLikes = games[gameID][1][msgID][3];
        currentLikes += 1;
        games[gameID][1][msgID][3] = currentLikes; //updated number of likes for this message
        
        //need to add this msgID to the list of messages this user has liked
        var msgsLiked = games[gameID][0][username][4];
        msgsLiked.push(msgID);
        games[gameID][0][username][4] = msgsLiked;
        
        //need to update score of the user whose message has been liked
        var whichUser = games[gameID][1][msgID][5];
        //add ten points to that users' score
        var currentScore = parseInt(games[gameID][0][username][1]);
        currentScore += 10;
        games[gameID][0][username][1] = currentScore;
        
        var parameter = [username, gameID, "liked message", msgID];
        log.push(parameter);
        
        return everyone.now.updateLikes(username, gameID, msgID, whichUser, currentScore);
    }
    
    everyone.now.serverDislikeMsg = function(username, gameID, msgID) { //*
        var currentLikes = games[gameID][1][msgID][3];
        currentLikes -= 1;
        games[gameID][1][msgID][3] = currentLikes; //updated number of likes for this message
        
        //need to update score of the user whose message has been liked
        var whichUser = games[gameID][1][msgID][5];
        //subtract ten points to that users' score
        var currentScore = parseInt(games[gameID][0][username][1]);
        currentScore -= 10;
        games[gameID][0][username][1] = currentScore;
        
        //need to remove this msgID from the list of messages this user has liked
        var msgsLiked = games[gameID][0][username][4];
        var index = msgsLiked.indexOf(msgID);
        if (index > -1) {
            msgsLiked.splice(index, 1);
        }
        games[gameID][0][username][4] = msgsLiked;
        
        var parameter = ["unliked a message", msgID];
        log.push(parameter);
        
        return everyone.now.updateDislikes(username, gameID, msgID, whichUser, currentScore);
    }

    everyone.now.serverGotNewChat = function(username, gameID, chatMessage, tag, paraphrase, selectedText) { //*
        //update messages made by this user in this game
        //is paraphrase 0 indexed or 1 indexed? 1 indexed
        var msgID = username+"_p"+paraphrase+"m"+msgIDCounter;
        msgIDCounter += 1;
        games[gameID][0][username][3].push(msgID);
        
        //add message to messagesingame
        games[gameID][1][msgID] = [paraphrase, chatMessage, tag, 0, selectedText, username];
        
        var messages = games[gameID][1];//messages in this game
        
        var msgNum = 0;
        for(each in messages) {
            if(messages[each][0] == paraphrase) {
                msgNum += 1;
            }
        }
        
        var parameter = [username, gameID, "got new comment", chatMessage, tag, msgID, paraphrase, selectedText];
        log.push(parameter);
        
		return everyone.now.gotNewChat(username, gameID, chatMessage, tag, msgID, paraphrase, selectedText, 0, msgNum);
	};
    
    everyone.now.serverAddMsg = function(username, gameID, msg_id, chatText) {  //*      
        //this message has been added to msg_id
        
        var msgID = username+"_f"+msgIDCounter;
        msgIDCounter += 1;
        
        games[gameID][0][username][3].push(msgID);
        games[gameID][1][msgID] = ["followup to "+msg_id, chatText, "", 0, "", username];
            
        var parameter = [username, gameID, "added followup", msgID, msg_id, chatText, 0];
        log.push(parameter);
        return everyone.now.addMsg(username, gameID, msgID, msg_id, chatText, 0);
    }
    
    everyone.now.serverMergeThread = function (username, gameID, threadSource, threadTarget) {//*
        //add ten points to the threadSource user
        var msgID = threadSource.substring(2);
        var whichUser = games[gameID][1][msgID][5];
        var totalScore = parseInt(games[gameID][0][whichUser][1])+parseInt(10);
        games[gameID][0][whichUser][1] = totalScore;
        
        
        var parameter = [username, gameID, "merged threads", threadSource, threadTarget];
        log.push(parameter);
        return everyone.now.mergeThread(username, gameID, threadSource, threadTarget, whichUser, totalScore);
    }
    
//  *************************************************  paraphrase stage *************************************************
    
    everyone.now.getParaphraseServer = function(gameID, num) {
        var para = games[gameID][2][num];
        //passing tags too for firstChats Comment box
        return this.now.fillInParaphrase(para, num, tags);
    }
    
    everyone.now.serverFirstTime = function(username, gameID, paraphraseGame) {
         var parameter = [username, gameID, "wrote first comments", paraphraseGame];
        log.push(parameter);
    }
    
//  *************************************************  generate stage *************************************************
    
    everyone.now.loadParaphrasesServer = function(gameID) { //*
        var paraphrasesInGame = games[gameID][2];//dictionary of paraphrases
        return this.now.loadParaphrases(gameID, tags, paraphrasesInGame);
    }
    
    everyone.now.addParaphraseServer = function(username, gameID, paraphrase) {//*
        
        if(gameID.toLowerCase().substring(0,4) != "beta") {
            //add paraphrase to server for this game
            var paraphrasesinthisGame = games[gameID][2];
            paraphrasesinthisGame.push(paraphrase);
            games[gameID][2] = paraphrasesinthisGame;
            
            //add paraphrase to user
            games[gameID][0][username][2] = paraphrase;
            return everyone.now.addParaphrase(username, gameID, paraphrase);
        }
    }
    
    everyone.now.loadEverythingServer = function(username, gameID) {

        return this.now.loadEverything(username, gameID, usersInGame, games, tags, games[gameID][2], log);
    }
    
    
    everyone.now.addHintServer = function() {
        //changes the hint in the hint area and systematically goes through all the hints in hints array.
        var hint = hints[hintNum];
        hintNum += 1;
        if (hintNum > (hints.length-1))
            hintNum = 0;
        return this.now.addHint(hint);
    }
    
    everyone.now.addScoreServer = function (username, gameID, scoreAdd) {//*
        //scoreAdd must be a string.
        var score = scoreAdd;
        var neg = false;
        if(scoreAdd.substring(0,1) == "-") {
            score = parseInt(scoreAdd.substring(1));
            neg = true;
        }
        else {
            score = parseInt(scoreAdd);
        }
        var totalScore;
        if (neg)
            totalScore = parseInt(games[gameID][0][username][1])-parseInt(scoreAdd);
        else
            totalScore = parseInt(games[gameID][0][username][1])+parseInt(scoreAdd);
        games[gameID][0][username][1] = totalScore;
        return everyone.now.newScore(username, gameID, totalScore);
    }
        
    
//  *************************************************  login stage *************************************************
    
        
    everyone.now.loginServer = function(username, password, gameID) {
        if (username in usersInGame) {
            if(usersInGame[username][0] == password) {
                //password matches
                console.log(username);
                var usersScoreInGame = 0;
                var userParaphraseInGame = "";
                if (gameID in games) {
                    //means game is existing. 
                    usersInGame = games[gameID][0];
                    msgsInGame = games[gameID][1];
                    paraphrasesInGame = games[gameID][2];
                    //Need to check if user has been in this game before
                    if (username in games[gameID][0]) {
                       //user has been in game before
                        usersScoreInGame = games[gameID][0][username][1];
                        userParaphraseInGame = games[gameID][0][username][2];
                    }
                    else {
                        //user has not been in game before which means user must still need to create a paraphrase
                        //users score in game must be 0 then
                        //need to add user to game
                        games[gameID][0][username] = [password, usersScoreInGame, userParaphraseInGame, [], [] ];
                    }
                }
                else {
                    //game does not exist and  user must still need to create a paraphrase
                    var copyParaphrases = [];  
                    for(i=0; i<paraphrases.length; i++) {
                        copyParaphrases.push(paraphrases[i]);
                    }
                    games[gameID] = [{},{},{}];
                    games[gameID][0][username] = [password, usersScoreInGame, userParaphraseInGame, [], [] ];
                    games[gameID][1] = {};
                    games[gameID][2] =copyParaphrases;
                }
                
                if(gameID.toLowerCase().substring(0,4) == "beta") //in tutorial mode so no extra paraprhases
                    return this.now.paraphraseStage(username, gameID, usersScoreInGame);
                else if (userParaphraseInGame == "") //user has not created paraphrase for game because just joining game or created new game session //score must be 0
                    return this.now.loginUser(username, gameID);
                else //user has been in game before and has created paraphrase before //user score is not 0
                    return this.now.paraphraseStage(username, gameID, usersScoreInGame);                    
                
            }
            else {
                return this.now.wrongPassword();
            }
        }
        else {
            //means user is given choice to create new username with this password by clicking new user
            return this.now.usernameNotExists();
        }
    }
    
    everyone.now.newuserServer = function(username, password, gameID) {
        console.log(username);
        if (username in usersInGame) //means user must choose a new username
            return this.now.usernameExists();
        else {
            usersInGame[username] = [password, [gameID]];
            //game exists already
            if(gameID in games) {
                //add user to current gameID's list of users
                
                    //usersingame{username: [password, scoreInGame, paraphraseInGame, messagesByUserInGame[msgIDs], msgsLikedByUserInGame[msgIDs] ]}  
                games[gameID][0][username] = [password, 0, "", [], []];
            }   
            //game doesn't exist already
            else {
                //create new game with this gameID key and value of an array of a list of users including this user and a blank list of messages.
                var users = {};
                users[username] = [password, 0, "", [], []];
                var messages = {};
                var copyParaphrases = [];
                for(i=0; i<paraphrases.length; i++) {
                    copyParaphrases.push(paraphrases[i]);
                }
                games[gameID] = [users, messages, copyParaphrases];                
            }
            if(gameID.toLowerCase().substring(0, 4) == "beta") //in tutorial mode so no extra paraprhases
                    return this.now.paraphraseStage(username, gameID, 0);
            else//pass back username, password, gameID, whether this is a new game or not, the users in the game and the messages in the game so far
                return this.now.newUser(username, gameID);
        }
    }
    
//  *************************************************  teacher page *************************************************
    
    everyone.now.submitTeacherServer = function(s, e, t, h, ex) {
    //s and e are strings. t is an associative array with tag names as keys and tag descriptions as values. ex and h are arrays.
        source = s;
        excerpt = e;
        tags = t;
        hints = h;
        paraphrases = ex;
    }
    
}).call(this);
