"use strict";
var tagsOrigin = "DF";

/* Drawfriends has a pretty easy structure:
	div class="sidebar" contains a div class="tag_list",
	containing list in which are separate links which are tags */
const highlightStyle = String.raw`
	div#tag_list li a {
		border-width: 2px;
		border-style: dotted;
		border-color: lightpink;

		transition:all .2s cubic-bezier(.5,.1,.7,.5);
		-webkit-transition:all .2s cubic-bezier(.5,.1,.7,.5)
	}
	`;

// Drawfriends is a special case because it already HAS a field with all the tags.
function getFormattedTags(template) {
	var resultingTags = new Array;
	var	tempString = document.querySelector('td textarea[id="tags"]').innerHTML;
	if (template.indexOf('@{OR}') > -1) { // TODO: FIX THIS to a proper template renaming
		tempString = tempString.replace(/_\((art|color)ist\)/g, '@' + tagsOrigin);
	} else {
		tempString = tempString.replace(/\s[\w]+?_\((art|color)ist\)/g, ' ');
	};
	resultingTags = tempString.split(' ');
	
	tempString = document.querySelector('div [id="tag_list"]').innerText.trim();
	resultingTags.unshift("drawfriends_" + tempString.substring(tempString.indexOf('Id: ') + 4, tempString.indexOf('\nPosted: '))); //add the drawfriends_ ID to the tags array

	return resultingTags;
};

//this one is different - instead of the popup field like everyone else this uses the existing tags text field on the page
function createTagsStringField() {
	if (document.getElementById('sirArea') === null) {
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

function setHighlight(neededState){
	if (neededState && (document.getElementById('sir-style') === null)) {
		var styleSir = document.createElement('style');
			styleSir.type = "text/css";
			styleSir.id = "sir-style";
			styleSir.innerHTML = highlightStyle;
		document.head.appendChild(styleSir);
	};
	if ((!neededState) && document.getElementById('sir-style')) {
		document.head.removeChild(document.getElementById('sir-style'));
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.order) {
			case 'ping':
				sendResponse({message: true, origin: tagsOrigin});
				setHighlight(request.useDecor);
				break;
			case 'giffTags':
				sendResponse({tags: getFormattedTags(request.template), origin: tagsOrigin});
				break;
			case 'getTagsString':
				createTagsStringField();
				break;
			case 'displayWarning':
				alert(request.warning);
				break;
			case 'askForTemplate':
				sendResponse({newTemplate: prompt("WARNING: currently the booru parser only looks if '@{OR}' is present in the template.\nPlease specify your custom template:", request.stub)});
				break;
			default:
				break;
		};
	}
);
