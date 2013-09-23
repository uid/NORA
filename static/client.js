now.loadMessages = function(source, excerpt, tags, hints, examples) {
    //gets directly from server
    // source, excerpt, tags, hints, examples are all inputted by teacher on teacher page or come from default values in web.js
    if (document.title == "NORA Teacher") {
        //shows teachers the current values of the four variables in case she wants to change it.
        $('#sourceTeacher').val(source);
        $('#excerptTeacher').val(excerpt);
        
        var countHints = hints.length;
        for (var i=1; i<=countHints; i++) {    
            var key = $('#example'+i).val();    
            if (i>3){
                $('#hintsAdd').click();
            }
            $('#hint'+i).val(hints[i-1]);
        }   
        
        var countExamples = examples.length;
        for (var i=1; i<=countExamples; i++) {    
            var key = $('#example'+i).val();    
            if (i>3)
                $('#examplesAdd').click();
            $('#example'+i).val(examples[i-1]);
        }
              
        var i=1;
        for(key in tags) {
            if (i>3)
                $('#tagsAdd').click();
            $('#tag'+i).val(key);
            $('#description'+i).val(tags[key]);
            i++;
        }
    }
    
    else if(document.title == "NORA") {
//        $('#source').text(source);
//        $('#excerpt').text(excerpt);
    }
};

