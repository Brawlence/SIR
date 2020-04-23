"use strict";
var tagsOrigin = "PX";
var windowDisplacement = 0;

const styleTargets = "aside section h2 div div a,	figcaption div h1, figcaption div footer ul li";

function getAuthorHandle() {
	return safeQuery('aside section h2 div div a').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return safeQuery('figcaption div div h1').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');

};

// with enlish translation following, no hash
function getTags() {
	var tagString = " ";
	for (let tag of safeQueryA('figcaption div footer ul li a')) {
		tagString += tag.innerText.replace(/[ ]/g, '_') + " ";
	};
	return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};
