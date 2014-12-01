/*
* Route when user wants to register or sign into an account.
*/
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Account = mongoose.model('Account');

/* GET the signin account page */
router.get('/', function(req, res) {
	res.render('front_page/signin', {title: 'Sign into account'});
});

/* POST form data to sign in */
router.post('/', function(req, res, next) {
	// find the user given the post data
	var userEmail = req.body.email;
	var userPassword = req.body.password;

	// of course, some insanity check later.

	// using credentials to find user
	Account.findOne({email : userEmail,
				  password: userPassword}, 
				  'username email _id',
				  function(err, user) {
				  	if (err)
				  		return next(err);
				  	if (!user) {
				  			// set a flash message to pass error
							req.flash('error', 'Incorrect e-mail and/or password. Please try again.');
					  		res.redirect('/signin');
				  	} else {			  		
				  		// create session
						req.session.name = user.username;
						req.session.email = user.email;
						req.session.id = user._id;
						req.session.loggedin = true;

						// direct user back to home page
						res.redirect('/');
				  	}
				  }); 	
});

module.exports = router;