now.ready(function () { 
    
//  *************************************************  login stage *************************************************
    
    $('#login').click(function() {
        var username = $("#username").val();
        var gameID = $("#gameID").val();
        
        if(username == "" || gameID == "") {
            $('#loginError').html("Field cannot be left blank.");    
        }
        var password = "";//$("#password").val();
        now.loginServer(username, password, gameID);
    });

    $('#newuser').click(function() {
        var username = $("#username").val();
        var password = "";//$("#password").val();
        var gameID = $("#gameID").val();
        now.newuserServer(username, password, gameID);
    });                      
    
    now.loginUser = function (username, gameID, s, e) {
        //pass back username, password, gameID, the users in the game and the messages in the game so far and the usersMsgs in this game so far
        //username and password and gameID are strings. newGame is a boolean. users and msgs InGame are arrays.
        now.startup(username, gameID, s, e);      
    }

    now.newUser = function (username, gameID, s, e) {
        //pass back username, password, gameID, whether this is a new game or not, the users in the game and the messages in the game so far
        //username and password and gameID are strings. newGame is a boolean. users and msgs InGame are arrays.
        now.startup(username, gameID, s, e);
    }
    
    now.startup = function(username, gameID, s, e) {
        $('span#username').text(username);
        $('span#gameID').text(gameID);
        $('#loginContainer').css("display", "none");
        $('#hello').css("visibility", "visible");
        $('#source').text(s);
        $('#excerpt').text(e);
        $('#score').text("0");
        //write paraphrase instruction toast
        $('#writeParaphrase').fadeIn(400).delay(2000).fadeOut(400);
    }
    
    now.wrongPassword = function () {
        //username and password and gameID are strings
        //means user entered wrong password
        $('#loginError').html("You have entered the wrong password. Please try again.");
    }
    
    now.usernameExists = function () {
        //username and password and gameID are strings
        //means user must choose new username
        $('#loginError').html("This username already exists. <br> Please enter a new username and try again.");
    
    }
    
    now.usernameNotExists = function () {
        //username and password and gameID are strings
        //means user is given choice to create new username with this password by clicking new user
        $('#loginError').html("This username does not exist. If you would like to create an account with this username, press the button 'New User'");
    }

//  ************************************************* end login stage *************************************************
    
//  *************************************************  rightCol stage ****************************************************
    now.likeMsg = function(msgID) {
        var username = $('span#username').text();
        var gameID = $('span#gameID').text(); 
        if( $('#plusOne_'+msgID).css("background-color")=="rgb(220, 220, 220)") {
            $('#plusOne_'+msgID).css("background-color", "rgb(60, 200, 250)");
            var numLikes = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID))+1;
            $('span#numLikes_'+msgID).text('+ '+numLikes);           
            now.serverLikeMsg(username, gameID, msgID);
        }
        else {
            var numLikes = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID))-1;
            $('span#numLikes_'+msgID).text('+ '+numLikes);
            $('#plusOne_'+msgID).css("background-color", "rgb(220,220,220)");
            now.serverDislikeMsg(username, gameID, msgID);
        }
    }
    
    now.updateDislikes = function(username, gameID, msgID, whichUser, totalScore) {
        var myGameID = $('span#gameID').text();
        var myUsername = $('span#username').text();
        if(gameID == myGameID) {
            var prevLiked = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID));
            prevLiked -= 1;
            document.getElementById('msg_'+msgID).setAttribute('data-likes_'+msgID, prevLiked);
            var numLikes = $('#msg_'+msgID).attr('data-likes_'+msgID);
            $('span#numLikes_'+msgID).text('+ '+numLikes);
            if(myUsername == whichUser)
                now.newScore(whichUser, gameID, totalScore);
        }
    }
    
    now.updateLikes = function(username, gameID, msgID, whichUser, totalScore) {
        var myGameID = $('span#gameID').text();
        var myUsername = $('span#username').text();
        if(gameID == myGameID) {
            var prevLiked = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID));
            prevLiked += 1;
            document.getElementById('msg_'+msgID).setAttribute('data-likes_'+msgID, prevLiked);
            var numLikes = $('#msg_'+msgID).attr('data-likes_'+msgID);
            $('span#numLikes_'+msgID).text('+ '+numLikes);
            if(myUsername == whichUser)
                now.newScore(whichUser, gameID, totalScore);
        }
    }
    
    now.selecting = function(searching, msgID){
        if(searching != "" && typeof searching != "undefined") {
            var spanCoord = searching.split(',');
            var start = spanCoord[0];
            var end = spanCoord[1];
            var num = $('#chatbox').attr('data-paraphraseActive');
            var text = $('#paraphraseSelected').text();
            if(msgID.substring(0,10) == "tagSection") {
                var tagKey = document.getElementById(msgID).getAttribute('data-tag');
                var background = $('#'+tagKey).css('background-color');
                var count = msgID.substring(10);
                document.getElementById("attachButton"+count).style.background= background;
            }
            else
                var background = document.getElementById('msg_'+msgID).getAttribute('data-background');
            var selection = $('#paraphraseSelected').text().substring(start, end);
            $('#paraphraseSelected').empty();
            var startoftext = text.substring(0,start);
            var restoftext = text.substring(end);
//            $('#paraphraseSelected').html(startoftext+'<span class="paraSelected" id="paraSelectedText" style="background-color:'+background+'">'+selection+'</span>'+restoftext);
            $('#paraphraseSelected').html(startoftext+'<span id="paraSelectedText" style="background-color:'+background+'">'+selection+'</span>'+restoftext);
            window.find(searching);
        }
    }
    
    now.gotNewChat = function(username, gameID, chatMessage, tag, msg_id, sentence, selectedText, numLikes, msgNum) {
        var myGameID = $('span#gameID').text();
        var myUsername = $('span#username').text();
        if(gameID == myGameID) {
//            if(!$('#paraSelectedText').hasClass('paraSelected')) {
//                $('#paraSelectedText').addClass('paraSelected')
//            }
            var opacity = "1";
            var background = $('div#commentBox #'+tag).attr('data-background');
            now.logCSV();
            var tag = '<span id=tag_'+msg_id+' style="font-size:small;float:left;">#'+ tag + '</span>';
            
            var tagsnlike = '<div id=tagsnlike style= "background-color:'+background+'; border-left:1px solid #000; border-right:1px solid #000; border-bottom:1px solid #000;">'+
                       '<span style=background-color:'+background+';width:100%;display:block;overflow:hidden;>'+tag +
                            '<span class=likeButton id=likeButton_'+msg_id+' style="float: right;display:block;">'+
                                    '<button class=plusOne id=plusOne_'+msg_id+' onClick="now.likeMsg(\''+msg_id+'\');" >' +
                                        '<span id=numLikes_'+msg_id+' style="font-size:x-small;">+ '+numLikes+'</span>' + 
                                    '</button>'+
                            '</span>'+ 
                        '</span></div>';
            if(username == myUsername) {
                opacity = "0.7"
//                tagsnlike = '<div id=tagsnlike style= "background-color:'+background+'; border-left:1px solid #000; border-right:1px solid #000; border-bottom:1px solid #000;">'+
//                       '<span style=background-color:'+background+';width:100%;display:block;overflow:hidden;>'+tag + '</span></div>';
            }
            var threadStart = '<div class=thread id=t_'+msg_id+' data-size=1 data-sentence='+sentence+' data-background='+background+'>'
            var msgntagsStart = '<div class=msgntags id=mt_'+msg_id+' style="opacity: '+opacity+'">'
            var msgStart = '<div class=msg id=msg_'+msg_id+' data-likes_'+msg_id+'= '+numLikes+' data-ST = "'+selectedText+'" data-background="'+background+'" style="background: '+background+'">';
            var end = '</div>';
            var chatMessageStart = '<div id=chatMsg_'+msg_id+'>';          
            
            
            var chatbox = '<textarea rows="1" style="width:100%" class=msgChat id=chatbox_'+msg_id+'></textarea>';
            var thread = $(threadStart + msgntagsStart + msgStart + chatMessageStart + chatMessage + end + end + tagsnlike + end + chatbox + end);
            var msgWidth = Math.floor(parseInt($('#leftCol').css('width'))/4);
            var col = (msgNum-1)%4;
            var xpos = 10+(col)*msgWidth;
            thread.css('left', xpos+'px');
            var hCol = Math.floor((msgNum-1)/4);
            var ypos = 10+125*(hCol);
            thread.css('top', ypos+'px');
            
            
            $('#messages'+sentence).append(thread);
            
            $('#chatbox_'+msg_id).keypress(function (event) {   
                if (event.keyCode === 13) {
                    var msg_id2 = this.id.substring(8); //in case the id was changed when threads were merged
                    var chatText = $('#chatbox_'+msg_id2).val();
                    var myGameID = $('span#gameID').text();
                    var myUsername = $('span#username').text();
                    now.serverAddMsg(myUsername, myGameID, msg_id2, chatText);
                }
            });
            
            $('#mt_'+msg_id).hover(
                function() {
                    var numLikes = $('#msg_'+msg_id).attr('data-likes_'+msg_id);
                    $('span#numLikes_'+msg_id).text('+ '+numLikes);
                    if($('#commentBoxMinimized').css('display')=='block') {
                        var selectedText = $('#msg_'+msg_id).attr('data-ST');
                        if (selectedText != "") {
                            now.selecting(selectedText, msg_id);
                        }
                    }
                },
                function() {
                    if($('#commentBoxMinimized').css('display')=='block') {
                        var num = $('#chatbox').attr('data-paraphraseActive');
                        text = $('#paraphraseSelected').text();
                        $('#paraphraseSelected').empty();
//                        $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
                        $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
                    }
                }
            );
            
            thread.draggable({
                stop: function(event, ui) {
                    var id = event.target.id;
                    var pos = $(event.target).position();
                    if(pos.left <0)  { $('#'+id).css('left', '0px');}
                    var widthM = parseInt($('#rightCol').css('width'))*9/10;
                    if(pos.left > widthM)  {$('#'+id).css('left', widthM+'px'); }
                    if(pos.top < 0) {$('#'+id).css('top', '10px');}
                    pos = $(event.target).position();
                    var username = $('span#username').text();
                    var gameID = $('span#gameID').text();
                    now.serverMovedMsg(username, gameID, id, pos);
                    
                }
            });
            
            thread.droppable({
//                hoverClass: "highlight",
                drop: function(event, ui) {
//                    var threadSource = event.target.id;
//                    var threadTarget = ui.draggable.attr('id');
//                    var username = $('span#username').text();
//                    var gameID = $('span#gameID').text();
//                
//                    now.serverMergeThread(username, gameID, threadSource, threadTarget);
                }
    
           });
        }
	};
    
    now.addMsg = function(username, gameID, msgid, msg_id, chatText, numLikes){
        var myGameID = $('span#gameID').text();
        var myUsername = $('span#username').text();
        if (myGameID == gameID) {
            var background = document.getElementById('t_'+msg_id).getAttribute('data-background');
//            if (numLikes == undefined || numLikes == null) numLikes =0;
            var msgStart = '<div class=msg id=msg_'+msgid+' data-likes_'+msgid+'= '+numLikes+' data-ST = "" style=background-color:'+background+';>';
            var end = '</div>';
            var opacity = "1";
            var likes = '<div id=tagsnlike style= "background-color:'+background+';border-left:1px solid #000; border-right:1px solid #000; border-bottom:1px solid #000;">'+
                        '<span style="background-color:'+background+';width:100%;display:block; overflow:hidden;">'+
                            '<span id=likeButton_'+msgid+' style="float:right;display:block;">'+
                                '<button class=plusOne id=plusOne_'+msgid+' onClick="now.likeMsg(\''+msgid+'\');" >' +
                                        '<span id=numLikes_'+msgid+' style="font-size:x-small;">+ '+numLikes+'</span>' + 
                                    '</button>'+
                            '</span>'+
                        '</span></div>';
            if(username == myUsername) {
                opacity = "0.7"
//                likes = '<div id=tagsnlike style= "background-color:'+background+';border-left:1px solid #000; border-right:1px solid #000; border-bottom:1px solid #000;">'+
//                        '<span style="background-color:'+background+';width:100%;display:block; overflow:hidden;">'+'</span></div>';
            }
            now.logCSV();
            var msgntagsStart = '<div class=msgntags id=mt_'+msgid+' style="opacity: '+opacity+'">';
            var chatMessageStart = '<div id=chatMsg_'+msgid+'>';
            
            var chatbox = $('#chatbox_'+msg_id);
            var msg = msgntagsStart+msgStart + chatMessageStart + chatText + end + end + likes +end;
            var thread = "t_"+msg_id;
            var idT_size = document.getElementById(thread).getAttribute('data-size');
            var size = parseInt(idT_size)+1;
            document.getElementById(thread).setAttribute('data-size', size);
            
            chatbox.before(msg);
            $('#msg_'+msgid).hover(
                function() {
                    var numLikes = $('#msg_'+msgid).attr('data-likes_'+msgid);
                    $('span#numLikes_'+msgid).text('+ '+numLikes);
                },
                function() {
                }
            );
            chatbox.val('');
        }
    };
    
    now.mergeThread = function(username, gameID, threadSource, threadTarget, whichUser, totalScore) {
        var myGameID = $('span#gameID').text();
        var myUsername = $('span#username').text();
        if (myGameID == gameID) {
            now.logCSV();
            if(whichUser != null || whichUser != "" || whichUser != undefined) {
                if(myUsername == whichUser)
                    now.newScore(whichUser, gameID, totalScore);
            }   
            var pos = $('#'+threadSource).position();
            var idS = threadSource.substring(2); 
            var idT = threadTarget.substring(2);
            var idS_size = document.getElementById(threadSource).getAttribute('data-size');
            var idT_size = document.getElementById(threadTarget).getAttribute('data-size');
            var size = parseInt(idS_size)+parseInt(idT_size);
            document.getElementById(threadTarget).setAttribute('data-size', size);
            var sentence = document.getElementById(threadTarget).getAttribute('data-sentence');
            
            var idS_background = document.getElementById(threadSource).getAttribute('data-background');
            document.getElementById(threadTarget).setAttribute('data-background', idS_background);
//            var tChat = $('#chatbox_'+idS);        
            var msgs = $('#'+ threadSource + ' .msgntags');
            $('#'+threadTarget).prepend(msgs);
            $('#'+threadSource).remove();
            $('#'+threadTarget).attr('id',threadSource);
            $('#chatbox_'+idT).attr('id', 'chatbox_'+idS);
//            $('#'+threadSource).children('div').each(function() {
//                var idChat = $(this).attr('id');
//                var idNum = idChat.substring(3);
//            });
            $('#'+threadSource).css('left', pos.left+'px');
            $('#'+threadSource).css('top', pos.top+'px');
        }
    };
    
