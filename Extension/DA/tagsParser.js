// TODO: parse picture name and author handle

var tagsOrigin = "DA";

function getImageTags() {
	var resultingTags = new Array;
	//var authorName = document.querySelectorAll('aside section h2 div div a div');
	//var pictureName = document.querySelectorAll('figcaption div div h1');

	//resultingTags.push(authorName[0].innerText+"@PX");
	//resultingTags.push(pictureName[0].innerText);

	var eclipseTags = document.querySelectorAll("[href*='/tag/']");
	for (var i = 0; i < eclipseTags.length; i++) {
		resultingTags.push(eclipseTags[i].innerText.replace(/[\#]/g, '')); // Eclipse design has no hash here #, old site has hash. SO FILTER IT
	};
	return resultingTags;
};
