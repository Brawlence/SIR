"use strict";
const tagsOrigin = "TW";
var windowDisplacement = 0;

const hastagStyle = String.raw`
	a[href*="/hashtag/"] {
		border-width: 2px;
		border-style: dotted;
		border-color: lightpink;

		transition:all .2s cubic-bezier(.55,.085,.68,.53);
		-webkit-transition:all .2s cubic-bezier(.55,.085,.68,.53)
	}
	`;

function getImageTags(template) {
	var resultingTags = new Array;

	// if the url contains /status/, crop to it, otherwise crop to the last symbol
	var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,(document.URL.lastIndexOf('/status/')>0?document.URL.lastIndexOf('/status/'):undefined));
	var authorName = document.querySelector("main div article div a[href*='" + authorHandle + "'] span, div div a[href*='" +  authorHandle + "']").innerText; //Twitter on Chrome works differently somewhy
	var pictureName = "";
	var tempArray = document.querySelectorAll("div article span a[href*='/hashtag/']");

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))
	
	for (let tag of tempArray) {
		template = template.replace(/\{tags\}/g, tag.innerText.replace(/[#]/g, '') + ' {tags}');
	};
	template = template.replace(/ \{tags\}/g, '');
	
	resultingTags = template.split(' ');
	return resultingTags;
};
