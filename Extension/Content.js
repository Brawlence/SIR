// A unified content script for ALL the sites

"use strict";

const AUTHOR_HANDLE_LENGTH_CUTOFF = 100;

const randLength = 10;

const sirHighlightStyle = String.raw`
	{
		border-width: 2px;
		border-style: dotted;
		border-color: lightpink;

		transition:all .2s cubic-bezier(.5,.1,.7,.5);
		-webkit-transition:all .2s cubic-bezier(.5,.1,.7,.5)
	}
	`;

const sirBoxStyle = String.raw`
	div#sirArea {
		left: 20px;
		position: fixed;
		z-index: 16777216;
		border-width: 3px;
		border-style: solid;
		padding: 5px;
		padding-bottom: 0px;
		background-color: lightgray;

		touch-action: none;
		user-select: none
	}

	div#sirArea:hover {
		cursor: grab;
		border-color: #506070
	}

	div#sirArea:active {
		cursor: grabbing;
		border-style: dashed
	}

	div#sirArea p span {
		font-size: small;
		float: right
	}

	button#c-and-h,
	button#save {
		float:right
	}

	textarea#elderMagicField {
		height: 150px;
		width: 360px
	}
	`;

const lowerParagraph_text = String.raw`
	<span class="dragable">
		Select 'Get Tags String' again to close this window.
	</span>
	`;

const lowerParagraph_btns = String.raw`
	<button id="c-and-h" onclick="javascript:
		document.getElementById('elderMagicField').select();
		document.execCommand('copy');
		document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));
	">
	📋
	</button>
	<!--
	<button id="options" onclick="javascript:alert();">
	🛠️
	</button>
	<button id="save" onclick="javascript:alert();">
	💾
	</button>
	-->
	<button onclick="javascript:
		document.getElementById('sirArea').parentElement.removeChild(document.getElementById('sirArea'));
	">
	🚫
	</button>
	`;

const loc_templateUpdatePrompt = String.raw`
            SPECIFY YOUR CUSTOM TEMPLATE

 {handle} - Author Handle (unique for the platform)
 {ID} - ID of the picture (platform-unique)
 {OR} - Tags Origin (2-symbols long platform ID)
 {name} - Author name
 {caption} - Picture caption
 {selection} - The text you have selected (trimmed to 128 symbols)
 {tags} - Tags string
 {rand} - random string
`;

function pick(element) {
	return document.getElementById(element);
};

function fresh(element) {
	return document.createElement(element);
};

// TODO: learn how to do this properly
function safeQuery(selector) {
	var trytofail = document.querySelector(selector);
	if ( (trytofail === undefined || trytofail === null) ) {
		var puppet = new Object;
		puppet.href = "";
		puppet.innerText = "";
		puppet.innerHTML = "";
		trytofail = puppet;
	};
	return trytofail;
};

function safeQueryA(selector) {
	var trytofail = document.querySelectorAll(selector);
	if ( (trytofail === undefined || trytofail === null || trytofail.length === 0) ) {
		var puppet = new Object;
		puppet.href = "";
		puppet.innerText = "tagme";
		puppet.innerHTML = "";
		return [puppet];
	};
	return trytofail;
};

function safeGetByClass(classSelector) {
	var trytofail = document.getElementsByClassName(classSelector);
	if ( (trytofail === undefined || trytofail === null || trytofail.length === 0) ) {
		var puppet = new Object;
		puppet.href = "";
		puppet.innerText = "       tagme";
		puppet.innerHTML = "";
		return [puppet];
	};
	return trytofail;
};

// relies on defined get...() functions in XX_tagsParser.js
function getNameBy(template) {
	let authorHandle = getAuthorHandle(),
		pictureID = getPictureID(),
		selectionText = document.getSelection().toString().replace(/\n/g, ' ').trim().slice(0,128); // text selection on the page is trimmed and shortened to 128 symbols just in case

	if ( (!authorHandle) && pictureID) template = template.replace(/@\{OR\}/g, ''); // if there is no authorHandle and we have an ID, ignore '@XX' in the template
	if (authorHandle.length > AUTHOR_HANDLE_LENGTH_CUTOFF) {						// if authorHandle is too big (multiple artists?), trim it
		authorHandle = authorHandle.substr(0, AUTHOR_HANDLE_LENGTH_CUTOFF);
		authorHandle = authorHandle.substring(0, authorHandle.lastIndexOf('+') + 1) + "…";
	}

	template = template.replace(/\{handle\}/g, authorHandle);
	template = template.replace(/\{OR\}/g, tagsOrigin);
	template = template.replace(/\{ID\}/g, pictureID);
	template = template.replace(/\{name\}/g, getAuthorName());
	template = template.replace(/\{caption\}/g, getPictureName());
	template = template.replace(/\{selection\}/g, selectionText);
	template = template.replace(/\{tags\}/g, getTags());
	template = template.replace(/\{rand\}/g, getRand(randLength));

	template = template.replace(/\s{2,}/g, ' ').trim();

	return template;
};

