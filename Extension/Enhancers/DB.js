"use strict";

function promptToNavigate() {
	let url = document.URL;
	if ( ((url.indexOf('/sample/') > -1) && (url.indexOf('sample-') > -1 )) ||
		 (url.indexOf('/180x180/') > -1) ||
		 (url.indexOf('/360x360/') > -1) ||
		 (url.indexOf('/720x720/') > -1 ) ) {

		if (!confirm("Open this image in original quality?")) {
			return;
		};
			
			url = url.replace(/\/sample\/|\/180x180\/|\/360x360\/|\/720x720\//g,'/original/');			// first part of the url
			url = url.replace(/_sample-/g,'_');						// the file name part

			window.location = url; 									// adds to the History, allowing to roll back

			setTimeout(promptToNavigate, 200);			
	} else {
		if (document.body.innerText.indexOf('404 Not Found') === 0 || document.body.innerText.indexOf('403 Forbidden') === 0) { // sometimes the originals for Danbooru are PNGs
			let ext = url.substring(url.lastIndexOf('.'));
			if ((ext.indexOf('jpg') > -1 ) ||
			    (ext.indexOf('jpeg') > -1)) {
					url = url.substring(0, url.lastIndexOf('.')) + ".png";
					window.location.replace(url);					// won't add the changed location to the browser history as the new object
				}
		}
	}

};

setTimeout(promptToNavigate, 200);