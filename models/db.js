/*
* Holds connection to mongodb database via mongoose. For now
* all of our application's schemas will be in this file. 
* Refactor later so that we only need one db and split everything
* else to instances of it.
*/
var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/codereview_p_two'

// connect to database, we should not be calling this over and over.
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

// close the mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose has been disconnected');
		process.exit(0);
	});
});

/*
* ACCOUNT SCHEMA
* The schema to create an account.
* Note: should we retrieve id by using the id mongodb creates when creating the document?
*/
var accountSchema = new mongoose.Schema({
	username: {type:String, unique: true, required: true },
	email: {type: String, unique: true, required: true }, 
	password: {type: String, required: true},// only for testing. find a way to encrypt this
	createdOn: { type: Date, 'default': Date.now },
	lastLogin: Date // TODO: this should be updated everytime user logs in.
});

mongoose.model('Account', accountSchema);

/*
* ROOM SCHEMA
* The schema that will create a model of a chatroom.
* Note: should we retrieve id by using the id mongodb creates when creating the document?
*/
var roomSchema = new mongoose.Schema({
	username: {type:String, required: true},
	roomtitle: {type:String, required: true},
	roomsummary: {type: String},
	createdOn: {type: Date, 'default': Date.now},
});

mongoose.model('Room', roomSchema);
