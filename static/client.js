now.loadMessages = function(messages, sentence) {
    now.startup(sentence, "text");
    for(var i =0; i<messages.length; i++) {
        var parameters = messages[i];
        if (parameters[0] == "gnc") {
            //now.gotNewChat(chatMessage, tag, msg_id, sentence, selectedText, msgNum)
            now.gotNewChat(parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6]);
        }
        if (parameters[0] == "mm") {
            //now.moveMsg(id, pos)
            now.moveMsg(parameters[1], parameters[2]);
        }
        if (parameters[0] == "mt") {
            //now.mergeThread(threadSource, threadTarget)
            now.mergeThread(parameters[1], parameters[2]);
        }
//        if (parameters[0] == "ns") {
//            // now.nextSentence(users, numReady)
//            now.nextSentence(parameters[1], parameters[2]);
//        }
//        if (parameters[0] == "es") {
//            //now.endSession(users, numReadyES)
//            now.endSession(parameters[1], parameters[2]);
//        }
//        if (parameters[0] == "us") {
//            //now.updateSentence(sentence)
//            now.updateSentence(parameters[1]);
//        }
        if (parameters[0] == "ul") {
            //now.updateLikes(msgID)
            now.updateLikes(parameters[1]);
        }
        if (parameters[0] == "am") {
            //now.addMsg(msgID, chatText)
            now.addMsg(parameters[1], parameters[2]);
        }
        if (parameters[0] == "dm") {
            //now.dragMsg(msgID)
            now.dragMsg(parameters[1]);
        }
        if (parameters[0] == "nmd") {
            //now.newMsgDivsentenceNum, height)
            now.newMsgDiv(parameters[1], parameters[2]);
        }
        if (parameters[0] == "ct") {
            //now.changeText(text)
            now.changeText(parameters[1]);
        }
        if (parameters[0] == "ls") {
            //now.lastSentence(maxSentences)
            now.lastSentence(parameters[1]);
        }
    }
};



