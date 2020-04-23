"use strict";
var tagsOrigin = "VA";
var windowDisplacement = 0;

const styleTargets = "div#tag_list li a";

function getAuthorHandle() {
	return safeQuery('aside section ul.artist-tag-list a.search-tag').innerText;
};

function getAuthorName() {
	return "";
};

// FIXME: hack, returning ID in the pictureName category
function getPictureName() {
	var lefter = pick("post-information").innerText.trim();
	return 	"danbooru_" + lefter.substring(lefter.indexOf('ID: ') + 4, lefter.indexOf('\nDate: ')); //add the danboroo_ ID to the tags array
};

function getTags() {
	var	tempString = safeQuery('textarea[id="post_tag_string"]').innerHTML;
	tempString = tempString.replace(/\n/g,'');
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};
