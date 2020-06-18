"use strict";
var tagsOrigin = "MW";
var windowDisplacement = 0;

//For somewhat more robust anchoring instead of pre-calculated 29 one can use 
//const MW_ID_DISPLACEMENT = document.URL.lastIndexOf('?p=')+3;
const MW_ID_DISPLACEMENT = 29;

const styleTargets = "div#content li.entry-author a, div#content li.entry-tags a, div#content li.entry-category a, div#content h2.entry-title";

function getAuthorHandle() {
	return safeQuery('div#content li.entry-author a').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

// FIXME: hack, returning ID in the AuthorName category
function getAuthorName() {
	let pic_ID = document.URL.substring(MW_ID_DISPLACEMENT).replace(/[\D]/g, '');
	return (pic_ID)?"medicalwhiskey_"+pic_ID:"";
};

function getPictureName() {
	return safeQuery('div#content h2.entry-title').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getTags() {
	var tagString = " ";
	for (let tag of safeQueryA('div#content li.entry-tags a, div#content li.entry-category a')) {
		tagString += tag.innerText.replace(/[,]/g, '') + " ";
	};
	return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
	return "";
}