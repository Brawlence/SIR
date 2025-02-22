"use strict";

const FILENAME_LENGTH_CUTOFF = 230;		// 230 is an arbitary number, on most systems the full filename shouldn't exceed 255 symbols

const loc_dlWithTags      = "Download with tags",
	  loc_noTagsFetched   = "No tags were fetched from this page",
	  loc_getTagsString   = "Get tags string",
	  loc_specifyTemplate = "Specify custom filename template...",
	  loc_highlightTags   = "Highlight fetched tags?",
	  loc_clampUnicode    = "Allow Unicode >05FF in tags?",
	  loc_supressSaveAs   = "Supress 'Save As' dialog?",
	  loc_pixivOnChrome   = "PIXIV refuses to serve pictures without the correct referrer. Currently there is no way around it."+
	  						"Tags window is invoked.\n Copy the tags and use the default 'Save As...' dialogue.";

const validComboSets = [				// valid combinations of tags origin, image hoster, image user
	["PX", "pximg",			"pixiv"],
	["DF", "img.booru.org",	"drawfriends"],
	["DA", "deviantart",	"deviantart"],
	["TW", "twimg",			"twitter"],
	["TW", "twimg",			"x.com"],
	["AS", "artstation",	"artstation"],
	["HF", "hentai-foundry","hentai-foundry"],
	["TU", "tumblr", 		"tumblr"],
	["VA", "img.booru.org",	"vidyart"],
	["MW", "medicalwhiskey","medicalwhiskey"],
	["DB", "cdn.donmai.us",	"danbooru"],
	["IG", "fbcdn",			"instagram"]
];

var invokeSaveAs = true,
	useDecoration = false,
	clampUnicode = false;
var firefoxEnviroment = false,
	useIcons = false;
