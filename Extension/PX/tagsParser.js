var tagsOrigin = "PX";
var windowDisplacement = 0;

function getImageTags() {
	var resultingTags = new Array;
	var authorName = document.querySelector('aside section h2 div div a div').innerText;
	var pictureName = document.querySelector('figcaption div div h1').innerText;
	var tempArray = document.querySelectorAll('figcaption div footer ul li a');

	resultingTags.push(authorName.replace(/[ ]/g, '-'));
	resultingTags.push(pictureName.replace(/[ ]/g, '-'));

	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText);
	};
	return resultingTags;
};
