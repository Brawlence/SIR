var tagsOrigin = "PX";
var windowDisplacement = 0;

function getImageTags() {
	var resultingTags = new Array;
	// var authorHandle = document.querySelectorAll('')[0].innerText; // TODO: fix
	var authorName = document.querySelectorAll('aside section h2 div div a div')[0].innerText;
	var pictureName = document.querySelectorAll('figcaption div div h1')[0].innerText;
	var tempArray = document.querySelectorAll('figcaption div footer ul li a');

	//resultingTags.push(authorHandle + "@" + tagsOrigin);
	resultingTags.push(authorName.replace(/[ ]/g, '-'));
	resultingTags.push(pictureName.replace(/[ ]/g, '-'));

	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText);
	};
	return resultingTags;
};
