getAbsoluteOffsetFromBody = function( el )
{   // finds the offset of el from the body or html element
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) )
    {
        _x += el.offsetLeft - el.scrollLeft + el.clientLeft;
        _y += el.offsetTop - el.scrollTop + el.clientTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function getXPathForElement(element) {
    const idx = (sib, name) => sib 
        ? idx(sib.previousElementSibling, name||sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1 
        ? ['']
        : elm.id && document.querySelector(`#${elm.id}`) === elm
            ? [`id("${elm.id}")`]
            : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
}


/** Googlify image in background thread */
function googlify(img, closest) {
	// Skip if already googlified once
	if (!img.src || img.googlified) return;
	img.googlified = true;

	// Perform googlification in background
	chrome.runtime.sendMessage({
		'type': 'googlify',
		'src': img.src,
		'offset': { left: img.offsetLeft, top: img.offsetTop },
		'parentXpath': getXPathForElement(closest)
	}, function(response) {
		if (response.googlified) {
			img.src = response.googlified;
		}
	});
}

/** Googlify all available images on initialization */
var images = document.getElementsByTagName('IMG');
for (var i = 0; i < images.length; ++i) {
	googlify(images[i], images[i].closest('div'));
}

/** Googlify subsequently added images */
var childListObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
    	for (var j = 0; j < mutation.addedNodes.length; ++j) {
			var node = mutation.addedNodes[j];
			if (node.nodeType === 1) {
				var images = node.getElementsByTagName('IMG');
				for (var i = 0; i < images.length; ++i) {
					googlify(images[i], images[i].closest('div'));
				}
			}
		}
	});
});

childListObserver.observe(document.body, {childList: true, subtree: true});

/** Googlify subsequently modified images with new src */
var attributeObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
		if (mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
			googlify(mutation.target, mutation.target.closest('div'));
		}
	});
});

attributeObserver.observe(document.body, {attributes: true,	subtree: true});
