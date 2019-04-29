# SIR #
**SIR** is an **Image Renamer** extention for Google Chrome.

It is a seamless, *generally* silent addition to your usual way of saving images from several sites listed below.

## Description ##
**SIR** fetches data from popular image galleries, suggesting informative file names to Chrome's save file dialog.

The result typically looks like:

`[Author_handle@OR] (Author_full_name) Title uniq_ID tag another_tag tag-episode2 tag_that_contained_spaces.ext` ,

where `OR` (origin) is specified as follows:
- PX - Pixiv
- TW - Twitter
- DA - Deviantart        
- TU - Tumblr
- AS - ArtStation
- HF - Hentai-Foundry.

`Author handles` are compatible with https://github.com/0xb8/WiseTagger/issues/1

Please note that `Author full name`, image `Title` and `Tag`s are optional on some sites and thus cannot always be fetched.
*Currently the only type of tracked Unique picture ID is `pixiv_(album)_(page)`, as for other sites tracking it is meaningless - I know no ways to get the image based on its ID.*

## Inner workings ##
**SIR** prefixes tags with a red `"TAG: "` sign on the sites listed above by injecting custom css:

![Example of tag highlighting](./Img/tag_highlighting.png)

Content scripts parse those tags and pass them to renaming procedure for later use.

The renaming code waits for Chrome's attempt to save a file, then checks where the queued file was located (by referer OR image hoster).
When matched, it renames the image based on the title of the currently opened tab and appends any tags found on this page.

If you're on *pixiv* and are trying to save a thumbnail, **SIR** will warn you (but won't restrict your ability to proceed):

![Example alert](./Img/thumbnail_warning.png)

## Recommendations ##
- **SIR** is a self-sufficient extention, yet it works wonders in conjunction with ![WiseTagger](https://github.com/0xb8/WiseTagger).
- Although a handy tool, it's **not** a batch downloader. You still have to manually save each file.
- Some authors include no tags whatsoever, others fill way too much useless general-sounding clutter, so if you're aiming for maximum resolution, please check the name before saving. 

## Known bugs ##
- *Twitter* - unrelated tags are fetched when trying to save an image from the feed
- Tags sometimes can't be fetched for js-made image transitions (Page reload (`F5`) fixes that)
