"use strict";
var tagsOrigin = "VA";
var windowDisplacement = 0;

const styleTargets = "div#tag_list li a";

function getAuthorHandle() {
	// Vidiyart already HAS a field with all the tags.
	var	tempString = safeQuery('td textarea[id="tags"]').innerHTML;
	if (tempString.indexOf('artist') > -1 || tempString.indexOf('colorist') > -1 ) {
		return tempString.match(/(art|color)ist\:([^\s\n\r]+)/g).join('+').replace(/(art|color)ist\:/g, '');
	};
	return "";
};

function getAuthorName() {
	return "";
};

function getPictureName() {
		return "";
};

/* Vidiyaart is a clone of drawfriends: div class="sidebar" contains a div class="tag_list", containing list in which are separate links which are tags */
function getTags() {
	var	tempString = safeQuery('td textarea[id="tags"]').innerHTML;
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
	var lefter = safeQuery('div [id="tag_list"]').innerText.trim();
	let id_string = lefter.match(/Id: [\d]+$/gim)[0];
	if (id_string) {
		return "vidyart_" + id_string.substring(4); //add the vidyart_ID to the tags array
	}
	return "";
}