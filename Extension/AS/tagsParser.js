var tagsOrigin = "AS";
var windowDisplacement = 90;

function getImageTags(template) {
	var resultingTags = new Array;
	var profilelink = document.querySelector('aside div.name a').href;

	var authorHandle = profilelink.substring(profilelink.lastIndexOf('/')+1);
	var authorName = document.querySelector('aside div.name a').innerText;
	var pictureName = document.querySelector('aside div h1.h3').innerText;
	var tempArray = document.getElementsByClassName("tags")[0].innerText.substring(7).split('#');

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))

	for (var i = 0; i < tempArray.length; i++) {
		template = template.replace(/\{tags\}/g, tempArray[i] + ' {tags}');
	};
	template = template.replace(/ \{tags\}/g, '');
	
	resultingTags = template.split(' ');
	return resultingTags;
};
