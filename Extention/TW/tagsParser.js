// TODO: get author name, handle and (probably?) comment

var tagsOrigin = "TW";

function getImageTags() {
	var resultingTags = new Array;
	var tempArray = document.getElementsByClassName("twitter-hashtag");
	for (i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText.substr(1));
	};
	return resultingTags;
};
