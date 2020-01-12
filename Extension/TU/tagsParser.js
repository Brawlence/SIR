var tagsOrigin = "TU";
var windowDisplacement = 0;

function getImageTags() {
	var resultingTags = new Array;
	var authorHandle = document.URL.substring(document.URL.lastIndexOf('://')+3,document.URL.lastIndexOf('.tumblr'));
	var authorName = document.querySelector("header div figcaption, header div h1 a").innerText; //it's either one or the other
	var tempArray = document.querySelectorAll("[href*='/tagged/']");

	resultingTags.push(authorHandle + "@" + tagsOrigin);
	resultingTags.push(authorName.replace(/[ ]/g, '-'));
	
	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText.replace(/[#]/g, ''));
	};
	return resultingTags;
};
