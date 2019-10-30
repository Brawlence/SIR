chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order === "giffTags") {
			var arrayOfTags = document.querySelectorAll('td textarea[id="tags"]')[0].innerHTML.split(' ');
			sendResponse({ tags: arrayOfTags, origin: "DF" });
		}
	}
);
