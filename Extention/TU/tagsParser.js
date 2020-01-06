// TODO: parse picture name and author handle
// Add parser for <figcaption>AUTHOR</figcaption>

var tagsOrigin = "TU";

function getImageTags() {
	var resultingTags = new Array;
	var tempArray = document.querySelectorAll("[href*='/tagged/']");
	for (i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText.replace(/[\#]/g, ''));
	};
	return resultingTags;
};
