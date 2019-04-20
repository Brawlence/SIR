// gets filename determined by Chrome, those together will be used as a fallback
function rabudo(hostname,ChromeFilename) {

	// separate extension from the filename
	var ext = ChromeFilename.substr(ChromeFilename.lastIndexOf('.') + 1);
	var filename = ChromeFilename.substring(0, ChromeFilename.lastIndexOf('.'));
	
	// extract the domain from hostname - indexOf is freakingly fast, see https://jsperf.com/substring-test
	// DEVIANTART
	if (hostname.indexOf('deviantart') > -1) {

		// author is a string starting after _by_ and ending with the last '-'
		var author = filename.substring(filename.lastIndexOf('_by_')+4,filename.lastIndexOf('-')); // old operation based on the file link
		//filename = localStorage["active_tab_title"];
		//var author = filename.substring(filename.lastIndexOf(' by ')+4,filename.lastIndexOf(' on Deviant'));

		// reformat filename to this template, moving the author info
		filename = '[' + author + '@DA] ' + filename.substring(0, filename.lastIndexOf('_by_')); // old operation based on the file link
		//filename = '[' + author + '@DA] ' + filename.substring(0, filename.lastIndexOf(' by '));
	};

	//TUMBLR
	//Add parser for <figcaption>AUTHOR</figcaption>
	if (hostname.indexOf('tumblr') > -1) {
		filename = '[' + author + '@TU@] ' + filename;
	};
	
	//TWITTER
	if (hostname.indexOf('twimg') > -1) {
		filename = '[' + author + '@TW] ' + filename;
		//cleaning ext - twitter links are nasty
		if (ext.indexOf('large') > -1) { ext = ext.substring(0, ext.indexOf('-large')); };
	};
	
	//PIXIV
	//The illustration name is always in <h1>NAME</h1>
	if (hostname.indexOf('pximg') > -1) {
		//since pixiv does not give info about name and author, try to extract it from the title of the page
		var activeTabTitle = localStorage["active_tab_title"];
		var author = activeTabTitle.substring(activeTabTitle.lastIndexOf('\u300C')+1,activeTabTitle.lastIndexOf('\u300D')); // '「' and '」' as last indexes
		var name = activeTabTitle.substring(activeTabTitle.indexOf('\u300C')+1,activeTabTitle.indexOf('\u300D'));
		//alert('The resulting author-picture is ' + author + ' - ' + name);
		
		// if user wants to save a rescaled thumbnail, add a tag
		if (filename.indexOf('master') > -1) {
			filename = 'THUMBNAIL!' + filename.substring(0, filename.lastIndexOf('_master'));
		};
		
		var number = filename.substring(0,filename.lastIndexOf('_'));
		filename = '[' + author + '@PX] pixiv_' + number + ' ' + name;

		};

	// make sure the modified filename doesn't contain any illegal characters
	filename = filename.replace(/[\#\?].*$/,'');

	// make sure the name is not left blank
	if (filename == "") {
		filename = "tagme";
	}

	// add back the extension to the file name
	filename = filename + "." + ext;

	return filename;
};


chrome.tabs.onActivated.addListener( 
	function(tabId, info) { // send to fire after Tab Activated procedure
		chrome.tabs.query({active: true, currentWindow: true}, // send into query (if active tab and current window were true)
			function activeTabTitle(tabs) {
				chrome.storage.local.set(
					{"active_tab_url": tabs[0].url, "active_tab_title": tabs[0].title},
					function() { console.log("onActivated called, " + tabs[0].url + ", " + tabs[0].title + " saved") }
				);	
			}
		);
	}
);

chrome.tabs.onUpdated.addListener( 
	function (tabId,info) {
		chrome.storage.local.set(
			{"active_tab_url": info.url},
			function() { console.log("onUpdate called, " + info.url + " saved") }
		);
	} 
);



chrome.downloads.onDeterminingFilename.addListener(
	function(item, suggest) { // sent into DeterminingFilename
	// Has access only to chrome's background page

		alert(returnedMASS);

			// get where that image is hosted by 
			var tempContainer = document.createElement('a'); 									// creating an link-type (a) object 
			tempContainer.href = item.url;														// ! linking to the item we are about to save
			//tempContainer.innerHTML = "Heh, not bad, kid. You made me use my HTML power!"; 	// with inner HTML structure
			//document.body.appendChild(tempContainer);											// on chrome's generated background page

			// at we can see, item.hostname is undefined
			//console.log("Item URL: " + item.url + ", Item HOSTNAME: " + item.hostname);					
			// but if we do this, suddenly url is undefined but hostname works
			//console.log("temp object URL: " + tempContainer.url + ", temp object HOSTNAME: " + tempContainer.hostname);

			var hostname = tempContainer.hostname;
			
			var resultingFilename = rabudo(hostname, item.filename);
			
			//end of MEANINGFUL NAMING
			// suggest the new filename to Chrome IF getting the tab name was successeffull
			suggest({ filename: resultingFilename, conflictAction: "uniquify" });
	}
);