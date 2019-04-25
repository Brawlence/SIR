# SIR #
SIR is an image renamer.

## Description ##
This extention is to fetch data from popular image galleries, providing informative names when saving.

The resulting filename looks like:
`[Author_handle@origin] (Author full name) Title uniq_ID Tag1 Tag2 Long-worded tag3.ext`
where origin is specified as two symbols:
- PX - Pixiv
- TW - Twitter
- DA - Deviantart        
- TU - Tumblr
- AS - ArtStation
- HF - HentaiFoundry.

Authors handles are compatible with https://github.com/0xb8/WiseTagger/issues/1

Please note that Author full name, image title and tags are optional on some sites and thus cannot always be fetched.
*Currently the only type of tracked Unique picture ID is pixiv's `pixiv_(album)_(page)`, as for other sites I know of no way to get the image based on this info.*

## Inner workings ##
SIR highlights found tags by injecting custom css on sites listed above.
Tag-like words are prefixed with red `"TAG: "` and colored in bluish violet:

![Example of tag highlighting](./Img/tag_highlighting.png)

Content scripts fetch those tags and pass them to renaming code for later use.

The renaming code waits for Chrome's attempt to save a file, then checks if the queued file was from one of those sites (by referer OR image hoster).
If matched, it renames the image based on the title of the currently opened tab and appends any found tags.


## Known bugs ##
- *Tumbler* - author name \ image title recognition not implemented yet
- *Twitter* - unrelated tags are fetched when trying to save an image from the feed
- Tags sometimes can't be fetched for js-made image transitions (F5 fixes this)