//    now.addToMyMsgs = function (chatMessage, tag, sentence, selectedText) {
//        var background = $('div#commentBox #'+tag).attr('data-background');
//        var threadStart = '<div class=thread id=myt_'+msg_id+' data-size=1 data-sentence='+sentence+' data-background='+background+'>'
//        var msgntagsStart = '<div class=msgntags id=mymt_'+msg_id+'>'
//        var msgStart = '<div class=msg id=mymsg_'+msg_id+' data-ST = "'+selectedText+'" data-background="'+background+'" style="background: '+background+'">';
//        var end = '</div>';
//        var tag = '<span id=mytag_'+msg_id+' style="font-size:small;float:left; padding:5px">#'+ tag + '</span>';
//        var chatMessageStart = '<div id=mychatMsg_'+msg_id+'>';
//        var tagsnlike = '<div id=mytagsnlike style= "background-color:'+background+'; border-left:1px solid #000; border-right:1px solid #000; border-bottom:1px solid #000;"><span style=background-color:'+background+';width:100%;display:block;overflow:hidden;>'+tag +'</span></div>';
//        var thread = $(threadStart + msgntagsStart + msgStart + chatMessageStart + chatMessage + end + end + tagsnlike + end + end);
//        var msgWidth = Math.floor(parseInt($('#rightCol').css('width'))/4);
//        if(msgWidth == 0) { msgWidth = Math.floor((parseInt($('#col2').css('width'))*0.7)/4);}
//        var msgNum = parseInt($('#mymessages'+sentence).attr("data-num"));
//        var col = (msgNum)%4;
//        var xpos = 10+(col)*msgWidth;
//        thread.css('left', xpos+'px');
//        var hCol = Math.floor(msgNum/4);
//        var ypos = 25+125*hCol;
//        thread.css('top', ypos+'px');
//        
//        $('#mymessages'+sentence).append(thread);
//        msgNum+=1;
//        $('#mymessages'+sentence).attr("data-num", msgNum)
//        
//        $('#myt_'+msg_id).hover(
//            function() {
//                var selectedText = $('#mymsg_'+msg_id).attr('data-ST');
//                if (selectedText != "") {
//                    now.selecting(selectedText, msg_id);
//                }
//            },
//            function() {
//                var num = $('#chatbox').attr('data-paraphraseActive');
//                text = $('#paraphraseSelected').text();
//                $('#paraphraseSelected').empty();
//                $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
//            }
//        );
//    }

