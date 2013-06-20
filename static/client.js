now.ready(function () {    
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
        
        now.sendNewChat($('#chatbox').val(), tag, msg_id, String(selectedText));
        $('#chatbox').val('');
        tag = "";
        $('#grammar').attr('checked', false);
        $('#logic').attr('checked', false);
        $('#style').attr('checked', false);
	});
    
    var sentences = $('#content').text().split(".");   
    
    $('#content').empty();
    
    for (var s in sentences) {
        var text = '<span class=grey id=sent_'+s+'>' + sentences[s] + '.</span>';
        if (s == sentences.length - 1) break;
        $('#content').append(text);
    }
    
    $('#sent_0').removeClass('grey');
    
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
    
    now.updateSentence = function(sentenceNum) {
        sentenceNum+=1;
        now.updateSentenceNumServer(sentenceNum);
        $('#sent_'+sentenceNum).removeClass('grey');
        $('#sent_'+(sentenceNum-1)).addClass('grey');
        document.getElementById("nextSentence").disabled= false;
        if (sentenceNum == sentences.length - 1) {
            for (var s in sentences) {
                $('#sent_'+s).removeClass('grey');
            }
            document.getElementById("nextSentence").disabled= true;
            $('div#usersReady').text("");
            $('div#pplReady').text("");
        }
    };
    
    $('#chatbox').keypress(function (event) {
		if (event.keyCode === 13) { // enter
			var tag = "";
			if ($('#grammar').is(':checked')) tag = tag.concat(" G ");
			if ($('#logic').is(':checked')) tag = tag.concat(" L ");
			if ($('#style').is(':checked')) tag = tag.concat(" S ");
            var d = new Date();
            var msg_id = (d.getMonth()+d.getFullYear()+d.getTime()).toString()
			now.sendNewChat($('#chatbox').val(), tag, msg_id, "");
			$('#chatbox').val('');
			tag = "";
			$('#grammar').attr('checked', false);
			$('#logic').attr('checked', false);
			$('#style').attr('checked', false);
			return false;
		}
	});
    
	now.moveMsg = function(id, pos) {
		$(id).css('top', pos.top+'px'); 
		$(id).css('left', pos.left+'px');
	};
    
    now.selecting = function(texty, msgID){
        document.getElementById('msg_'+msgID).style.zIndex = 2;
        var spanExists = document.getElementById('st_'+msgID);
        if (spanExists==null) {
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
            if($('#st_'+msgID).hasClass('selectedText')) {  
                $('#st_'+msgID).removeClass('selectedText');
            }
            else {
                $('#st_'+msgID).addClass('selectedText');

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
        now.sendNewChat(chatMessage, tag, msg_id, selectedText);
    }
    
	now.gotNewChat = function(chatMessage, tag, msg_id, sentence,selectedText) {
        var texty = escape(String(selectedText));
        var threadChat = $();
        var chatMsg = '<textarea rows="1" style="width:100%" class=msgChat id=chatbox_'+msg_id+'></textarea>';
        var thread = $('<div class=thread id=t_'+msg_id+'> <div class=msg id=msg_'+msg_id+' data-likes_'+msg_id+'= 0 data-ST = "'+selectedText+'" onclick=now.selecting(&apos;"'+texty+'"&apos;,'+msg_id+')>('+(sentence+1)+ ') <div id=tag_'+msg_id+'>'+ tag + '</div><br><div id=chatMsg_'+msg_id+'>' + chatMessage + '</div><span id=likes_'+msg_id+' style=display:none><br><button onclick=now.serverDragMsg('+msg_id+') id=drag_'+msg_id+' style=display:none>Drag Out</button><button onclick=now.likeMsg('+msg_id+') id=like_'+msg_id+'>Like</button><br>#Likes: <div id=numLikes_'+msg_id+'></div> </span></div>'+chatMsg+'</div>');
        
        $('#messages').append(thread);
        
        $('#chatbox_'+msg_id).keypress(function (event) {   
            if (event.keyCode === 13) {
                now.serverAddMsg(msg_id);
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
        
	    var ypos = 10;
	    var xpos = (parseInt(msg_id)%60)*10;
	    thread.css('top', ypos+'px');
	    thread.css('left', xpos+'px');
        
		thread.draggable({
            stop: function(event, ui) {
                var id = event.target.id;
                console.log("here "+id);
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
    
    now.addMsg = function(msg_id){
        //adding message to thread
            var d = new Date();
            var msgid = (d.getMonth()+d.getFullYear()+d.getTime()).toString()
            var chatbox = $('#chatbox_'+msg_id);
            var chatMsg = chatbox.val();
            var msg = '<div class=msg id=msg_'+msgid+' data-likes_'+msgid+'= 0><div id=chatMsg_'+msgid+'>' + chatMsg + '</div><span id=likes_'+msgid+' style=display:none><br><button onclick=now.likeMsg('+msgid+') id=like_'+msgid+'>Like</button><br>#Likes: <div id=numLikes_'+msgid+'></div> </span></div>';
            
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