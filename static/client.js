now.loadMessages = function(messages, sentence, likes) {
    now.startup(sentence, "html");
    for(var i =0; i<messages.length; i++) {
        var parameters = messages[i];
        if (parameters[0] == "gnc") {
            //now.gotNewChat(chatMessage, tag, msg_id, sentence, selectedText, msgNum, likes)
            now.gotNewChat(parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], likes[parameters[3]]);
        }
        else if (parameters[0] == "mm") {
            //now.moveMsg(id, pos, msgNum)
            now.moveMsg(parameters[1], parameters[2], parameters[3]);
        }
        else if (parameters[0] == "mt") {
            //now.mergeThread(threadSource, threadTarget)
            now.mergeThread(parameters[1], parameters[2]);
        }
        else if (parameters[0] == "ul") {
            //now.updateLikes(msgID)
            now.updateLikes(parameters[1]);
        }
        else if (parameters[0] == "ud") {
            //now.updateLikes(msgID)
            now.updateDislikes(parameters[1]);
        }
        else if (parameters[0] == "am") {
            //now.addMsg(msgID, msg_id chatText)
            now.addMsg(parameters[1], parameters[2], parameters[3]);
        }
        else if (parameters[0] == "dm") {
            //now.dragMsg(msgID, sentence, msgNum, msg_id);
            now.dragMsg(parameters[1],  parameters[2], parameters[3], parameters[4]);
        }
        else if (parameters[0] == "nmd") {
            //now.newMsgDivsentenceNum, height)
            now.newMsgDiv(parameters[1], parameters[2]);
        }
        else if (parameters[0] == "ct") {
            //now.changeText(text)
            now.changeText(parameters[1]);
        }
        else if (parameters[0] == "ls") {
            //now.lastSentence(maxSentences)
            now.lastSentence(parameters[1]);
        }
    }
};