//  *************************************************  end rightCol stage *************************************************
    
    
//  *************************************************  commenting stage *************************************************

    
//    $('#instructionsButton').click(function (event) {
//        var text = $('#instructionsButton').text();
//        if( text == "Show Instructions") {
//            $('#instructionsButton').text("Hide Instructions");
//            $('#instructions').css("display", "");
//        }
//        else if (text == "Hide Instructions") {
//            $('#instructionsButton').text("Show Instructions");
//            $('#instructions').css("display", "none");
//        }
//    });
    
    now.newMessage = function() {
        $('#commentBoxMinimized').css('display','');
        $('#commentBox').css('display', 'none');
        var sentence = document.getElementById('chatbox').getAttribute('data-paraphraseActive');
        if (sentence != "") {
            var username = $('span#username').text();
            var gameID = $('span#gameID').text();
            var tag = $('#chatbox').attr("data-post");
            var post = $("#submitChat").is(":disabled");//way to check if tag is selected
            console.log("may have to check this part too?");
            if(!post) {// if tag=false means submit button is not disabled, which means a tag is selected
                var selectedText = document.getElementById('chatbox').getAttribute('data-selected');
                document.getElementById('chatbox').setAttribute('data-selected',"");
                $('#selectTag').css("display", "none");
                $('#description').css("visibility", "hidden");
                $('#description').css("border", "0px solid black");
                $('#description').css("border-radius", "0px");
                
                $('#chatbox'+sentence).attr("data-post", "0")
                
                var sentence = $('#chatbox').attr('data-paraphraseActive');
                var chatMsg = $('#chatbox').val();
//                console.log("what does addToMyMsgs do?");
//                now.addToMyMsgs(chatMsg, tag, sentence, selectedText);
                var username = $('span#username').text();
//                console.log("sentence 0 or 1 indexed? "+sentence); it's 1 indexed
                now.serverGotNewChat(username, gameID, chatMsg, tag, sentence, selectedText);
                var scoreAdd = "10";
                now.addScoreServer(username, gameID, scoreAdd);
                $('#chatbox').val('');
                
            }
            else {
//                $('#tagSelection').css("visibility", "visible");
//                $('#tagSelection').text("Select a tag first.");
            }
            
            //something wrong here i think
            $('#submitChat').attr("disabled", "disabled"); 
            $('#selectTag').css("display", "");
            var num = $('#chatbox').attr('data-paraphraseActive');
            text = $('#paraphraseSelected').text();
            $('#paraphraseSelected').empty();
//            $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
            $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
        }
        else {
//            $('#tagSelection').text('Select a paraphrase first');
//            $('#tagSelection').css("visibility", "visible");
        }
    };
    
    now.newMessageLoad = function(sentence, tag, num, selectedText, msg_id, chatMsg) {
        //sentence is paraphrase
        if (sentence != "") {
            var numTags = $('#paraphraseSection').attr('data-numTags'); //if there are four tags, then this will be three
            var firstTime = $('#paraphrase'+num).attr('data-original');
            if(!firstTime) {
                $('#messages'+sentence).css("display", "");
            }
//            now.addToMyMsgs(chatMsg, tag, sentence, selectedText);
            var username = $('span#username').text();
            var gameID = $('span#gameID').text();
        }
    };
    
    
    
