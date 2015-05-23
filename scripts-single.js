window.addEventListener( 'DOMContentLoaded', function() {
		
	/***************** FIX MAIN LAYOUT IN SINGLE-PROJECT *****************/
	var main = document.querySelector('.single-project');
	
	if (main) {
		var adjustMain = function() {
			viewport = document.documentElement.clientWidth;
			if (viewport > 1199) {
				
				if (!main.classList.contains('centered')) {
					main.classList.add('centered');
				}
			} else {
				if (main.classList.contains('centered')) {
					main.classList.remove('centered');
				}
			}
		};
		
		var resizeTimer;
		
		window.addEventListener('resize', function() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(adjustMain, 50);
		});
		
		adjustMain();
	}
	
}, false);

window.addEventListener('load', function() {
	
	/***************** ENLIGHTEN *****************/
	// Define stuff
	var enl_els = document.querySelectorAll('.enl'),
		enl_img,
		enl_container,
		enl_ctrls_next,
		enl_ctrls_prev,
		enl_ctrls_close,
		enl_slide,
		enl_main;
	
	function enlMe(questo, i) {
		questo.addEventListener('click', function(event) {
			event.preventDefault();
			// We load the images in the background
			enlLoadImgs();
			var enl_containers = document.querySelectorAll('.enl-container');
			// When the image we want to show first has been loaded, we make the thing appear
			enl_containers[i].querySelector('img').onload = enlAppear;
			enl_containers[i].classList.add('enl-current');
			// If the slide we load is not the first, then all previous slides will have the class .enl-previous so that they slide in from the left
			if (i > 0) {
				for (var newI = i-1; newI >= 0; newI--) {
					enl_containers[newI].classList.add('enl-previous');
				}
			}
			// We remove left arrow form the first slide and right arrow from the last
			enl_containers[0].firstChild.removeChild(enl_containers[0].querySelector('.enl-ctrls-prev'));
			var enl_last = enl_containers[enl_containers.length - 1];
			enl_last.firstChild.removeChild(enl_last.querySelector('.enl-ctrls-next'));
			// We listen for clicks on controls for navigating through the slides or closing the enlighten
			[].forEach.call(document.querySelectorAll('.enl-ctrls-next'), function(el) {
				el.addEventListener('click', function() {
					var thisContainer = el.parentNode.parentNode;
					thisContainer.classList.remove('enl-current');
					thisContainer.classList.add('enl-previous');
					thisContainer.nextSibling.classList.add('enl-current');
				});
			});
			[].forEach.call(document.querySelectorAll('.enl-ctrls-prev'), function(el) {
				el.addEventListener('click', function() {
					var thisContainer = el.parentNode.parentNode;
					thisContainer.classList.remove('enl-current');
					thisContainer.previousSibling.classList.remove('enl-previous');
					thisContainer.previousSibling.classList.add('enl-current');
				});
			});
			[].forEach.call(document.querySelectorAll('.enl-ctrls-close'), function (el) {
				el.addEventListener('click', function() {
					enlDisappear();
				});
			});
		});
	}
	
	function enlLoadImgs() {
		// If there are images, then…
		if (enl_els) {
			// We set the body to overflow:hidden because we don't want weird scrolling behind the enlighten
			document.body.style.overflow = 'hidden';
			enl_main = document.createElement('div');
			enl_main.id = 'enl';
			document.body.appendChild(enl_main);
			
			// While we wait for images to download, we want to show a loading indicator
			var waiting = '<div id="wait"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>';
			document.body.insertAdjacentHTML('beforeend', waiting);
			document.getElementById('wait').classList.add('showWait');
			
			// Here we loop through images and create the divs as needed. Vanilla javascript syntax is very verbose here, but it's very simple
			for (var i = 0; i < enl_els.length; i++) {
				// Create the image
				enl_img = new Image();
				enl_img.src = enl_els[i].getAttribute('href');
				enl_img.alt = enl_els[i].getAttribute('data-alt');
				// Create container and slide
				enl_container = document.createElement('div');
				enl_container.className = 'enl-container';
				enl_slide = document.createElement('div');
				enl_slide.className = 'enl-slide';
				// Create controls
				enl_ctrls_next = document.createElement('button');
				enl_ctrls_next.className = 'enl-ctrls enl-ctrls-next';
				enl_ctrls_next.innerHTML = 'Next';
				enl_ctrls_prev = document.createElement('button');
				enl_ctrls_prev.className = 'enl-ctrls enl-ctrls-prev';
				enl_ctrls_prev.innerHTML = 'Previous';
				enl_ctrls_close = document.createElement('button');
				enl_ctrls_close.className = 'enl-ctrls enl-ctrls-close';
				enl_ctrls_close.innerHTML = 'Close';
				// Put everything in place
				enl_slide.appendChild(enl_img);
				enl_slide.appendChild(enl_ctrls_next);
				enl_slide.appendChild(enl_ctrls_prev);
				enl_slide.appendChild(enl_ctrls_close);
				enl_container.appendChild(enl_slide);
				enl_main.appendChild(enl_container);
			}
		}
	}
	
	// Function to call when the image we want to show first has finished loading and is ready to display. This makes the whole thing slide down (or other animation defined on the .enl-appear class) and here we also hide the loading spinner
	function enlAppear() {
		document.getElementById('enl').classList.add('enl-appear');
		document.getElementById('wait').classList.remove('showWait');
	}
	
	// This closes the enlighten. I decided to delete the whole #enl div for better functionality when opening and closing enlighten a few times
	function enlDisappear() {
		document.body.style.overflow = 'auto';
		document.getElementById('enl').classList.remove('enl-appear');
		function deleteMe() {
			document.body.removeChild(document.getElementById('enl'));
			document.body.removeChild(document.getElementById('wait'));
		}
		setTimeout(deleteMe, 400);
	}
	
	if (viewport > 1200) {
		// For performance and sanity it's better not to define functions inside loops (index values get very messy, kind of an entire afternoon to understand what was going on). So, here we are going to call the enlMe() function and pass parameters as needed
		for (var i = 0; i < enl_els.length; i++) {
			enlMe(enl_els[i], i);
		}
	}
	
});