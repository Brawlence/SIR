var tagsOrigin = "TW";
var windowDisplacement = 0;

function getImageTags() {
	var resultingTags = new Array;
	// if the url contains /status/, crop to it, otherwise crop to the last symbol
	var authorHandle = document.URL.substring(document.URL.lastIndexOf('.com/')+5,(document.URL.lastIndexOf('/status/')>0?document.URL.lastIndexOf('/status/'):undefined));
	var authorName = document.querySelector("main div article div a[href*='" + authorHandle + "'] span, div div a[href*='" +  authorHandle + "']").innerText; //Twitter on Chrome works differently somewhy
	//var pictureName = document.URL.substring(document.URL.lastIndexOf('/art/')+5,document.URL.lastIndexOf('-'));
	var tempArray = document.querySelectorAll("div article span a[href*='/hashtag/']");

	resultingTags.push(authorHandle + "@" + tagsOrigin);
	resultingTags.push(authorName.replace(/[ \n\t\r\v\f]/g, '-'));
	//resultingTags.push(pictureName.replace(/[ ]/g, '-')); //replace is not needed
	
	for (var i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText.replace(/[#]/g, ''));
	};
	return resultingTags;
};
