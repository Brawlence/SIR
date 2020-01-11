var tagsOrigin = "HF";
var windowDisplacement = 0;

function getImageTags() {
	var resultingTags = new Array;
	var urlDivided = document.URL.substring(document.URL.lastIndexOf('/user/')+6).split('/');	
	var authorHandle = urlDivided[0];
	var pictureName = urlDivided[2];
	var tempArray = document.querySelectorAll('div.boxbody td a[rel="tag"]');

	resultingTags.push(authorHandle + "@" + tagsOrigin);
	resultingTags.push(pictureName.replace(/[ ]/g, '-')); //replacement is not needed

	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText.replace(/[\#]/g, ''));
	};
	return resultingTags;
};
