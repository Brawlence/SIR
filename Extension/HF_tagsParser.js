"use strict";
var tagsOrigin = "HF";
var windowDisplacement = 0;

/* Those are called "Keywords" on HF */
const hastagStyle = String.raw`
	div.boxbody td a[rel='tag'] {
		border-width: 2px;
		border-style: dotted;
		border-color: lightpink;

		transition:all .2s cubic-bezier(.5,.1,.7,.5);
		-webkit-transition:all .2s cubic-bezier(.5,.1,.7,.5)
	}
	`;

function getImageTags(template) {
	var resultingTags = new Array;
	var urlDivided = document.URL.substring(document.URL.lastIndexOf('/user/')+6).split('/');	
	
	var authorHandle = urlDivided[0];
	var authorName = "";
	var pictureName = urlDivided[2];
	var tempArray = document.querySelectorAll('div.boxbody td a[rel="tag"]');

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
