"use strict";
var tagsOrigin = "TU";
var windowDisplacement = 0;

/* Sad tumblr noises */
const hastagStyle = String.raw`
	a[href*='/tagged/'] {
		border-width: 2px;
		border-style: dotted;
		border-color: lightpink;

		transition:all .2s cubic-bezier(.5,.1,.7,.5);
		-webkit-transition:all .2s cubic-bezier(.5,.1,.7,.5)
	}
	`;

function getImageTags(template) {
	var resultingTags = new Array;


	var authorHandle = document.URL.substring(document.URL.lastIndexOf('://')+3,document.URL.lastIndexOf('.tumblr'));
	var authorName = document.querySelector("header div figcaption, header div h1 a").innerText; //it's either one or the other
	var pictureName = "";
	var tempArray = document.querySelectorAll("[href*='/tagged/']");

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
