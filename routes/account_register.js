/*
* Route when user wants to register or sign into an account
*/
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Account = mongoose.model('Account');

/* GET the register account page */
router.get('/', function(req, res) {
	res.render('front_page/register', {title: 'Register an account'});
});

/* POST from the register page. Does this work? */
router.post('/', function(req, res, next) {
	// We are gonna retrieve post data and send it to
	// mongodb and mongoose via our model...
	
	Account.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		lastLogin: Date.now()
	}, function(err) {
		if (err) // basic error handling, will have more later
			return next(err);
		res.redirect('/signin');
	});
});

module.exports = router;