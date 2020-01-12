# SIR #
**SIR** is an **Image Renamer** extension for Google Chrome and Mozilla Firefox.

[![codebeat badge](https://codebeat.co/badges/a1038521-6438-40a5-86c1-3f333b1a1772)](https://codebeat.co/projects/github-com-brawlence-sir-master)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3565/badge)](https://bestpractices.coreinfrastructure.org/projects/3565)

## Description ##
**SIR** fetches data from popular image galleries, suggesting informative file names through the usual save file dialog.

The result typically looks like:

`uniq_ID Author_handle@OR Author-Name Picture-Title tag another_tag tag_episode-2 tag&replaced_spaces.ext`,

where `OR` (origin) is specified as follows:
- AS - ArtStation
- DA - Deviantart
- DF - Drawfriends (mostly anonymous art) boroo
- HF - Hentai-Foundry
- PX - Pixiv
- TU - Tumblr
- TW - Twitter

`Author handles` are compatible with https://github.com/0xb8/WiseTagger/issues/1

Please note that `Author full name`, image `Title` and `Tag`s are optional on some sites and thus cannot always be fetched.

*Currently the only type of tracked Unique picture IDs are `pixiv_(album)_(page)` and `drawfriends_(pictureID)`, as for other sites tracking it is meaningless - I know no ways to get the image based on their respective IDs.*

## Inner workings ##
**SIR** marks fetched info with a red dotted line on the sites listed above by injecting custom CSS:
![Example of tag highlighting](./Img/tag_highlighting.png)

Content scripts parse those tags and pass them to renaming procedure for later use.

Invoking a context menu for an image hosted or located on those supported sites will yield an additional item with **SIR** icon. Clicking on it results with either the file being saved in your default download directory or "Save As" dialogue being invoked (depending on whether the `Suppress 'Save As'` option was selected). Both results will contain the array of fetched tags already added to the filename.

*In addition, it is possible to manually get the list of discovered tags by pressing `Ctrl+Shift+1` or selecting "Get tags string" in the **SIR** context menu.*

For Chrome, if you're on *Pixiv* and are trying to save a thumbnail, **SIR** will halt you (but won't restrict your ability to proceed):

![Example alert](./Img/thumbnail_warning.png)

For Firefox, the message is displayed through the content script, but there is currently no way to interrupt the process.

## Installation ##
Since SIR is still in development, no packed releases had been made yet. To install and run the extension, follow these steps:
- clone \ download the repository, unpack the archive and place `Extension` folder in known location
- for Firefox, navigate to Debug Addons menu (`about:debugging#/runtime/this-firefox` or Menu→Addons→'Gear' Dropdown→Debug Addons) and click on `Load Temporary Add-on…`
- for Chrome, navigate to Extensions menu (`chrome://extensions/` or Menu→More tools→Extensions), enable the "Developer Mode" and click on `Load Unpacked`
- proceed to the `Extension` folder, select either the folder itself (for Chrome) or the `manifest.json` file (for Firefox)

## Recommendations ##
- **SIR** is a self-sufficient extension, yet it works wonders in conjunction with ![WiseTagger](https://github.com/0xb8/WiseTagger).
- Although a handy tool, it's **not** a batch downloader. You still have to manually save each file.
- Some authors include no tags whatsoever, others fill way too much useless general-sounding clutter, so if you're aiming for maximum resolution, please check and tweak the name before saving.
- Overabundant tags can sometimes exceed the filename length limit, thus they are currently trimmed to nearest space symbol below 230 symbols.  

## Known bugs ##
- *Twitter* - in the timeline, unrelated tags are fetched from the whole page. Please save from individual post page for now.
- *Chromium 77* (probably others too?) - sometimes the extension fails to fetch tags. Page reload (`F5`) / Tab switch / `Get Tags String` fixes that
- Every new `Get Tags String` window on the same page is placed 20 px lower than the previous one. Should I keep it as a feature?
 
If you happen to enconuter an unlisted bug, please submit it through https://github.com/Brawlence/SIR/issues/new