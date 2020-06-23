"use strict";

const FILENAME_LENGTH_CUTOFF = 230;		// 230 is an arbitary number, on most systems the full filename shouldn't exceed 255 symbols

const loc_dlWithTags = "Download with tags",
	  loc_noTagsFetched = "No tags were fetched from this page",
	  loc_getTagsString = "Get tags string",
	  loc_specifyTemplate = "Specify custom filename template...",
	  loc_highlightTags = "Highlight fetched tags?",
	  loc_supressSaveAs = "Supress 'Save As' dialog?",
	  loc_thumnailWarning = "You have requested to save a thumbnail. If you want a full-sized picture instead, either:\n"+
								"- click on it to enlarge before saving\n"+
								"- use the 'Save link as...' context menu option.",
	  loc_pixivOnChrome = "PIXIV refuses to serve pictures without the correct referrer. Currently there is no way around it."+
	  						"Tags window is invoked.\n Copy the tags and use the default 'Save As...' dialogue.";

const validComboSets = [				// valid combinations of tags origin, image hoster, image user
	["PX", "pximg",			"pixiv"],
	["DF", "img.booru.org",	"drawfriends"],
	["DA", "deviantart",	"deviantart"],
	["TW", "twimg",			"twitter"],
	["AS", "artstation",	"artstation"],
	["HF", "hentai-foundry","hentai-foundry"],
	["TU", "tumblr", 		"tumblr"],
	["VA", "img.booru.org",	"vidyart"],
	["MW", "medicalwhiskey","medicalwhiskey"],
	["DB", "danbooru",		"danbooru"]
];

var invokeSaveAs = true,
	useDecoration = true;
var firefoxEnviroment = false,
	useIcons = false;
var fileNameTemplate = "{handle}@{OR} {ID} {name} {caption} {tags}";

function validateAnswer(tagsOrigin, hosterUrl, requesterUrl) {
	for (let comboSet of validComboSets) {
		if ((tagsOrigin.indexOf(comboSet[0])>-1) &&
			((hosterUrl.indexOf(comboSet[1])>-1) || (requesterUrl.indexOf(comboSet[2])>-1))) {
			return true;
		}
	}
	return false;
};

function processURL( /* object */ image, tabId) { 
/* Cleans the URL of image object, shifts some information to name if needed */
	let url = image.url,
		ext = image.ext,
		filename = url.substring(url.lastIndexOf('/') + 1);

	// substring search with indexOf is the fastest, see https://jsperf.com/substring-test
	if (filename.indexOf('.') > -1) {
		if (filename.indexOf('?') > -1) {
			filename = filename.substring(0, filename.indexOf('?')); 	//prune the access token from the name if it exists
		}
		ext = filename.substring(filename.lastIndexOf('.') + 1); 		// extract extension
	};
	
	if (image.origin === "TW") {			 							// TWITTER
		if (filename.indexOf('?') > -1) {
			ext = url.substr( url.indexOf('format=')+7, 3 );			// as far as I know, Twitter uses only png, jpg or svg - all ext are 3-lettered
			url = url.replace(/(name=[\w\d]+)/g,'name=orig'); 			// force Twitter to serve us with original image
		} else {
			ext = ext.substring(0, (ext.indexOf(':')>0)?ext.indexOf(':'):ext.length);
			url = url.substring(0, (url.indexOf(':')>0)?url.lastIndexOf(':'):url.length) + ":orig";
		};
	}; 
	
	if (image.origin === "PX") {										// PIXIV — get the page number (since pixiv_xxxx can hold many images)
		let PXpage = filename.substring(filename.indexOf('_p') + 2, filename.indexOf('.'));
		let PXthumb = "";
		
		if (PXpage.indexOf('master') > -1) {
			PXpage = PXpage.substring(0, PXpage.indexOf('_master'));
			PXthumb = "-THUMBNAIL!-";	 								// if user wants to save a rescaled thumbnail, add a tag
			sir.displayWarning(tabId, loc_thumnailWarning);
		};

		image.tags = image.tags + " page_" + PXpage + PXthumb;
	};

	image.url = url;
	image.ext = ext;
}

