window.addEventListener("load", function () {
	
	// FastClick magic
	FastClick.attach(document.body);
	
	// Add a polyfill to fix the vh issue in Mobile Safari
	viewportUnitsBuggyfill.init()
	
	document.getElementById('menu-helper').addEventListener('click', function(event) {
		console.log(this.nextElementSibling);
		this.classList.toggle('menu-helper--open');
		this.nextElementSibling.classList.toggle('nav--open');
	})
	
})