"use strict";

var saveSilentlyEnabled = false;
var firefoxEnviroment = false;
var useIcons = false;

function nicelyTagIt(imageHost, requesterPage, failOverName, response, tabId) { // gets filename determined by browser, it will be used as a fallback - and also the response from content scripts

	console.log("nicelyTagIt commenced with the following parameters:\n imageHost: " + imageHost +
				"\n requster page: " + requesterPage + "\n failOverName: " + failOverName + 
				"\n content script result: " + response.origin + " " + response.tags);

	var filename = "",
		ext = "";
	var arrayOfTags = response.tags;

	// indexOf is freakingly fast, see https://jsperf.com/substring-test
	if (failOverName.indexOf('.') > -1) { //checks for mistakenly queued download
		if (failOverName.indexOf('?') > -1) {
			failOverName = failOverName.substring(0, failOverName.indexOf('?')); //prune the access token from the filename if it exists
		}
		filename = failOverName.substring(0, failOverName.lastIndexOf('.'));
		ext = failOverName.substr(failOverName.lastIndexOf('.') + 1); // separate extension from the filename
	} else if (failOverName.indexOf('\?format=') > -1) { // TWITER HAS SILLY LINKS

		filename = failOverName.substring(0, failOverName.indexOf('\?format='));
		ext = failOverName.substring(failOverName.indexOf('\?format=') + 8, failOverName.indexOf('\&name='));
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
			sir.displayWarning(tabId, "You have requested to save a thumbnail. If you want a full-sized picture instead, either:\n- click on it to enlarge before saving\n- use the \"Save link as...\" context menu option.");
		};

		filename = "pixiv_" + PXnumber + PXthumb + " page_" + PXpage + " ";

		if (response.origin === "PX") {
			for (var i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if ((filename.indexOf('@PX') == -1) && (filename.indexOf('pixiv_') == -1)) {
				filename = "pixiv " + filename;
			}
		}
	};

	// ! DRAWFRIENDS BOROO
	if ((imageHost.indexOf('drawfriends.booru.org') > -1) || (requesterPage.indexOf('drawfriends') > -1)) {
		if (response.origin === "DF") {
			filename = "";
			for (var i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_').replace(/_\(artist\)/g, '\@DF') + " ";
			};
			if ((filename.indexOf('@DF') == -1) && (filename.indexOf('drawfriends') == -1)) {
				filename = "drawfriends " + filename;
			}
		}
	};

	// ! DEVIANTART
	if ((imageHost.indexOf('deviantart') > -1) || (requesterPage.indexOf('deviantart') > -1)) {
		if (response.origin === "DA") {
			filename = "";
			for (var i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@DA') == -1) {
				filename = "deviantart " + filename;
			}
		};
	};

	// ! TWITTER
	if ((imageHost.indexOf('twimg') > -1) || (requesterPage.indexOf('twitter') > -1)) {
		if (response.origin === "TW") {
			filename = "";
			for (var i = 0; i < arrayOfTags.length; i++) {
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
		if (response.origin === "AS") {
			filename = "";
			for (var i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@AS') == -1) {
				filename = "artstation " + filename;
			};
		};
	};

	// ! HENTAIFOUNDRY
	if ((imageHost.indexOf('hentai-foundry') > -1) || (requesterPage.indexOf('hentai-foundry') > -1)) {
		if (response.origin === "HF") {
			filename = "";
			for (var i = 0; i < arrayOfTags.length; i++) {
				filename += arrayOfTags[i].replace(/[ \:]/g, '_') + " ";
			};
			if (filename.indexOf('@HF') == -1) {
				filename = "hentai-foundry " + filename;
			};
		};
	};

	// ! TUMBLR
	if ((imageHost.indexOf('tumblr') > -1) || (requesterPage.indexOf('tumblr') > -1)) {
		if (response.origin === "TU") {
			filename = "";
			for (var i = 0; i < arrayOfTags.length; i++) {
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

	filename = filename.replace(/\ \ /g, ' '); 				// remove double spaces
	filename = filename.replace(/[ ]$/g, '');				// remove trailing whitespaces
	filename = filename.replace(/[\,\\/:*?\"<>|]/g, ''); 	// make sure the modified filename in general doesn't contain any illegal characters

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

var sir = {
	//adds an individual item to the context menu and gives it the id passed into the function
	makeMenuItem: function (id, item, icon, clickable, useIcon) {
		if (useIcon) {
			chrome.contextMenus.create({
				id: id.toString(),
				title: item.toString(),
				enabled: clickable,
				contexts: ["image"],
				icons: { "16": icon.toString() },
			})
		} else {
			//icons not supported, leave them out
			chrome.contextMenus.create({
				id: id.toString(),
				title: item.toString(),
				enabled: clickable,
				contexts: ["image"]
			})
		}
	},

	makeMenuItems: function (browserInfo) {
		chrome.contextMenus.removeAll();
		if (!(browserInfo === undefined || browserInfo === null)) { //if the browserInfo was actually sent here
			if (parseInt(browserInfo.version, 10) >= 56) { //not sure when icon support was added, but it existed in 56 and does not exist in 52
				useIcons = true;
			}
		}

		sir.makeMenuItem("dl", "Download with tags","Icons/dl.png",  false, useIcons);
		sir.makeMenuItem("gts","Get tags string",   "Icons/gts.png", false, useIcons);

		chrome.contextMenus.create({
			type: "checkbox",
			id: "saveSilently",
			title: "Supress \"Save As\" dialog?",
			checked: saveSilentlyEnabled,
			contexts: ["image"]
		})
	},

	//gets browser info and passes it to makeMenuItems to determine if things like icons are supported
	makeMenu: function () {
		if (firefoxEnviroment) {
			var gettingBrowserInfo = browser.runtime.getBrowserInfo();
			gettingBrowserInfo.then(sir.makeMenuItems);
		} else {
			sir.makeMenuItems();
		}
	},

	disableMenu: function () {
		if (useIcons) {
			chrome.contextMenus.update("dl", {icons: {"16": "Icons/no_dl.png"},	title: "No tags were fetched from this page", enabled: false});
			chrome.contextMenus.update("gts", {icons: { "16": "Icons/no_gts.png" }, enabled: false});
		} else {
			chrome.contextMenus.update("dl", {title: "No tags were fetched from this page", enabled: false});
			chrome.contextMenus.update("gts", {enabled: false});
		}
	},

	enableMenu: function () {
		if (useIcons) {
			chrome.contextMenus.update("dl", {icons: { "16": "Icons/dl.png" }, title: "Download with tags", enabled: true});
			chrome.contextMenus.update("gts", { icons: { "16": "Icons/gts.png" }, enabled: true});
		} else {
			chrome.contextMenus.update("dl", {title: "Download with tags", enabled: true});
			chrome.contextMenus.update("gts", {enabled: true});
		}
	},

	invokeTagsField: function (tabId) {
		chrome.tabs.sendMessage(tabId, { order: "getTagsString" },
			function justWaitTillFinished(response) {
				if (chrome.runtime.lastError) {
					console.warn(chrome.runtime.lastError.message);
				} else {
					if (typeof response !== 'undefined') {
						console.log(response);
					}
				}
			}
		);
	},

	displayWarning: function (tabId, message) {
		if (!firefoxEnviroment) {
			alert(message);
		};
		chrome.tabs.sendMessage(tabId, { order: "displayWarning", warning: message },
			function justWaitTillFinished(response) {
				if (chrome.runtime.lastError) {
				console.warn(chrome.runtime.lastError.message);
				} else {
					if (typeof response !== 'undefined') {
						console.log(response);
					}
				}
			}
		);
	},

	initialize: function () {
		if (navigator.userAgent.indexOf('Firefox') > -1) {
			firefoxEnviroment = true;
			console.log("Firefox enviroment confirmed. Proceeding as usual.");
		} else if (navigator.userAgent.indexOf('Chrom') > -1) {
			firefoxEnviroment = false;
			console.log("Chromium enviroment discovered. Pixiv saving will require additional work.");
		} else {
			firefoxEnviroment = false;
			console.warn("Unknown user-agent type. Proceed at your own risk.");
		};
		sir.makeMenu();
	},
	
	setupConnection: function(tabId, reason) { 
		sir.disableMenu(); //disable the context menu while we don't know if SIR context scripts are working here
		chrome.tabs.sendMessage(tabId, { order: "ping" }, // ! tabId is an integer
			function updateMenu(response) {
				if(chrome.runtime.lastError) {
					console.warn(chrome.runtime.lastError.message);
				} else {
					if (typeof response !== 'undefined') {
						if (response.message) {
							sir.enableMenu();
							console.log( reason + " Connection extablished with " + response.origin);
						}
					}
				}
			}
		);
	},
	
	dlWithTags: function (info, tabId) {
		chrome.tabs.sendMessage(tabId, { order: "giffTags" }, // ! tabId is an integer
			function requestAndWrite(response) {
				if (chrome.runtime.lastError) {
					console.warn(chrome.runtime.lastError.message);
				} else {
					if (typeof response !== 'undefined') {
						// get where that image is hosted on by
						var tempContainer = document.createElement('a'); // creating an link-type (a) object
						tempContainer.href = info.srcUrl; // linking to the item we are about to save
						//tempContainer.innerHTML = "Heh, not bad, kid. You made me use my HTML power!"; 	// with inner HTML structure
						//document.body.appendChild(tempContainer);											// on chrome's generated background page

						// at we can see, info.hostname is undefined
						// console.log("Item URL: " + info.srcUrl + ", Item hostname: " + info.hostname);
						// but if we do this, suddenly url is undefined but hostname works
						// console.log("temp object URL: " + tempContainer.url + ", temp object hostname: " + tempContainer.hostname);

						var imageHost = tempContainer.hostname;
						var failOverName = info.srcUrl.substr(info.srcUrl.lastIndexOf('/') + 1, info.srcUrl.length - info.srcUrl.lastIndexOf('/') - 1);

						var resultingFilename = nicelyTagIt(imageHost, info.pageUrl, failOverName, response, tabId);

						console.log("Attempting to download:\n url: " + info.srcUrl + "\n resultingFilename: " + resultingFilename + "\n (length: " + resultingFilename.length + ")");

						if (firefoxEnviroment) {
							chrome.downloads.download({
								url: info.srcUrl,
								saveAs: !saveSilentlyEnabled,
								filename: resultingFilename,
								headers: [{ name: 'referrer', value: info.pageUrl }, { name: 'referer', value: info.pageUrl }]
							});
						} else if (response.origin === "PX") {
							sir.displayWarning(tabId, "PIXIV refuses to serve pictures without the correct referrer. Tags window is invoked.\n Copy the tags and use the default \"Save As...\" dialogue.");
						} else {
							chrome.downloads.download({
								url: info.srcUrl,
								saveAs: !saveSilentlyEnabled,
								filename: resultingFilename,
							});
						};
					}
				}
			}
		)

	}
}

sir.initialize();

chrome.tabs.onActivated.addListener(
	function runOnActivated(swappingTab, changeInfo) { // send to fire after Tab Activated procedure
		sir.setupConnection(swappingTab.tabId, "Tab activated."); // ! the swappingTab is an object with references to previous Active Tab and current Active Tab 
	}
);

chrome.tabs.onUpdated.addListener(
	function runOnUpdated(tabId, changeInfo) {
		sir.setupConnection(tabId, "Page loaded."); // ! this TabID is just an integer id of the tab — no consistensy!
	}
);

chrome.commands.onCommand.addListener(
	function hotkey_triggered(command) {
		if (command == "SIR_it") {
			var querying = chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (result) {
				for (let tab of result) {
						sir.invokeTagsField(tab.id);
				}
			});
		}
	}
);

//perform the requested action on menu click
chrome.contextMenus.onClicked.addListener(function (info, tab) { // ! info is an object which spawned the menu, tab is literally a tab object where the action happened
	switch (info.menuItemId) {
	case 'saveSilently':
		saveSilentlyEnabled = !saveSilentlyEnabled;
		break;
	case 'gts':
		sir.invokeTagsField(tab.id); // ! so tab.id will be passed
		break;
	case 'dl':
		sir.dlWithTags(info, tab.id);
		break;
	default:
		console.error("Strange thing happened in Menu handling. Info state: " + info + "\nTab state: " + tab);
	}
});
