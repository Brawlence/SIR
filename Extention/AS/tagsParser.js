// TODO: parse picture name and author handle

var tagsOrigin = "AS";

function getImageTags() {
	var resultingTags = document.getElementsByClassName("tags")[0].innerText.substr(7).split('#'); // cut first 7 symbols
	return resultingTags;
};
