"use strict";

function promptToNavigate() {
	let url = document.URL;
	if ( (url.indexOf('img-master') > -1) &&
		 (url.indexOf('_master') > -1 ) &&
		 confirm("Open this image in original quality?") ) {
			
			url = url.replace(/\/img-master\//g,'/img-original/');		// first part of the url
			url = url.replace(/_master[\d]+\./g,'.');					// the file name

			window.location = url; 										// adds to the History, allowing to roll back

			setTimeout(promptToNavigate, 200);			
	} else {
		if (document.body.innerText.indexOf('404 Not Found') === 0 || document.body.innerText.indexOf('403 Forbidden') === 0) {
			let ext = url.substring(url.lastIndexOf('.'));
			if ((ext.indexOf('jpg') > -1 ) ||
			    (ext.indexOf('jpeg') > -1)) {
					url = url.substring(0, url.lastIndexOf('.')) + ".png";
					window.location.replace(url);					// won't add the changed location to the browser history as the new object

					setTimeout(promptToNavigate, 200);
			} else {
				let ID = url.substring(url.lastIndexOf('/') + 1, url.indexOf('_'));
				if (confirm("This won't work unless you had already requested the image from the original post page:\nhttps://www.pixiv.net/artworks/" + ID + "\nOpen it now?")) {
					window.location = "https://www.pixiv.net/artworks/" + ID; 	// the same as above
				};
			};
		}
	}
};

setTimeout(promptToNavigate, 200);
