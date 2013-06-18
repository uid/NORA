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
        console.log(sentenceNum);
        console.log(sentences.length - 1);
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
    
	now.gotNewChat = function(chatMessage, tag, msg_id, sentence,selectedText) {
        var texty = escape(String(selectedText));
        $('#messages').append('<div class=msg id=msg_'+msg_id+' onclick=now.selecting(&apos;"'+texty+'"&apos;,'+msg_id+')>('+(sentence+1)+ ') '+ tag + '<br>' + chatMessage + '</div>');
        /*  var text = '<span class=selectedText id=st_'+msg_id+'>' + selectedText + '.</span>';   
        $('#messages').append('<div class=msg id=msg_'+msg_id+' onclick=now.selecting('+msg_id+')>'+(sentence+1)+ ' '+ tag + '<br>' + chatMessage + '</div>');*/
         
	    var ypos = 10;
	    var xpos = (parseInt(msg_id)%60)*10;
	    $('#msg_'+msg_id).css('top', ypos+'px');
	    $('#msg_'+msg_id).css('left', xpos+'px');
        
		$(function() {
			$('#msg_'+msg_id).draggable({
				stop: function(event, ui) {
					var id = '#' + event.target.id;
					now.serverMoveMsg(id, $(id).position());
				}
			});
		});
		
	    $(function() {
			$('#msg_'+msg_id).droppable({
				drop: function(event, ui) {
					var id = '#' + event.target.id;
					var idDrop = '#' + this.id;
					console.log("I was just dropped on!");
					now.moveMsg($(this), ($(id).position()));
				}
			});
	   });
	 
	};
    
    
}); 