//  *************************************************  end commenting stage *************************************************


    
//  *************************************************  paraphrase stage *************************************************

    
    now.paraphraseClicked = function (elem, num) {
        var currentNum=$('#chatbox').attr("data-paraphraseActive");
        num += 1;
        if(num!=currentNum) {
            $('#messages'+currentNum).css('display', 'none');
//            $('#mymessages'+currentNum).css('display', 'none');
            $('#commentBoxMinimized').css('display','none');
            $('#commentBox').css('display','none');
            var newTop = parseInt($('#paraphrase'+num).position().top)*.80;
            $('#readParaphrase').css('top', newTop+'px');
//            var newLeft = parseInt($('#leftCol').css('width'))+10;
            var newLeft = 250;
            $('#readParaphrase').css('left', newLeft+'px');
            $('#readParaphrase').css('z-index','1');
            
            $('#paraphrase'+currentNum).removeClass('active');
            $('#paraphrase'+currentNum).addClass('paraphrases');

            $('#paraphrase'+num).removeClass('paraphrases');
            $('#paraphrase'+num).addClass('active');
            
            
            
//            $('div#paraphrases .active').hover(function() {
//                    var elem = this.id;
//                    if($('#'+elem).hasClass('active')) {
//                        var newTop = parseInt($('#'+elem).position().top)*0.80;
//                        $('#readParaphrase').css('top', newTop+'px');
//                        var newLeft = 250;
//                        $('#readParaphrase').css('left', newLeft+'px');
//                        $('#readParaphrase').css('z-index','1');
//                        $('#readParaphrase').css('display', '');
//                    }
//                
//                }, 
//                function() {
//                    var elem = this.id;
//                    $('#readParaphrase').css('display', 'none');
//            });
            document.getElementById('chatbox').setAttribute('data-paraphraseActive', num);
              
            
        }
    }
    
    now.fillInParaphrase = function(paraphrase, num, tags) {
        //called on server-side
        num += 1;
        now.logCSV();
        $('#paraSelectedText').text(paraphrase);
        var firstTime = $('#paraphrase'+num).attr('data-original');
        if(firstTime=="true") {
            $('#commentBoxMinimized').css('display','none');
            
            $('#readParaphrase').css('display', '');
//            $('#paraSelectedText').removeClass('paraSelected');
            $('#originalCommenting').html('');
            $('#originalCommenting').css('display','');
            
//            var developed =  $('#originalCommenting').attr('data-developed');
//            if(developed=="false") {
                var colors = ["#FFFFDA", "#EB6A9D", "#99FF99", "#FFE2FF", "#CB6666", "#A0A0AB"];
                var countTags =0;
                for (key in tags) {
                    var tagDiv = '<div> <span class="tagsOriginal" id="'+key+'" style="background:'+colors[countTags]+'; padding-top:1px" data-description="'+tags[key]+'" data-background="'+colors[countTags]+'" data-num=t_'+countTags+'>#'+key+'</span> - '+tags[key]+'</div>';
                    countTags += 1; 
                    var buttonDiv = '';//'<button class=attachButton id="attachButton'+countTags+'">Attach Selected Text</button><br>';
                    
//                    var descriptionDiv = '<div class="descriptionOriginal" id="'+key+'Description" style="background:'+colors[countTags]+'" data-description="'+tags[key]+'" data-background="'+colors[countTags]+'" data-num=t_'+countTags+'>'+tags[key]+'</div>' ;
//                    $('#originalCommenting').append(descriptionDiv);
//                   
                    var chatTag = '<textarea class=chatboxesOriginal id="chatbox'+countTags+'" data-tag="'+key+'" data-selected=""></textarea>'
                    var thisTagSection = '<div class=thisTagSection id="tagSection'+countTags+'" data-tag="'+key+'">'+tagDiv+buttonDiv+chatTag+'</div>';
                    $('#originalCommenting').append(thisTagSection);          
                    
                    $('#originalCommenting').attr('data-developed', 'true');      
                }
                var doneButton = '<div id=doneOriginalButton><button class=buttonsGen id=doneOriginal>Done</button> <span class=error id=loginOriginalError></span></div>';
                $('#originalCommenting').append(doneButton); 
                
                $('.attachButton').click(function() {
                    var selection = $('#paraSelectedText').text();
                    var text = $('#paraphraseSelected').text();
                    var count = this.id.substring(12);
                    var elem = "tagSection"+count;
                    var tagKey = document.getElementById(elem).getAttribute('data-tag');
                    var background = $('#'+tagKey).css('background-color');
                    if(document.getElementById("attachButton"+count).style.background== background) {
                        document.getElementById('chatbox'+count).setAttribute('data-selected', "");
                        document.getElementById("attachButton"+count).style.background = "";
                        $('#paraphraseSelected').empty();
            //                $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
                        $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
                    }
                    else {
                        var show = $('#paraSelectedText').hasClass('paraSelected');
                        if(selection != "" && show) {
                            var len = selection.length;
                            var search = text.search(selection);
                            var newText = "";
                            if( search == -1){
            //                    $('#paraSelectedText').addClass('paraSelected');
                                document.getElementById('chatbox'+count).setAttribute('data-selected', "");
                                $('#paraphraseSelected').empty();
            //                    $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
                                $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
                            }
                            else {
                                var end = parseInt(search)+parseInt(selection.length);
                                document.getElementById('chatbox'+count).setAttribute('data-selected', search+","+end);
                                $('#paraphraseSelected').empty();
                                var restoftext = text.substring(selection.length+search);
                                $('#paraphraseSelected').html(text.substring(0,search)+'<span id="paraSelectedText">'+selection+'</span>'+restoftext);
                                var searching = search+","+end;
                                now.selecting(searching, elem);
                            }
                        }
                        else {
                            document.getElementById('chatbox'+count).setAttribute('data-selected', "");
                            var text = $('#paraphraseSelected').text();
                            $('#paraphraseSelected').empty();
            //                $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
                            $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
                        }
                    }
                });
                
                
                $('.thisTagSection').hover(
                    function() {
                        var elem = this.id;
                        var count = elem.substring(10);
                        var show = $('#paraSelectedText').hasClass('paraSelected');
                        if(!show) {
                            var selectedText = $('#chatbox'+count).attr('data-selected');
                            now.selecting(selectedText, elem);
                        }
                        $('#attachText').css('display', '');
                    }, 
                    function() {
                        var show = $('#paraSelectedText').hasClass('paraSelected');
                        if(!show) {
                            var text = $('#paraphraseSelected').text();
                            $('#paraphraseSelected').empty();
                            $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
                        }
                        $('#attachText').css('display', 'none');
                });
                    
                $('#doneOriginal').click(function() {
                    var show=true;
                    var sentence = $('#chatbox').attr('data-paraphraseActive');
                    var numTags = $('#paraphraseSection').attr('data-numTags');
                        
                    for(i=1; i<numTags; i++) {
                        var chatMsg = $('#chatbox'+i).val();
                        if(chatMsg == "") {
                            $('#loginOriginalError').html("You must write a comment for every tag."); 
                            show=false;
                            break;
                        }
                    }
                    if(show) {
                        $('#messages'+sentence).css("display", "");
                        
                        for(i=1; i<numTags; i++) {
                            var chatMsg = $('#chatbox'+i).val();
                            if(chatMsg == "") {
                                $('#loginOriginalError').html("You must write a comment for every tag."); 
                                show=false;
                                break;
                            }
                            $('#chatbox'+i).val('');
                            var tag = $('#chatbox'+i).attr('data-tag');
                            var sentence = document.getElementById('chatbox').getAttribute('data-paraphraseActive');
                            if (sentence != "") {
                                var username = $('span#username').text();
                                var gameID = $('span#gameID').text();
                                var selectedText = document.getElementById('chatbox'+i).getAttribute('data-selected');
                                   
                                now.serverGotNewChat(username, gameID, chatMsg, tag, sentence, selectedText);
                                var scoreAdd = "10";
                                now.addScoreServer(username, gameID, scoreAdd);
                                $('#readParaphrase').css('display', 'none');
                            }
                        }
                        $('#originalCommenting').css('display', 'none');
                        $('#paraphrase'+sentence).attr('data-original', 'false');
                        $('#commentBoxMinimized').css('display','');
                        now.serverFirstTime(username, gameID, num);
                    }
                });
//            }
        }
        else {
            $('#commentBoxMinimized').css('display','');
            $('#readParaphrase').css('display', 'none');
//            $('#paraSelectedText').addClass('paraSelected');
            $('#originalCommenting').css('display', 'none');
            $('#messages'+num).css("display", "");
        }
    }
    
    
    $('#chatbox').keypress(function (event) {
                var tag = $('#chatbox').attr('data-tag');;//document.getElementById('chatbox').getAttribute('data-tag');
                if(tag == "1") {
                    if(event.keyCode === 32 || event.keyCode === 13) { //space
                        var textTag = $('#chatbox').val();//document.getElementById("chatbox").value;
                        var text = $('#chatbox').attr('data-text');//document.getElementById('chatbox').getAttribute('data-text');
                        var size = text.length;
                        var tag = textTag.substring(size+1);
                        $('.tags').each(function() {
                            if (this.id == tag) {
                                $(this).click();
                                $('#chatbox').val(text);
                                $('#chatbox').attr('data-text', "");
                                $('#chatbox').attr('data-tag', "0");
                            }
                        });
                    }
                }
                else {
                    if (event.keyCode === 13) { // enter
                        var chatbox = $('#chatbox').val().trim();
                        if(chatbox != "")
                            now.newMessage();
                    }
                    if (event.keyCode === 35) { //hash #;
                        var text = $('#chatbox').val();
                        $('#chatbox').attr('data-text', text);
                        $('#chatbox').attr('data-tag', "1");
                    }
                }
            });
            
            $('#submitChat').click(function (event) {
                var chatbox = $('#chatbox').val();
                if(chatbox != "")
                    now.newMessage();
            });
    
    now.loadParaphrases = function(gameID, tags, paraphrasesInGame) {
        //examples is a list provided by teacher
        //paraphrasesInGame is a dictionary where the username is the key and the value is the paraphrase provided by that user
//        var myGameID = $('span#gameID').text();
//        var myUsername = $('span#username').text();
//        var show = (document.getElementById('commentBox').style.display == "") ;
//        if(gameID == myGameID && show) { }
        var colors = ["#FFFFDA", "#EB6A9D", "#99FF99", "#FFE2FF", "#CB6666", "#A0A0AB"];
        
        var countTags =0;
        for (key in tags) {
            var tagDiv = '<button class="tags" id="'+key+'" style="background:'+colors[countTags]+'" data-description="'+tags[key]+'" data-background="'+colors[countTags]+'" data-num=t_'+countTags+'>#'+key+'</button>';
            $('#tagSection').append(tagDiv);
            countTags += 1;
        }
        
        $(".tags").hover(function() {
                var elem = this.id;
                    var background = $('#'+elem).css("background-color");
                    var visible = $('#description').css('visibility');
                    var descrip = $('#'+elem).attr('data-description');
                    if (descrip != "" && visible == "hidden") {
                        $('#description').text(descrip);
                        $('#description').css("visibility", "visible");
                        $('#description').css("background-color", background);
                    }
                    
                }, 
                function() {
                    var elem = this.id;
                    var selected = $('#'+elem).hasClass("selected");
                    var descrip = $('#'+elem).attr('data-description');
                    var text = $('#description').text();
                    if(!selected && text == descrip)            
                        $('#description').css("visibility", "hidden");
        });
        
        $('.tags').click(function() {
            if(document.getElementById('chatbox').getAttribute('data-paraphraseActive') != "") {
                var elem = this.id;
                if($('#'+elem).hasClass('selected')) {
                    $('#'+elem).removeClass('selected');//unselecting tag
                    var tag = "";
                    if(tag == "") {
                        
                        $('#submitChat').attr("disabled", "disabled");
                        $('#selectTag').css("display", "");
//                        $('#tagSelection').css("visibility", "visible");
                    }
                }
                else { //selecting tag
                    $('#chatbox').attr("data-post", elem);
                    $('#'+elem).addClass('selected');
                    var background = $('#'+elem).css("background-color");
                    var visible = $('#description').css('visibility');
                    var descrip = $('#'+elem).attr('data-description');
                    if (descrip != "") {
                        $('#description').text(descrip);
                        $('#description').css("visibility", "visible");
                        $('#description').css("background-color", background);
                    }
                    var background = document.getElementById(elem).getAttribute('data-background');
                    $('#'+elem).css("background", background);
//                    $('#tagSelection').css("visibility", "hidden");
                        $('#submitChat').removeAttr("disabled");
                        $('#selectTag').css("display", "none");
                    $('.tags').each(function() {
                        if(($(this).hasClass("selected"))) {
                            var e = this.id;
                            if(e!=elem) {
                                $('#'+e).removeClass('selected');
                            }
                        }
                    });
                }
                $('#chatbox').focus();
            }
            else {
//                $('#tagSelection').text('First select a paraphrase');
//                $('#tagSelection').css("visibility", "visible");
                
            }
        });
        
        //generate paraphrases on page
        var count = 1;
        for (each in paraphrasesInGame) {    
          
            $('div#paraphraseSection').append('<span class=paraphrases id=paraphrase'+count+' data-num='+count+' data-type=user data-tags="" data-original="true">Paraphrase '+count+'</span>');
            count+=1;
//            $('div#paraphrases').append(paraphraseDiv);
        }
        
        $('.paraphrases').click(function(){
            var elem = this.id;
            var num = parseInt($('#'+elem).attr("data-num"))-1;
            now.paraphraseClicked(elem, num);
            $('#chatbox').focus();
            var gameID = $('span#gameID').text();
            now.getParaphraseServer(gameID, num);
            $('#selectParaphrase').text("Choose a tag for your comment.");
            $('#chooseParaphrase').css("display", "none");
        });
        
        $('.paraphrases').hover(
                function() {
                    var newTop = parseInt($('#paraphraseSection').position().top)*0.8;
                    $('#chooseParaphrase').css('top', newTop+'px');
            //            var newLeft = parseInt($('#leftCol').css('width'))+10;
                    var newLeft = 250;
                    $('#chooseParaphrase').css('left', newLeft+'px');
                    $('#chooseParaphrase').css('z-index','1');
                    $('#chooseParaphrase').css('display', '');
                },
                function() {
                    $('#chooseParaphrase').css('display', 'none');
                }
            );
        
        
        
        //for every paraphrase, generate respective message section
        for(var i =1; i<count; i++) {
//            var mymessageDiv = '<div class=messages id=mymessages'+i+' style="display:none" data-num=0> </div>';
//            $('#rightCol').append(mymessageDiv);
            
            var messageDiv = '<div class=messages id=messages'+i+' style="display:none" data-num=0> </div>';
            $('#messageSection').append(messageDiv);
            $('#messages'+i).hover(
                function() {
                    var show = $('#commentBoxMinimized').css('display');
                    if(show == 'block') {
                        var newTop = parseInt($('#messageSection').position().top)*1.2;
                        $('#postedComments').css('top', newTop+'px');
                //            var newLeft = parseInt($('#leftCol').css('width'))+10;
                        var newLeft = 250;
                        $('#postedComments').css('left', newLeft+'px');
                        $('#postedComments').css('z-index','1');
                        $('#postedComments').css('display', '');
                    }
                },
                function() {
                        $('#postedComments').css('display', 'none');   
                }
            );
                    
            $('#messages'+i).mousedown(function() {
                $('#commentBoxMinimized').css('display','');
                $('#commentBox').css('display', 'none');
                document.getElementById('chatbox').setAttribute('data-selected', "");
                var text = $('#paraphraseSelected').text();
                $('#paraphraseSelected').empty();
//                $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
                $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
            });
        }
    }
    
    now.paraphraseStage = function(username, gameID, usersScoreInGame, s, e) {
        //just in case it hasn't done this step yet because it can technically come to this method straight from the login server-side method
        $('#source').text(s);
        $('#excerpt').text(e);
        if(gameID.toLowerCase().substring(0,4) == "beta") 
            now.addParaphraseServer(username, gameID, "");
        $('span#username').text(username);
        $('span#gameID').text(gameID);
        $('#loginContainer').css("display", "none");
        $('#hello').css("visibility", "visible");
        
        //change formatting
        $('#leftCol').removeClass('generateStage');
        $('#leftCol').addClass('paraphraseStage');
//        $('#rightCol').removeClass('generateRightCol');
//        $('#rightCol').addClass('paraphraseRightCol');
        $('#toastCol').css('display', '');
        $('#generatePart').css('display','none');
        $('#excerpt').css('width', '90%');
        $('#excerpt').css('height', '80px');
        $('#excerpt').css('font-size', '14.5px');
        $('#excerpt').css('margin-top', '10px');
        $('#excerpt').css('margin-left', '50px');
        
        $('#source').css('font-size', '14px');
        $('#source').css('padding-left', '10px');
//        $('#instructionsButton').css("display", "");
        $('#score').text(usersScoreInGame);
        $('#selectParaphrase').text("Select a paraphrase below and begin commenting.");
//        $('#commentBox').css('display','');
        $('#chooseText').css('display','');
        $('#messageSection').css('display', '');
        
        var newTop = parseInt($('#paraphraseSection').position().top)*0.8;
        $('#chooseParaphrase').css('top', newTop+'px');
//            var newLeft = parseInt($('#leftCol').css('width'))+10;
        var newLeft = 250;
        $('#chooseParaphrase').css('left', newLeft+'px');
        $('#chooseParaphrase').css('z-index','1');
        $('#chooseParaphrase').css('display', '');
        
        
        $('#commentBoxMinimized').click(function() {
            $('#commentBoxMinimized').css('display','none');
            $('#commentBox').css('display', '');
        });
        //load paraphrases submitted so far
        now.loadParaphrasesServer(gameID);
        
        now.loadEverythingServer(username, gameID);
    }
    
