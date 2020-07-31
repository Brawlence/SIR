# SIR #
**SIR** is an **Image Renamer** extension for Google Chrome and Mozilla Firefox.

[![codebeat badge](https://codebeat.co/badges/a1038521-6438-40a5-86c1-3f333b1a1772)](https://codebeat.co/projects/github-com-brawlence-sir-master)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3565/badge)](https://bestpractices.coreinfrastructure.org/projects/3565)
[![pipeline status](https://gitlab.com/Brawlence/SIR/badges/master/pipeline.svg)](https://gitlab.com/Brawlence/SIR/commits/master)
[![coverage report](https://gitlab.com/Brawlence/SIR/badges/master/coverage.svg)](https://gitlab.com/Brawlence/SIR/commits/master)

## Description ##
**SIR** fetches data from popular image galleries, suggesting informative file names through the usual 'save file' dialog. 

The naming template is customizable; by default it's set to:

`{handle}@{OR} {name} {caption} {tags}.ext`,  

_{handle}_ represents author's nickname (usually it's a part of the gallery link),
_{OR}_ is site abbrevation as follows below,
_{name}_ is author's human-readable name (often it's not the same as handle!),
_{caption}_ is the image title as specified by the creator,
_{tags}_ is a string of tags, separated by spaces (in-tag spaces are replaced by underscores).

Supported site | OR ('origin')
--------------- | --------------- 
Artstation | **AS**
Deviantart | **DA**
Drawfriends | **DF**
Hentai-Foundry | **HF**
Pixiv | **PX**
Tumblr | **TU**
Twitter | **TW**
MedicalWhiskey | **MW**
VidyArt | **VA**
Danbooru. | **DB**

The resulting filename is compatible with https://github.com/0xb8/WiseTagger/issues/1 and can be further tweaked by specifying a *custom template* through the extension context menu.

*Please note:*
- *On some sites many or all identifiers could be missing (and thus cannot be fetched).*
- *Unique IDs are not present on Twitter and Tumblr.*

## Technical details ##
Every time a new page from the listed domains is loaded, **SIR** adds to it a content script, which responds for pings from the extension.
If the active tab has this script responding, context menu items would be enabled, allowing input.

By user request (`"SIR Image Renamer"` → `"Download with tags"`), content scripts parse the page and pass the info to renaming procedure. This procedure suggests the file downloader a name to save the file by. "Save As" dialogue is invoked depending on whether the `Suppress 'Save As'` option was selected. By default, the image is saved in your browser's default download directory.

*In addition, it is possible to manually get the list of tags by pressing `Ctrl+Shift+1` or selecting `"Get tags string"` in the context menu.*

One can see what info is discovered by **SIR** (`"SIR Image Renamer"` → `"Highlight fetched tags?"`):
![Example of tag highlighting](./Img/tag_highlighting.png)

Additionally, if you're on *Pixiv* and are trying to save a thumbnail, **SIR** will halt you (but won't restrict your ability to proceed):

![Example alert](./Img/thumbnail_warning.png)

## Installation ##
[Stable releases](https://github.com/Brawlence/SIR/releases) are published through the official stores:

Firefox: https://addons.mozilla.org/firefox/addon/sir_image_renamer/

Chromium: https://chrome.google.com/webstore/detail/sir-image-renamer/gmdcgijknjodfhggamchhhejamncbgmc

To install and run the latest (non stable) version of this extension, follow these steps:
- clone (or download the repository and unpack the archive) and place `Extension` folder in known location
- for Firefox, navigate to Debug Addons menu (`about:debugging#/runtime/this-firefox` or Menu→Addons→'Gear' Dropdown→Debug Addons) and click on `Load Temporary Add-on…`
- for Chrome, navigate to Extensions menu (`chrome://extensions/` or Menu→More tools→Extensions), enable the "Developer Mode" and click on `Load Unpacked`
- proceed to the `Extension` folder, select either the folder itself (for Chrome) or the `manifest.json` file (for Firefox)

## Recommendations ##
- **SIR** is a self-sufficient extension, yet it works wonders in conjunction with ![WiseTagger](https://github.com/0xb8/WiseTagger).
- Although a handy tool, it's **not** a batch downloader. You still have to manually save each file.
- Some authors include no tags whatsoever, others fill way too much useless general-sounding clutter, so if you're aiming for maximum resolution, please check and tweak the name before saving.
- Overabundant tags can sometimes exceed the filename length limit, thus they are currently trimmed to nearest space symbol below 230 symbols.  

## Planned features and TODO ##
- Implement an 'Options' page (page action) and store persistent user options

## Known bugs ##
- *Twitter* - when scrolling through the infinite view, unrelated tags are fetched (since **SIR** fetches tags from the whole visible area). Please save images from individual post page for now.
- *Chrome*/*Chromium*-based browsers do not allow setting 'referer' header; thus, on **Pixiv**, it's not possible to download the image through context menu. Please use `Get Tags String` → `Save As…` in the meantime.
 
If you happen to enconuter an unlisted bug, please submit it through https://github.com/Brawlence/SIR/issues/new
