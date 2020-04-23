"use strict";
var tagsOrigin = "DA";
var windowDisplacement = 0;

const styleTargets = "div.dev-title-container a.discoverytag, a[href*='/tag/'], aside div h1.h3";

function getAuthorHandle() {
	return document.URL.substring(document.URL.lastIndexOf('.com/')+5,document.URL.lastIndexOf('/art/')).replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return document.URL.substring(document.URL.lastIndexOf('/art/')+5,document.URL.lastIndexOf('-')).replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

/* Deviantart tag - usual is prefixed by a hashsign, with Eclipse on - no hashsign */
function getTags() {
	var tagString = " ";
	for (let tag of safeQueryA("[href*='/tag/']")) {
		tagString += tag.innerText.replace(/[#]/g, '') + " ";
	};
	return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};