//    now.highlightStage = function(username, gameID, usersScoreInGame) {
//        //just in case it hasn't done this step yet because it can technically come to this method straight from the login server-side method
//        if(gameID.toLowerCase() == "beta") 
//            now.addParaphraseServer(username, gameID, "");
//        $('span#username').text(username);
//        $('span#gameID').text(gameID);
//        $('#loginContainer').css("display", "none");
//        $('#hello').css("visibility", "visible");
//        
//        //change formatting
//        $('#leftCol').removeClass('generateStage');
//        $('#leftCol').addClass('highlightStage');
//        var width = parseInt($('body').css('width')) - 120;
//        $('#leftCol').css('width', width+'px');
//        $('#toastCol').css('display', '');
////        $('#rightCol').removeClass('generateRightCol');
////        $('#rightCol').addClass('paraphraseRightCol');
//        $('#generatePart').css('display','none');
//        $('#excerpt').css('width', '90%');
//        $('#excerpt').css('font-size', '12px');
//        $('#excerpt').css('padding-top', '10px');
//        $('#source').css('font-size', '12px');
//        $('#source').css('padding-left', '10px');
////        $('#instructionsButton').css("display", "");
//        $('#score').text(usersScoreInGame);
//        $('#selectParaphrase').text("Select a paraphrase below and begin commenting.");
////        $('#commentBox').css('display','');
//         $('#chooseText').css('display','');
//        
//        $('#chooseParaphrase').fadeIn(400).delay(3000).fadeOut(400);
//        
//        
//        //load paraphrases submitted so far
//        now.loadParaphrasesServer(gameID);
//        
//        now.loadEverythingServer(username, gameID);
//    }
//  ************************************************* end paraphrase stage *************************************************


