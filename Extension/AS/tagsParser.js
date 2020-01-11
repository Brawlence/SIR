var tagsOrigin = "AS";
var windowDisplacement = 90;

function getImageTags() {
	var resultingTags = new Array;
	var profilelink = document.querySelectorAll('aside div.name a')[0].href;
	var authorHandle = profilelink.substr(profilelink.lastIndexOf('/')+1);
	var authorName = document.querySelectorAll('aside div.name a')[0].innerText;
	var pictureName = document.querySelectorAll('aside div h1.h3')[0].innerText;
	var tempArray = document.getElementsByClassName("tags")[0].innerText.substr(7).split('#');

	resultingTags.push(authorHandle + "@" + tagsOrigin);
	resultingTags.push(authorName.replace(/[ ]/g, '-'));
	resultingTags.push(pictureName.replace(/[ ]/g, '-'));

	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i]);
	};
	return resultingTags;
};
