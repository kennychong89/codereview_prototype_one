var editorSocket = io.connect('/editor');

$(document).ready(function() {
	
	// TODO - refactor this
	editorSocket.on('text update', function(data) {
		var action = data.action;
		var textEditor = $('#editor');

		var textEditorValue = textEditor.val();
		var editLineNumber = data.lineNumber;

		if (action.toLowerCase() === 'delete') {
			// delete character
			var removedCharacterText = textEditorValue.substring(0, editLineNumber) 
				+ textEditorValue.substring(editLineNumber + 1);

			textEditor.val(removedCharacterText);
		} else if (action.toLowerCase() === 'add') {
			// add character
			var characterToAdd = data.text;

			var addCharacterText = textEditorValue.substring(0, editLineNumber) 
			+ characterToAdd + textEditorValue.substring(editLineNumber);

			textEditor.val(addCharacterText);
		}
	});

	// listen for user input
	listenTextInput();
});

function listenTextInput() {
	var textEditor = $('#editor');
	var previousText = textEditor.val();

	textEditor.bind('input', function(event) {
		var currentText = event.target.value;
		var caretPosition = getCaretPosition(this);

		var operation = '';
		var lineNumber = 0;
		var character = '';

		// if current text length is smaller than previous text, assume we are deleting
		if (previousText.length > currentText.length) {
			operation = 'DELETE';

			// figure out where the deletion happened
			lineNumber = caretPosition;

			// retrieve character deleted
			character = previousText.charAt(lineNumber);
		} else {
			operation = 'ADD';

			// figure out where the insertion happened
			lineNumber = caretPosition - 1;

			character = currentText.charAt(lineNumber);
		}

		handleTextInput(operation, lineNumber, character);

		previousText = currentText;
	});
}

function getCaretPosition(element) {
	var pos = 0;

	// testing only for firefox
	if (element.selectionStart || element.selectionStart == '0')
		pos = element.selectionStart;

	return pos;
}

function handleTextInput(operation, lineNumber, character) {
	editorSocket.emit('text change', {
		'action' : operation,
		'linePosition' : lineNumber,
		'textdata' : character
	}); 
}