//  *************************************************  generate stage *************************************************
    
    now.loadEverything = function(username, gameID, users, games, tags, paraphrases, log) {
//        var games = {}; 
        // gameID is key
        // each game keeps track of usersingame{}, messagesingame{}, and paraphrasesingame{}
            // usersingame{username: [password, scoreInGame, paraphraseInGame, messagesByUserInGame[msgIDs], msgsLikedByUserInGame[msgIDs] ]}  
            // messagesingame{msgID: [paraphrase, message, tag, likes, selectedText, username]}
            // paraphrasesingame [] where order is the order in game where first ones are the examples provided by teacher    
        
        //var messages; key is msgID  - [0]username, [1]gameID, [2]chatMessage, [3]tag, [4]msgID, [5]paraphrase #, [6]selectedText
        var messagesList = games[gameID][1];
        var myMessages = games[gameID][0][username][3];//should be a list of msgIDs associated with that game id
        var username = $('span#username').text();
        tagList = [];
        var numTags = 1;
        for (each in tags) {
            tagList.push(each);
            numTags += 1;
        }
        $('#paraphraseSection').attr('data-numTags', numTags);
        
        var i = 1;
        var msgCount = {};
        for (each in paraphrases) {
            msgCount[i] = 0;
            $('#messages'+i).css('display', '');
            i+=1;
        }
//        messagesingame{msgID: [paraphrase, message, tag, likes, selectedText, username]}
        
        for(each in log) {
            if(  log[each][1] == gameID && log[each][2] == "got new comment" ) {
                //var parameter =[username, gameID, "got new comment", chatMessage, tag, msgID, paraphrase, selectedText];
                var msgID = log[each][5];
                var paraphrase = log[each][6];
                if(username == log[each][0]) {
                    console.log("not sure what this part does");
                    now.newMessageLoad(messagesList[0], messagesList[2], tagList.indexOf(messagesList[2]), messagesList[4], msgID, messagesList[1]);
                }
                msgCount[paraphrase] +=1;
                
                var temp = messagesList[msgID][1];
//                now.gotNewChat = function(username, gameID, chatMessage, tag, msg_id, sentence, selectedText, numLikes, msgNum) {
                now.gotNewChat(log[each][0], log[each][1], messagesList[msgID][1], messagesList[msgID][2], msgID, paraphrase, messagesList[msgID][4], messagesList[msgID][3], msgCount[paraphrase]);   
            }
            else if( log[each][1] == gameID && log[each][2] == "merged threads" ) {
                //var parameter = [username, gameID, "merged threads", threadSource, threadTarget];
                now.mergeThread(log[each][0], log[each][1], log[each][3], log[each][4]);
            }
            else if ( log[each][1] == gameID && log[each][2] == "added followup" ) {
                //var parameter = [username, gameID, "added followup", msgID, msg_id, chatText, numLikes];
                var msgID = log[each][3];
//                now.addMsg = function(username, gameID, msgid, msg_id, chatText, numLikes){
                now.addMsg(log[each][0], log[each][1], log[each][3], log[each][4], log[each][5], messagesList[msgID][3]);
            }
            else if ( log[each][1] == gameID && log[each][2] == "liked message" ) {
//                var parameter = [username, gameID, "liked message", msgID];
                if(username == log[each][0]) {
                    var msgID = log[each][3];
                    if( $('#plusOne_'+msgID).css("background-color")=="rgb(220, 220, 220)") {
                        $('#plusOne_'+msgID).css("background-color", "rgb(60, 200, 250)");
                    }
                }
            }
            else if (log[each][0] == username && log[each][1] == gameID && log[each][2] == "moved message" ) {
//                var parameter = [username, gameID, "moved message", msgID, pos];
                var id = log[each][3];
                var pos = log[each][4];
                $('#'+id).css('left', pos.left);
                $('#'+id).css('top', pos.top);
            }
            else if (log[each][0] == username && log[each][1] == gameID && log[each][2] == "wrote first comments" ) {
                var num = log[each][3];
                $('#paraphrase'+num).attr('data-original', "false");
            }
                
        }
        var myScore = games[gameID][0][username][1];
        $('#score').text(myScore);
        $('.messages').css('display','none');
        $('#showMe').css("display", "none");
        
        $('#paraphraseSelected').mousedown(function() {
            var show = $('#paraSelectedText').hasClass('paraSelected');
            if(show) {
                $('#paraSelectedText').removeClass('paraSelected');
            }
        });
                                
        $('#paraphraseSelected').mouseup(function() {
//            $('#paraSelectedText').removeClass('paraSelected');
            var selection = window.getSelection().toString();
            var text = $('#paraphraseSelected').text();
            if(selection != "") {
                var len = selection.length;
                var search = text.search(selection);
                var newText = "";
                if( search == -1){
//                    $('#paraSelectedText').addClass('paraSelected');
                    document.getElementById('chatbox').setAttribute('data-selected', "");
                    $('#paraphraseSelected').empty();
//                    $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
                    $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
                }
                else {
                    var end = parseInt(search)+parseInt(selection.length);
                    document.getElementById('chatbox').setAttribute('data-selected', search+","+end);
                    $('#paraphraseSelected').empty();
                    var restoftext = text.substring(selection.length+search);
//                $('#paraphraseSelected').html(text.substring(0,search)+'<span class="paraSelected" id="paraSelectedText">'+selection+'</span>'+restoftext); 
                    $('#paraphraseSelected').html(text.substring(0,search)+'<span class=paraSelected id="paraSelectedText">'+selection+'</span>'+restoftext);
                }
                var show = $('#commentBoxMinimized').css('display');
                if(show == 'block') {
                    $('#commentBoxMinimized').click();
                    $('#chatbox').focus();
                }
            }
            else {
                document.getElementById('chatbox').setAttribute('data-selected', "");
                var text = $('#paraphraseSelected').text();
                $('#paraphraseSelected').empty();
//                $('#paraphraseSelected').html('<span class="paraSelected" id="paraSelectedText">'+text+'</span>');
                $('#paraphraseSelected').html('<span id="paraSelectedText">'+text+'</span>');
            }
        });
        
        $('#commentingSection').hover(function() {
                var num = $('#chatbox').attr('data-paraphraseActive');
                var firstTime = $('#paraphrase'+num).attr('data-original');
                if(firstTime=="false") {
                    $('#selectText').css('display', '');
                    var newLeft = 250;
                    $('#selectText').css('left', newLeft+'px');
                    var newTop = parseInt($('#paraphraseSection').position().top)*0.9;
                    $('#selectText').css('top', newTop+'px');
                    $('#selectText').css('z-index','1');
                }
            },
            function() {
                $('#selectText').css('display', 'none');
                $('#selectText').css('z-index','-1');    
        });
    }
    
    $('#done').click(function() {
        var paraphrase = $('#paraGenChat').val();
        if (paraphrase != "") {
            var username = $('span#username').text();
            var gameID = $('span#gameID').text();
            var scoreAdd = "100";
            now.addScoreServer(username, gameID, scoreAdd);
            now.addParaphraseServer(username, gameID, paraphrase);
            var s = $('#source').text();
            var e = $('#excerpt').text();
            now.paraphraseStage(username, gameID, "100", s, e);
        }
        else {
            $('#paraphraseError').html("You must write a paraphrase first."); 
        }
    });
    
    now.newScore = function(username, gameID, totalScore) {
        var myGameID = $('span#gameID').text();
        var myUsername = $('span#username').text();
        if(gameID == myGameID && myUsername == username) {
            $('#score').text(totalScore);
        }
    }
    
    now.addParaphrase = function(username, gameID, paraphrase) {
        var myGameID = $('span#gameID').text();
        var myUsername = $('span#username').text();
        var show = $('#leftCol').hasClass("paraphraseStage");
        if(gameID == myGameID && myUsername != username && show) {
            
            var count = $("#paraphraseSection > span").size()+1;
            $('div#paraphraseSection').append('<span class=paraphrases id=paraphrase'+count+' data-num='+count+' data-type=user data-tags="" data-original="true">Paraphrase '+count+'</span>');
//            var paraphraseDiv = '<div class=paraphrases id=paraphrase'+count+' data-num='+count+' data-type=user data-tags="" >Paraphrase '+count+' </div>';
            $('#paraphrase'+count).click(function(){
                var elem = this.id;
                var num = parseInt($('#'+elem).attr("data-num"))-1;
                now.paraphraseClicked(elem, num);
                $('#chatbox').focus();
                var gameID = $('span#gameID').text();
                now.getParaphraseServer(gameID, num);
                $('#selectParaphrase').text("Choose a tag for your comment.");
                $('#chooseParaphrase').css("display", "none");
            });
            
            var messageDiv = '<div class=messages id=messages'+count+' style="display:none" data-num=0> </div>';
            $('#messageSection').append(messageDiv);
        }
    }
    
