var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var mongoose = require('mongoose');
var Room = mongoose.model('Room');

/* GET home page. */
router.get('/', function(req, res, next) {
  // we have to figure out a way to retrieve all the room data from db
  // and render them in views as links.
  // Note that this should not be called everytime a new request is retrieved.
  // Find a way to cache the rooms and only update when a new room has been
  // created.
  Room.find({},
            '_id username roomtitle',
            function(err, rooms) {
                if (err)
                    next(err);
                
                // I think the easiest way to do this is just do a string replace
                for (var i = 0; i < rooms.length; i++) {
                  var removedReservedChars = rooms[i].roomtitle.replace(/[^a-zA-Z0-9. ]/g, '').toLowerCase(); 
                  rooms[i].rmURLPathTitle = removedReservedChars.replace(/ /g, '-');
                   
                  //console.log(rooms[i].roomURLPathTitle);
                }
                // pass rooms as a value to res.render
                res.render('front_page/index', { title: 'Welcome to CodeReview!', 
                                                 roomsinfo: rooms});
            });
});

/* GET to log out of the session */
router.get('/logout', function(req, res) {
	if (req.session.loggedin) {
		req.session.destroy();
		res.redirect('/');
	}
});

/*
* Get the room when user clicks on a link at the front page.
* Should I put this in its own route file?
*/
router.get('/rooms/:id/:name', function(req, res, next) {
  //console.log(req.params.id);
  //console.log(req.params.name);
  // find the room data from database.
  Room.findById(req.params.id, 
    'roomtitle roomsummary _id',
    function(err, room) {
      if (err)
        next(err);
    
      // we are going to render the chat room page here.
      // test render socket_test.jade
      //res.render('socket_test.jade');

      res.render('front_page/chatroom/room', {
        title: room.roomtitle,
        summary: room.roomsummary,
        roomID: room._id
      });

  }); 
});

router.get('/rooms/', function(req, res, next) {
  console.log("list of rooms");
});


/* Middleware called when user logs out. Used with test page
router.use(function (req, res, next) {
    if (req.query.logoff === 'true') {
        req.session.destroy();
        res.redirect('/');
    } else {   
        next();
    }
});
*/

// TEST PAGE 
/*
router.get('/test', function(req, res) {
	res.render('test');
});
*/
module.exports = router;