var fileNameTemplate = "{handle}@{OR} {ID} {name} {caption} {selection} {tags}";

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
	if (filename.indexOf('.') > -1) {									// ! GENERAL CASE - dot is present
		if (filename.indexOf('?') > -1) {
			filename = filename.substring(0, filename.indexOf('?')); 	//prune the access token from the name if it exists
		}
		ext = filename.substring(filename.lastIndexOf('.') + 1); 		// extract extension
	};
	
	switch (image.origin) {
		case "TW":			 											// ! TWITTER - special case: extracting EXT
			if (filename.indexOf('?') > -1) {
				ext = url.substr( url.indexOf('format=')+7, 3 );		// as far as I know, Twitter uses only png, jpg or svg - all ext are 3-lettered
				url = url.replace(/(name=[\w\d]+)/g,'name=orig'); 		// force Twitter to serve us the original image
			} else {
				ext = ext.substring(0, (ext.indexOf(':')>0)?ext.indexOf(':'):ext.length);
				url = url.substring(0, (url.indexOf(':')>0)?url.lastIndexOf(':'):url.length) + ":orig";
			};			
			break;

		case "PX":														// ! PIXIV — special case: additional tag 'page_' (since pixiv_xxxx can hold many images)
			let PXpage = filename.substring(filename.indexOf('_p') + 2, filename.indexOf('.'));
			
			if (PXpage.indexOf('master') > -1) {						// if a re-mastered image is selected, try to download the best availible one
				PXpage = PXpage.replace(/\_master[\d]+/g,'');			// url ex.: https://i.pximg.net/img-master/img/1970/01/01/11/59/59/12345678_p0_master1200.jpg
				if (image.overrideURLs) {
					url = image.overrideURLs[PXpage];
					filename = url.substring(url.lastIndexOf('/') + 1);
					ext = filename.substring(filename.lastIndexOf('.') + 1);
				} else {			
					url = url.replace(/\/img-master\//g,'/img-original/');	// first part of the url
					url = url.replace(/_master[\d]+\./g,'.');				// the file name part
				};
			};

			image.tags = image.tags.replace(/(pixiv_[\d]+)/g,'$1 page_'+PXpage);
			break;

		case "DB":														// ! DANBOORU - requesting an original
			if (url.indexOf('/sample/') > -1) {
				if (image.overrideURLs) {
					url = image.overrideURLs[0];
					filename = url.substring(url.lastIndexOf('/') + 1);
					ext = filename.substring(filename.lastIndexOf('.') + 1);
				} else {
					url = url.replace(/\/sample\//g,'/original/');		// first part of the url
					url = url.replace(/_sample-/g,'_');					// the file name part *
				};
			};
			break;
	}

	image.url = url;
	image.ext = ext;
}

function generateFilename(image) {
	if (image.ext.length > 5) image.ext = "maybe.jpeg";						// make sure that extention did not go out of bounds
	if (image.tags === "") image.tags = "tagme"; 							// make sure the name is not left blank

	if (clampUnicode) {														// if the Unicode limiter is set, clean the characters higher than Hebrew
		let author_protection = "";											// but try to avoid the author tag during the processing
		let handleEstimates = image.tags.match(/[^\s]*@[A-Za-z]{2}\s/g);	// handle@XX format with trailing space
		if (handleEstimates) author_protection = handleEstimates[0];
		image.tags = image.tags.substring(author_protection.length);
		image.tags = author_protection + " " + image.tags.replace(/[^\u0000-\u05ff]+/g,'');			
	} 

	image.tags = image.tags.replace(/[,\\/:*?"<>|\t\n\v\f\r]/g, '')			// make sure the name in general doesn't contain any illegal characters
						   .replace(/\s\(\s*\)\s?/g, ' ')					// remove empty brackets
						   .replace(/\s{2,}/g, ' ') 						// collapse multiple spaces
	 					   .trim();
	
	if (image.tags.length + image.ext.length + 1 >= 255) {
		image.tags = image.tags.substr(0, FILENAME_LENGTH_CUTOFF);			// substr - specified amount,
		image.tags = image.tags.substring(0, image.tags.lastIndexOf(' '));	// substring - between the specified indices
	}
	
	image.filename = image.tags + "." + image.ext;
};

// singleton
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
		chrome.contextMenus.create({type: "checkbox",  id: "clampUnicode",  title: loc_clampUnicode,  checked: !clampUnicode, contexts: ["image"]});
		chrome.contextMenus.create({type: "checkbox",  id: "saveSilently",  title: loc_supressSaveAs, checked: !invokeSaveAs, contexts: ["image"]});
	},

	makeMenu: function () {
	/* gets browser info and passes it to makeMenuItems to determine if things like icons are supported */
		if (firefoxEnviroment) {
			let gettingBrowserInfo = browser.runtime.getBrowserInfo();
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

	dlWithTags: function (imageObject, tabId) {
		chrome.tabs.sendMessage(tabId, { order: "giffTags", template: fileNameTemplate }, // ! tabId is an integer
			function workWithThis(response) {
				if (chrome.runtime.lastError) {
					//console.warn(chrome.runtime.lastError.message);
				} else {
					if ( (typeof response === 'undefined') ||
						 (!validateAnswer(response.origin, imageObject.srcUrl, imageObject.pageUrl)) ) return;

					if (!firefoxEnviroment && response.origin === "PX") {
						sir.displayWarning(tabId, loc_pixivOnChrome);
						sir.invokeTagsField(tabId);
						return;
					};

					let imageURL = "", imageReferer = "";
					if (imageObject === null) { 
						imageURL = response.linksArray[0];
						imageReferer = response.pageAt;
					} else {
						imageURL = imageObject.srcUrl;
						imageReferer = imageObject.pageUrl;
					};

					let image = {
							origin: response.origin, 
							url: imageURL,
							overrideURLs: response.linksArray,
							tags: response.tagString,
							ext: "unknown",
							filename: "tagme" 
						};
					
					processURL(image, tabId);
					generateFilename(image);
					
					//console.log("Attempting to download:\n url: " + image.url + "\n Filename: " + image.filename + "\n (length: " + image.filename.length + ")");

						chrome.downloads.download({
							url: image.url,
							filename: image.filename,
							saveAs: invokeSaveAs,
							headers: (firefoxEnviroment ? ( [{ name: 'referrer', value: imageReferer }, { name: 'referer', value: imageReferer }] ) : [])
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
		switch (command) {
			case "SIR_it":
				chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (result) {
					for (let tab of result) {
						sir.invokeTagsField(tab.id);
					}
				});				
				break;
			
			case "Decorate":
				chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (result) {
					for (let tab of result) {
						useDecoration = !useDecoration;
						sir.setupConnection(tab.id, "Highlight toggled.");
					}
				});
				break;

			/*case "Batch_DL":
				chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (result) {
					for (let tab of result) sir.dlWithTags(null, tab.id, true);
				});	
				break;
				*/
		};
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
		case 'clampUnicode':
			clampUnicode = !clampUnicode;
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
