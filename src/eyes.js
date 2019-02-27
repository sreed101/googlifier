function getElementByXPath(path) { 
    return (new XPathEvaluator()) 
        .evaluate(path, document.documentElement, null, 
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null) 
        .singleNodeValue; 
} 

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      var parentEl = getElementByXPath(request.parentXpath);
      var div = document.createElement("div");
        div.style.width = (request.eye.radius * 2) + "px";
        div.style.height = (request.eye.radius * 2) + "px";
        div.style.borderRadius = "50%";
        div.style.background = "#FFFFFF";
        div.style.top = request.offset.top + request.eye.radius + "px";
        div.style.left = request.offset.left + request.eye.radius + "px";
        //div.style.top = request.offset.top + (request.eye.y - (request.eye.radius * 2)) + "px";
        //div.style.left = request.offset.left + (request.eye.x - (request.eye.radius * 2)) + "px";
        div.style.position = "absolute";
        div.className = "eye";

        var eye = parentEl.appendChild(div);
    });

//This is a pen based off of Codewoofy's eyes follow mouse. It is just cleaned up, face removed, and then made to be a little more cartoony. https://codepen.io/Codewoofy/pen/VeBJEP
$("body").mousemove(function(event) {
    $(".eye").each(function() {
        var eye = $(this);
        var x = (eye.offset().left) + (eye.width() / 2);
        var y = (eye.offset().top) + (eye.height() / 2);
        var rad = Math.atan2(event.pageX - x, event.pageY - y);
        var rot = (rad * (180 / Math.PI) * -1) + 180;
        eye.css({
            '-webkit-transform': 'rotate(' + rot + 'deg)',
            '-moz-transform': 'rotate(' + rot + 'deg)',
            '-ms-transform': 'rotate(' + rot + 'deg)',
            'transform': 'rotate(' + rot + 'deg)'
        });
    });
  });