function generateFilename(image) {
	if (image.ext.length > 5) image.ext = "maybe.jpeg";					// make sure that extention did not go out of bounds
	if (image.tags === "") image.tags = "tagme"; 						// make sure the name is not left blank

	image.tags = image.tags.replace(/[,\\/:*?"<>|\t\n\v\f\r]/g, '')		// make sure the name in general doesn't contain any illegal characters
						   .replace(/[ ]{2, }/g, ' ') 					// collapse multiple spaces
	 					   .trim();
	
	if (image.tags.length + image.ext.length + 1 >= 255) {
		image.tags = image.tags.substr(0, FILENAME_LENGTH_CUTOFF)		// substr - specified amount,
							   .substring(0, name.lastIndexOf(' '));	// substring - between the specified indices
	}
	
	image.filename = image.tags + "." + image.ext;
};

var sir = {
	makeMenuItem: function (id, item, icon, clickable, useIcon) {
	/* adds an individual item to the context menu and gives it the id passed into the function */
		chrome.contextMenus.create({
			id: id.toString(),
			title: item.toString(),
			enabled: clickable,
			contexts: ["image"]
		})
		//if icons are supported, add them
		if (useIcon) chrome.contextMenus.update(id.toString(), {icons: { "16": icon.toString() }});
	},

	makeMenuItems: function (browserInfo) {
		chrome.contextMenus.removeAll();
		if (!(browserInfo === undefined || browserInfo === null)) { // if the browserInfo was actually sent here
			if (parseInt(browserInfo.version, 10) >= 56) { 			// not sure when icon support was added, but it existed in 56 and does not exist in 52
				useIcons = true;
			}
		}

		sir.makeMenuItem("dl",  loc_dlWithTags,    "Icons/dl.png",  false, useIcons);
		sir.makeMenuItem("gts", loc_getTagsString, "Icons/gts.png", false, useIcons);

		chrome.contextMenus.create({type: "separator", id:"separator1", contexts: ["image"]});

		sir.makeMenuItem("tmpl", loc_specifyTemplate, "Icons/no_gts.png", false, useIcons);

		chrome.contextMenus.create({type: "separator", id:"separator2", contexts: ["image"]});

		chrome.contextMenus.create({type: "checkbox",  id: "useDecoration", title: loc_highlightTags, checked: useDecoration, contexts: ["image"]});
		chrome.contextMenus.create({type: "checkbox",  id: "saveSilently",  title: loc_supressSaveAs, checked: !invokeSaveAs, contexts: ["image"]});
	},

	makeMenu: function () {
	/* gets browser info and passes it to makeMenuItems to determine if things like icons are supported */
		if (firefoxEnviroment) {
			var gettingBrowserInfo = browser.runtime.getBrowserInfo();
			gettingBrowserInfo.then(sir.makeMenuItems);
		} else {
			sir.makeMenuItems();
		}
	},

	disableMenu: function () {
		chrome.contextMenus.update("dl", {title: loc_noTagsFetched, enabled: false});
		chrome.contextMenus.update("gts", {enabled: false});
		chrome.contextMenus.update("tmpl", {enabled: false});
		if (useIcons) {
			chrome.contextMenus.update("dl", {icons: {"16": "Icons/no_dl.png"}});
			chrome.contextMenus.update("gts", {icons: { "16": "Icons/no_gts.png" }});
		};
	},

	enableMenu: function () {
		chrome.contextMenus.update("dl", {title: loc_dlWithTags, enabled: true});
		chrome.contextMenus.update("gts", {enabled: true});
		chrome.contextMenus.update("tmpl", {enabled: true});
		if (useIcons) {
			chrome.contextMenus.update("dl", {icons: { "16": "Icons/dl.png" }});
			chrome.contextMenus.update("gts", { icons: { "16": "Icons/gts.png" }});
		};
	},

	invokeTagsField: function (tabId) {
		chrome.tabs.sendMessage(tabId, { order: "getTagsString", template: fileNameTemplate },
			function waitAndLog(response) {
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
				function waitAndLog(response) {
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
		chrome.tabs.sendMessage(tabId, { order: "ping", useDecor: useDecoration }, // ! tabId is an integer
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

	/* A stub for a planned feature
	dl: function (url, filename, referer) {
		
	},
	*/

	dlWithTags: function (imageObject, tabId) {
		chrome.tabs.sendMessage(tabId, { order: "giffTags", template: fileNameTemplate }, // ! tabId is an integer
			function workWithThis(response) {
				if (chrome.runtime.lastError) {
					//console.warn(chrome.runtime.lastError.message);
				} else {
					if ( (typeof response === 'undefined') ||
					     (!validateAnswer(response.origin, imageObject.srcUrl, imageObject.pageUrl)) ) return;
					
					let image = {
							origin: response.origin, 
							url: imageObject.srcUrl,
							tags: response.tagString,
							ext: "unknown",
							filename: "tagme.jpg" 
						};
					
					processURL(image, tabId);
					generateFilename(image);
					
					if (!firefoxEnviroment && response.origin === "PX") {
						sir.displayWarning(tabId, loc_pixivOnChrome);
						sir.invokeTagsField(tabId);
						return;
					};
					
					//console.log("Attempting to download:\n url: " + image.url + "\n Filename: " + image.filename + "\n (length: " + image.filename.length + ")");

					chrome.downloads.download({
						url: image.url,
						filename: image.filename,
						saveAs: invokeSaveAs,
						headers: (firefoxEnviroment ? ( [{ name: 'referrer', value: imageObject.pageUrl }, { name: 'referer', value: imageObject.pageUrl }] ) : [])
					}, function reportOnDownloading() {
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
		} else if (command === "Decorate") {
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (result) {
				for (let tab of result) {
					useDecoration = !useDecoration;
					sir.setupConnection(tab.id, "Highlight toggled.");
				}
			});
		}
	}
);

chrome.contextMenus.onClicked.addListener(function (info, tab) { // ! info is an object which spawned the menu, tab is literally a tab object where the action happened
	switch (info.menuItemId) {
	case 'saveSilently':
		invokeSaveAs = !invokeSaveAs;
		break;
	case 'useDecoration':
		useDecoration = !useDecoration;
		sir.setupConnection(tab.id, "Highlight toggled.");
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