//    used to debug generate page without going to server
//    $('#skip').click(function() {
//        var username = $('span#username').text();
//        var gameID = $('span#gameID').text();
//        
//        now.paraphraseStage(username, gameID);
//    });
    
    $('#hint').click(function() {
        now.addHintServer();
    });
    
    now.addHint = function(hint) {
        $('#hintArea').text(hint);
    }
    
//  *************************************************  end generate stage *************************************************

    
//  *************************************************  teacher page *************************************************
    $('#examplesAdd').click(function() {
        var count = parseInt($('#examplesDiv').attr('data-count'));
        count+=1;
        $('#examplesDiv').append('<textarea class=example id=example'+count+'></textarea> <br> ');
        $('#examplesDiv').attr('data-count', count);
    });
    
    $('#hintsAdd').click(function() {
        var count = parseInt($('#hintsDiv').attr('data-count'));
        count+=1;
        $('#hintsDiv').append('<textarea class=description id=hint'+count+'></textarea><br>');
        $('#hintsDiv').attr('data-count', count);
    });
    
    $('#tagsAdd').click(function() {
        var count = parseInt($('#tagsDiv').attr('data-count'));
        count+=1;
        if(count<7) {
            $('#tagsDiv').append('<textarea class=textAreaTeacher id=tag'+count+'></textarea> <textarea class=description id=description'+count+'></textarea> <br>');
            $('#tag'+count).click(function() {
                $('#tag'+count).val("");
            });
            $('#description'+count).click(function() {
                $('#description'+count).val("");
            });
            $('#tagsDiv').attr('data-count', count);
        }
        if (count>=6) {
            $('#tagsAdd').css('display','none');
        }
    });
    
    $('.textAreaTeacher').click(function() {
        var elem = this.id;
        $('#'+elem).val("");
    });
    
    $('.description').click(function() { 
        var elem = this.id;
        $('#'+elem).val("");
    });
    
    $('.example').click(function() { 
        var elem = this.id;
        $('#'+elem).val("");
    });
    
    $('#submitTeacher').click(function() {
        var source = $('#sourceTeacher').val();
        var excerpt = $('#excerptTeacher').val();
        
        var countHints = parseInt($('#hintsDiv').attr('data-count'));
        countHints+=1;
        var hints = [];
        for (var i=1; i<countHints; i++) {    
            var key = $('#hint'+i).val();
            if (key != "")
                hints.push(key);
        }
        
        var countExamples = parseInt($('#examplesDiv').attr('data-count'));
        countExamples+=1;
        var examples = [];
        for (var i=1; i<countExamples; i++) {    
            var key = $('#example'+i).val();
            if (key != "")
                examples.push(key);
        }
        
        var count = parseInt($('#tagsDiv').attr('data-count'));
        count+=1;
        var tags = {};
        for (var i=1; i<count; i++) {    
            var key = $('#tag'+i).val();
            var val = $('#description'+i).val();
            if (key != "")
                tags[key] = val;
        }
        
        $('.submittedTeacher').fadeIn(400).delay(3000).fadeOut(400); //fade out after 3 seconds

        //source and excerpt are strings. tags is a associative array with tag names as keys and tag descriptions as values. examples and hints are arrays.
        now.submitTeacherServer(source, excerpt, tags, hints, examples);
    });
    
    $('#csv').click(function() {
        now.logCSV();
    });
    
//  *************************************************  end teacher page *************************************************
    
}); 