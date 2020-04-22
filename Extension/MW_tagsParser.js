"use strict";
var tagsOrigin = "MW";
var windowDisplacement = 0;

function getImageTags(template) {
	var resultingTags = new Array;
	

	var authorHandle = document.querySelector('div#content li.entry-author a').innerText;
	var authorName = "";
	var pictureName = document.querySelector('div#content h2.entry-title').innerText;
	var tempArray = document.querySelectorAll('div#content li.entry-tags a, div#content li.entry-category a');

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))

	for (let tag of tempArray) {
		template = template.replace(/\{tags\}/g, tag.innerText + ' {tags}');
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
				"div#content li.entry-author a, div#content li.entry-tags a, div#content li.entry-category a, div#content h2.entry-title { \
					border-width: 2px; \
					border-style: dotted; \
					border-color: lightpink; \
				}";
		document.head.appendChild(styleSir);
	};
	if ((!neededState) && document.getElementById('sir-style')) {
		document.head.removeChild(document.getElementById('sir-style'));
	}
};
