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
    var source = "blah blah";
    var excerpt = "blah blah blah blah";
    var paraphrases = ['a', 'b', 'c'];
    
    var burkeS = "Kenneth Burke’s “Definition of Man”:";
    var burkeE = "You persuade a man only insofar as you can talk his language by speech, gesture, tonality, order, image, attitude, idea, identifying your ways with his. Persuasion by flattery is but a special case of persuasion in general. But flattery can safely serve as our paradigm if we systematically widen its meaning, to see behind it the conditions of identification or consubstantiality in general (Burke 55).";
    var obamaS = "Obama’s “A More Perfect Union”:";
    var obamaE = "I chose to run for President at this moment in history because I believe deeply that we cannot solve the challenges of our time unless we solve them together, unless we perfect our union by understanding that we may have different stories, but we hold common hopes; that we may not look the same and may not have come from the same place, but we all want to move in the same direction: towards a better future for our children and our grandchildren.";
    
    var hints = ["Is your language new and different from the original?", "Is your structure different from the original?", "Do you capture the meaning of the original passage?"];
//     var tags = {grammar: "Does it follow the rules of the language (e.g., subject-verb-agreement, tense, etc.)?", meaning: "Is the meaning/story of the passage clear?", style: "Is the vocabulary/word-choice appropriate in order to convey the author's intended meaning?"};
//    var tags  = {1: '¿Qué representa el viento (wind) en la película?', 2:'¿Qué papel (role) desempeñan (play) las madres en la película?' , 3: '¿Qué papel desempeñan los personajes masculinos?', 4:'¿Por qué se llama la película Volver?'}
    var essay = ['¿Qué representa el viento (wind) en la película?', '¿Qué papel (role) desempeñan (play) las madres en la película?', '¿Qué papel desempeñan los personajes masculinos?', '¿Por qué se llama la película Volver?'];
    var tags = {language: "Is the language sufficiently new and original?", structure: "Does the structure convey the idea from the source in the writers' own words?", meaning: "Does the paraphrase accurately reflect the meaning of the original passage?"};
//    var paraphrases = ['Malcolm Gladwell argues that the quality of a college—how well it educates, challenges, and inspires its students—cannot be measured directly. For this reason, he thinks that U.S. News’ algorithm’s reliance on proxies to measure educational quality yields results that are “flimsy at best.”', 'Gladwell argues that the proxies that U.S. News uses to measure a college’s quality are insufficient because educational quality cannot really be measured.'];
    var burke = ['<b>Paraphrase 1 </b><br> We convince other people by being able to speak in the same ways that they do; for instance, by using identical kinds of words and images, sentence structures, tone of voice, hand movements, etc. Flattery is one specific way to gain accord, but it reveals the pattern of persuasion more widely, showing how others come to identify and agree with us.', '<b>Paraphrase 2 </b><br> For Kenneth Burke, all persuasion is just flattery, and he believes that we only agree with each other and do what others want when they specifically mirror our ways of acting, thinking, and talking.', '<b>Paraphrase 3 </b><br> Kenneth Burke’s theory of identification suggests that persuasion functions through systems of similarity that a speaker creates with the audience, and that this identification is similar in kind, if not in extent, to flattery, which can function as a model. When a speaker actively chooses ways of speaking—phrasing, figures of speech, lines of thought—that align with those of the audience, the audience sees themselves as sharing an identity with the speaker, and thus can be convinced.'];
    var obama = ['<b>Paraphrase 1 </b><br> Obama decided to run for President at this time due to his belief that Americans need to work together to solve challenges, and while we have differences in background, identity, and narratives, we have the same hopes and want the same future for the next generation.', '<b>Paraphrase 2 </b><br> Obama presents himself as a problem solver who can unite all Americans no matter how disparate in background, region, or ethnicity and thus create the perfect America that everyone wants.', '<b>Paraphrase 3 </b><br> While recognizing the many kinds of differences—in identity, region, and history—that divide Americans, Obama foregrounds his faith in the need for a united approach to problem solving as the reason for his candidacy.'];
    
    
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
    var usersInGame = {'denzil':['',[]]};
    //username is key
        //[password, [listofGamesUserIsIn] ]
    
    nowjs.on("connect", function(){
        return this.now.loadMessages(source, excerpt, tags, hints, paraphrases);
    });
    var logIndex = 1;
//  *************************************************  rightCol stage *************************************************
    var logString = "";
