"use strict";

var invokeSaveAs = true;
var fileNameTemplate = "{handle}@{OR} {name} {caption} {tags}";
var firefoxEnviroment = false;
var useIcons = false;

function validateAnswer(tagsOrigin, imageHost, requesterPage) {
	let match = false;
	const validityMap = [
		["PX", "pximg", 				"pixiv"],
		["DF", "drawfriends.booru.org",	"drawfriends"],
		["DA", "deviantart", 			"deviantart"],
		["TW", "twimg", 				"twitter"],
		["AS", "artstation", 			"artstation"],
		["HF", "hentai-foundry", 		"hentai-foundry"],
		["TU", "tumblr", 				"tumblr"]
	];

	for (var i = 0; i < validityMap.length; i++) {
		if ((tagsOrigin.indexOf(validityMap[i][0])>-1) && ((imageHost.indexOf(validityMap[i][1])>-1) || (requesterPage.indexOf(validityMap[i][2])>-1))) {
			match = true;
			break;
		}
	}
	return match;
};

function nicelyTagIt(response, failOverName, tabId) { // gets filename determined by browser, it will be used as a fallback - and also the response from content scripts

	//console.log("nicelyTagIt commenced with the following parameters:\n failOverName: " + failOverName + "\n content script result: " + response.origin + " " + response.tags);

	var filename = "",
		ext = "";
	var arrayOfTags = response.tags;

	// indexOf is freakingly fast, see https://jsperf.com/substring-test
	if (failOverName.indexOf('.') > -1) { //checks for mistakenly queued download
		if (failOverName.indexOf('?') > -1) {
			failOverName = failOverName.substring(0, failOverName.indexOf('?')); 	//prune the access token from the filename if it exists
		}
		filename = failOverName.substring(0, failOverName.lastIndexOf('.'));
		ext = failOverName.substring(failOverName.lastIndexOf('.') + 1); 			// separate extension from the filename
	} else if (failOverName.indexOf('?format=') > -1) { 							// TWITER HAS SILLY LINKS
		filename = failOverName.substring(0, failOverName.indexOf('?format='));
		ext = failOverName.substring(failOverName.indexOf('?format=') + 8, failOverName.indexOf('&name='));
	} else {
		return failOverName;
	};

	if (response.origin === "PX") { 									// ! PIXIV — format the name to be WiseTagger-compatible
		var PXnumber = filename.substring(0, filename.indexOf('_p'));
		var PXpage = filename.substring(filename.indexOf('_p') + 2);
		var PXthumb = "";

		if (PXpage.indexOf('master') > -1) {
			PXpage = PXpage.substring(0, PXpage.indexOf('_master'));
			PXthumb = " -THUMBNAIL!- "; 								// if user wants to save a rescaled thumbnail, add a tag
			sir.displayWarning(tabId, "You have requested to save a thumbnail. If you want a full-sized picture instead, either:\n- click on it to enlarge before saving\n- use the \"Save link as...\" context menu option.");
		};

		filename = "pixiv_" + PXnumber + PXthumb + " page_" + PXpage + " ";
	} else {
		filename = ""; 													// other than PIXIV we don't actually need any info from the filename
	};
	
	for (var i = 0; i < arrayOfTags.length; i++) {
		filename += arrayOfTags[i].replace(/[ :]/g, '_') + " ";
	};
	if ((filename.indexOf(response.origin) === -1) && (filename.indexOf('drawfriends') === -1)) {
		filename = response.origin + " " + filename;
	};

	filename = filename.replace(/  /g, ' '); 							// remove double spaces
	filename = filename.replace(/[ ]$/g, '');							// remove trailing whitespaces
	filename = filename.replace(/[,\\/:*?"<>|\t\n\v\f\r]/g, '');		// make sure the modified filename in general doesn't contain any illegal characters

	if (response.origin === "TW") {										// ! TWITTER — cleaning the filename from that trailing flag - for old TWITTER (pre Sep 2019)
		if (ext.indexOf('large') > -1) { ext = ext.substring(0, ext.indexOf('large') - 1); }; 
	};

	if (ext.length > 5) { 												//additional check for various madness
		return failOverName;
	}

	if (filename === "") { 												// make sure the name is not left blank
		filename = "tagme";
	} else if (ext === "") { 											// also make sure that extention did not magically disappear
		ext = "maybe.jpeg";
	}

	if (filename.length + ext.length + 1 >= 255) {
		filename = filename.substr(0, 230); 							// 230 is an arbitary number
		filename = filename.substring(0, filename.lastIndexOf(' '));	// substr - specified amount, substring - between the specified indices
	}

	return (filename + "." + ext);
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
		if (!(browserInfo === undefined || browserInfo === null)) { // if the browserInfo was actually sent here
			if (parseInt(browserInfo.version, 10) >= 56) { 			// not sure when icon support was added, but it existed in 56 and does not exist in 52
				useIcons = true;
			}
		}

		sir.makeMenuItem("dl", "Download with tags","Icons/dl.png",  false, useIcons);
		sir.makeMenuItem("gts","Get tags string",   "Icons/gts.png", false, useIcons);

		chrome.contextMenus.create({type: "separator", id:"separator1", contexts: ["image"]});

		sir.makeMenuItem("tmpl","Specify custom filename template...", "Icons/no_gts.png", true, useIcons);

		chrome.contextMenus.create({type: "separator", id:"separator2", contexts: ["image"]});

		chrome.contextMenus.create({type: "checkbox",  id: "saveSilently", title: "Supress \"Save As\" dialog?", checked: !invokeSaveAs, contexts: ["image"]});
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
			chrome.contextMenus.update("tmpl", {enabled: false});
		} else {
			chrome.contextMenus.update("dl", {title: "No tags were fetched from this page", enabled: false});
			chrome.contextMenus.update("gts", {enabled: false});
			chrome.contextMenus.update("tmpl", {enabled: false});
		}
	},

	enableMenu: function () {
		if (useIcons) {
			chrome.contextMenus.update("dl", {icons: { "16": "Icons/dl.png" }, title: "Download with tags", enabled: true});
			chrome.contextMenus.update("gts", { icons: { "16": "Icons/gts.png" }, enabled: true});
			chrome.contextMenus.update("tmpl", {enabled: true});
		} else {
			chrome.contextMenus.update("dl", {title: "Download with tags", enabled: true});
			chrome.contextMenus.update("gts", {enabled: true});
			chrome.contextMenus.update("tmpl", {enabled: true});
		}
	},

	invokeTagsField: function (tabId) {
		chrome.tabs.sendMessage(tabId, { order: "getTagsString", template: fileNameTemplate },
			function justWaitTillFinished(response) {
				if (chrome.runtime.lastError) {
					//console.warn(chrome.runtime.lastError.message);
				} else {
					/*
					if (typeof response !== 'undefined') {
						console.log(response);
					}
					*/
				}
			}
		);
	},

	displayWarning: function (tabId, message) {
		if (!firefoxEnviroment) {
			alert(message);
		} else {
			chrome.tabs.sendMessage(tabId, { order: "displayWarning", warning: message },
				function justWaitTillFinished(response) {
					if (chrome.runtime.lastError) {
					//console.warn(chrome.runtime.lastError.message);
					} else {
						/*
						if (typeof response !== 'undefined') {
							console.log(response);
						}
						*/
					}
				}
			);
		};
	},

	promptTemplate: function (tabId, stubTemplate) {
		chrome.tabs.sendMessage(tabId, { order: "askForTemplate", stub: stubTemplate },
			function updateTemplate(response) {
				if (chrome.runtime.lastError) {
				//console.warn(chrome.runtime.lastError.message);
				} else {
					if (typeof response !== 'undefined') {
						if ((response.newTemplate !== "") && ( response.newTemplate !== null)) fileNameTemplate = response.newTemplate;
					}
				}
			}
		);
	},

	initialize: function () {
		if (navigator.userAgent.indexOf('Firefox') > -1) {
			firefoxEnviroment = true;
			//console.log("Firefox enviroment confirmed. Proceeding as usual.");
		} else if (navigator.userAgent.indexOf('Chrom') > -1) {
			firefoxEnviroment = false;
			//console.log("Chromium enviroment discovered. Pixiv saving will require additional work.");
		} else {
			firefoxEnviroment = false;
			//console.warn("Unknown user-agent type. Proceed at your own risk.");
		};
		sir.makeMenu();
	},
	
	setupConnection: function(tabId, reason) { 
		sir.disableMenu(); //disable the context menu while we don't know if SIR context scripts are working here
		chrome.tabs.sendMessage(tabId, { order: "ping" }, // ! tabId is an integer
			function updateMenu(response) {
				if(chrome.runtime.lastError) {
					//console.warn(chrome.runtime.lastError.message);
				} else {
					if (typeof response !== 'undefined') {
						if (response.message) {
							sir.enableMenu();
							//console.log( reason + " Connection extablished with " + response.origin);
						}
					}
				}
			}
		);
	},
	
	dlWithTags: function (imageObject, tabId) {
		chrome.tabs.sendMessage(tabId, { order: "giffTags", template: fileNameTemplate }, // ! tabId is an integer
			function workWithThis(response) {
				if (chrome.runtime.lastError) {
					//console.warn(chrome.runtime.lastError.message);
				} else {
					if (typeof response !== 'undefined') {
						// get where that image is hosted on by
						var tempContainer = document.createElement('a'); // creating an link-type (a) object
						tempContainer.href = imageObject.srcUrl; // linking to the item we are about to sav

						var imageHost = tempContainer.hostname;
						var failOverName = imageObject.srcUrl.substring(imageObject.srcUrl.lastIndexOf('/') + 1);

						if (!validateAnswer(response.origin, imageHost, imageObject.pageUrl)) return;
						
						var resultingFilename = nicelyTagIt(response, failOverName, tabId); // tabId is only needed to display a warning if something goes afool

						//console.log("Attempting to download:\n url: " + imageObject.srcUrl + "\n resultingFilename: " + resultingFilename + "\n (length: " + resultingFilename.length + ")");

						if (firefoxEnviroment) {
							chrome.downloads.download({
								url: imageObject.srcUrl,
								saveAs: invokeSaveAs,
								filename: resultingFilename,
								headers: [{ name: 'referrer', value: imageObject.pageUrl }, { name: 'referer', value: imageObject.pageUrl }]
							}, function reportOnTrying() {
								if (chrome.runtime.lastError) {
									/*
									if (chrome.runtime.lastError.message.indexOf('user') > -1) {
										console.log(chrome.runtime.lastError.message);
									} else {
										console.warn(chrome.runtime.lastError.message);
									};
									*/
								};
							});
						} else if (response.origin === "PX") {
							sir.displayWarning(tabId, "PIXIV refuses to serve pictures without the correct referrer. Currently there is no way around it. Tags window is invoked.\n Copy the tags and use the default \"Save As...\" dialogue.");
							sir.invokeTagsField(tabId);
						} else {
							chrome.downloads.download({
								url: imageObject.srcUrl,
								saveAs: invokeSaveAs,
								filename: resultingFilename,
							}, function reportOnTrying() {
								if (chrome.runtime.lastError) {
									/*
									if (chrome.runtime.lastError.message.indexOf('user') > -1) {
										console.log(chrome.runtime.lastError.message);
									} else {
										console.warn(chrome.runtime.lastError.message);
									}; 
									*/
								};
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
	function runOnActivated(swappingTab, /*changeInfo*/) { // send to fire after Tab Activated procedure
		sir.setupConnection(swappingTab.tabId, "Tab activated."); // ! the swappingTab is an object with references to previous Active Tab and current Active Tab 
	}
);

chrome.tabs.onUpdated.addListener(
	function runOnUpdated(tabId, /*changeInfo*/) {
		sir.setupConnection(tabId, "Page loaded."); // ! this TabID is just an integer id of the tab — no consistensy!
	}
);

chrome.commands.onCommand.addListener(
	function hotkey_triggered(command) {
		if (command === "SIR_it") {
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (result) {
				for (let tab of result) {
						sir.invokeTagsField(tab.id);
				}
			});
		}
	}
);

// TODO: make tag highlight toggle-able
chrome.contextMenus.onClicked.addListener(function (info, tab) { // ! info is an object which spawned the menu, tab is literally a tab object where the action happened
	switch (info.menuItemId) {
	case 'saveSilently':
		invokeSaveAs = !invokeSaveAs;
		break;
	case 'tmpl':
		sir.promptTemplate(tab.id, fileNameTemplate);
		break;
	case 'gts':
		sir.invokeTagsField(tab.id); 							// ! so tab.id will be passed
		break;
	case 'dl':
		sir.dlWithTags(info, tab.id);
		break;
	default:
		//console.error("Strange thing happened in Menu handling. Info state: " + info + "\nTab state: " + tab);
	}
});
