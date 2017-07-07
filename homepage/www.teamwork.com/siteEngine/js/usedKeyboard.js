var keysPressed = 0;
var formfield1234567892 = document.getElementsByName('formfield1234567892');
//capture when a user uses types on their keyboard
document.onkeypress = logKeys;

function logKeys() {
	//user hit a key, increment the counter
	keysPressed++;
	//load the amount to hidden form field

	for(var i = 0; i < formfield1234567892.length; i++) {
    	formfield1234567892[i].value = keysPressed
	}

	// document.getElementById("formfield1234567892").value = keysPressed;
}