"use strict";
var tagsOrigin = "AS";
var windowDisplacement = 90;

function getImageTags(template) {
	var resultingTags = new Array;
	var profilelink = document.querySelector('aside div.name a').href;

	var authorHandle = profilelink.substring(profilelink.lastIndexOf('/')+1);
	var authorName = document.querySelector('aside div.name a').innerText;
	var pictureName = document.querySelector('aside div h1.h3').innerText;
	var tempArray = document.getElementsByClassName("tags")[0].innerText.substring(7).split('#');

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))

	for (var i = 0; i < tempArray.length; i++) {
		template = template.replace(/\{tags\}/g, tempArray[i] + ' {tags}');
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
			styleSir.innerHTML = /* FINALLY - an Artstation tag is a link (a) inside a div with tags class - it's complete with a hash sign */
				"div.tags a {\
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
