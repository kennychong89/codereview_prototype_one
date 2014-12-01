/*
* This will represent a chat room object that will contain information about the
* chat room, including room name, room owner, room number, number of users, etc. 
*/
var Room = function(roomNumber, roomName, roomOwnerName) {
	this.roomNumber = roomNumber;
	this.roomName = roomName;
	this.roomOwnerName = roomOwnerName;
};

Object.defineProperties(Room.prototype, {
	"roomNumber": {
		get: function() { return this.__roomNumber; },
		set: function(roomNumber) { return this.__roomNumber = roomNumber}
	},
	"roomName": {
		get: function() { return this.__roomName; },
		set: function(roomName) { return this.__roomName = roomName}
	},
	"roomOwnerName": {
		get: function() { return this.__roomOwnerName},
		set: function(roomOwnerName) { this.__roomOwnerName = roomOwnerName}
	}
});

module.exports = Room;