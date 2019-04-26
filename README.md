# SIR #
SIR is an image renamer.

## Description ##
This extention is to fetch data from popular image galleries, suggesting Chrome informative file names.

The result typically looks like:

`[Author_handle@OR] (Author_full_name) Title uniq_ID tag another_tag tag-episode2 tag_that_contained_spaces.ext`
where `OR` (origin) is specified as follows:
- PX - Pixiv
- TW - Twitter
- DA - Deviantart        
- TU - Tumblr
- AS - ArtStation
- HF - Hentai-Foundry.

`Author handle`s are compatible with https://github.com/0xb8/WiseTagger/issues/1

Please note that `Author full name`, image `Title` and `Tag`s are optional on some sites and thus cannot always be fetched.
*Currently the only type of tracked Unique picture ID is `pixiv_(album)_(page)`, as for other sites tracking it is meaningless - I know no ways to get the image based on its ID.*

## Inner workings ##
SIR prefixes tags with a red `"TAG: "` by injecting custom css on sites listed above.

![Example of tag highlighting](./Img/tag_highlighting.png)

Content scripts fetch those tags and pass them to renaming code for later use.

The renaming code waits for Chrome's attempt to save a file, then checks if the queued file was from one of those sites (by referer OR image hoster).
If matched, it renames the image based on the title of the currently opened tab and appends any found tags.

Additionally, if you're on *pixiv* and are trying to save a thumbnail, SIR will warn you (but won't restrict your ability to proceed).
![Example alert](./Img/thumbnail_warning.png)

## Known bugs ##
- *Tumbler* - author name \ image title recognition not implemented yet
- *Twitter* - unrelated tags are fetched when trying to save an image from the feed
- Tags sometimes can't be fetched for js-made image transitions (Page reload (`F5`) fixes that)
