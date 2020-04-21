// A unified content script for almost ALL the sites
// relies on defined getImageTags() and constants in XX_tagsParser.js

"use strict";

const lowerParagraph_text = String.raw`
	<span>
		Select 'Get Tags String' again to close this window.
	</span>
	`;

const lowerParagraph_btns = String.raw`
	<button id="c-and-h" onclick="javascript:
		document.getElementById('elderMagicField').select();
		document.execCommand('copy');
		document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));
	">
		Copy & Hide
	</button>
	<button onclick="javascript:
		document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));
	">
		Cancel
	</button>
	`;

const sirBoxStyle = String.raw`
	div#sirArea {
		left: 20px;
		position: fixed;
		z-index: 255;
		border-width: 3px;
		border-style: solid;
		padding: 5px;
		padding-bottom: 0px;
		background-color: lightgray
	}

	div#sirArea p span {
		font-size: small; float: right;
	}

	button#c-and-h {
		float:right;
	}

	textarea#elderMagicField {
		height: 150px;
		width: 360px
	}
	`;

function pick(element) {
	return document.getElementById(element);
};

function fresh(element) {
	return document.createElement(element);
};

function createTagsStringField(template) {
	if (pick('sirArea') === null) {
		var arrayOfTags = getImageTags(template);
		var tagsString = "";
		for (var i = 0; i < arrayOfTags.length; i++) {
			tagsString += arrayOfTags[i].replace(/ /g, '_') + " ";
		};

		var allTheStyles = document.head.appendChild(fresh('style'));
			allTheStyles.type = "text/css";
			allTheStyles.id = "sir-box-style";
			allTheStyles.innerHTML = sirBoxStyle;

		const sirBox = document.body.appendChild(fresh('div'));
			sirBox.id = "sirArea";
			sirBox.style.top = (windowDisplacement + 20) + "px";

		const elderMagicField = pick('sirArea').appendChild(fresh('textarea'));
			elderMagicField.id = "elderMagicField";
			elderMagicField.value = tagsString;

		const lowerParagraph = pick('sirArea').appendChild(fresh('p'));
		if ((tagsOrigin==="TU")|(tagsOrigin==="TW")) {
			lowerParagraph.innerHTML = lowerParagraph_text;
			pick('elderMagicField').focus();
		} else {
			// ! Can't add onclick events to buttons with the usual method, have to use innerHTML instead
			lowerParagraph.innerHTML = lowerParagraph_btns;
			pick('c-and-h').focus();
		};

	} else {
		pick('sirArea').parentElement.removeChild(pick('sirArea'));
		document.head.removeChild(pick('sir-box-style'));
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
