"use strict";
var tagsOrigin = "HF";
var windowDisplacement = 0;

const styleTargets = "div.boxbody td a[rel='tag']";

var urlDivided = document.URL.substring(document.URL.lastIndexOf('/user/')+6).split('/');
function getAuthorHandle() {
	return urlDivided[0].replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return urlDivided[2].replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

/* Those are called "Keywords" on HF */
function getTags() {
	var tagArray = [];
	for (let tag of safeQueryA('div.boxbody td a[rel="tag"]')) {
		tagArray.push(tag.innerText.replace(/[#]/g, ''));
	};
	return tagArray;
};
