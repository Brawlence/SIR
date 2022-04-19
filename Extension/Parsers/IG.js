"use strict";
var tagsOrigin = "IG";
var ID_prefix  = "instagram_";
var windowDisplacement = 0;

//For somewhat more robust anchoring instead of pre-calculated 28 one can use 
//const IG_ID_DISPLACEMENT = document.URL.lastIndexOf('/p/')+3;
const IG_ID_DISPLACEMENT = 28;

const presentingArticle = 'article[role*="presentation"]';
const selectableArticle = 'article[tabindex="-1"]';
const scalableImage     = 'img[sizes]';

const styleTargets = String.raw`${presentingArticle} div span a[href*="explore/tags"]`;

function getAuthorHandle() {
    var profileHandle = safeQuery(String.raw`${presentingArticle} div span a`).innerText;
	return profileHandle.replace(/[ ,\\/:?<>\t\n\v\f\r]/g, '-');
};

function getAuthorName() {
	return "";
};

function getPictureName() {
	return "";
};

function getTags() {
    var tagString = " ";
    for (let tag of safeQueryA('a[href*="explore/tags"]')) {
		tagString += tag.innerText.replace(/[#]/g, '') + " ";
	};
    return tagString.replace(/[,\\/:?<>\t\n\v\f\r]/g, '_');
};

function getPictureID() {
    if (document.URL.indexOf('/p/') === -1) return;
    let pic_ID = document.URL.substring(IG_ID_DISPLACEMENT).replace(/[\W]/g, ''); //Instagram IDs contain A-z 0-9 and underscore
	return (pic_ID)?ID_prefix+pic_ID:"";
}

// ! Instagram-specific Image|Video unfvckery

const target   = String.raw `${presentingArticle} div   ${scalableImage}, ${presentingArticle} div   video
                             ${selectableArticle} div   ${scalableImage}, ${selectableArticle} div   video`;

const carousel = String.raw `${presentingArticle} ul li ${scalableImage}, ${presentingArticle} ul li video
                             ${selectableArticle} div   ${scalableImage}, ${selectableArticle} div   video`;

let individualPostPage = true;

function findParentElementOfType(element, type) {
    if (element.localName === "body") return null;
    if (element.parentElement.localName === type) return element.parentElement;
    return findParentElementOfType(element.parentElement, type);
}

function cleanSlide(content) {
    let overlayContainer;
    switch (content.localName) {
        case "img":
            content.sizes = "4096px";                               // Promoting the image to maximum quality, 4096 is arbitary here, scrset maximum currently is 1080
            overlayContainer = content.parentElement.parentElement; // Contains transparent overlay preventing right-clicking on image
            if (overlayContainer.childNodes[1]) overlayContainer.childNodes[1].remove();
            break;
    
        case "video":
            overlayContainer = content.parentElement.parentElement.parentElement.parentElement; // Contains the play button and its background
            if (overlayContainer.childNodes[1]) {
                overlayContainer.childNodes[1].style.top="40%";
                overlayContainer.childNodes[1].style.bottom="40%";
                overlayContainer.childNodes[1].style.left="40%";
                overlayContainer.childNodes[1].style.right="40%";
            };
            if (overlayContainer.childNodes[2]) {
                overlayContainer.childNodes[2].style.top="40%";
                overlayContainer.childNodes[2].style.bottom="40%";
                overlayContainer.childNodes[2].style.left="40%";
                overlayContainer.childNodes[2].style.right="40%";
            };
            break;
        default:
            break;
    }
}

function periodicCleaner() {
    // ! Since the scope is so narrow with only one element satisfying img[sizes*="px"] prepended by article[role*="presentation"] or article[tabindex="-1"],
    // ! the following two lines (individual post page detection) are overkill but I will leave them just in case IG breaks something

    if (individualPostPage) individualPostPage = (document.URL.indexOf("instagram.com/p/") !== -1); // Transition true→false is possible, false→true is not
    let content = individualPostPage ? document.querySelector(target) : document.body.lastElementChild.querySelector(target); // first picture or video in queue

    if (content) {
        if (document.querySelector(carousel)) {
            let carouselContainer = findParentElementOfType(content, 'ul');
            for (let slide of carouselContainer.children) if (slide.querySelector('div img, div video')) cleanSlide(slide.querySelector('div img, div video'));
        } else {
            cleanSlide(content);
        }
        setTimeout(periodicCleaner, 100);
    } else {
        setTimeout(periodicCleaner, 500);
    }
}

setTimeout(periodicCleaner, 200);