function getLinksArr() {
	let array = parseAdditionalLinks();
	return array || [];	
};

function getRand(randLength) {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let randString = "";

	for (let i = 0; i < randLength; i++) {
		randString += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return randString;
};

// ! Drag-able elderMagicField 
var dragging = false;
var currentX, currentY, initialX, initialY;
var xOffset = 0,
	yOffset = 0;

function setTranslate(xPos, yPos, el) {
	el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
};

function dragStart(e) {
	if (e.type === "touchstart") {
		initialX = e.touches[0].clientX - xOffset;
		initialY = e.touches[0].clientY - yOffset;
	} else {
		initialX = e.clientX - xOffset;
		initialY = e.clientY - yOffset;
	};

	if (e.target.className === "dragable") dragging = true;
};

function dragEnd(e) {
	initialX = currentX;
	initialY = currentY;
	dragging = false;
};

function drag(e) {
	if (dragging) {
		e.preventDefault();
		
		if (e.type === "touchmove") {
			currentX = e.touches[0].clientX - initialX;
			currentY = e.touches[0].clientY - initialY;
		} else {
			currentX = e.clientX - initialX;
			currentY = e.clientY - initialY;
		}

		xOffset = currentX;
		yOffset = currentY;

		setTranslate(currentX, currentY, pick('sirArea'));
	}
};

function toggleDragable(state) {
	switch (state) {
		case true:
			document.body.addEventListener("touchstart", dragStart, false);
			document.body.addEventListener("touchend", dragEnd, false);
			document.body.addEventListener("touchmove", drag, false);

			document.body.addEventListener("mousedown", dragStart, false);
			document.body.addEventListener("mouseup", dragEnd, false);
			document.body.addEventListener("mousemove", drag, false);
			break;
	
		default:
			document.body.removeEventListener("touchstart", dragStart, false);
			document.body.removeEventListener("touchend", dragEnd, false);
			document.body.removeEventListener("touchmove", drag, false);

			document.body.removeEventListener("mousedown", dragStart, false);
			document.body.removeEventListener("mouseup", dragEnd, false);
			document.body.removeEventListener("mousemove", drag, false);
			xOffset = 0;
			yOffset = 0;
			dragging = false;
			break;
	}
};

// Drag-able elderMagicField - end of block

function setHighlight(neededState) {
	if (neededState && (pick('sir-style') === null)) {
		var styleSir = document.head.appendChild(fresh('style'));
			styleSir.type = "text/css";
			styleSir.id = "sir-style";
			styleSir.innerHTML = styleTargets + sirHighlightStyle;
	};
	if ((!neededState) && pick('sir-style')) {
		document.head.removeChild(pick('sir-style'));
	}
};

function createTagsStringField(template) {
	if (pick('sirArea') === null) {

		var allTheStyles = document.head.appendChild(fresh('style'));
			allTheStyles.type = "text/css";
			allTheStyles.id = "sir-box-style";
			allTheStyles.innerHTML = sirBoxStyle;

		const sirBox = document.body.appendChild(fresh('div'));
			sirBox.id = "sirArea";
			sirBox.style.top = (windowDisplacement + 20) + "px";
			sirBox.className = "dragable";

		const elderMagicField = pick('sirArea').appendChild(fresh('textarea'));
			elderMagicField.id = "elderMagicField";
			elderMagicField.value = getNameBy(template);

		const lowerParagraph = pick('sirArea').appendChild(fresh('p'));
			lowerParagraph.className = "dragable";
			// ! Can't add onclick events to buttons with the usual method, have to use innerHTML instead
			if ((tagsOrigin==="TU")|(tagsOrigin==="TW")) {
				lowerParagraph.innerHTML = lowerParagraph_text;
				pick('elderMagicField').focus();
			} else {
				lowerParagraph.innerHTML = lowerParagraph_btns;
				pick('c-and-h').focus();
			};
		toggleDragable(true);
	} else {
		pick('sirArea').parentElement.removeChild(pick('sirArea'));
		document.head.removeChild(pick('sir-box-style'));
		toggleDragable(false);
	}
};

chrome.runtime.onMessage.addListener(
	function(request, _sender, sendResponse) {
		switch (request.order) {
			case 'ping':
				sendResponse({message: true, origin: tagsOrigin});
				setHighlight(request.useDecor);
				break;
			case 'giffTags':
				sendResponse({tagString: getNameBy(request.template), origin: tagsOrigin, linksArray: getLinksArr(), pageAt: document.URL});
				break;
			case 'getTagsString':
				createTagsStringField(request.template);
				break;
			case 'displayWarning':
				alert(request.warning);
				break;
			case 'askForTemplate':
				sendResponse({newTemplate: prompt(loc_templateUpdatePrompt, request.stub)});
				break;
			default:
				break;
		};
	}
);
