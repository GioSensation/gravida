window.addEventListener("load", function () {
	var budget = document.getElementById('budget'),
		budgetOutput = document.querySelector('#range-output');
	
	// FastClick magic
	FastClick.attach(document.body);
	
	// Add a polyfill to fix the vh issue in Mobile Safari
	viewportUnitsBuggyfill.init();
	
	var menuHelper = document.getElementById('menu-helper');
	
	menuHelper.addEventListener('click', function() {
		this.classList.toggle('menu-helper--open');
		this.nextElementSibling.classList.toggle('nav--open');
	});
	
	document.getElementById('nav').addEventListener('click', function() {
		menuHelper.classList.remove('menu-helper--open');
		this.classList.remove('nav--open');
	});
	
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		date = document.getElementById('date'),
		currentDate = new Date().getMonth();
	date.placeholder = months[currentDate] + ' ' + new Date().getFullYear();
	
	/***************** RANGE INPUT STUFF *****************/
	function rangeUpdate() {
		var value = (budget.value - budget.min)/(budget.max - budget.min);
		budget.style.backgroundImage = [
			'-webkit-gradient(',
				'linear, ',
				'left top, ',
				'right top, ',
				'color-stop(' + value + ', #3DACDF), ',
				'color-stop(' + value + ', #F2F2F2)',
			')'
		].join('');
		budgetOutput.value = budget.value;
	}
	rangeUpdate();
	budget.oninput = rangeUpdate;
});