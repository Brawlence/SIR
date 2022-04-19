"use strict";
var tagsOrigin = "PX";
var ID_prefix  = "pixiv_";
var windowDisplacement = 0;

const styleTargets = "aside section h2 div div a div, figcaption div h1, figcaption div footer ul li";

function getAuthorHandle() {
	return safeQuery('aside section h2 div div a div').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return safeQuery('figcaption div div h1').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');

};

// with enlish translation following, no hash
function getTags() {
	let tagString = " ";
	for (let tag of safeQueryA('figcaption div footer ul li a')) {
		tagString += tag.innerText.replace(/[ ]/g, '_') + " ";
	};
	return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
	let pic_ID = document.URL.substring(document.URL.lastIndexOf('/')).replace(/[\D]/g, '');
	return (pic_ID)?ID_prefix+pic_ID:"";
}

function promptToNavigate() {
	let url = document.URL;
	if ( (url.indexOf('img-master') > -1) &&
	     (url.indexOf('_master') > -1 ) &&
		 confirm("Open this image in original quality?") ) {
		
		let ID = url.substring(url.lastIndexOf('/') + 1, url.indexOf('_'));
		if (confirm("This won't work unless you had already requested the image from the original post page:\nhttps://www.pixiv.net/artworks/" + ID + "\nTry anyway? ('No' to open the post link)")) {
			url = url.replace(/\/img-master\//g,'/img-original/');		// first part of the url
			url = url.replace(/_master[\d]+\./g,'.');					// the file name

			window.location = url; 										// adds to the History, allowing to roll back
		} else {
			window.location = "https://www.pixiv.net/artworks/" + ID; 	// the same as above
		}
	}
}

setTimeout(promptToNavigate, 200);