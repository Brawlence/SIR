"use strict";

function promptToNavigate() {
	let url = document.URL;
	if ( (url.indexOf('twimg') > -1) &&
		 (url.indexOf('orig') < 1 ) &&
		 (url.indexOf('4096x4096') < 1) &&
		 confirm("Open this image in original quality?") ) {

		if (url.indexOf('?') > -1) {
			window.location.replace(url.replace(/(&?name=[\w\d]+&?)/g,'') + "&name=orig"); // won't add the changed location to the browser history as the new object
		} else {
			window.location.replace(url.substring(0, (url.lastIndexOf(':')>10)?url.lastIndexOf(':'):url.length) + ":orig"); // 10 because there is always : in http://
		};	
	}
};

setTimeout(promptToNavigate, 200);