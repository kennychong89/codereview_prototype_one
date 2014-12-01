var testSessionSocket = io.connect('/test');

$(document).ready(function() {
	testSessionSocket.on('hello world', function(data) {
		console.log(data.hello);
	});

	testSessionSocket.on('does session work', function(data) {
		console.log(data.sessions);
	});
});