now.ready(function () {    
    $('#changeText').click(function (event) {
        var password = prompt("what's the password?");
        if(password == "nora") {
            document.getElementById('changeTextArea').style.display = '';
        }
        else {
            alert("Sorry, wrong password!");
        }
    });
        
    var paraOriginal;
    now.changeText = function(text) {
        document.getElementById('content').innerHTML = text;
        now.startup(0, "html");
    }
    

    now.startup = function (sentence, type) {
        var sentences;
        if(type == "html") sentences = document.getElementById('content').innerHTML.split(". <br>");
        else sentences = $('#content').text().split(".");
        $('#content').empty();
        var numSentences = 0;
        for (var s in sentences) {
            numSentences += 1;
            var text = '<span class=grey id=sent_'+s+'>' + sentences[s] + '. <br></span>';
            if (s == sentences.length-1) break;
            $('#content').append(text);
        }
        $('#sent_'+sentence).removeClass('grey');
        if(type == "html") $('#sentence').html($('#sent_'+sentence).html());
        else $('#sentence').text($('#sent_'+sentence).text);
        
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
        $('#col1').append('<div class=messages><div id=messages0></div></div>');
        now.startup(0, "text");
    };
    
    now.reinitializeES = function() {
        document.getElementById("endSession").disabled = false; 
        $('div#usersReadyES').text("");
        $('div#pplReadyES').text("");
    };
    
    now.nextSentence = function(users, numReady) {
        $('div#usersReady').text("Users Ready:");
        $('div#pplReady').text(numReady+"/"+users);
        if(numReady >= users) {
            $('div#pplReady').text("0/"+users);
            now.updateServer();
        }
    }
    
    $('#nextSentence').click(function (event) {
        now.incrementUsersReady();
        now.nextSentenceServer();
    });
    
    now.lastSentence = function(maxSentenceNum) {
        for (var i =0; i<maxSentenceNum; i++) {
            $('#sent_'+i).removeClass('grey');
        }
        $("#menuSentence").css("display", "none");
        $("#sentence").css("display", "none");
        $("#correctSpacing").css("display", "none");
        $('#chat').css("height", "25%");
        $('.messages').css("height", "70%");
        var num=maxSentenceNum-1;
        $('#messages'+num).css("height","500px");
//        document.getElementById("nextSentence").disabled= true;
//        $('div#usersReady').text("");
//        $('div#pplReady').text("");
    }
    
    now.updateSentence = function(sentenceNum, height, maxSentenceNum) {
        $('#sent_'+sentenceNum).removeClass('grey');
        $('#sent_'+(sentenceNum-1)).addClass('grey');
        document.getElementById("nextSentence").disabled= false;
        $('#sentence').html($('#sent_'+sentenceNum).html());
//        $('#sentence').text($('#sent_'+sentenceNum).text());
        now.newMsgDiv(sentenceNum, height);
        if (sentenceNum == maxSentenceNum - 1) {
            now.serverLastSentence();
        }
    };
    
    now.newMsgDiv = function (sentenceNum, height) {
        var start = '<div class=msgs id=messages'+sentenceNum+' style=height:420px>';
        var col0 = '<div id=msgCol0_'+sentenceNum+' style=width:20%;float:left;></div>'; 
        var col1 = '<div id=msgCol1_'+sentenceNum+' style=width:20%;float:left;></div>'; 
        var col2 = '<div id=msgCol2_'+sentenceNum+' style=width:20%;float:left;></div>'; 
        var col3 = '<div id=msgCol3_'+sentenceNum+' style=width:20%;float:left;></div>'; 
        var col4 = '<div id=msgCol4_'+sentenceNum+' style=width:20%;float:left;></div>';                                     
        var end = '</div>';
        var nmd = start + col0 + col1 + col2 + col3 + col4 + end;
        $('#messages').append(nmd);
        var objDiv = document.getElementById('messages');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    
    $('.tags').click(function() {
        if($(this).css("background-color")=="rgb(220, 220, 220)") {
            //not blue 
            $(this).css("background-color", "rgb(60, 200, 250)");
        }
        else {
            //change to not blue
            $(this).css("background-color", "rgb(220, 220, 220)");
        }
    });
    
    $('#chatbox').keypress(function (event) {
		if (event.keyCode === 13) { // enter
			now.newMessage();
		}
	});
    
    $('#submitChat').click(function (event) {
        now.newMessage();
    });
    
    now.newMessage = function() {
        var tag = "";
        $('.tags').each(function() {
            if($(this).css("background-color")=="rgb(60, 200, 250)") {
                $(this).css("background-color", "rgb(220, 220, 220)");
                 tag = tag + "#" +String(this.id)+ " ";
            }
        });
        var d = new Date();
        var msg_id = (d.getMonth()+d.getFullYear()+d.getTime()).toString()
        now.serverGotNewChat($('#chatbox').val(), tag, msg_id, "");
        $('#chatbox').val('');
    };

	now.moveMsg = function(id, pos, msgNum) {
//        //parseInt($('#msgCol0_0').css('width'))-parseInt($('#t_1373560288061').css('width'))+parseInt($('#msgCol0_0').css('width'))*colNumExactID
//        var col = $(id).parent().attr('id');
//        var colNum = parseInt(col.substring(6,7));
//        var colWidth = parseInt($('#'+col).css('width'));
////        var threadWidth = parseInt($(id).css('width'));   
////        var leftOffset = (colWidth - threadWidth)+colWidth*colNum;
////        var left = pos.left - leftOffset;
        var colOffset = $('#col1').offset();
        $(id).css('left', pos.left+'px');
//        
//        var threadHeight = parseInt($(id).css('height'));
//        var border = parseInt($('.msgs').css('border-top-width'));
//        var padding = parseInt($('.msgs').css('padding-top'));
//        var top = pos.top - ( border + padding + (msgNum%5*threadHeight));
        var top = pos.top;
        $(id).css('top', top+'px');
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
            }
        }
    }
    
    now.likeMsg = function(msgID) {
        if( $('#plusOne_'+msgID).css("background-color")=="rgb(220, 220, 220)") {
            $('#plusOne_'+msgID).css("background-color", "rgb(60, 200, 250)");
            var numLikes = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID))+1;
            $('span#numLikes_'+msgID).text('+ '+numLikes);
            now.serverLikeMsg(msgID);
        }
        else {
            var numLikes = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID))-1;
            $('span#numLikes_'+msgID).text('+ '+numLikes);
            $('#plusOne_'+msgID).css("background-color", "rgb(220,220,220)");
            now.serverDislikeMsg(msgID);
        }
    }
    
    now.updateDislikes = function(msgID) {
        var prevLiked = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID));
        prevLiked -= 1;
        document.getElementById('msg_'+msgID).setAttribute('data-likes_'+msgID, prevLiked);
    }
    
    now.updateLikes = function(msgID) {
        var prevLiked = parseInt($('#msg_'+msgID).attr('data-likes_'+msgID));
        prevLiked += 1;
        document.getElementById('msg_'+msgID).setAttribute('data-likes_'+msgID, prevLiked);
    }
    
    now.dragMsg = function(msgID, sentence, msgNum, msg_id) {
        //msgID is already just the number
        var chatMessage = $('#chatMsg_'+msgID).text();
        var tag = $('#tag_'+msgID).text();
        var selectedText = $('#msg_'+msgID).attr('data-ST');
        document.getElementById('mt_'+msgID).remove();
        now.gotNewChat(chatMessage, tag, msg_id, sentence, selectedText, msgNum);   
    }
    
	now.gotNewChat = function(chatMessage, tag, msg_id, sentence, selectedText, msgNum, numLikes) {
        if (numLikes == undefined) numLikes =0;
        var texty = escape(String(selectedText));
        var threadStart = '<div class=thread id=t_'+msg_id+' style=float:right>';
        var msgntagsStart = '<div class=msgntags id=mt_'+msg_id+'>'
        var msgStart = '<div class=msg id=msg_'+msg_id+' data-likes_'+msg_id+'= 0 data-ST = "'+selectedText+'" onclick=now.selecting(&apos;"'+texty+'"&apos;,'+msg_id+')>';
        var end = '</div>';
        var tag = '<span id=tag_'+msg_id+' style="font-size:x-small;">'+ tag + '</span>';
        var chatMessageStart = '<div id=chatMsg_'+msg_id+'>';
        var drag = '<span id=dragButton_'+msg_id+' style="display:none; position:absolute; right:2">'+
                        ' <input onclick=now.serverDragMsg('+msg_id+') id=drag_'+msg_id+' type=image src=drag.png style=width:15px;>'+
                    '</span>';
        var tagsnlike = '<div id=tagsnlike style= "background-color:#F0FFFF; border-left:1px solid #000; border-right:1px solid #000; border-bottom:1px solid #000;">'+
                   '<span style=background-color:#F0FFFF;width:20%;height:20%;>'+
                        '<span id=likeButton_'+msg_id+'>'+
                                            //this.disabled=true;
                                '<button class=plusOne id=plusOne_'+msg_id+' onClick="now.likeMsg('+msg_id+');">' +
                                    '<span id=numLikes_'+msg_id+' style="font-size:x-small;">+ '+numLikes+'</span>' + 
                                '</button>'+
//                            ' <input onclick=now.likeMsg('+msg_id+') id=like_'+msg_id+' type=image src=like.png style=width:8.5%;>'+
                        '</span>'+  tag +
                    '</span>'+drag+'</div>';
        
        var chatbox = '<textarea rows="1" style="width:100%" class=msgChat id=chatbox_'+msg_id+'></textarea>';
        var thread = $(threadStart + msgntagsStart + msgStart + chatMessageStart + chatMessage + end + end + tagsnlike + end + chatbox + end);
        var col = msgNum%5;
        $('#msgCol'+col+'_'+sentence).append(thread);
        
        $('#chatbox_'+msg_id).keypress(function (event) {   
            if (event.keyCode === 13) {
                var chatText = $('#chatbox_'+msg_id).val();
                var d = new Date();
                var msgid = (d.getMonth()+d.getFullYear()+d.getTime()).toString();
                now.serverAddMsg(msgid, msg_id, chatText);
            }
        });
        
        $('#msg_'+msg_id).hover(
            function() {
                var numLikes = $('#msg_'+msg_id).attr('data-likes_'+msg_id);
                $('span#numLikes_'+msg_id).text('+ '+numLikes);
            },
            function() {
            }
        );
        
		thread.draggable({
            stop: function(event, ui) {
                var id = event.target.id;
                console.log("position ");
                console.log($(event.target).position());
                console.log("offset ");
                console.log($(event.target).offset());
                
                now.serverMoveMsg('#'+id, $(event.target).offset());
            }
        });
		
	    thread.droppable({
            drop: function(event, ui) {
                console.log("I "+event.target.id +" was just dropped on by "+ui.draggable.attr('id'));
                var threadSource = event.target.id;
                var threadTarget = ui.draggable.attr('id');
              //  console.log(threadSource +' ts & tt '+ threadTarget);
                now.serverMergeThread(threadSource, threadTarget);
            }

	   });
	 
	};
    
    now.addMsg = function(msgid, msg_id, chatText){
        var msgStart = '<div class=msg id=msg_'+msgid+' data-likes_'+msgid+'= 0 data-ST = "">';
        var end = '</div>';
        var msgntags = '<div class=msgntags id=mt_'+msgid+'>';
        var chatMessageStart = '<div id=chatMsg_'+msgid+'>';
        var likes = '<div id=tagsnlike style= "background-color:#F0FFFF;border-left:1px solid #000; border-right:1px solid #000; border-bottom:1px solid #000;">'+
            '<span style=background-color:#F0FFFF;width:20%;height:20%;>'+
                        '<span id=likeButton_'+msgid+'>'+
                            ' <input onclick=now.likeMsg('+msgid+') id=like_'+msgid+' type=image src=like.png style=width:10%; height:10%;>'+
                        '</span>'+
                        
                        '<span id=numLikes_'+msgid+' style="font-size:x-small"> 0 </span> '+
                    '</span>';
        var chatbox = $('#chatbox_'+msg_id);
        var msg = msgntags+msgStart + chatMessageStart + chatText + end + end + likes +end;
        chatbox.before(msg);
        $('#msg_'+msgid).hover(
            function() {
                var numLikes = $('#msg_'+msgid).attr('data-likes_'+msgid);
                $('span#numLikes_'+msgid).text(' '+numLikes);
            },
            function() {
            }
        );
        chatbox.val('');
    };
    
    now.mergeThread = function(threadSource, threadTarget) {
        var idS = threadSource.substring(2); 
        var idT = threadTarget.substring(2);
        var tChat = $('#chatbox_'+idS);        
    //    console.log('after passing '+ threadSource +' ts & tt '+ threadTarget);
        var msgs = $('#'+ threadSource + ' .msgntags');
        $('#'+threadTarget).prepend(msgs);
        $('#'+threadSource).remove();
        $('#'+threadTarget).attr('id',threadSource);
        $('#'+threadSource).children('div').each(function() {
            var idChat = $(this).attr('id');
            var idNum = idChat.substring(3);
            if(idNum != idS) {
                $('span#dragButton_'+idNum).css('display', '');
            }
        });
        //$('#'+threadTarget).attr('id', threadSource);
    };
    
}); 