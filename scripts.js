window.addEventListener("load", function () {
	
	// FastClick magic
	FastClick.attach(document.body);
	
	// Add a polyfill to fix the vh issue in Mobile Safari
	viewportUnitsBuggyfill.init()
	
	var menuHelper = document.getElementById('menu-helper');
	
	menuHelper.addEventListener('click', function(event) {
		this.classList.toggle('menu-helper--open');
		this.nextElementSibling.classList.toggle('nav--open');
	})
	
	document.getElementById('nav').addEventListener('click', function() {
		menuHelper.classList.remove('menu-helper--open');
		this.classList.remove('nav--open');
	})
	
})