function getImageTags() {
	var resultingTags = new Array;
	var resultingTags = document.querySelectorAll('td textarea[id="tags"]')[0].innerHTML.split(' ');

	var tempString = document.querySelectorAll('div [id="tag_list"]')[0].innerText.trim();
	resultingTags.unshift("drawfriends_" + tempString.substring(tempString.indexOf('Id: ') + 4, tempString.indexOf('\nPosted: '))); //add the drawfriends_ ID to the tags array

	return resultingTags;
};

function createElderMagicField() {
	if (document.getElementById('sirArea') == null) {
		document.getElementById('edit_form').style = "display: ";
		const buttonsParagraph = document.createElement('p');
		buttonsParagraph.id = "sirArea";
		buttonsParagraph.innerHTML = "<button id=\"c-and-h\" onclick=\"javascript:document.getElementById('tags').select();document.execCommand('copy');document.getElementById('sirArea').parentElement.style='';document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));document.getElementById('edit_form').style = 'display:none';\">Copy & Hide</button>";

		document.getElementById('tags').parentElement.appendChild(buttonsParagraph);
		document.getElementById('tags').parentElement.style = "height: 150px; width: 360px;  border-width: 3px; border-style: solid; padding: 5px; background-color: lightgray;";
		document.getElementById('c-and-h').focus();
	} else {
		document.getElementById('tags').parentElement.removeChild(document.getElementById('sirArea'));
		document.getElementById('tags').parentElement.style = "";
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order === "giffTags") {
			sendResponse({ tags: getImageTags(), origin: "DF" });
		} else if (request.order === "imprintTags") {
			createElderMagicField();
		} else if (request.order === "displayWarning") {
			alert(request.warning);
		};
	}
);
