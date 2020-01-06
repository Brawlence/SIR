var saveSilentlyEnabled = false;
var firefoxEnviroment = false;

var sir = {
	//adds an individual item to the context menu and gives it the id passed into the function
	makeMenuItem: function(id, item, icon, useIcon) {
		if (useIcon) {
			chrome.contextMenus.create({
				id: id.toString(),
				title: item.toString(),
				contexts: ["image"],
				icons: { "16": icon.toString() }
			})
		} else {
			//icons not supported, or undesirable. leave them out
			chrome.contextMenus.create({
				id: id.toString(),
				title: item.toString(),
				contexts: ["image"]
			})
		}
	},

	//adds all URLs to the function from local storage, using indices 0 - urlList.length-1 as their IDs
	makeMenuItems: function(browserInfo) {
		chrome.contextMenus.removeAll();

		var useIcons = false;
		if (!(browserInfo === undefined || browserInfo === null)) { //if the browserInfo was actually sent here and we're in Firefox
			if (parseInt(browserInfo.version, 10) >= 56) { //not sure when icon support was added, but it existed in 56 and does not exist in 52
				useIcons = true;
			}
		}

		//TODO: check if the tags fetched by content scripts had arrived before enabling dl?
		sir.makeMenuItem( /* id */ "dl", /* title */ "Download with tags", /* Icon */ "SIR_16x16.png", useIcons);
		sir.makeMenuItem( /* id */ "invokeEMF", /* title */ "Get tags string", /* Icon */ "SIR_16x16.png", useIcons);

		chrome.contextMenus.create({
			type: "checkbox",
			id: "saveSilently",
			title: "Supress \"Save As\" dialog?",
			checked: saveSilentlyEnabled,
			contexts: ["image"]
		})

	},

	//gets browser info and passes it to makeMenuItems to determine if things like icons are supported
	makeMenu: function() {
		// indexOf is freakingly fast, see https://jsperf.com/substring-test
		if (firefoxEnviroment) {
			var gettingBrowserInfo = browser.runtime.getBrowserInfo();
			gettingBrowserInfo.then(sir.makeMenuItems);
		} else {
			sir.makeMenuItems();
		}
	},

	//TODO: re-issue command to get tags into local storage? Dynamically enable DL sub-menu?
	invokeTagsField: function() {
		var querying = chrome.tabs.query({ active: true, currentWindow: true }, function(result) {
			for (let tab of result) {
				chrome.tabs.sendMessage(tab.id, { order: "imprintTags" },
					function justWaitTillFinished(response) {
						if (chrome.runtime.lastError) {
							localStorage.clear();
						} else {
							if (typeof response !== 'undefined') {
								//TODO: decide if cleanup needed
							}
						}
					}
				);
			}
		});
	},

	displayWarning: function(message) {
		if (!firefoxEnviroment) {
			alert(message);
		}
		var querying = chrome.tabs.query({ active: true, currentWindow: true }, function(result) {
			for (let tab of result) {
				chrome.tabs.sendMessage(tab.id, { order: "displayWarning", warning: message },
					function justWaitTillFinished(response) {
						if (chrome.runtime.lastError) {
							localStorage.clear();
						} else {
							if (typeof response !== 'undefined') {
								//TODO: decide if cleanup needed
							}
						}
					}
				);
			}
		});
	},

	firstRun: function(details) {
		if (details.reason === 'install' || details.reason === 'update') {
			console.log("SIR is installed successefully. Performing first-run checks.");
			if (navigator.userAgent.indexOf('Firefox') > -1) {
				firefoxEnviroment = true;
				console.log("Firefox enviroment confirmed. Proceeding as usual.");
			} else if (navigator.userAgent.indexOf('Chrom') > -1) {
				firefoxEnviroment = false;
				console.log("Chromium enviroment discovered. Pixiv saving will require additional work.");
			} else {
				firefoxEnviroment = false;
				console.log("Unknown user-agent type. Proceed at your own risk.");
			}
		}
		chrome.commands.onCommand.addListener(function(command) {
			if (command == "SIR_it") {
				sir.invokeTagsField();
			}
		});
	},
}

