// TODO: Plan & implement proper testing suite
var Links_to_test = [
    "https://www.artstation.com/artwork/zARRXD",
    "https://www.deviantart.com/chrissiezullo/art/Nejire-Hadou-787225844",
    "https://danbooru.donmai.us/posts/3278046,json",
    "https://drawfriends.booru.org/index.php?page=post&s=view&id=99115",
    "https://www.hentai-foundry.com/pictures/user/BBC-Chan/774805/Elyzabeth-1",
    "http://medicalwhiskey.com/?p=12513",
    "https://www.pixiv.net/artworks/79196939",
    "https://blurryken.tumblr.com/post/185528821532/do-you-want-to-share-a-bubble-tea-with-me",
    "https://twitter.com/ToyNewsInterna1/status/1222547463002681344",
    "https://vidyart.booru.org/index.php?page=post&s=view&id=377421"
];

for (let link of Links_to_test) { window.open(link,"_blank"); };

//Things to check:
//1. CSS injection 
//2. Get Tags String returning the proper filled string
//3. Download With Tags actually downloading the file
//4. File length trimming?