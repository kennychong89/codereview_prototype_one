var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var flashmsg = require('express-messages');
var socketio = require('socket.io');

var memoryStore = session.MemoryStore;
var sessionStore = new memoryStore();
var SessionSockets = require('session.socket.io-express4');

// models
var db = require('./models/db');

// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var accountRegister = require('./routes/account_register');
var accountSignin = require('./routes/account_signin');
var room = require('./routes/room');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

/*
sessionSockets.of('/test').on('connection', function(err, socket, sesssion) {
    socket.emit('hello world', {hello: 'world'});
    socket.emit('does session work', {sessions: session.test});
});
*/

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({secret: 'dogewowsuchsecret',
                 resave: true,
                 store: sessionStore,
                 saveUninitialized: true,
                 cookie: {maxAge: 60000}}));

app.use(function(req, res, next) {
    //console.log(req.session.loggedin);

    // res.locals save information for templates to use.
    if (req.session.loggedin) {
        res.locals.username = req.session.name;
        res.locals.useremail = req.session.email;
        res.locals.id = req.session.id;   
        res.locals.loggedin = req.session.loggedin;
    }
    
    next();
});

app.use(function(req, res, next) {
    res.locals.messages = flashmsg(req, res);
    //res.locals.error = req.flash('error');
    next();
});

app.use('/', routes);
app.use('/users', users);

// account route
app.use('/register', accountRegister)
app.use('/signin', accountSignin);

// room route
app.use('/createroom', room);
//app.use('/rooms', room);

// will this work?
var server = require('http').createServer(app);
var io = socketio.listen(server);

var sessionSockets = new SessionSockets(io, sessionStore, cookieParser());

//var testSocket = require('./models/testsession_socket.js').listen(sessionSockets);
var chatSocket = require('./models/chat_socket.js').listen(sessionSockets);
var editorSocket = require('./models/editor_socket.js').listen(io);
server.listen(app.get('port'));
//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
