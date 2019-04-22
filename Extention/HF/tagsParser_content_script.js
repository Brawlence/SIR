chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        if (request.order === "giffTags") {
            var arrayOfTags = new Array;
            var tempArray = document.querySelectorAll('div.boxbody td a[rel="tag"]');
            for (i = 0; i < tempArray.length; i++) {
				arrayOfTags[i] = tempArray[i].innerText;
			};
            sendResponse( {tags: arrayOfTags, origin : "HF"} );
        };
	}
);
