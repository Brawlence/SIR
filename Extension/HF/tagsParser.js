// TODO: parse picture name and author handle

var tagsOrigin = "HF";
var windowDisplacement = 0;

function getImageTags() {
	var resultingTags = new Array;
	var tempArray = document.querySelectorAll('div.boxbody td a[rel="tag"]');
	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText);
	};
	return resultingTags;
};
