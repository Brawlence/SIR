"use strict";
const tagsOrigin = "TW";
var ID_prefix  = "";
var windowDisplacement = 0;

const styleTargets = "a[href*='/hashtag/']";

function getAuthorHandle() {
	var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,(document.URL.lastIndexOf('/status/')>0?document.URL.lastIndexOf('/status/'):undefined)); // if the url contains /status/, crop to it, otherwise crop to the last symbol
	return authorHandle.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-'); 	
};

function getAuthorName() {
	var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,(document.URL.lastIndexOf('/status/')>0?document.URL.lastIndexOf('/status/'):undefined)); // if the url contains /status/, crop to it, otherwise crop to the last symbol
	return safeQuery("main div article div a[href*='" + authorHandle + "'] span, div div a[href*='" +  authorHandle + "']").innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-'); //Twitter on Chrome works differently somewhy
};

function getPictureName() {
	return "";
};

function getTags() {
	var tagString = " ";
	for (let tag of safeQueryA("div article span a[href*='/hashtag/']")) {
		tagString += tag.innerText.replace(/[#]/g, '') + " ";
	};
	return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
	return "";
};

function parseAdditionalLinks() {
	return [];
};
