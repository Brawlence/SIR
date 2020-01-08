// A unified content script for almost ALL the sites, relies on defined getImageTags(); in XX\tagsParser.js
"use strict";

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
		buttonsParagraph.innerHTML =
			"<button id=\"c-and-h\" style=\"float:right\" onclick=\"javascript:\
				document.getElementById('elderMagicField').select();\
				document.execCommand('copy');\
				document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));\">\
			Copy & Hide</button>\
			<button onclick=\"javascript:\
				document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));\">\
			Cancel</button>";

		document.body.appendChild(sirDivArea);
		document.getElementById('sirArea').appendChild(elderMagicField);
		document.getElementById('sirArea').appendChild(buttonsParagraph);

		document.getElementById('c-and-h').focus();

	} else {
		document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order === "giffTags") {
			sendResponse({ tags: getImageTags(), origin: tagsOrigin });
		} else if (request.order === "imprintTags") {
			createElderMagicField();
		} else if (request.order === "displayWarning") {
			alert(request.warning);
		};
	}
);
