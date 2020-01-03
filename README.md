# SIR #
**SIR** is an **Image Renamer** extention for Google Chrome and Mozilla Firefox.

It is an addition to your usual way of saving images from several sites listed below.

## Description ##
**SIR** fetches data from popular image galleries, suggesting informative file names through the usual save file dialog.

The result typically looks like:

`uniq_ID Author_handle@OR (Author_full_name) Title tag another_tag tag-episode2 tag_that_contained_spaces.ext`,

where `OR` (origin) is specified as follows:
- PX - Pixiv
- DF - Drawfriends (mostly anonymous art) boroo
- DA - Deviantart
- AS - ArtStation
- TW - Twitter
- HF - Hentai-Foundry
- TU - Tumblr

`Author handles` are compatible with https://github.com/0xb8/WiseTagger/issues/1

Please note that `Author full name`, image `Title` and `Tag`s are optional on some sites and thus cannot always be fetched.

*Currently the only type of tracked Unique picture IDs are `pixiv_(album)_(page)` and `drawfriends_(pictureID)`, as for other sites tracking it is meaningless - I know no ways to get the image based on their respective IDs.*

## Inner workings ##
**SIR** marks fetched info with a red dotted line on the sites listed above by injecting custom css:
![Example of tag highlighting](./Img/tag_highlighting.png)

Content scripts parse those tags and pass them to renaming procedure for later use.

Invoking a context menu for an image hosted or located on those supported sites will yeild an additional item with **SIR** icon. Clicking on it results with either the file being saved in your default download directory or "Save As" dialogue being invoked. Both results will contain the array of fetched tags already added to the filename.

*In addition, it is possible to manually get the list of discovered tags by pressing `Ctrl+Shift+1` or selecting "Get tags string" in the **SIR** context menu.*

For Chrome, if you're on *pixiv* and are trying to save a thumbnail, **SIR** will halt you (but won't restrict your ability to proceed):

![Example alert](./Img/thumbnail_warning.png)

For Firefox, the message is displayed through the content script, but there is currently no way to interrupt the process.

## Recommendations ##
- **SIR** is a self-sufficient extention, yet it works wonders in conjunction with ![WiseTagger](https://github.com/0xb8/WiseTagger).
- Although a handy tool, it's **not** a batch downloader. You still have to manually save each file.
- Some authors include no tags whatsoever, others fill way too much useless general-sounding clutter, so if you're aiming for maximum resolution, please check and tweak the name before saving.
- Overabudant tags can sometimes exceed the filename length limit, thus they are currently trimmed to nearest space symbol below 230 symbols.  

## Known bugs ##
- 1.1.1 has only rudimentary support for *ArtStation*, *Twitter*, *Hentai-Foundry* and *Tumblr*. Currently refactoring it.
- *Twitter* - unrelated tags are fetched when trying to save an image from the feed.
- Tags sometimes can't be fetched for js-made image transitions — page reload (`F5`) or Ivoke Tag List (`Ctrl+Shift+1`) fixes that.
