function nicelyTagIt(imageHost, requesterPage,chromeFilename) { // gets filename determined by Chrome, those together will be used as a fallback

	if (localStorage["active_tab_title"] == -1) { // if no title is found, drop everything
		return chromeFilename;
	};

	var filename = chromeFilename.substring(0, chromeFilename.lastIndexOf('.'));
	var ext = chromeFilename.substr(chromeFilename.lastIndexOf('.') + 1); // separate extension from the filename
	

	// indexOf is freakingly fast, see https://jsperf.com/substring-test
	// ! DEVIANTART
	if ( (imageHost.indexOf('deviantart') > -1) || (requesterPage.indexOf('deviantart') > -1) ) {
	
		if (filename.indexOf('_by_') > -1) { // old method based on file name from the link
			var author = filename.substring(filename.lastIndexOf('_by_')+4,filename.lastIndexOf('-')); // author is a string starting after _by_ and ending with the last '-'
			var name = filename.substring(0, filename.lastIndexOf('_by_'));
		}

		filename = localStorage["active_tab_title"];
		var author = filename.substring(filename.lastIndexOf(' by ')+4,filename.lastIndexOf(' on Deviant'));
		var name = filename.substring(0, filename.lastIndexOf(' by '));

		filename = '[' + author + '@DA] ' + name; //reformat filename to this template, moving the author info
	};

	// ! TUMBLR
	// TODO: Add tumblr caption recognition
	if (imageHost.indexOf('tumblr') > -1) {
		//filename = localStorage["active_tab_title"];
		var author = "";
		var name = "";

		filename = '[' + author + '@TW] ' + name + " " + filename;
	};
	
	// ! TWITTER
	// TODO: Add twitter caption recognition
	if (imageHost.indexOf('twimg') > -1) {
		//filename = localStorage["active_tab_title"];
		var author = "";
		var name = "";

		filename = '[' + author + '@TW] ' + name + " " + filename;
		if (ext.indexOf('large') > -1) { ext = ext.substring(0, ext.indexOf('large')-1); }; //cleaning ext - twitter links are nasty
	};
	
	// ! PIXIV
	if ((imageHost.indexOf('pximg') > -1)||(requesterPage.indexOf('pixiv') > -1)) {
		
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


	// ! ARTSTATION
	// TODO: Add artstation caption recognition
	if ( (imageHost.indexOf('artstation') > -1) || (requesterPage.indexOf('artstation') > -1) ) {
		//filename = localStorage["active_tab_title"];
		var author = "";
		var name = "";

		filename = '[' + author + '@AS] ' + name + " " + filename;
	};

	// ! HENTAIFOUNDRY
	// TODO: Add hentaifoundry caption recognition
	if ( (imageHost.indexOf('hentai-foundry') > -1) || (requesterPage.indexOf('hentai-foundry') > -1) ) {
		//filename = localStorage["active_tab_title"];
		var author = "";
		var name = "";

		filename = '[' + author + '@HF] ' + name + " " + filename;
	};

	filename = filename.replace(/[\\/:*?\"<>|]/,''); // make sure the modified filename doesn't contain any illegal characters

	if (filename == "") { // make sure the name is not left blank
		filename = "tagme"; 
	}

	if (ext == "") {
		ext == "maybe.jpeg";
	}
	
	filename = filename + "." + ext; // add back the extension to the file name
	
	//console.log("Renaming result: " + filename);
	return filename;
};

// TODO: Add tags recieving based on chrome messaging API

chrome.tabs.onActivated.addListener( 
	function(tabId, changeInfo) { // send to fire after Tab Activated procedure
		chrome.tabs.query({active: true, currentWindow: true, status: "complete"}, // send into query (if active tab and current window were true)
			function setStorage(tabs) {
				if (tabs.length > 0) {
					//console.log("onActivated returned those values: " + tabs[0].title + " " + tabs[0].url);
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
								//console.log("onUpdated! Culprit: " + culprit.url + " " + culprit.title + "\n Active tab:" + tabs[0].title + " " + tabs[0].url);
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

			// get where that image is hosted on by 
			var tempContainer = document.createElement('a'); 									// creating an link-type (a) object 
			tempContainer.href = item.url;														// ! linking to the item we are about to save
			//tempContainer.innerHTML = "Heh, not bad, kid. You made me use my HTML power!"; 	// with inner HTML structure
			//document.body.appendChild(tempContainer);											// on chrome's generated background page

			// at we can see, item.hostname is undefined
			//console.log("Item URL: " + item.url + ", Item hostname: " + item.hostname);					
			// but if we do this, suddenly url is undefined but hostname works
			//console.log("temp object URL: " + tempContainer.url + ", temp object hostname: " + tempContainer.hostname);
			
			var imageHost = tempContainer.hostname;
			
			localStorage["initiator_url"] = item.referrer; // TODO: remove or comment this - it's not necessary, just convinient to debug

			var resultingFilename = nicelyTagIt(imageHost, item.referrer, item.filename);
			
			//end of MEANINGFUL NAMING
			// suggest the new filename to Chrome IF getting the tab name was successeffull
			suggest({ filename: resultingFilename, conflictAction: "uniquify" });
	}
);