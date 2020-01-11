var tagsOrigin = "DA";
var windowDisplacement = 0;

function getImageTags() {
	var resultingTags = new Array;

	var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,document.URL.lastIndexOf('/art/'));
	//var authorName = document.querySelectorAll(EXPRESSION_HERE)[0].innerText; authorHandle & Name are one and the same
	var pictureName = document.URL.substring(document.URL.lastIndexOf('/art/')+5,document.URL.lastIndexOf('-'));
	var tempArray = document.querySelectorAll("[href*='/tag/']");

	resultingTags.push(authorHandle + "@" + tagsOrigin);
	//resultingTags.push(authorName.replace(/[ ]/g, '-'));
	resultingTags.push(pictureName.replace(/[ ]/g, '-')); //replace is not needed

	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText.replace(/[\#]/g, '')); // Eclipse design has no hash here #, old site has hash
	};
	return resultingTags;
};
