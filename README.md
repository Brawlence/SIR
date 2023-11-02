# SIR #
**SIR** is an **Image Renamer** extension for Google Chrome and Mozilla Firefox.

[![codebeat badge](https://codebeat.co/badges/a1038521-6438-40a5-86c1-3f333b1a1772)](https://codebeat.co/projects/github-com-brawlence-sir-master)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3565/badge)](https://bestpractices.coreinfrastructure.org/projects/3565)
[![pipeline status](https://gitlab.com/Brawlence/SIR/badges/master/pipeline.svg)](https://gitlab.com/Brawlence/SIR/commits/master)
[![coverage report](https://gitlab.com/Brawlence/SIR/badges/master/coverage.svg)](https://gitlab.com/Brawlence/SIR/commits/master)
[![GitHub Releases](https://img.shields.io/github/v/release/Brawlence/SIR.svg)](https://github.com/Brawlence/SIR/releases)

*Get it from the official stores here: [🦊 Firefox](https://addons.mozilla.org/firefox/addon/sir_image_renamer/), [🏐 Chrome](https://chrome.google.com/webstore/detail/sir-image-renamer/gmdcgijknjodfhggamchhhejamncbgmc)*  

## Features ##
* Customizable naming template
* Option to bypass 'Save As…' dialog
* Fetched Tags String preview & copy _(with hotkeys!)_
* Pixiv thumbnail warning on save request
* Pixiv, X (Twitter), Danbooru max quality promoter & navigation prompt on 'View Image…'
* Automatic handling of long names & multiple artists collaboration

## Description ##
**SIR** fetches data from popular image galleries, suggesting informative file names through the usual 'Save As…' dialog. 

The naming template is customizable; by default it's set to:

`{handle}@{OR} {ID} {name} {caption} {tags}`,  

_{handle}_ represents author's nickname (usually it's a part of the gallery link),
_{OR}_ is site abbreviation as follows below,
_{ID}_ is a platform-unique ID of the picture (if present),
_{name}_ is author's human-readable name (often it's not the same as handle!),
_{caption}_ is the image title as specified by the creator,
_{tags}_ is a string of tags, separated by spaces (in-tag spaces are replaced by underscores).

Additionally, the selected text can be passed on as well with _{selection}_ string.

Supported site | OR ('origin') | ID type
--------------- | --------------- |  --------------- 
Artstation | **AS** | case-sensitive alphanumeric
Deviantart | **DA** | numeric
Drawfriends | **DF** | numeric
Hentai-Foundry | **HF** | numeric
Instagram | **IG** | case-sensitive alphanumeric with underscore
Pixiv | **PX** | numeric
Tumblr | **TU** | none
X (Twitter) | **TW** | none
MedicalWhiskey | **MW** | numeric
VidyArt | **VA** | numeric
Danbooru | **DB** | numeric
TODO: Kemono-Party | **KP** | ???
TODO: Gumroad | **GR** | ???

The resulting filename is compatible with https://github.com/0xb8/WiseTagger/issues/1 and can be further tweaked by specifying a *custom template* through the extension context menu.

*Please note:*
- *On some sites many or all identifiers could be missing (and thus cannot be fetched).*
- *No Unique IDs are known for X (Twitter) and Tumblr. If you do happen to know how to decipher ids for these platforms, please contact me.*

## Technical details ##
Every time a new page from the listed domains is loaded, **SIR** adds to it a content script, which responds for pings from the extension.
If the active tab has this script responding, context menu items would be enabled, allowing input.

By user request (`"SIR Image Renamer"` → `"Download with tags"`), content scripts parse the page and pass the info to renaming procedure. This procedure suggests the file downloader a name to save the file by. "Save As" dialogue is invoked depending on whether the `Suppress 'Save As'` option was selected. By default, the image is saved in your browser's default download directory.

*In addition, it is possible to manually get the list of parsed tags by pressing `Ctrl+Shift+1` or selecting `"Get tags string"` in the context menu.*

One can see what info is discovered by **SIR** (`"SIR Image Renamer"` → `"Highlight fetched tags?"`):
![Example of tag highlighting](./Img/tag_highlighting.png)

For currently shown image or video on *Instagram*, the extension first promotes it to maximum available quality and then removes (right-click preventing) obstructions. This enables proper behavior not only for **SIR**, but for all the regular context menu options too (including third-party extensions depending on context menus, ex. `Image Search Options`!).

When opening single images from `twimg.com` domain (*Twitter* hosting server), **SIR** will prompt you for navigation to their full-sized original counterparts.
Additionally, on *Pixiv* invoking a menu from a thumbnail, queues the download of the full-resolution picture.

## Installation ##

To install and run the latest (non stable) version of this extension, follow these steps:
- clone (or download the repository and unpack the archive) and place `Extension` folder in known location
- for Firefox, navigate to Debug Addons menu (`about:debugging#/runtime/this-firefox` or Menu→Addons→'Gear' Dropdown→Debug Addons) and click on `Load Temporary Add-on…`
- for Chrome, navigate to Extensions menu (`chrome://extensions/` or Menu→More tools→Extensions), enable the "Developer Mode" and click on `Load Unpacked`
- proceed to the `Extension` folder, select either the folder itself (for Chrome) or the `manifest.json` file (for Firefox)

[Stable releases](https://github.com/Brawlence/SIR/releases) are published through the official stores and can be found here:

Firefox: https://addons.mozilla.org/firefox/addon/sir_image_renamer/

Chromium: https://chrome.google.com/webstore/detail/sir-image-renamer/gmdcgijknjodfhggamchhhejamncbgmc

## Recommendations ##
- **SIR** is a self-sufficient extension, yet it works wonders in conjunction with ![WiseTagger](https://github.com/0xb8/WiseTagger).
- Although a handy tool, it's **not** _(yet?)_ a batch downloader. You still have to manually save each file.
- Some authors include no tags whatsoever, others fill way too much useless general-sounding clutter, so if you're aiming for maximum resolution, please check and tweak the name before saving.
- Overabundant tags can sometimes exceed the filename length limit, thus they will be trimmed to nearest space below 230 symbols.  

## Planned features (TODO) ##
- [x] Customizable template
- [ ] 'Options' page (as page action) to tweak and store persistent user options
- [ ] Download subfolder customization
- [ ] Localisation _(…s?)_
- [ ] Integration with ![Hydrus Network](https://github.com/hydrusnetwork/hydrus) for stealing tags _(maybe?)_
- [ ] Batch downloads _(maybe?)_

## Known bugs ##
- *Twitter* - when scrolling through the infinite view, unrelated tags are fetched (since **SIR** fetches tags from the whole visible area). Please save images from individual post page for now.
- *Chrome*/*Chromium*-based browsers do not allow setting 'referer' header; thus, on **Pixiv**, it's not possible to download the image through context menu. Please use `Get Tags String` → `Save As…` in the meantime.
 
If you happen to enconuter an unlisted bug, please submit it through https://github.com/Brawlence/SIR/issues/new
