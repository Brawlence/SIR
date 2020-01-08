"use strict";

function getImageTags() {
	var resultingTags = new Array;
	var resultingTags = document.querySelectorAll('td textarea[id="tags"]')[0].innerHTML.split(' ');

	var tempString = document.querySelectorAll('div [id="tag_list"]')[0].innerText.trim();
	resultingTags.unshift("drawfriends_" + tempString.substring(tempString.indexOf('Id: ') + 4, tempString.indexOf('\nPosted: '))); //add the drawfriends_ ID to the tags array

	return resultingTags;
};

//this one is different - instead of the popup field like everyone else this uses the existing tags text field on the page
function createElderMagicField() {
	if (document.getElementById('sirArea') == null) {
		document.getElementById('edit_form').style = "display: ";
		const buttonsParagraph = document.createElement('p');
		buttonsParagraph.id = "sirArea";
		buttonsParagraph.innerHTML =
			"<button id=\"c-and-h\" style=\"float:right\" onclick=\"javascript:\
				document.getElementById('tags').select();\
				document.execCommand('copy');\
				document.getElementById('sirArea').parentElement.style='';\
				document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));\
				document.getElementById('edit_form').style = 'display:none';\">\
			Copy & Hide</button>\
			<button onclick=\"javascript:\
				document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));\">\
			Cancel</button>";

		document.getElementById('tags').parentElement.appendChild(buttonsParagraph);
		document.getElementById('tags').parentElement.style =
			"height: 150px; width: 360px;  border-width: 3px; border-style: solid; padding: 5px; background-color: lightgray;";

		document.getElementById('c-and-h').focus();

	} else {
		document.getElementById('tags').parentElement.style = "";
		document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order === "ping") {
			sendResponse({message: true, origin: "DF"});
		} else if (request.order === "giffTags") {
			sendResponse({ tags: getImageTags(), origin: "DF" });
		} else if (request.order === "imprintTags") {
			createElderMagicField();
		} else if (request.order === "displayWarning") {
			alert(request.warning);
		};
	}
);
