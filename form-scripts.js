window.addEventListener('load', function() {
	var budget = document.getElementById('budget'),
		budgetOutput = document.querySelector('#range-output');
		
	/***************** INPUT MONTH STUFF  *****************/
	// This whole stuff adds better usability cross-browser: when input[type=month] is supported it provides a default value (next month), when it is not supported, it gives a placeholder (next month). This also lays out the ground for form validation afterwards where, in both cases, if the value is empty when the form is submitted, the script automatically assigns next month.
	var months = {'01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December'},
		date = document.getElementById('date'),
		year = new Date().getFullYear(),
		month = new Date().getMonth() + 1;
		month = month < 10 ? "0" + (month+1) : month+1;
		
		
	if (month === 13) {
		month = '01';
	    year += 1;
	}
	
	function checkInput(type) {
	 	var input = document.createElement("input");
	 	input.setAttribute("type", type);
	 	return input.type === type;
	}
	
	if (checkInput("month")) {
		var nextMonthValue = year + '-' + month;
		date.value = nextMonthValue;
	} else {
		var nextMonthPlaceholder = months[month] + ' ' + year;
		date.placeholder = nextMonthPlaceholder;
	}
	
	/***************** RANGE INPUT STUFF *****************/
	function rangeUpdate() {
		var value = (budget.value - budget.min)/(budget.max - budget.min)*100,
			valueTo = value + 0.1;
		budget.style.backgroundImage = [
			'linear-gradient(',
				'to right, ',
				'#3DACDF ' + value + '%, ',
				'#F2F2F2 ' + valueTo + '%',
			')'
		].join('');
		budgetOutput.value = budget.value;
	}
	rangeUpdate();
	budget.oninput = rangeUpdate;
	
	/***************** FORM MAGIC *****************/
	var theForm = document.getElementById('contactForm'),
		formContainer = theForm.parentNode,
		nameInput = theForm.name,
		emailInput = theForm.email,
		errorMessageEmpty = 'This field is required.',
		errorMessageLenght = 'This is way too long to be real.',
		errorMessageInvalidEmail = 'Please, insert a valid email address',
		errorMessage = '',
		wait = document.getElementById('wait');
	
	// This thing hides the menu while the textarea is focused to fix a bug where the menu could appear above the textarea itself when the text was too long
//	if ( isiOS && isSafari ) {
//		textarea.addEventListener('focus', function() {
//			document.getElementsByTagName('header')[0].style.visibility = 'hidden';
//			
//			textarea.addEventListener('blur', function() {
//				document.getElementsByTagName('header')[0].style.visibility = 'visible';
//			});
//		});
//	}

	theForm.setAttribute('novalidate', 'true');
	
	function valueIsValid( input, type, maxlen ) {
		
		// shorthand for: if undefined then
		type = type || 'plain';
		maxlen = maxlen || 100;
		
		input = input.value;
		
		if ( input === '' ) {
			errorMessage = errorMessageEmpty;
			return false;
		} else if ( input.length > maxlen ) {
			errorMessage = errorMessageLenght;
			return false;
		} else { // input not empty and normal lenght
		
			switch ( type ) {
				case 'email': // check for email plausibility
					var atpos = input.indexOf("@"),
						dotpos = input.lastIndexOf(".");
					if ( atpos < 1 || ( dotpos - atpos < 2 ) ) {
						errorMessage = errorMessageInvalidEmail;
					} else { // valid email
						return true;
					}
					break;
				default: // valid plain text
					return true;
			}
		}
	}
	
	function errorFlash( questo ) {
		if ( !questo.parentNode.classList.contains('error') ) {
			questo.parentNode.classList.add('error');
		}
		questo.nextElementSibling.textContent = errorMessage;
	}
	
	function readyAgain( questo ) {
		questo.addEventListener('focus', function() {
			questo.parentNode.className = questo.parentNode.className.replace( /(?:^|\s)error(?!\S)/g , '' );
		}, true);
	}
	
	nameInput.addEventListener('blur', function() {
		if ( !valueIsValid( this ) ) {
			errorFlash( this );
			readyAgain(this);
		}
	}, true);
	
	emailInput.addEventListener('blur', function() {
		if ( !valueIsValid( this, 'email' )) {
			errorFlash( this );
			readyAgain(this);
		}
	}, true);
	
	function validate() {
		var validty = false,
			validName = false,
			validEmail = false;
		
		if ( valueIsValid( nameInput ) ) {
			validName = true;
		} else {
			errorFlash( nameInput );
			readyAgain( nameInput );
		}
		if ( valueIsValid( emailInput, 'email' ) ) {
			validEmail = true;
		} else {
			errorFlash( emailInput );
			readyAgain( emailInput );
		}
		
		if ( validName === true && validEmail === true ) {
			validty = true;
		}
		
		// Force "next month" when no date is submitted, this prevents empty data on the server side of life
		if (date.value === '') {
			if (checkInput('month')) {
				var nextMonthValue = year + '-' + month;
				date.value = nextMonthValue;
			} else {
				var nextMonthPlaceholder = months[month] + ' ' + year;
				date.value = nextMonthPlaceholder;
			}
		}
		
		return validty;
	}
	
	function sendData() {
		var XHR = new XMLHttpRequest();

		// We bind the FormData object and the form element
		var FD  = new FormData(theForm);

		// We define what will happen if the data are successfully sent
		XHR.addEventListener("load", function(event) {
			wait.className = wait.className.replace( /(?:^|\s)showWait(?!\S)/g , '' );
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			formContainer.innerHTML = event.target.responseText;
		});

		// We define what will happen in case of error
		XHR.addEventListener("error", function() {
			window.alert('Oups! Something goes wrong.');
		});

		// We setup our request
		XHR.open("POST", "contact.php");

		// The data sent are the one the user provide in the form
		XHR.send(FD);
	}
	
	// to takeover its submit event.
	theForm.addEventListener("submit", function (event) {
		event.preventDefault();
		
		if ( validate() ) {
			
			wait.className += 'showWait';
			
			sendData();
		} else {
			document.querySelector('.submit-label').classList.add('shake');
			document.getElementById('formSubmit').classList.add('shake');
			setTimeout(function () {
				scrollTo(0, 400);
				document.querySelector('.submit-label').classList.remove('shake');
				document.getElementById('formSubmit').classList.remove('shake');
			}, 400);
		}
	});
});