//    var deploy = fileSys.readFileSync("deployment.csv", 'utf8');
////    fileSys.readFile('deployment.csv', function (err, data) {
////      if (err) throw err;
////      var lines = data.trim().split('\n');
////        var lastLine = lines.slice(-1)[0];
////      console.log(lines);
////    });
////  console.log("here ");
//    var lines = deploy.trim().split('\n');
//    console.log("line "+lines[0]);
//    for (each in lines) {
//        var parameter = lines[each].split(',');
////        console.log(parameter);
//        log.push(parameter);
//    }
//    
    everyone.now.logCSV = function() {
        for (each in log) {
            var parameter = log[each];
            logString = parameter.join(",")+ "\n" +logString + "\n";
        }
        fileSys.writeFileSync("log"+logIndex+".csv", logString);
        logIndex = logIndex + 1;
    }
    
    everyone.now.serverMovedMsg = function (username, gameID, msgID, pos) {
        var parameter = [username, gameID, "moved message", msgID, pos];
        log.push(parameter);
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

    everyone.now.serverRemoveItem = function(username, gameID, item) {
        var parameter = [username, gameID, "remove item", item];
        log.push(parameter);
    }
    
    everyone.now.serverGotNewChat = function(username, gameID, chatMessage, tag, paraphrase, selectedText, numLikes) { //*
        //update messages made by this user in this game
        //is paraphrase 0 indexed or 1 indexed? 1 indexed
        var msgID = username+"_p"+paraphrase+"m"+msgIDCounter;
        msgIDCounter += 1;
        games[gameID][0][username][3].push(msgID);
        
        //add message to messagesingame
        games[gameID][1][msgID] = [paraphrase, chatMessage, tag, numLikes, selectedText, username];
        
        var messages = games[gameID][1];//messages in this game
        
        var msgNum = 0;
        for(each in messages) {
            if(messages[each][0] == paraphrase) {
                msgNum += 1;
            }
        }
        
        var parameter = [username, gameID, "got new comment", chatMessage, tag, msgID, paraphrase, selectedText];
        log.push(parameter);
        
		return everyone.now.gotNewChat(username, gameID, chatMessage, tag, msgID, paraphrase, selectedText, numLikes, msgNum);
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
    
    everyone.now.serverMergeThread = function (username, gameID, msgSource, threadTarget) {//*
        //add ten points to the threadSource user
//        var msgID = msgSource.substring(3);
//        var whichUser = games[gameID][1][msgID][5];
//        var totalScore = parseInt(games[gameID][0][whichUser][1])+parseInt(10);
//        games[gameID][0][whichUser][1] = totalScore;
        
        
        var parameter = [username, gameID, "merged threads", msgSource, threadTarget];
        log.push(parameter);
        return everyone.now.mergeThread(username, gameID, msgSource, threadTarget);
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
        
        if(gameID.toLowerCase().substring(0,7) != "spanish") {
            //add paraphrase to server for this game
            var paraphrasesinthisGame = games[gameID][2];
            var count = paraphrasesinthisGame.length+1;
            var newParaphrase = '<b>Paraphrase '+count+' </b><br>'+paraphrase;
            paraphrasesinthisGame.push(newParaphrase);
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
                console.log(gameID);
                var usersScoreInGame = 0;
                var userParaphraseInGame = "";
                var s = "";
                var e = "";
                if(gameID.toLowerCase().substring(0, 5) == "burke") {
                    s= burkeS;
                    e= burkeE;
                }
                else if(gameID.toLowerCase().substring(0, 7) == "spanish") {
                    s= '';//"Boehner and the Democrats";
                    e = "";
                }
                else {
                    s= obamaS;
                    e= obamaE;
                }

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
                    var s = "";
                    var e = "";
                    if(gameID.toLowerCase().substring(0, 5) == "burke") {
                        var copyParaphrases = [];
                        for(i=0; i<burke.length; i++) {
                            copyParaphrases.push(burke[i]);
                        }
                        s= burkeS;
                        e= burkeE;
                    }
                    else if(gameID.toLowerCase().substring(0, 7) == "spanish") {
                        var copyParaphrases = [];
                        for(i=0; i<essay.length; i++) {
                            copyParaphrases.push(essay[i]);
                        }
                        s= '';//"Boehner and the Democrats"
                    }
                    else {
                        var copyParaphrases = [];
                        for(i=0; i<obama.length; i++) {
                            copyParaphrases.push(obama[i]);
                        }
                        s= obamaS;
                        e= obamaE;
                    }

                    games[gameID] = [{},{},{}];
                    games[gameID][0][username] = [password, usersScoreInGame, userParaphraseInGame, [], [] ];
                    games[gameID][1] = {};
                    games[gameID][2] =copyParaphrases;
                }
                
                if(gameID.toLowerCase().substring(0,7) == "spanish") //in tutorial mode so no extra paraprhases
                    return this.now.paraphraseStage(username, gameID, usersScoreInGame, s, e);
                else if (userParaphraseInGame == "") //user has not created paraphrase for game because just joining game or created new game session //score must be 0
                    return this.now.loginUser(username, gameID, s, e);
                else //user has been in game before and has created paraphrase before //user score is not 0
                    return this.now.paraphraseStage(username, gameID, usersScoreInGame, s, e);                    
                
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
        console.log(gameID);
        if (username in usersInGame) //means user must choose a new username
            return this.now.usernameExists();
        else {
            var s = "";
            var e = "";
            if(gameID.toLowerCase().substring(0, 5) == "burke") {
                s= burkeS;
                e= burkeE;
            }
            else if(gameID.toLowerCase().substring(0, 7) == "spanish") {
                s= "";
                e = "";
            }
            else {
                s= obamaS;
                e= obamaE;
            }
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
                if(gameID.toLowerCase().substring(0, 5) == "burke") {
                    var copyParaphrases = [];
                    for(i=0; i<burke.length; i++) {
                        copyParaphrases.push(burke[i]);
                    }
                    s= burkeS;
                    e= burkeE;
                }
                else if(gameID.toLowerCase().substring(0, 7) == "spanish") {
                    var copyParaphrases = [];
                    for(i=0; i<essay.length; i++) {
                        copyParaphrases.push(essay[i]);
                    }
                }
                else {
                    var copyParaphrases = [];
                    for(i=0; i<obama.length; i++) {
                        copyParaphrases.push(obama[i]);
                    }
                    s= obamaS;
                    e= obamaE;
                }
                games[gameID] = [users, messages, copyParaphrases];                
            }
            if(gameID.toLowerCase().substring(0, 7) == "spanish") //in tutorial mode so no extra paraprhases
                    return this.now.paraphraseStage(username, gameID, 0, s, e);
            else//pass back username, password, gameID, whether this is a new game or not, the users in the game and the messages in the game so far
                return this.now.newUser(username, gameID, s, e);
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
