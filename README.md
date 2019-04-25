# SIR
SIR is an image renamer. This extention is to fetch data (author name, image title, site of origin, tracked tags, availible unique IDs) from popular image galleries:

The resulting filename looks like:
`[Author_handle@origin] (Author full name) Title Tag1 Tag2 Long-worded tag3.ext`
where origin is specified as two symbols:
- PX - Pixiv
- TW - Twitter
- DA - Deviantart        
- TU - Tumblr
- AS - ArtStation
- HF - HentaiFoundry.

Authors handles are compatible with https://github.com/0xb8/WiseTagger/issues/1

Currently the extention does the following:
Highlights tags found on the page based on its html structure (by injecting custom css on those sites).
Tag-like words would be prefixed with red `"TAG: "` and colored in bluish violet:
[Img/tag_highlighting.png]

The renaming code tracks the name of an active tab, waits for Chrome's attempt to save a file, then checks if the image is originating from one of those sites (the code checks the referer and the image hosting. When matched, it renames the image based on the title of the tab).
Additional content scripts scan the page for tags and append them to suggested name. 

Known bugs:
- *Tumbler* - author name \ image title recognition not implemented yet
- *Twitter* - unrelated tags are fetched when trying to save an image from the feed
- Tags sometimes can't be fetched for js-made image transitions (F5 fixes this)