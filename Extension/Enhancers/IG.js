"use strict";

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
};

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
};

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
};

setTimeout(periodicCleaner, 200);