var tagsOrigin = "AS";
var windowDisplacement = 90;

function getImageTags() {
	var resultingTags = new Array;
	var profilelink = document.querySelector('aside div.name a').href;
	var authorHandle = profilelink.substring(profilelink.lastIndexOf('/')+1);
	var authorName = document.querySelector('aside div.name a').innerText;
	var pictureName = document.querySelector('aside div h1.h3').innerText;
	var tempArray = document.getElementsByClassName("tags")[0].innerText.substring(7).split('#');

	resultingTags.push(authorHandle + "@" + tagsOrigin);
	resultingTags.push(authorName.replace(/[ ]/g, '-'));
	resultingTags.push(pictureName.replace(/[ ]/g, '-'));

	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i]);
	};
	return resultingTags;
};
