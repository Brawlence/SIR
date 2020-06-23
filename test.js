// TODO: Plan & implement proper testing suite
var Links_to_test = [
    "https://www.artstation.com/artwork/zARRXD",                                                //ID tracking implemented
    "https://deviantart.com/view/787225844",                                                    //ID tracking implemented Original was "https://www.deviantart.com/chrissiezullo/art/Nejire-Hadou-787225844"
    "https://danbooru.donmai.us/posts/3278046",                                                 //ID tracking implemented
    "https://drawfriends.booru.org/index.php?page=post&s=view&id=99115",                        //ID tracking implemented
    "https://www.hentai-foundry.com/pictures/774805",                                           //ID tracking implemented Original was "https://www.hentai-foundry.com/pictures/user/BBC-Chan/774805/Elyzabeth-1"
    "http://medicalwhiskey.com/?p=12513",                                                       //ID tracking implemented
    "https://www.pixiv.net/artworks/79196939",                                                  //ID tracking implemented
    "https://blurryken.tumblr.com/post/185528821532/do-you-want-to-share-a-bubble-tea-with-me", //NO IDS KNOWN
    "https://twitter.com/ToyNewsInterna1/status/1222547463002681344",                           //NO IDS KNOWN
    "https://vidyart.booru.org/index.php?page=post&s=view&id=377421"                            //ID tracking implemented, but bugged
];

for (let link of Links_to_test) { window.open(link,"_blank"); };

//Things to check:
//1. CSS injection 
//2. Get Tags String returning the proper filled string
//3. Download With Tags actually downloading the file
//4. File length trimming?