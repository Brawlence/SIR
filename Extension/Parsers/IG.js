"use strict";
var tagsOrigin = "IG";
var ID_prefix  = "instagram_";
var windowDisplacement = 0;

//For somewhat more robust anchoring instead of pre-calculated 28 one can use 
//const IG_ID_DISPLACEMENT = document.URL.lastIndexOf('/p/')+3;
const IG_ID_DISPLACEMENT = 28;

const presentingArticle = 'article[role*="presentation"]';
const selectableArticle = 'article[tabindex="-1"]';
const scalableImage     = 'img[sizes]';

const styleTargets = String.raw`${presentingArticle} div span a[href*="explore/tags"]`;

function getAuthorHandle() {
    var profileHandle = safeQuery(String.raw`${presentingArticle} div span a`).innerText;
	return profileHandle.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return "";
};

function getTags() {
    var tagString = " ";
    for (let tag of safeQueryA('a[href*="explore/tags"]')) {
		tagString += tag.innerText.replace(/[#]/g, '') + " ";
	};
    return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
    if (document.URL.indexOf('/p/') === -1) return;
    let pic_ID = document.URL.substring(IG_ID_DISPLACEMENT).replace(/[\W]/g, ''); //Instagram IDs contain A-z 0-9 and underscore
	return (pic_ID)?ID_prefix+pic_ID:"";
};

function parseAdditionalLinks() {
	return [];
};
