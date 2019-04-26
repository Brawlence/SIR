// TODO: also get the name 
// The illustration name is always in <figcaption> <h1>NAME</h1> </figcaption> , tags are there too
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        if (request.order === "giffTags") {
            var arrayOfTags = new Array;
            var tempArray = document.querySelectorAll('figcaption div footer ul li a');
            for (i = 0; i < tempArray.length; i++) {
				arrayOfTags[i] = tempArray[i].innerText;
			};
            sendResponse( {tags: arrayOfTags, origin : "PX"} );
        };
	}
);