var tagsOrigin = "DA";
var windowDisplacement = 0;

function getImageTags(template) {
	var resultingTags = new Array;


	var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,document.URL.lastIndexOf('/art/'));
	var authorName = "";
	var pictureName = document.URL.substring(document.URL.lastIndexOf('/art/')+5,document.URL.lastIndexOf('-'));
	var tempArray = document.querySelectorAll("[href*='/tag/']");

	template = template.replace(/\{handle\}/g, authorHandle.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{name\}/g, authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	template = template.replace(/\{caption\}/g, pictureName.replace(/[ \n\t\r\v\f]/g, '-'))
	
	for (var i = 0; i < tempArray.length; i++) {
		template = template.replace(/\{tags\}/g, tempArray[i].innerText.replace(/[#]/g, '') + ' {tags}'); // Eclipse design has no hash here #, old site has hash
	};
	template = template.replace(/ \{tags\}/g, '');
	
	resultingTags = template.split(' ');
	return resultingTags;
};
