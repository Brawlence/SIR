"use strict";

function promptToNavigate() {
	if ( (document.URL.indexOf('twimg') > -1) && (document.URL.indexOf('orig') < 1 ) && (document.URL.indexOf('4096x4096') < 1) && confirm("Open this image in original quality?") ) {
		if (document.URL.indexOf('?') > -1) {
			window.location.replace(document.URL.replace(/(&?name=[\w\d]+&?)/g,'') + "&name=orig"); // won't add the changed location to the browser history as the new object
		} else {
			window.location.replace(document.URL.substring(0, (document.URL.lastIndexOf(':')>10)?document.URL.lastIndexOf(':'):document.URL.length) + ":orig"); // 10 because there is always : in http://
		};	
	}
};

setTimeout(promptToNavigate, 200);