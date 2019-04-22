// TODO: Add parser for <figcaption>AUTHOR</figcaption>
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        if (request.order === "giffTags") {
            var arrayOfTags = document.getElementsByClassName("tags")[0].innerText.substr(7).split('#'); // cut first 7 symbols
            sendResponse( {tags: arrayOfTags, origin : "TU"} );
        }
	}
);