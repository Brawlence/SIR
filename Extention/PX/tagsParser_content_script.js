// The illustration name is always in <figcaption> <h1>NAME</h1> </figcaption> , tags are there too
// Author's name is in <aside> <section> <h2> <div> <div> <a> <div>
function getImageTags() {
	var resultingTags = new Array;
	var authorName = document.querySelectorAll('aside section h2 div div a div');
	var pictureName = document.querySelectorAll('figcaption div div h1');
	var tempArray = document.querySelectorAll('figcaption div footer ul li a');

	resultingTags.push(authorName[0].innerText+"@PX");
	resultingTags.push(pictureName[0].innerText);
	for (i = 0; i < tempArray.length; i++) {
		resultingTags.push(tempArray[i].innerText);
	};
	return resultingTags;
};

function createElderMagicField() {
	if (document.getElementById('sirArea') == null) {
		var arrayOfTags = getImageTags();
		var tagsString = "";
		for (i = 0; i < arrayOfTags.length; i++) {
			tagsString += arrayOfTags[i].replace(/ /g, '_') + " ";
		};
	
		const sirDivArea = document.createElement('div');
			sirDivArea.id = "sirArea";
			sirDivArea.style = "top: 20px; left: 20px; position: fixed; z-index: 255;  border-width: 3px; border-style: solid; padding: 5px; background-color: lightgray;"
		const elderMagicField = document.createElement('textarea');
			elderMagicField.id = "elderMagicField";
			elderMagicField.style = "height: 150px; width: 360px;";
			elderMagicField.value = tagsString;
		//somewhy I can't add onclick events to buttons with this method so I'll have to use innerHTML instead
		const buttonsParagraph = document.createElement('p');
			buttonsParagraph.innerHTML = "<button id=\"c-and-h\" style=\"float:right\" onclick=\"javascript:document.getElementById('elderMagicField').select();document.execCommand('copy');document.getElementById('root').removeChild(document.getElementById('sirArea'));\">Copy & Hide</button><button onclick=\"javascript:document.getElementById('root').removeChild(document.getElementById('sirArea'));\">Cancel</button>";
	
		document.getElementById('root').appendChild(sirDivArea);
		document.getElementById('sirArea').appendChild(elderMagicField);
		document.getElementById('sirArea').appendChild(buttonsParagraph);
	
		document.getElementById('c-and-h').focus();
	
	} else {
		document.getElementById('root').removeChild(document.getElementById('sirArea'));
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order === "giffTags") {
			sendResponse({ tags: getImageTags(), origin: "PX" });
		} else if (request.order === "imprintTags") {
			createElderMagicField();
		} else if (request.order === "displayWarning") {
			alert(request.warning);
		};
	}
);
