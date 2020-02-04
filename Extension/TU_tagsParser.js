"use strict";
var tagsOrigin = "TU";
var windowDisplacement = 0;

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
	
	for (var i = 0; i < tempArray.length; i++) {
		template = template.replace(/\{tags\}/g, tempArray[i].innerText.replace(/[#]/g, '') + ' {tags}');
	};
	template = template.replace(/ \{tags\}/g, '');
	
	resultingTags = template.split(' ');
	return resultingTags;
};

function setHighlight(neededState){
	if (neededState && (document.getElementById('sir-style') === null)) {
		var styleSir = document.createElement('style');
			styleSir.type = "text/css";
			styleSir.id = "sir-style";
			styleSir.innerHTML =
				"a[href*='/tagged/'] {\
					border-width: 2px;\
					border-style: dotted;\
					border-color: lightpink;\
				}";
		document.head.appendChild(styleSir);
	};
	if ((!neededState) && document.getElementById('sir-style')) {
		document.head.removeChild(document.getElementById('sir-style'));
	}
};