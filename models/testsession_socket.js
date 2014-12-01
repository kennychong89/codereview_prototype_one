// test session socket.
exports.listen = function(io) {
	var test = io.of('/test');

	test.on('connection', function (err, socket, session) {
		
		//console.log(session);
		socket.emit('hello world', {hello: 'world'});
		socket.emit('does session work', {sessions: session.loggedin});
	});
};