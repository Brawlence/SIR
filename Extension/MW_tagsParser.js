"use strict";
var tagsOrigin = "MW";
var windowDisplacement = 0;

const styleTargets = "div#content li.entry-author a, div#content li.entry-tags a, div#content li.entry-category a, div#content h2.entry-title";

function getAuthorHandle() {
	return safeQuery('div#content li.entry-author a').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return safeQuery('div#content h2.entry-title').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getTags() {
	var tagArray = [];
	for (let tag of safeQueryA('div#content li.entry-tags a, div#content li.entry-category a')) {
		tagArray.push(tag.innerText);
	};
	return tagArray;
};
