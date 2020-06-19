"use strict";
var tagsOrigin = "DB";
var windowDisplacement = 0;

const styleTargets = "aside section a.search-tag";

function getAuthorHandle() {
	return safeQuery('aside section ul.artist-tag-list a.search-tag').innerText;
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return "";
};

function getTags() {
	var	tempString = safeQuery('textarea[id="post_tag_string"]').innerHTML;
	tempString = tempString.replace(/\n/g,'');
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
	var lefter = pick("post-information").innerText.trim();
	return 	"danbooru_" + lefter.substring(lefter.indexOf('ID: ') + 4, lefter.indexOf('\nDate: ')); //add the danboroo_ ID to the tags array
}