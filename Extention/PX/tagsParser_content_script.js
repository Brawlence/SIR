// TODO: also get the name 
// The illustration name is always in <figcaption> <h1>NAME</h1> </figcaption> , tags are there too
function getImageTags() {
	var resultingTags = new Array;
	var tempArray = document.querySelectorAll('figcaption div footer ul li a');
	for (i = 0; i < tempArray.length; i++) {
		resultingTags[i] = tempArray[i].innerText;
	};
	return resultingTags;
};
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order === "giffTags") {
			sendResponse({ tags: getImageTags(), origin: "PX" });
		} else if (request.order === "imprintTags") {
			var arrayOfTags = getImageTags();
			var tagsString = "";
			for (i = 0; i < arrayOfTags.length; i++) {
				tagsString = tagsString + " " + arrayOfTags[i].replace(/ /g, '_');
			};
			const elderMagicField = document.createElement('textarea');
			elderMagicField.value = tagsString;
			elderMagicField.style = "top: 20px; left: 20px; position: fixed; z-index: 255; height: 150px; width: 360px;";
			document.getElementById('root').appendChild(elderMagicField);
			elderMagicField.select();
			document.execCommand('copy');
			//document.getElementById('root').removeChild(elderMagicField);
		};
	}
);
