"use strict";
const tagsOrigin = "TW";
var windowDisplacement = 0;

const styleTargets = "a[href*='/hashtag/']";

var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,(document.URL.lastIndexOf('/status/')>0?document.URL.lastIndexOf('/status/'):undefined)); // if the url contains /status/, crop to it, otherwise crop to the last symbol
function getAuthorHandle() {
	return authorHandle.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-'); 	
};

function getAuthorName() {
	return safeQuery("main div article div a[href*='" + authorHandle + "'] span, div div a[href*='" +  authorHandle + "']").innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-'); //Twitter on Chrome works differently somewhy
};

function getPictureName() {
	return "";
};

function getTags() {
	var tagArray = [];
	for (let tag of safeQueryA("div article span a[href*='/hashtag/']")) {
		tagArray.push(tag.innerText.replace(/[#]/g, ''));
	};
	return tagArray;
};