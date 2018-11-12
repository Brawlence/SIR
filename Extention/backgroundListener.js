//global variable with the active tab title, updated every time user tries to change the active tab
//var tNfo = 'empty_name';

chrome.tabs.onActivated.addListener( function(info) {
	chrome.tabs.query({active: true, currentWindow: true },  function sasuga(tabs) {
		localStorage["active_tab_title"] = tabs[0].title;
		localStorage["active_tab_url"] = tabs[0].url;
		//tNfo=tabs[0].title;
	});
});

chrome.tabs.onUpdated.addListener(function (tabId , info) {
      localStorage["active_tab_url"] = info.url;
});

chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
	
	//if we still don't know the active tab title
	if (localStorage["active_tab_title"] > -1) {
		//break the download
		chrome.downloads.cancel(item.id);
		
	} else {
		
		alert(localStorage["active_tab_title"] + ' ' + localStorage["active_tab_url"]);
		//MEANINGFUL NAMING
		
			// get where that image is hosted
			var a = document.createElement('a');
			a.href = item.url;
			alert (item.url);
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
				var author = filename.substring(filename.lastIndexOf('_by_')+4,filename.lastIndexOf('-')); // old operation based on the file link
				//filename = localStorage["active_tab_title"];
				//var author = filename.substring(filename.lastIndexOf(' by ')+4,filename.lastIndexOf(' on Deviant'));

				// reformat filename to this template, moving the author info
				filename = '[' + author + '@DA] ' + filename.substring(0, filename.lastIndexOf('_by_')); // old operation based on the file link
				//filename = '[' + author + '@DA] ' + filename.substring(0, filename.lastIndexOf(' by '));
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
				//since pixiv does not give info about name and author, try to extract it from the title of the page
				var tNfo = localStorage["active_tab_title"];
				var author = tNfo.substring(tNfo.lastIndexOf('\u300C')+1,tNfo.lastIndexOf('\u300D')); // '「' and '」' as last indexes
				var name = tNfo.substring(tNfo.indexOf('\u300C')+1,tNfo.indexOf('\u300D'));
				//alert('The resulting author-picture is ' + author + ' - ' + name);
				
				// if user wants to save a rescaled thumbnail, add a tag
				if (filename.indexOf('master') > -1) {
					filename = 'THUMBNAIL!' + filename.substring(0, filename.lastIndexOf('_master'));
				};
				
				var number = filename.substring(0,filename.lastIndexOf('_'));
				filename = '[' + author + '@PX] pixiv_' + number + ' ' + name;

				};


			// make sure the name is not left blank
			if (filename == "") {
				filename = "tagme";
			}

			// add back the extension to the file name
			filename = filename + "." + ext;
			
			// make sure the modified filename doesn't contain any illegal characters
			filename = filename.replace(/[\#\?].*$/,'');
			
		//end of MEANINGFUL NAMING
		
		// suggest the new filename to Chrome IF getting the tab name was successeffull
		suggest({ filename: filename, conflictAction: "uniquify" });

	};
	//tNfo = 'empty_name';
});