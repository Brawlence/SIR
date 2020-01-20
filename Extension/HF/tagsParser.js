var tagsOrigin = "HF";
var windowDisplacement = 0;

function getImageTags(template) {
	var resultingTags = new Array;
	var urlDivided = document.URL.substring(document.URL.lastIndexOf('/user/')+6).split('/');	
	
	var authorHandle = urlDivided[0];
	var authorName = "";
	var pictureName = urlDivided[2];
	var tempArray = document.querySelectorAll('div.boxbody td a[rel="tag"]');

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))

	for (var i = 0; i < tempArray.length; i++) {
		template = template.replace(/\{tags\}/g, tempArray[i].innerText.replace(/[#]/g, '') + ' {tags}');
	};
	template = template.replace(/ \{tags\}/g, '');
	
	resultingTags = template.split(' ');
	return resultingTags;
};
