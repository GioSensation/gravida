window.addEventListener('load', function () {
//		isiOS = (/(iPad|iPhone|iPod)/g.test( navigator.userAgent )) ? true: false,
//		isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) ? true: false;
	var viewport = document.documentElement.clientWidth,
		header = document.querySelector('body > header');
	
	// FastClick magic
	FastClick.attach(document.body);
	// Add a polyfill to fix the vh issue in Mobile Safari
	window.viewportUnitsBuggyfill.init();
	
	// Mobile only scripts
	if (viewport < 600) {
		var menuHelper = document.getElementById('menu-helper');
		
		menuHelper.addEventListener('click', function() {
			this.classList.toggle('menu-helper--open');
			this.nextElementSibling.classList.toggle('nav--open');
		});
		
		document.getElementById('nav').addEventListener('click', function() {
			menuHelper.classList.remove('menu-helper--open');
			this.classList.remove('nav--open');
		});
	} else {
		(function() {
			var position = window.pageYOffset || document.documentElement.scrollTop;
			window.addEventListener('scroll', function() {
				var distanceY = window.pageYOffset || document.documentElement.scrollTop;
				if (distanceY > position && position > 0) {
					header.classList.add('shrinked');
				} else if (position < 30) {
					header.classList.remove('shrinked');
				}
				position = distanceY;
			});
		})();
	}
	
	
	
	/***************** MAP APP THING *****************/
	// This thing switches from Apple Maps native map to Google Map in non-Apple devices
	var //iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent ),
		isApple = (navigator.userAgent.match(/Mac OS X/i)) ? true: false;
	
	if ( !isApple ) {
		[].forEach.call( document.querySelectorAll('.location-link'), function(el) {
			el.setAttribute('href', "https://www.google.it/maps/place/43%C2%B018'02.9%22N+13%C2%B027'26.6%22E/@43.300797,13.457395,105m/data=!3m1!1e3!4m2!3m1!1s0x0:0x0");
		});
	}
	
	
	
});