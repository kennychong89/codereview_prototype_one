// the chat socket module

// TODO - not using Room object at the moment
var Room = require('./chatroom.js');

var guestCounter = 0;
var currentRoom = {};
var nickNames = {};
var roomList = ['room1', 'room2', 'room3'];

exports.listen = function(io) {
	// create a custom namespace for chat socket.
	var chatNameSpace = io.of('/chat');

	chatNameSpace.on('connection', function(err, socket, session) {
		//console.log(session);

		// retrieve user name if he has signin, else assign user a  guest name
		if (session && session.loggedin) 
			guestCounter = assignName(socket, guestCounter, nickNames, session.name);
		else
			guestCounter = assignName(socket, guestCounter, nickNames, 'Guest');

		socket.on('join room', function(data) {
 			// ignore the data for now
 			// test case: all users will join the same room for now
 			joinRoom(socket, data.roomNumber);
		});

		socket.on('chat message', function(data) {
			var userMsg = data.message;

			sendChatMessage(socket, userMsg);
		});

		socket.on('disconnect', function() {
			leaveRoom(socket);
		});
	});
};

function assignName(socket, guestNumber, nickNames, username) {
	var name = username;
	
	if (username === 'Guest')
		name = username + ': #' + guestNumber;

	nickNames[socket.id] = name;

	socket.emit('nameResult', { name : name });

	return guestNumber + 1;
}

function joinRoom(socket, roomNumber) {
	socket.join(roomNumber);

	currentRoom[socket.id] = roomNumber;
	var userName = nickNames[socket.id];
	var currentRoomName = currentRoom[socket.id];

	// send user message that he has joined the room
	socket.emit('message', 
		{message: 'You have connected to room #: ' + roomNumber});

	socket.broadcast.to(currentRoomName).emit(
		'message', 
		{message: userName + " has joined the room"});

	// broadcast to the rest of the room
	//socket.broadcast.to(roomNumber);
}

function sendChatMessage(socket, message) {
	var currentRoomName = currentRoom[socket.id];
	var userName = nickNames[socket.id];

	socket.broadcast.to(currentRoomName).emit(
		'message', {message: userName + ": " + message});
}

// TODO - right now, just delete the user
function leaveRoom(socket) {
	var currentRoomName = currentRoom[socket.id];
	var userName = nickNames[socket.id];

	socket.broadcast.to(currentRoomName).emit(
		'message', {message: userName + " has left the room."}
		);

	// remove the user from chat
	delete nickNames[socket.id];
}

// TODO
function createRoom(id, roomName, owner) {

}