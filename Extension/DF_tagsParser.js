"use strict";
var tagsOrigin = "DF";
var windowDisplacement = 0;

const highlightStyle = "div#tag_list li a";

// all the tags are inside a hidden text field
var	tempString = document.querySelector('td textarea[id="tags"]').innerHTML;

function getAuthorHandle() {
	return tempString.match(/\s?\w+?_\((art|color)ist\)/g).replace(/_\((art|color)ist\)/g, '@' + tagsOrigin);
};

function getAuthorName() {
	return "";
};

// TODO: hack, returning drawfriendID in the pictureName category
function getPictureName() {
	lefter = document.querySelector('div [id="tag_list"]').innerText.trim();
	return 	"drawfriends_" + lefter.substring(lefter.indexOf('Id: ') + 4, lefter.indexOf('\nPosted: ')); //add the drawfriends_ ID to the tags array
};

/* Drawfriends has a pretty easy structure: div class="sidebar" contains a div class="tag_list", 	containing list in which are separate links which are tags */
function getTags() {
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};
