// TODO: parse picture name and author handle

var tagsOrigin = "HF";

function getImageTags() {
	var resultingTags = new Array;
	var tempArray = document.querySelectorAll('div.boxbody td a[rel="tag"]');
	for (i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText);
	};
	return resultingTags;
};
