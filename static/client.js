var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

now.ready(function () {
    $('#nextSentence').click(function (event) {
		prompt("I was clicked", "yes you were");
	});
    
    $('#chatbox').keypress(function (event) {
		if (event.keyCode === 13) { // enter
			var tag = "";
			if ($('#grammar').is(':checked')) tag = tag.concat(" G ");
			if ($('#logic').is(':checked')) tag = tag.concat(" L ");
			if ($('#style').is(':checked')) tag = tag.concat(" S ");
            var d = new Date();
            var msg_id = (d.getMonth()+d.getFullYear()+d.getTime()).toString()
			now.sendNewChat($('#chatbox').val(), tag, msg_id);
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

	now.gotNewChat = function(chatMessage, tag, msg_id) {
		$('#messages').append('<div class=msg id=msg_'+msg_id+' style="position:absolute; display:inline-block; width:15%; word-wrap: break-word; border:1px solid #999;background-color:#FFFF99;"> (sentence) ' +msg_id + ' '+ tag + '<br>' + chatMessage + '</div>');
	    
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