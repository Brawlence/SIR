"use strict";
var tagsOrigin = "DA";
var windowDisplacement = 0;

function getImageTags(template) {
	var resultingTags = new Array;


	var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,document.URL.lastIndexOf('/art/'));
	var authorName = "";
	var pictureName = document.URL.substring(document.URL.lastIndexOf('/art/')+5,document.URL.lastIndexOf('-'));
	var tempArray = document.querySelectorAll("[href*='/tag/']");

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))
	
	for (let tag of tempArray) {
		template = template.replace(/\{tags\}/g, tag.innerText.replace(/[#]/g, '') + ' {tags}'); // Eclipse design has no hash here #, old site has hash
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
			styleSir.innerHTML = /* Deviantart tag - usual is prefixed by a hashsign + with Eclipse on, no hashsign */
				"div.dev-title-container a.discoverytag,\
				a[href*='/tag/'] {\
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
