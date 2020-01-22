# SIR #
**SIR** is an **Image Renamer** extension for Google Chrome and Mozilla Firefox.

[![codebeat badge](https://codebeat.co/badges/a1038521-6438-40a5-86c1-3f333b1a1772)](https://codebeat.co/projects/github-com-brawlence-sir-master)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3565/badge)](https://bestpractices.coreinfrastructure.org/projects/3565)
[![pipeline status](https://gitlab.com/Brawlence/SIR/badges/master/pipeline.svg)](https://gitlab.com/Brawlence/SIR/commits/master)
[![coverage report](https://gitlab.com/Brawlence/SIR/badges/master/coverage.svg)](https://gitlab.com/Brawlence/SIR/commits/master)

## Description ##
**SIR** fetches data from popular image galleries, suggesting informative file names through the usual save file dialog.

The result by default looks like:

`uniq_ID Author_handle@OR Author-Name Picture-Title tag another_tag tag_episode-2 tag&replaced_spaces.ext`,

where `OR` (origin) is based on a name of the supported site as follows: **A**rt**S**tation, **D**eviant**A**rt, **D**raw**F**riends, **H**entai-**F**oundry, **P**i**X**iv, **TU**mblr, **TW**itter.

The resulting filename is compatible with https://github.com/0xb8/WiseTagger/issues/1 and can be further tweaked by specifying a *custom template* through the extension context menu.
*Please note:*
- *On some sites some of these identifiers are optional and thus cannot be fetched.*
- *Currently the only type of tracked Unique picture IDs are `pixiv_(album)_(page)` and `drawfriends_(pictureID)`, as for other sites tracking it is meaningless - I know no ways to get the image based on their respective IDs.*

## Inner workings ##
**SIR** marks fetched info with a red dotted line by injecting custom CSS on sites specified above:
![Example of tag highlighting](./Img/tag_highlighting.png)

Along with the CSS, a receiver content script is injected, which listens for incoming messages from the main extension script.

As the user reloads the page or changes the active tab, **SIR** checks if the page includes one of those content scripts. If it does, the context menu items will be enabled.

By user request (`"SIR Image Renamer"` → `"Download with tags"`), content scripts parse the page and pass the tags to renaming procedure. This procedure suggests the file downloader a name to save the file by, in your browser's default download directory. "Save As" dialogue is invoked depending on whether the `Suppress 'Save As'` option was selected.

*In addition, it is possible to manually get the list of discovered tags by pressing `Ctrl+Shift+1` or selecting `"Get tags string"` in the context menu.*

Additionally, if you're on *Pixiv* and are trying to save a thumbnail, **SIR** will halt you (but won't restrict your ability to proceed):

![Example alert](./Img/thumbnail_warning.png)

## Installation ##
Stable releases are published through the official stores:

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
- Further refactor the tag parser code, unifying as much as possible
- Make the highlight toggle-able
- Add yande.re to the list of supported sites
- Implement persistent options
- Add an 'Options' page

## Known bugs ##
- *Twitter* - in the timeline, unrelated tags are fetched from the whole page. Please save from individual post page for now.
- *Chromium 77* (probably others too?) - sometimes the extension fails to fetch tags. Page reload (`F5`) / Tab switch / `Get Tags String` fixes that
- Every new `Get Tags String` window on the same page is placed 20 px lower than the previous one. Should I keep it as a feature?
 
If you happen to enconuter an unlisted bug, please submit it through https://github.com/Brawlence/SIR/issues/new