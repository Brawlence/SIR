// The illustration name is always in <figcaption> <h1>NAME</h1> </figcaption> , tags are there too
// Author's name is in <aside> <section> <h2> <div> <div> <a> <div>
var tagsOrigin = "PX";

function getImageTags() {
	var resultingTags = new Array;
	var authorName = document.querySelectorAll('aside section h2 div div a div');
	var pictureName = document.querySelectorAll('figcaption div div h1');
	var tempArray = document.querySelectorAll('figcaption div footer ul li a');

	resultingTags.push(authorName[0].innerText + "@PX");
	resultingTags.push(pictureName[0].innerText);
	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText);
	};
	return resultingTags;
};
