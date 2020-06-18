"use strict";
var tagsOrigin = "AS";
var windowDisplacement = 90;

const styleTargets = "div.tags a, aside div.name a, aside div h1.h3";

function getAuthorHandle() {
	var profilelink = safeQuery('aside div.name a').href;
	return profilelink.substring(profilelink.lastIndexOf('/')+1).replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return safeQuery('aside div.name a').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getPictureName() {
	return safeQuery('aside div h1.h3').innerText.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

/* FINALLY - an Artstation tag is a link (a) inside a div with tags class - it's complete with a hash sign */
function getTags() {
	return safeGetByClass("tags")[0].innerText.substring(7).replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '_').replace(/#/g, ' ');
};

function getPictureID() {
	return "";
}