// A unified content script for almost ALL the sites, relies on defined getImageTags(); in XX\tagsParser.js
"use strict";

function createTagsStringField(template) {
	if (document.getElementById('sirArea') === null) {
		var arrayOfTags = getImageTags(template);
		var tagsString = "";
		for (var i = 0; i < arrayOfTags.length; i++) {
			tagsString += arrayOfTags[i].replace(/ /g, '_') + " ";
		};

		const sirDivArea = document.createElement('div');
			sirDivArea.id = "sirArea";
			windowDisplacement += 20;
			sirDivArea.style = "top:" + windowDisplacement + "px; left: 20px; position: fixed; z-index: 255;  border-width: 3px; border-style: solid; padding-left: 5px; padding-right: 5px; padding-top: 5px; background-color: lightgray;"
		document.body.appendChild(sirDivArea);

		const elderMagicField = document.createElement('textarea');
			elderMagicField.id = "elderMagicField";
			elderMagicField.style = "height: 150px; width: 360px;";
			elderMagicField.value = tagsString;
		document.getElementById('sirArea').appendChild(elderMagicField);

		const buttonsParagraph = document.createElement('p');
		if ((tagsOrigin==="TU")|(tagsOrigin==="TW")) {
			buttonsParagraph.innerHTML = "<span style ='font-size: small; float: right;'>Select 'Get Tags String' again to close this window.</p>"
			document.getElementById('sirArea').appendChild(buttonsParagraph);
			document.getElementById('elderMagicField').focus();
		} else {
			windowDisplacement -= 20; //compensate for the previous increment
			// ! Can't add onclick events to buttons with the usual method, have to use innerHTML instead
			buttonsParagraph.innerHTML =
				"<button id=\"c-and-h\" style=\"float:right\" onclick=\"javascript:\
					document.getElementById('elderMagicField').select();\
					document.execCommand('copy');\
					document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));\">\
				Copy & Hide</button>\
				<button onclick=\"javascript:\
					document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));\">\
				Cancel</button>";
			document.getElementById('sirArea').appendChild(buttonsParagraph);
			document.getElementById('c-and-h').focus();
		};

	} else {
		document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));
	}
};

chrome.runtime.onMessage.addListener(
	function(request, _sender, sendResponse) {
		switch (request.order) {
			case 'ping':
				sendResponse({message: true, origin: tagsOrigin});
				setHighlight(request.useDecor);
				break;
			case 'giffTags':
				sendResponse({tags: getImageTags(request.template), origin: tagsOrigin});
				break;
			case 'getTagsString':
				createTagsStringField(request.template);
				break;
			case 'displayWarning':
				alert(request.warning);
				break;
			case 'askForTemplate':
				sendResponse({newTemplate: prompt("\t\t\t\tCUSTOM TEMPLATE\t\t\t\t\n{handle} - Author Handle (unique for the platform)\n{OR} - Tags Origin (AS, DA, DF, HF, PX, TU, TW)\n{name} - Author name\n{caption} - Picture caption\n{tags} - Tags string\n\nPlease specify your custom template:", request.stub)});
				break;
			default:
				break;
		};
	}
);
