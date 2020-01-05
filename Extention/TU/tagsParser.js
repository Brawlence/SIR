// TODO: parse picture name and author handle
// Add parser for <figcaption>AUTHOR</figcaption>

var tagsOrigin = "TU";

function getImageTags() {
	var postTags = document.querySelectorAll("[href*='/tagged/']");
	for (i = 0; i < eclipseTags.length; i++) {
		resultingTags.push(postTags[i].innerText.replace(/[\#]/g, ''));
	};
	return resultingTags;
};
