var viewport = document.documentElement.clientWidth,
	dpi = window.devicePixelRatio,
	rtnimg = 'large';

/***************** SMALL *****************/
if (
	viewport < 481 // smartphones
	||
	viewport < 767 && dpi < 1.5 // regular dpi tablets and small computers
	) {
	rtnimg = 'small';
	}

/***************** MEDIUM *****************/
if (
	viewport >= 481 && viewport < 1200 && dpi > 1.5 // hidpi tablets
	||
	viewport >= 767 && viewport < 1900 && dpi < 1.5 // standard laptops & desktops up to 21.5"
	) {
		rtnimg = 'medium';
	}

/***************** LARGE *****************/
if (
	viewport >= 1200 && dpi > 1.5 // hidpi laptops
	||
	viewport >= 1900 // big desktops
	) {
		rtnimg = 'large';
	}

function scrollTo(to, duration) {
	var FF = !(window.mozInnerScreenX == null),
		bodyToScroll;
	if (FF) {
		bodyToScroll = document.documentElement; 
	} else {
		bodyToScroll = document.body;
	}
    var start = bodyToScroll.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);                        
        bodyToScroll.scrollTop = val; 
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

window.addEventListener('load', function () {
	var header = document.querySelector('body > header');
	
	// FastClick magic
	FastClick.attach(document.body);
	// Add a polyfill to fix the vh issue in Mobile Safari
	window.viewportUnitsBuggyfill.init();
	
	document.getElementById('contacts-nav-link').addEventListener('click', function(event) {
		event.preventDefault();
		scrollTo(document.body.scrollHeight, 400);
	});
	
	var gravidaTeaseAsterisk = document.getElementById('gravida-tease-asterisk');
	if (gravidaTeaseAsterisk) {
		gravidaTeaseAsterisk.addEventListener('click', function(event) {
			event.preventDefault();
			scrollTo(document.getElementById('gravida-tease').offsetTop - 300, 400);
		});
	}
		
	/***************** RETINA MAGIC HAPPENS HERE *****************/
	var responsiveImages = document.querySelectorAll('.responsive_image');
	[].forEach.call( responsiveImages, function(el) {
		var imgAlt = el.getAttribute('data-alt');
		if (!imgAlt) {
			imgAlt = 'Empty';
		}
		if (el.hasAttribute('data-' + rtnimg)) {
			var imgSrc = el.getAttribute('data-' + rtnimg),
				imgEl = new Image();
				imgEl.src = imgSrc;
				imgEl.alt = imgAlt;
			el.appendChild(imgEl);
		}
	});
	
	var responsiveBgImages = document.querySelectorAll('.responsive_bg_image');
	[].forEach.call( responsiveBgImages, function(el) {
		if (el.hasAttribute('data-' + rtnimg)) {
			var imgSrc = el.getAttribute('data-' + rtnimg);
			el.style.backgroundImage = "url(/" +imgSrc + ")";
		}
	});
		
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
		// Tablets and desktop scripts
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