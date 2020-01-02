function getImageTags() {
	return document.querySelectorAll('td textarea[id="tags"]')[0].innerHTML.split(' ');;
};


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order === "giffTags") {
			sendResponse({ tags: getImageTags(), origin: "DF" });
		} else if (request.order === "imprintTags") {
			document.getElementById('edit_form').style = "display: ";
			const buttonsParagraph = document.createElement('p');
				buttonsParagraph.id = "sirArea";
				buttonsParagraph.innerHTML = "<button id=\"c-and-h\" onclick=\"javascript:document.getElementById('tags').select();document.execCommand('copy');document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));\">Copy & Hide</button>";
	
			document.getElementById('tags').parentElement.appendChild(buttonsParagraph);
			document.getElementById('c-and-h').focus();
		} else if (request.order === "displayWarning") {
			alert(request.warning);
		};
	}
);
