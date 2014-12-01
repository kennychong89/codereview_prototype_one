/*
* Route when a user wants to create a room, assuming that the 
* user is logged in.
*/
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Room = mongoose.model('Room');
/*
* GET the create room form page
*/
router.get('/', function(req, res) {
	// expect only user that are logged in to be able to create room.
	if (req.session.loggedin) {
		// render the create room page.
		res.render('front_page/createroom');
	} else {
		// set a flash message to pass error
		req.flash('error', 'Please sign into your account to create a new room.');
		
		// tell user to log in first. redirect them to signin page.
		res.redirect('/signin');
		//res.render('front_page/signin');
	}
});

/*
* POST data when user creates a new room.
*/
router.post('/', function(req, res, next) {
	// retrieve values from room form
	var roomTitle = req.body.roomname;
	var roomSummary = req.body.roomsummary;

	res.location('/');
	// quick test
	/*
	res.render('test', {roomname: roomTitle,
						 roomsummary: roomSummary});
	*/

	// send data to the database
	Room.create({
		username: req.session.name,
		roomtitle: roomTitle,
		roomsummary: roomSummary,
	}, function(err) {
		if (err)
			return next(err);

		// do something else here.
		res.render('test', {
			roomname: roomTitle,
			roomsummary: roomSummary,
		});
	});
});

module.exports = router;