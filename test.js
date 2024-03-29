// TODO: Implement proper testing suite
let Links_to_test = [
    "https://www.artstation.com/artwork/zARRXD",                                                // ID is alphanumeric
    "https://deviantart.com/view/773367018",                                                    // Special case: parsing download link; "https://www.deviantart.com/warrenlouw/art/Ochaco-Uraraka-773367018"
    "https://danbooru.donmai.us/posts/3887268",                                                 // Special case: tags string > 230 characters limit
    "https://drawfriends.booru.org/index.php?page=post&s=view&id=99115",                        //
    "https://www.hentai-foundry.com/pictures/774805",                                           // Original was "https://www.hentai-foundry.com/pictures/user/BBC-Chan/774805/Elyzabeth-1"
    "http://medicalwhiskey.com/?p=12513",                                                       //
    "https://www.pixiv.net/artworks/79196939",                                                  // Special case: thumbnail detection
    "https://www.pixiv.net/request",                                                            // Special case: creators accepting requests & qualifier handling
    "https://blurryken.tumblr.com/post/185528821532/do-you-want-to-share-a-bubble-tea-with-me", // NO IDS KNOWN - ID tracking not implemented
    "https://twitter.com/RGVaerialphotos/status/1280334509863579648",                           // NO IDS KNOWN - ID tracking not implemented Special case: image must be ORIG
    "https://vidyart.booru.org/index.php?page=post&s=view&id=375444",                           // Special cases: >6 artists; very long tags string
    "https://www.instagram.com/p/CFBa7UUM7ue/"                                                  // ID is alphanumeric, Special case: video
];

for (let link of Links_to_test) { window.open(link,"_blank"); };

//Things to check:
//1. CSS injection 
//2. Get Tags String returning the proper filled string
//3. Download With Tags actually downloading the file
//4. File length trimming to below 200 symbols
//5. Multiple authors are trimmed to below 100 symols
