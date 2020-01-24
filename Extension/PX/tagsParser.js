var tagsOrigin = "PX";
var windowDisplacement = 0;

function getImageTags(template) {
	var resultingTags = new Array;


	var authorHandle = document.querySelector('aside section h2 div div a div').innerText;
	var authorName = "";
	var pictureName = document.querySelector('figcaption div div h1').innerText;
	var tempArray = document.querySelectorAll('figcaption div footer ul li a');

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))
	
	for (var i = 0; i < tempArray.length; i++) {
		template = template.replace(/\{tags\}/g, tempArray[i].innerText.replace(/ /g, '_') + ' {tags}');
	};
	template = template.replace(/ \{tags\}/g, '');

	resultingTags = template.split(' ');
	return resultingTags;
};
