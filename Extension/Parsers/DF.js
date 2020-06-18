"use strict";
var tagsOrigin = "DF";
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

// FIXME: hack, returning drawfriendID in the pictureName category
function getPictureName() {
	var lefter = safeQuery('div [id="tag_list"]').innerText.trim();
	return 	"drawfriends_" + lefter.substring(lefter.indexOf('Id: ') + 4, lefter.indexOf('\nPosted: ')); //add the drawfriends_ ID to the tags array
};

/* Drawfriends has a pretty easy structure: div class="sidebar" contains a div class="tag_list", 	containing list in which are separate links which are tags */
function getTags() {
	var	tempString = safeQuery('td textarea[id="tags"]').innerHTML;
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
	return "";
}