chrome.runtime.onInstalled.addListener(sir.firstRun);
sir.makeMenu();

function nicelyTagIt(imageHost, requesterPage, failOverName) { // gets filename determined by browser, it will be used as a fallback

	console.log("nicelyTagIt commenced with the following parameters:\n imageHost: " + imageHost + "\n requster page: " + requesterPage + "\n failOverName: " + failOverName);

	if ((localStorage["active_tab_title"] == -1) || (localStorage["active_tab_title"] == "")) { // if the tab title was not found, drop everything
		return failOverName;
	};

	var filename, ext;

	// indexOf is freakingly fast, see https://jsperf.com/substring-test
	if (failOverName.indexOf('.') > -1) { //checks for mistakenly queued download

		if (failOverName.indexOf('?') > -1) {
			failOverName = failOverName.substring(0, failOverName.indexOf('?')); //prune the access token from the filename if it exists
		}
		filename = failOverName.substring(0, failOverName.lastIndexOf('.'));
		ext = failOverName.substr(failOverName.lastIndexOf('.') + 1); // separate extension from the filename
	} else if (failOverName.indexOf('\?format=') > -1) { // TWITER HAS SILLY LINKS
		
		filename = failOverName.substring(0,failOverName.indexOf('\?format='));
		ext = failOverName.substring(failOverName.indexOf('\?format=')+8,failOverName.indexOf('\&name='));
	} else {
		return failOverName;
	};

	// ! PIXIV
	if ((imageHost.indexOf('pximg') > -1) || (requesterPage.indexOf('pixiv') > -1)) {
		var PXnumber = filename.substring(0, filename.indexOf('_p'));
		var PXpage = filename.substr(filename.indexOf('_p') + 2);
		var PXthumb = "";

		if (PXpage.indexOf('master') > -1) {
			PXpage = PXpage.substring(0, PXpage.indexOf('_master'));
			PXthumb = " -THUMBNAIL!- "; // if user wants to save a rescaled thumbnail, add a tag
			sir.displayWarning("You have requested to save a thumbnail. If you want a full-sized picture instead, either:\n- click on it to enlarge before saving\n- use the \"Save link as...\" context menu option.");
		};

		filename = "pixiv_" + PXnumber + PXthumb + " page_" + PXpage + " ";

		if (localStorage["origin"] === "PX") {
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if ((filename.indexOf('@PX') == -1)&&(filename.indexOf('pixiv_') == -1)) {
				filename = "pixiv " + filename;
			}
		}
	};

	// ! DRAWFRIENDS BOROO
	if ((imageHost.indexOf('drawfriends.booru.org') > -1) || (requesterPage.indexOf('drawfriends') > -1)) {
		if (localStorage["origin"] === "DF") {
			filename = "";
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_').replace(/_\(artist\)/g, '\@DF') + " ";
			};
			if ((filename.indexOf('@DF') == -1) && (filename.indexOf('drawfriends') == -1)) {
				filename = "drawfriends " + filename;
			}
		}
	};

	// ! DEVIANTART
	if ((imageHost.indexOf('deviantart') > -1) || (requesterPage.indexOf('deviantart') > -1)) {
		if (localStorage["origin"] === "DA") {
			filename = "";
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@DA') == -1) {
				filename = "deviantart " + filename;
			}
		};
	};

	var activeTabTitle = localStorage["active_tab_title"];

	// ! TWITTER
	if ((imageHost.indexOf('twimg') > -1) || (requesterPage.indexOf('twitter') > -1)) {
		if (localStorage["origin"] === "TW") {
			filename = "";
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@HF') == -1) {
				filename = "twitter " + filename;
			};
		};

		if (ext.indexOf('large') > -1) { ext = ext.substring(0, ext.indexOf('large') - 1); }; //cleaning ext - twitter image links are nasty
	};

	// ! ARTSTATION
	if ((imageHost.indexOf('artstation') > -1) || (requesterPage.indexOf('artstation') > -1)) {
		if (localStorage["origin"] === "AS") {
			filename = "";
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@AS') == -1) {
				filename = "artstation " + filename;
			};
		};
	};

	// ! HENTAIFOUNDRY
	if ((imageHost.indexOf('hentai-foundry') > -1) || (requesterPage.indexOf('hentai-foundry') > -1)) {
		if (localStorage["origin"] === "HF") {
			filename = "";
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@HF') == -1) {
				filename = "hentai-foundry " + filename;
			};
		};
	};

	// ! TUMBLR
	if ((imageHost.indexOf('tumblr') > -1) || (requesterPage.indexOf('tumblr') > -1)) {
		if (localStorage["origin"] === "TU") {
			filename = "";
			var arrayOfTags = JSON.parse(localStorage["tags"]);
			for (i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@TU') == -1) {
				filename = "tumblr " + filename;
			};
		};
	};

	if (ext.length > 5) { //additional check for various madness
		return failOverName;
	}

	// TODO: merge two correction replace ops with regexp
	filename = filename.replace(/\ \ /g, ' ');
	filename = filename.replace(/[ ]$/g, '');

	filename = filename.replace(/[\,\\/:*?\"<>|]/g, ''); // make sure the modified filename doesn't contain any illegal characters

	if (filename == "") { // make sure the name is not left blank
		filename = "tagme";
	} else if (ext == "") { // also make sure that extention did not magically disappear
		ext == "maybe.jpeg";
	}

	if (filename.length + ext.length + 1 >= 255) {
		filename = filename.substr(0, 230); // 230 is an arbitary number
		filename = filename.substring(0, filename.lastIndexOf(' ')); // substr - specified amount, substring - between the specified indices
	}

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
	switch (info.menuItemId) {
		case 'saveSilently':
			//handle alt option toggle
			saveSilentlyEnabled = !saveSilentlyEnabled;
			break;
		case 'invokeEMF':
			sir.invokeTagsField();
			break;
		case 'dl':
			// get where that image is hosted on by
			var tempContainer = document.createElement('a'); // creating an link-type (a) object
			tempContainer.href = info.srcUrl; // ! linking to the item we are about to save
			//tempContainer.innerHTML = "Heh, not bad, kid. You made me use my HTML power!"; 	// with inner HTML structure
			//document.body.appendChild(tempContainer);											// on chrome's generated background page

			// at we can see, info.hostname is undefined
			// console.log("Item URL: " + info.srcUrl + ", Item hostname: " + info.hostname);
			// but if we do this, suddenly url is undefined but hostname works
			// console.log("temp object URL: " + tempContainer.url + ", temp object hostname: " + tempContainer.hostname);

			var imageHost = tempContainer.hostname;
			var failOverName = info.srcUrl.substr(info.srcUrl.lastIndexOf('/') + 1, info.srcUrl.length - info.srcUrl.lastIndexOf('/') - 1);

			var resultingFilename = nicelyTagIt(imageHost, info.pageUrl, failOverName);

			console.log("Attempting to download:\n url: " + info.srcUrl + "\n resultingFilename: " + resultingFilename + "\n (length: " + resultingFilename.length + ")");

			if (firefoxEnviroment) {
				chrome.downloads.download({
					url: info.srcUrl,
					saveAs: !saveSilentlyEnabled,
					filename: resultingFilename,
					headers: [{ name: 'referrer', value: info.pageUrl }, { name: 'referer', value: info.pageUrl }]
				});
			} else if (localStorage["origin"] === "PX") {
				sir.displayWarning("PIXIV refuses to serve pictures without the correct referrer. Tags window is invoked.\n Copy the tags and use the default \"Save As...\" dialogue.");
			} else {
				chrome.downloads.download({
					url: info.srcUrl,
					saveAs: !saveSilentlyEnabled,
					filename: resultingFilename,
				});
			};
			break;
		default:
			console.log("Strange thing happened in Menu handling. Info state: " + info);
			console.log("Tab state: " + tab);
	}

});
