function nicelyTagIt(hostname,ChromeFilename) { // gets filename determined by Chrome, those together will be used as a fallback

	if (localStorage["active_tab_title"] == -1) { // if no title is found, drop everything
		return ChromeFilename;
	};

	var ext = ChromeFilename.substr(ChromeFilename.lastIndexOf('.') + 1); // separate extension from the filename
	var filename = ChromeFilename.substring(0, ChromeFilename.lastIndexOf('.'));

	// indexOf is freakingly fast, see https://jsperf.com/substring-test
	// ! DEVIANTART
	if (hostname.indexOf('deviantart') > -1) {
	
		var author = filename.substring(filename.lastIndexOf('_by_')+4,filename.lastIndexOf('-')); // author is a string starting after _by_ and ending with the last '-'
		filename = localStorage["active_tab_title"];
		var author = filename.substring(filename.lastIndexOf(' by ')+4,filename.lastIndexOf(' on Deviant'));

		//reformat filename to this template, moving the author info
		filename = '[' + author + '@DA] ' + filename.substring(0, filename.lastIndexOf('_by_')); // old operation based on the file link
		//filename = '[' + author + '@DA] ' + filename.substring(0, filename.lastIndexOf(' by '));
	};

	// ! TUMBLR
	// TODO: Add parser for <figcaption>AUTHOR</figcaption>
	if (hostname.indexOf('tumblr') > -1) {
		filename = '[' + author + '@TU@] ' + filename;
	};
	
	// ! TWITTER
	if (hostname.indexOf('twimg') > -1) {
		filename = '[' + author + '@TW] ' + filename;
		if (ext.indexOf('large') > -1) { ext = ext.substring(0, ext.indexOf('-large')); }; //cleaning ext - twitter links are nasty
	};
	
	// ! PIXIV
	// TODO: The illustration name is always in <figcaption> <h1>NAME</h1> </figcaption>
	if (hostname.indexOf('pximg') > -1) {
		
		var activeTabTitle = localStorage["active_tab_title"]; //since pixiv does not give info about name and author, try to extract it from the title of the page
		// old Pixiv naming standart
		//var author = activeTabTitle.substring(activeTabTitle.lastIndexOf('\u300C')+1,activeTabTitle.lastIndexOf('\u300D')); // '「' and '」' as last indexes
		//var name = activeTabTitle.substring(activeTabTitle.indexOf('\u300C')+1,activeTabTitle.indexOf('\u300D'));
		var splotted = activeTabTitle.split('\"');
		var name = splotted[1];
		var author = splotted[3];

		var PXnumber = filename.substring(0,filename.lastIndexOf('_'));
		var PXpage = filename.substring(filename.lastIndexOf('_p')+2, filename.lastIndexOf('_p')+4);

		if (filename.indexOf('master') > -1) { // if user wants to save a rescaled thumbnail, add a tag
			filename = 'THUMBNAIL!' + filename.substring(0, filename.lastIndexOf('_master')); 
		};
			
		filename = '[' + author + '@PX] pixiv_' + PXnumber + '_' + PXpage + ' ' + name;
	};

	filename = filename.replace(/[\\/:*?\"<>|]/,''); // make sure the modified filename doesn't contain any illegal characters

	if (filename == "") { // make sure the name is not left blank
		filename = "tagme"; 
	}
	
	filename = filename + "." + ext; // add back the extension to the file name

	return filename;
};


chrome.tabs.onActivated.addListener( 
	function(tabId, changeInfo) { // send to fire after Tab Activated procedure
		chrome.tabs.query({active: true, currentWindow: true, status: "complete"}, // send into query (if active tab and current window were true)
			function setStorage(tabs) {
				if (tabs.length > 0) {
					// console.log("onActivated returned those values: " + tabs[0].title + " " + tabs[0].url);
					localStorage["active_tab_title"] = tabs[0].title;			// needs the "tabs" permission
					localStorage["active_tab_url"] = tabs[0].url;				// needs the "tabs" permission
				}
			}
		);
	}
);

// the safety checks in this one is pure magic - it should only proceed to do its buisiness if the FINALIZED page was updated and it's currently the active one
chrome.tabs.onUpdated.addListener( 
	function (tabId , changeInfo, culprit) {
		if (culprit.status === "complete") {
			chrome.tabs.query({active: true, currentWindow: true, status: "complete"},
				function fireIfActive(tabs) {
					if (typeof tabs !== 'undefined') {
						if (tabs.length > 0) {
							if (tabs[0].tabId === culprit.tabId) { // Definitely the ACTIVE one was updated
								// console.log("onUpdated! Culprit: " + culprit.url + " " + culprit.title + "\n Active tab:" + tabs[0].title + " " + tabs[0].url);
								localStorage["active_tab_url"] = tabs[0].url;		// needs the "tabs" permission
								localStorage["active_tab_title"] = tabs[0].title; 	// needs the "tabs" permission
							}
						}	
					}
				}
			);
		}
	}
); 


chrome.downloads.onDeterminingFilename.addListener(
	function(item, suggest) { // sent into DeterminingFilename
	// Has access only to chrome's background page

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
			
			var resultingFilename = nicelyTagIt(hostname, item.filename);
			
			//end of MEANINGFUL NAMING
			// suggest the new filename to Chrome IF getting the tab name was successeffull
			suggest({ filename: resultingFilename, conflictAction: "uniquify" });
	}
);