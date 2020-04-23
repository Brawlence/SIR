"use strict";
var tagsOrigin = "TU";
var windowDisplacement = 0;

const styleTargets = "a[href*='/tagged/'], header div figcaption, header div h1 a";

function getAuthorHandle() {
	return document.URL.substring(document.URL.lastIndexOf('://')+3,document.URL.lastIndexOf('.tumblr')).replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return safeQuery("header div figcaption, header div h1 a").innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-'); //it's either one or the other
};

function getPictureName() {
	return "";
};

function getTags() {
	var tagArray = [];
	for (let tag of safeQueryA("[href*='/tagged/']")) {
		tagArray.push(tag.innerText.replace(/[#]/g, ''));
	};
	return tagArray;
};
