"use strict";
var tagsOrigin = "PX";
var windowDisplacement = 0;

function getImageTags(template) {
	var resultingTags = new Array;


	var authorHandle = document.querySelector('aside section h2 div div a').innerText; // TODO: fix later
	var authorName = "";
	var pictureName = document.querySelector('figcaption div div h1').innerText;
	var tempArray = document.querySelectorAll('figcaption div footer ul li a');

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))
	
	for (var i = 0; i < tempArray.length; i++) {
		template = template.replace(/\{tags\}/g, tempArray[i].innerText.replace(/ /g, '_') + ' {tags}');
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
			styleSir.innerHTML = /* author's handle, the name of the picture, tags - with enlish translation following, no hash*/
				"aside section h2 div div a,\
				figcaption div h1,\
				figcaption div footer ul li {\
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
