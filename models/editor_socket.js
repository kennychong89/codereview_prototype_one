/*
* the text editor module.
*/

exports.listen = function(io) {
	// create a custom namespace for editor
	var editorNameSpace = io.of('/editor');

	editorNameSpace.on('connection', function(socket) {
		socket.on('text change', function(data) {
			var action = data['action'];
			var line = data['linePosition'];
			var text = data['textdata'];

			socket.broadcast.emit('text update', {
				'action' : action,
				'lineNumber' : line,
				'text' : text
			});
		});
	});
}