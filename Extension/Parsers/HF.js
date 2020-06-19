"use strict";
var tagsOrigin = "HF";
var windowDisplacement = 0;

const styleTargets = "div.boxbody td a[rel='tag']";

var urlDivided = document.URL.substring(document.URL.lastIndexOf('/user/')+6).split('/');
function getAuthorHandle() {
	return urlDivided[0].replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return urlDivided[2].replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

/* Those are called "Keywords" on HF */
function getTags() {
	var tagString = " ";
	for (let tag of safeQueryA('div.boxbody td a[rel="tag"]')) {
		tagString += tag.innerText.replace(/[#,]/g, '') + " ";
	};
	return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

//https://www.hentai-foundry.com/pictures/1234
function getPictureID() {
	let URLwithNoName = document.URL.substring(0,document.URL.lastIndexOf('/'));
	let pic_ID = URLwithNoName.substring(URLwithNoName.lastIndexOf('/')).replace(/[\D]/g, '');
	return (pic_ID)?"hfoundry_"+pic_ID:"";
}