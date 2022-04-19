"use strict";
var tagsOrigin = "DF";
var ID_prefix  = "drawfriends_";
var windowDisplacement = 0;

const styleTargets = "div#tag_list li a";

function getAuthorHandle() {
	// all the tags are inside a hidden text field
	var	tempString = safeQuery('td textarea[id="tags"]').innerHTML;
	if (tempString.indexOf('_(artist)') > -1 || tempString.indexOf('_(colorist)') > -1 ) {
		return tempString.match(/\w+?_\((art|color)ist\)/g).join('+').replace(/_\((art|color)ist\)/g, '');
	};
	return "";
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return "";
};

/* Drawfriends has a pretty easy structure: div class="sidebar" contains a div class="tag_list", 	containing list in which are separate links which are tags */
function getTags() {
	var	tempString = safeQuery('td textarea[id="tags"]').innerHTML;
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
	var lefter = safeQuery('div [id="tag_list"]').innerText.trim();
	let id_string = lefter.match(/Id: [\d]+$/gim)[0];
	if (id_string) {
		return ID_prefix + id_string.substring(4); //add the drawfriends_ ID to the tags array 	
	}
	return "";
}