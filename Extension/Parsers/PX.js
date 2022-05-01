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
};

function parseAdditionalLinks() {
	let arr = [];
	for (let imageObject of document.querySelectorAll('body div#root main section div[role~="presentation"] a')) {
		arr.push(imageObject.href);
	}
	return arr;
};
