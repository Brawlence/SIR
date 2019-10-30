var saveSilentlyEnabled = false;

var sir = {
	//adds an individual item to the context menu and gives it the index passed into the function
	makeMenuItem: function(index, item, icon, useIcon) {
		if (useIcon) {
			chrome.contextMenus.create({
				id: index.toString(),
				title: item.toString(),
				contexts: ["image"],
				icons: { "16": icon.toString() }
			})
		} else {
			//icons not supported, or undesirable. leave them out
			chrome.contextMenus.create({
				id: index.toString(),
				title: item.toString(),
				contexts: ["image"]
			})
		}
	},

	//adds all URLs to the function from local storage, using indices 0 - urlList.length-1 as their IDs
	makeMenuItems: function(browserInfo) {
		chrome.contextMenus.removeAll();

		var useIcons = true;
		if (parseInt(browserInfo.version, 10) < 56) { //not sure when icon support was added, but it existed in 56 and does not exist in 52
			useIcons = false;
		}


		sir.makeMenuItem(0 /* Index */ , "Download with tags" /* title */ , "SIR_16x16.png" /* Icon */ , useIcons);

		chrome.contextMenus.create({
			type: "checkbox",
			id: "saveSilently",
			title: "Save silently",
			checked: saveSilentlyEnabled,
			contexts: ["image"]
		})

		// useful for getting from LocalStorage in async
		var urls = chrome.storage.local.get(["urlList"], function(result) {
			if (!result.urlList || (result.urlList.length == 0)) {
				//FUCK
			} else {

			}
		})
	},

	//gets browser info and passes it to makeMenuItems to determine if things like icons are supported
	makeMenu: function() {
		var gettingBrowserInfo = browser.runtime.getBrowserInfo();
		gettingBrowserInfo.then(sir.makeMenuItems);
	},

	firstRun: function(details) {
		if (details.reason === 'install' || details.reason === 'update') {
			console.log("SIR is installed successefully.");
		}
	},
}

browser.runtime.onInstalled.addListener(sir.firstRun);
sir.makeMenu();

