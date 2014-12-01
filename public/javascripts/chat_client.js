var chatSocket = io.connect('/chat');

$(document).ready(function() {
	// TODO - wire this up
	var chatApp = new Chat(chatSocket);
	var count = 0;
	var roomID = roomNumber;
	// test only. all users will join room '1'
	/*
	window.setInterval(function() {
		var message = "hi " + (count++);

		// test
		chatSocket.emit('chat message', {
			'room': 1,
			'message': message
		});

		addMessageToChat(message, false);
	}, 200);
	*/

	chatSocket.emit('join room', {'roomNumber': roomID});

	// test from editor.js
	chatSocket.on('hello', function(data) {
		addMessageToChat(data.hello, false);
	});

	// quick tests
	chatSocket.on('nameResult', function(result){
		var message = 'You are now ' + result.name;

		addMessageToChat(message, true);
	});

	chatSocket.on('message', function(result) {
		addMessageToChat(result.message, true);
	});

	$('#send-message').focus();

	$('#send-form').submit(function(event) {
		var message = $('#send-message').val();

		// test
		chatSocket.emit('chat message', {
			'room' : 1,
			'message': message
		});

		addMessageToChat(message, false);

		$('#send-message').val('');

		return false;
	});
});

/*
* Creates a new list item with message and append it to the chat
* Arguments:
* message - the message to append to chat
* bold - option to bold the message
*
* Returns - nothing
*/
function addMessageToChat(message, bold) {
	if (bold)
		$('#messages').append("<li><b>" + message + "</li></b>");
	else
		$('#messages').append("<li>" + message + "</li>");
}

/*
* TODO - will be used after user has created a room,
* in which we will send the room number to the server.
*/
function getRoomNumber() {
	var path = $(location).attr('pathname');

	// split the path to get room. room is at index 2.
	var roomNumber  = path.split('/')[2];

	return roomNumber;
}