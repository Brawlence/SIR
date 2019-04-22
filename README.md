# SIR
SIR is an image renamer. This extention is to fetch data (author name, image title, site of origin, tracked tags, availible unique IDs) from popular image galleries:
- Pixiv             PX
- Twitter           TW
- Deviantart        DA
- Tumblr            TU
- ArtStation        AS
- HentaiFoundry.    HF

Authors are named according to https://github.com/0xb8/WiseTagger/issues/1

Currently the extention does the following:
Highlights tags found on the page based on its html structure (by injecting custom css on those sites).
Tag-like words would be prefixed with red "TAG: " and colored in bluish violet.
The renaming code tracks the name of an active tab, waits for Chrome to attempt saving a file, then tries to establish if the image beeing saved from those one of those sites (the code checks the origin of the request and the host on which the image is located. If matched, it renames the image based on the title of the tab).

For ArtStation, DevianArt and twittter it also fetches the tags.

TODO: HentaiFoundry, Tumblr.