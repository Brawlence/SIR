"use strict";
var tagsOrigin = "DB";
var ID_prefix  = "danbooru_";
var windowDisplacement = 0;

const styleTargets = "aside section a.search-tag";

function getAuthorHandle() {
	return safeQuery('aside section ul.artist-tag-list a.search-tag').innerText.replace(/\s/g, '_');
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
	let failover_noLogin = safeQuery('section[id="tag-list"]').innerText.replace(/(Copyrights|Characters|Artists|Tags|Meta)\n/g, '').replace(/\? ([\w\:\_\- ]+) [\d\.]+k?$/gmi,'$1').replace(/ /g, '_').replace(/[,\\/:?<>\t\n\v\f\r]/g, ' ');
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_') || failover_noLogin;
};

function getPictureID() {
	let lefter = pick("post-information").innerText.trim();
	let id_string = lefter.match(/Id: [\d]+$/gim)[0];
	if (id_string) {
		return ID_prefix + id_string.substring(4); //add the danboroo_ ID to the tags array 	
	}
	return "";
}