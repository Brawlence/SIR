chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        if (request.order === "giffTags") {
            var arrayOfTags = new Array;
            var tempArray = document.getElementsByClassName("twitter-hashtag");
            for (i = 0; i < tempArray.length; i++) {
				arrayOfTags[i] = tempArray[i].innerText.substr(1);
			};
            sendResponse( {tags: arrayOfTags, origin : "TW"} );
        };
	}
);