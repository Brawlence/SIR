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
	
	// extract the domain from hostname - indexOf is freakingly fast, see https://jsperf.com/substring-test
	// DEVIANTART
	if (hostname.indexOf('deviantart') > -1) {
		// author is a string starting after _by_ and ending with the last '-'
		var author = filename.substring(filename.lastIndexOf('_by_')+4,filename.lastIndexOf('-'));
		// reformat filename to this template, moving the author info
		filename = '[' + author + '@DA] ' + filename.substring(0, filename.lastIndexOf('_by_'));
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
		
		// if user wants to save a rescaled thumbnail, add a tag
		if (filename.indexOf('master') > -1) {
			filename = 'THUMBNAIL!' + filename.substring(0, filename.lastIndexOf('_master'));
		};
		
		var number = filename.substring(0,filename.lastIndexOf('_'));
		filename = '[@PX] pixiv_' + number;
	};


	// make sure the name is not left blank
	if (filename == "") {
		filename = "tagme";
	}

	// add back the extension to the file name
	filename = filename + "." + ext;
	
	// make sure the modified filename doesn't contain any illegal characters
	filename = filename.replace(/[\#\?].*$/,'');

	// suggest the new filename to Chrome
	suggest({ filename: filename, conflictAction: "uniquify" });
});