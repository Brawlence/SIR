"use strict";

function promptToNavigate() {
	let url = document.URL;
	if ( (url.indexOf('/thumbnail/') > -1) &&
		 (url.indexOf('img.kemono') > -1 ) &&
		 confirm("Open this image in original quality?") ) {
			
			url = url.replace(/\/thumbnail\//g,'/');				// first part of the url
			url = url.replace(/img.kemono/g,'c5.kemono');			// the hosting server part

			window.location = url; 									// adds to the History, allowing to roll back
		
	} else {
		if (document.body.innerText.indexOf('404 Not Found') === 0 || document.body.innerText.indexOf('403 Forbidden') === 0) {
			let ext = url.substring(url.lastIndexOf('.'));
			if ((ext.indexOf('jpg') > -1 ) ||
			    (ext.indexOf('jpeg') > -1)) {
					url = url.substring(0, url.lastIndexOf('.')) + ".png"; // if jpg fails, try PNG
					window.location.replace(url);						   // won't add the changed location to the browser history as the new object
				}
		}
	}

};

setTimeout(promptToNavigate, 200);