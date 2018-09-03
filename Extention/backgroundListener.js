chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
	// get where that image is hosted
	var a = document.createElement('a');
	a.href = item.url;
	var hostname = a.hostname;

	// get filename determined by Chrome
	var ChromeFilename = item.filename;
	
	// separate extension from the filename
	var ext = ChromeFilename.substr(ChromeFilename.lastIndexOf('.') + 1);
	var filename = ChromeFilename.substring(0, ChromeFilename.lastIndexOf('.'));

	switch (hostname) {
		case 'twitter':
			filename = '[TW~___] ' + filename;		
			break;
		case 'deviantart.net':
			filename = '[DA~___] ' + filename;
			break;
		case 'pixiv':
			filename = '[PX~___] ' + filename;
			break;
		case 'tumblr':
			filename = '[TU~___] ' + filename;
			break;
		default:
			break;
	}

	// make sure the name is not left blank
	if (filename == "") {
		filename = "tagme";
	}

	// add back the extension to the file name
	filename = filename + "." + ext;

	// make sure the modified filename doesn't contain any illegal characters
	filename = filename.replace(/[\#\?].*$/,'_');

	// suggest the new filename to Chrome
	suggest({ filename: filename, conflictAction: "uniquify" });
});