function nicelyTagIt(imageHost, requesterPage, chromeFilename) { // gets filename determined by Chrome, those together will be used as a fallback

	//sasuga

	if ((localStorage["active_tab_title"] == -1) || (localStorage["active_tab_title"] == "")) { // if the tab title was not found, drop everything
		return chromeFilename;
	};

	// indexOf is freakingly fast, see https://jsperf.com/substring-test
	if (chromeFilename.indexOf('.') > -1) { //checks for mistakenly queued download
		var filename = chromeFilename.substring(0, chromeFilename.lastIndexOf('.'));
		var ext = chromeFilename.substr(chromeFilename.lastIndexOf('.') + 1); // separate extension from the filename
	} else {
		return chromeFilename;
	};

	var activeTabTitle = localStorage["active_tab_title"];

	// ! DEVIANTART
	if ((imageHost.indexOf('deviantart') > -1) || (requesterPage.indexOf('deviantart') > -1)) {
		var author = activeTabTitle.substring(activeTabTitle.lastIndexOf(' by ') + 4, activeTabTitle.lastIndexOf(' on Deviant'));
		var name = activeTabTitle.substring(0, activeTabTitle.lastIndexOf(' by '));

		filename = '[' + author + '@DA] ' + name; //reformat filename to this template, moving the author info

		if (localStorage["origin"] === "DA") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename = filename + " " + arrayOfTags[i].replace(/ /g, '_');
			};
		};
	};

	// ! TUMBLR
	if ((imageHost.indexOf('tumblr') > -1) || (requesterPage.indexOf('tumblr') > -1)) {
		var temp = activeTabTitle.split(': ')[0];
		if (temp.indexOf(' ') > -1) {
			name = temp.replace(/ /g, '_');
			if (requesterPage.indexOf('//tumblr') > -1) {
				author = requesterPage.substring(requesterPage.indexOf('tumblr.'), requesterPage.lastIndexOf('.com'));
			} else {
				author = requesterPage.substring(requesterPage.indexOf('//'), requesterPage.lastIndexOf('.tumblr'));
			}
		} else if (temp == requesterPage.substring(requesterPage.indexOf('//'), requesterPage.lastIndexOf('.tumblr'))) {
			author = temp;
			name = "";
		};

		filename = '[' + author + '@TU] ' + name + " " + filename;
		if (localStorage["origin"] === "TU") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename = filename + " " + arrayOfTags[i].replace(/ /g, '_');
			};
		};
	};

	// ! TWITTER
	if ((imageHost.indexOf('twimg') > -1) || (requesterPage.indexOf('twitter') > -1)) {
		var author = "___"; // in this case, @handle of twitter profile
		var name = ""; // name of the author profile, not the name of the image itself
		if (activeTabTitle.indexOf(' | ') > -1) { // on profile page: 'Artist (@twitter_link) | Twitter'
			var temp = activeTabTitle.split(' | ')[0];
			author = temp.substring(temp.indexOf('(') + 2, temp.indexOf(')'));
			name = temp.substring(0, temp.indexOf(' (')).replace(/ /g, '_');
		};
		if (activeTabTitle.indexOf(': ') > -1) { // on a random feed page: 'Artist on twitter: «picture_caption»'
			var temp = activeTabTitle.split(': ')[0];
			temp = temp.substring(0, temp.lastIndexOf(' '));
			author = requesterPage.substring(requesterPage.lastIndexOf('.com/') + 5, requesterPage.lastIndexOf('/status/'));
			name = temp.substring(0, temp.lastIndexOf(' ')).replace(/ /g, '_');
		};
		filename = '[' + author + '@TW] (' + name + ')';

		if (localStorage["origin"] === "TW") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename = filename + " " + arrayOfTags[i].replace(/ /g, '_');
			};
		};

		if (ext.indexOf('large') > -1) { ext = ext.substring(0, ext.indexOf('large') - 1); }; //cleaning ext - twitter image links are nasty
	};

	// ! PIXIV
	if ((imageHost.indexOf('pximg') > -1) || (requesterPage.indexOf('pixiv') > -1)) {
		if (typeof activeTabTitle !== "undefined") { // why am I even supposed to check for this shit?
			var splotted = activeTabTitle.split('\"');
		} else {
			return chromeFilename;
		}
		var name = splotted[1];
		var author = splotted[3];

		var PXnumber = filename.substring(0, filename.lastIndexOf('_'));
		var PXpage = filename.substring(filename.lastIndexOf('_p') + 2, filename.lastIndexOf('_p') + 4);

		if (filename.indexOf('master') > -1) {
			alert("You are saving a thumbnail. If you want a full-sized picture, either:\n- click on it to enlarge before saving\n- use the \"Save link as...\" context menu option.")
			PXpage = 'THUMBNAIL!' + PXpage; // if user wants to save a rescaled thumbnail, add a tag
		};

		filename = '[' + author + '@PX] pixiv_' + PXnumber + '_' + PXpage + ' ' + name;

		if (localStorage["origin"] === "PX") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename = filename + " " + arrayOfTags[i].replace(/[ \:]/g, '_');
			};
		}
	};

	// ! ARTSTATION
	if ((imageHost.indexOf('artstation') > -1) || (requesterPage.indexOf('artstation') > -1)) {
		var author = activeTabTitle.substring(activeTabTitle.lastIndexOf(', ') + 2, activeTabTitle.length);
		var name = activeTabTitle.substring(activeTabTitle.lastIndexOf(' - ') + 3, activeTabTitle.lastIndexOf(', '));
		filename = '[' + author + '@AS] ' + name + " " + filename;

		if (localStorage["origin"] === "AS") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename = filename + " " + arrayOfTags[i].replace(/ /g, '_');
			};
		}
	};

	// ! HENTAIFOUNDRY
	if ((imageHost.indexOf('hentai-foundry') > -1) || (requesterPage.indexOf('hentai-foundry') > -1)) {
		var author = activeTabTitle.substring(activeTabTitle.indexOf(' by ') + 4, activeTabTitle.lastIndexOf(' - '));
		var name = activeTabTitle.substring(0, activeTabTitle.indexOf(' by '));

		filename = '[' + author + '@HF] ' + name;

		if (localStorage["origin"] === "HF") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename = filename + " " + arrayOfTags[i].replace(/ /g, '_');
			};
		}
	};

	// ! DRAWFRIENDS BOROO
	if ((imageHost.indexOf('drawfriends.booru.org') > -1) || (requesterPage.indexOf('drawfriends') > -1)) {
		/* no failover, just get the tags */
		filename = "";

		if (localStorage["origin"] === "DF") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename = filename + " " + arrayOfTags[i].replace(/ /g, '_');
			};
		}
	};


	if (ext.length > 5) { //additional check for various madness
		return chromeFilename;
	}

	// TODO: merge two correction replace ops with regexp
	filename = filename.replace(/\ \ /g, ' ');
	filename = filename.replace(/\ \./g, '.');

	filename = filename.replace(/[\,\\/:*?\"<>|]/g, ''); // make sure the modified filename doesn't contain any illegal characters

	if (filename == "") { // make sure the name is not left blank
		filename = "tagme";
	} else if (ext == "") { // also make sure that extention did not magically disappear
		ext == "maybe.jpeg";
	}

	//console.log("Renaming result: " + filename + "." + ext);

	return (filename + "." + ext); // add back the extension to the file name and return them
};

function requestTagsAndWriteEm(TabIdToSendTo) {
	chrome.tabs.sendMessage(TabIdToSendTo, { order: "giffTags" },
		function requestAndWrite(response) {
			if (chrome.runtime.lastError) {
				//localStorage.clear(); //TODO: decide if a clean-up is needed here
			} else {
				if (typeof response !== 'undefined') {
					localStorage["tags"] = JSON.stringify(response.tags);
					localStorage["origin"] = response.origin;
				}
			}
		}
	)
}

chrome.tabs.onActivated.addListener(
	function runOnActivated(tabId, changeInfo) { // send to fire after Tab Activated procedure
		chrome.tabs.query({ active: true, currentWindow: true, status: "complete" }, // send into query (if active tab and current window were true)
			function setStorage(tabs) {
				if (tabs.length > 0) {
					localStorage["active_tab_title"] = tabs[0].title; // needs the "tabs" permission

					// somewhy the following wrecks havoc on everything
					// TODO: I need to think how to actually switch current line of tags when the active tab is changed
					//requestTagsAndWriteEm(tabs[0].id);
				}
			}
		);
	}
);

// TODO: MAYBE inject my content scripts programmatically instead of declaratively? Context menu -> Save with all the info ?
// the safety checks in this one is pure magic - it should only proceed to do its buisiness if the FINALIZED page was updated and it's currently the active one
chrome.tabs.onUpdated.addListener(
	function runOnUpdated(tabId, changeInfo, culprit) {
		if (culprit.status === "complete") {
			chrome.tabs.query({ active: true, currentWindow: true, status: "complete" },
				function fireIfActive(tabs) {
					if (typeof tabs !== 'undefined') {
						if (tabs.length > 0) {
							if (tabs[0].tabId === culprit.tabId) { // Definitely the ACTIVE one was updated
								localStorage["active_tab_title"] = tabs[0].title; // needs the "tabs" permission
								requestTagsAndWriteEm(tabs[0].id);
							}
						}
					}
				}
			);
		}
	}
);

//perform the requested action on menu click
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId == "saveSilently") {
		//handle alt option toggle
		saveSilentlyEnabled = !saveSilentlyEnabled;
	} else {
		// get where that image is hosted on by
		var tempContainer = document.createElement('a'); // creating an link-type (a) object
		tempContainer.href = info.srcUrl; // ! linking to the item we are about to save
		//tempContainer.innerHTML = "Heh, not bad, kid. You made me use my HTML power!"; 	// with inner HTML structure
		//document.body.appendChild(tempContainer);											// on chrome's generated background page

		// at we can see, info.hostname is undefined
		console.log("Item URL: " + info.srcUrl + ", Item hostname: " + info.hostname);
		// but if we do this, suddenly url is undefined but hostname works
		console.log("temp object URL: " + tempContainer.url + ", temp object hostname: " + tempContainer.hostname);

		var imageHost = tempContainer.hostname;
		var failOverName = info.srcUrl.substr(info.srcUrl.lastIndexOf('/') + 1, info.srcUrl.length - info.srcUrl.lastIndexOf('/') - 1);

		console.log("imageHost : " + imageHost + ", info.pageUrl : " + info.pageUrl + ", failOverName : " + failOverName);
		var resultingFilename = nicelyTagIt(imageHost, info.pageUrl, failOverName);

		browser.downloads.download({
			saveAs: !saveSilentlyEnabled,
			filename: resultingFilename,
			url: info.srcUrl
		});
		console.log("resultingFilename: " + resultingFilename + ", url: " + info.pageUrl);
	}
})
