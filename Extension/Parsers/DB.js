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
	let failover_noLogin = safeQuery('section[id*="tag-"]').innerText
							.replace(/(Copyright[s]?|Character[s]?|Artist[s]?|Tags|General|Meta)\n/g, '')
							.replace(/\?[\t\n\r\ ]/g,'')
							.replace(/\s[\d\.]+(k|M|G)?\n?/g,'\n')
							.replace(/ /g, '_')
							.replace(/[,\\/:?<>\t\n\v\f\r]/g, ' ');
	return tempString.replace(/\s?(\w+?)_\((art|color)ist\)/g, '').replace(/[,\\/:?<>\t\n\v\f\r]/g, '_') || failover_noLogin;
};

function getPictureID() {
	let lefter = pick("post-information").innerText.trim();
	let id_string = lefter.match(/Id: [\d]+$/gim)[0];
	if (id_string) {
		return ID_prefix + id_string.substring(4); //add the danboroo_ ID to the tags array 	
	}
	return "";
};

function parseAdditionalLinks() {
	let url = safeQuery('aside section li#post-info-size a').href;
	let array = [];
	array.push(url);
	return array;
};