now.ready(function () {    
    $('#changeText').click(function (event) {
        var password = prompt("what's the password?");
        if(password == "NORA") {
            document.getElementById('changeTextArea').style.display = '';
        }
        else {
            alert("Sorry, wrong password!");
        }
    });
    
    
    $('#changeTextArea').keypress(function (event) {
		if (event.keyCode === 13) { // enter
            var text = $('#changeTextArea').val();
            now.serverChangeText(text);
			$('#changeTextArea').val('');
            document.getElementById('changeTextArea').style.display = 'none';
		}
	});
        
    var paraOriginal;
    now.changeText = function(text) {
        document.getElementById('content').innerHTML = text;
        now.startup(0, "html");
    }
    

    now.startup = function (sentence, type) {
        var sentences;
        if(type =="html") sentences = document.getElementById('content').innerHTML.split(".");
        else sentences = $('#content').text().split(".");
        $('#content').empty();
        var numSentences = 0;
        for (var s in sentences) {
            numSentences += 1;
            var text = '<span class=grey id=sent_'+s+'>' + sentences[s] + '.</span>';
            if (s == sentences.length - 1) break;
            $('#content').append(text);
        }
        $('#sent_'+sentence).removeClass('grey');
        now.serverNumMaxSentences(numSentences);
    }
    
    
    $('#selectedText').click(function (event) {
        var selectedText=(
            window.getSelection
            ?
            window.getSelection()
            :
            document.getSelection
            ?
                document.getSelection()
            :
                document.selection.createRange().text
        );
        var tag = "";
        if ($('#grammar').is(':checked')) tag = tag.concat(" G ");
        if ($('#logic').is(':checked')) tag = tag.concat(" L ");
        if ($('#style').is(':checked')) tag = tag.concat(" S ");
        var d = new Date();
        var msg_id = (d.getMonth()+d.getFullYear()+d.getTime()).toString()
        
        now.serverGotNewChat($('#chatbox').val(), tag, msg_id, String(selectedText));
        $('#chatbox').val('');
        tag = "";
        $('#grammar').attr('checked', false);
        $('#logic').attr('checked', false);
        $('#style').attr('checked', false);
	});

    $('#endSession').click(function (event) {
        now.incrementUsersReadyES();
		now.endSessionServer();
	});
    
    now.endSession = function(users, numReady) {
        $('div#usersReadyES').text("Users Ready:");
        $('div#pplReadyES').text(numReady+"/"+users);
        if(numReady >= users) {
            $('div#pplReadyES').text("0/"+users);
            now.updateServerES();
        }
    }
    
    now.updateES = function(sentence) {
        $('#col1').children('div').each(function() {
            $(this).remove();
            now.reinitializeServer();
        });
        $('#col1').append('<div class=messages id=messages0></div>');
        now.startup(0, "text");
    };
    
    now.reinitializeES = function() {
        document.getElementById("endSession").disabled = false; 
        $('div#usersReadyES').text("");
        $('div#pplReadyES').text("");
    };
    
    $('#nextSentence').click(function (event) {
        now.incrementUsersReady();
		now.nextSentenceServer();
	});
    
    now.nextSentence = function(users, numReady) {
        $('div#usersReady').text("Users Ready:");
        $('div#pplReady').text(numReady+"/"+users);
        if(numReady >= users) {
            $('div#pplReady').text("0/"+users);
            now.updateServer();
        }
    }
    
    now.lastSentence = function(maxSentenceNum) {
        for (var i =0; i<maxSentenceNum; i++) {
            $('#sent_'+i).removeClass('grey');
        }
        document.getElementById("nextSentence").disabled= true;
        $('div#usersReady').text("");
        $('div#pplReady').text("");
    }
    
    now.updateSentence = function(sentenceNum, height, maxSentenceNum) {
        $('#sent_'+sentenceNum).removeClass('grey');
        $('#sent_'+(sentenceNum-1)).addClass('grey');
        document.getElementById("nextSentence").disabled= false;
        now.newMsgDiv(sentenceNum, height);
        if (sentenceNum == maxSentenceNum - 1) {
            now.serverLastSentence();
        }
    };
    
    now.newMsgDiv = function (sentenceNum, height) {
        $('#messages'+(sentenceNum-1)).css('height', height+200+'px');
        $('#col1').append('<div class=messages id=messages'+sentenceNum+'></div>');
        var objDiv = document.getElementById('col1');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    
    $('#chatbox').keypress(function (event) {
		if (event.keyCode === 13) { // enter
			var tag = "";
			if ($('#grammar').is(':checked')) tag = tag.concat(" G ");
			if ($('#logic').is(':checked')) tag = tag.concat(" L ");
			if ($('#style').is(':checked')) tag = tag.concat(" S ");
            var d = new Date();
            var msg_id = (d.getMonth()+d.getFullYear()+d.getTime()).toString()
			now.serverGotNewChat($('#chatbox').val(), tag, msg_id, "");
			$('#chatbox').val('');
			tag = "";
			$('#grammar').attr('checked', false);
			$('#logic').attr('checked', false);
			$('#style').attr('checked', false);
			return false;
		}
	});
    
	now.moveMsg = function(id, pos) {
        if (pos.top <0) {
            $(id).css('top', '5px'); 
        }
        else {
            var newTop = pos.top + document.getElementById('col1').scrollTop;
            $(id).css('top', newTop+'px');
        }
        if (pos.left <0) {
            $(id).css('left', '0px'); 
        }
        else if (pos.left>600) {
            $(id).css('left', '600px');
        }
        else {
            $(id).css('left', pos.left+'px');
        }
	};
    
    now.selecting = function(texty, msgID){
        var selectedText = $('#msg_'+msgID).attr('data-ST');
        if(selectedText != "undefined") {
            var spanExists = document.getElementById('st_'+msgID);
            if (spanExists==null) { 
                paraOriginal = String(document.getElementById('content').innerHTML);
                var searching = unescape(texty);
                searching = searching.substring(1,searching.length-1);
                var para = String(document.getElementById('content').innerHTML);
                var start = para.indexOf(searching);
                var textSpan = '<span class=selectedText id=st_'+msgID+'>' + para.substring(start, (start+searching.length)) + '</span>';
                var newpara = para.substring(0,start)+ textSpan+ para.substring((start+searching.length), para.length);
                document.getElementById('content').innerHTML = newpara;
                document.getElementById('st_'+msgID);
            }
            else {
                document.getElementById('content').innerHTML = paraOriginal;
//                if($('#st_'+msgID).hasClass('selectedText')) {  
//                    $('#st_'+msgID).removeClass('selectedText');
//                }
//                else {
//                    $('#st_'+msgID).addClass('selectedText');
//        
//                }
            }
        }
    }
    
    now.likeMsg = function(msgID) {
        $('#like_'+msgID).remove();
        now.serverLikeMsg(msgID);
    }
    
    now.updateLikes = function(msgID) {
        var prevLiked = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID));
        prevLiked += 1;
        document.getElementById('msg_'+msgID).setAttribute('data-likes_'+msgID, prevLiked);
    }
    
    now.dragMsg = function(msgID) {
        //msgID is already just the number
        var chatMessage = $('#chatMsg_'+msgID).text();
        var tag = $('#tag_'+msgID).text();
        var selectedText = $('#msg_'+msgID).attr('data-ST');
        document.getElementById('msg_'+msgID).remove();
        var d = new Date();
        var msg_id = (d.getMonth()+d.getFullYear()+d.getTime()).toString()
        now.serverGotNewChat(chatMessage, tag, msg_id, selectedText);
    }
    
	now.gotNewChat = function(chatMessage, tag, msg_id, sentence, selectedText, msgNum) {
        var texty = escape(String(selectedText));
        var threadChat = $();
        var chatMsg = '<textarea rows="1" style="width:100%" class=msgChat id=chatbox_'+msg_id+'></textarea>';
        var thread = $('<div class=thread id=t_'+msg_id+'> <div class=msg id=msg_'+msg_id+' data-likes_'+msg_id+'= 0 data-ST = "'+selectedText+'" onclick=now.selecting(&apos;"'+texty+'"&apos;,'+msg_id+')>('+(sentence+1)+ ') <div id=tag_'+msg_id+'>'+ tag + '</div><br><div id=chatMsg_'+msg_id+'>' + chatMessage + '</div><span id=likes_'+msg_id+' style=display:none><br><button onclick=now.serverDragMsg('+msg_id+') id=drag_'+msg_id+' style=display:none>Drag Out</button><button onclick=now.likeMsg('+msg_id+') id=like_'+msg_id+'>Like</button><br>#Likes: <div id=numLikes_'+msg_id+'></div> </span></div>'+chatMsg+'</div>');
        
        $('#messages'+sentence).append(thread);
        
        $('#chatbox_'+msg_id).keypress(function (event) {   
            if (event.keyCode === 13) {
                var chatText = $('#chatbox_'+msg_id).val();
                now.serverAddMsg(msg_id, chatText);
            }
        });
        
        $('#msg_'+msg_id).hover(
            function() {
                var numLikes = $('#msg_'+msg_id).attr('data-likes_'+msg_id);
                $('div#numLikes_'+msg_id).text(numLikes);
                document.getElementById('likes_'+msg_id).style.display = '';
                //$(this).append($('<span><button onclick=now.likeMsg('+msg_id+') id=like_'+msg_id+'>Like</button><br>#Likes: '+numLikes+'</span>'));
            },
            function() {
                document.getElementById('likes_'+msg_id).style.display = 'none';
                //$(this).find('span').remove();
            }
        );
        
        var xpos = (msgNum%7)*100;
        thread.css('left', xpos+'px');
        //thread.css('top', ypos+'px'); 
        
		thread.draggable({
            stop: function(event, ui) {
                var id = event.target.id;
                console.log($(event.target).position());
                now.serverMoveMsg('#'+id, $(event.target).position());
            }
        });
		
	    thread.droppable({
            drop: function(event, ui) {
                console.log("I "+event.target.id+" was just dropped on by "+ui.draggable.attr('id'));
                var threadSource = event.target.id;
                var threadTarget = ui.draggable.attr('id');
                now.serverMergeThread(threadSource, threadTarget);
                
            }

	   });
	 
	};
    
    now.addMsg = function(msg_id, chatText){
        //adding message to thread
        var d = new Date();
        var msgid = (d.getMonth()+d.getFullYear()+d.getTime()).toString();
        var chatbox = $('#chatbox_'+msg_id);
        var chatMsg = chatText;
        var msg = '<div class=msg id=msg_'+msgid+' data-likes_'+msgid+'= 0 data-ST = ""><div id=tag_'+msgid+'></div><br><div id=chatMsg_'+msgid+'>' + chatMsg + '</div><span id=likes_'+msgid+' style=display:none><br><button onclick=now.serverDragMsg('+msgid+') id=drag_'+msg_id+' style=display:none>Drag Out</button><button onclick=now.likeMsg('+msgid+') id=like_'+msgid+'>Like</button><br>#Likes: <div id=numLikes_'+msgid+'></div> </span></div>';
        
        chatbox.before(msg);
        $('#msg_'+msgid).hover(
            function() {
                var numLikes = $('#msg_'+msgid).attr('data-likes_'+msgid);
                $('div#numLikes_'+msgid).text(numLikes);
                document.getElementById('likes_'+msgid).style.display = '';
            },
            function() {
                document.getElementById('likes_'+msgid).style.display = 'none';
            }
        );
        chatbox.val('');
    };
    
    now.mergeThread = function(threadSource, threadTarget) {
        var idT = threadSource.substring(2); 
        var tChat = $('#chatbox_'+idT);
        var msgs = $('#'+ threadSource + ' .msg');
        $('#'+threadTarget).prepend(msgs);
        $('#'+threadSource).remove();
        $('#'+threadTarget).children('div').each(function() {
            var idChat = $(this).attr('id');
            var idNum = idChat.substring(4);
            if(idNum != idT) {
                $(this).find('button').css('display', '');
            }
        });
        //$('#'+threadTarget).attr('id', threadSource);
    };
    
}); 