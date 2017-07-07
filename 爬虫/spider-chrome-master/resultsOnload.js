function messageDispatch(request, sender, sendResponse) {
    var element = null;
    //what are we using
    switch(request.method){
        case "getElementById":
            element =document.getElementById(request.id);
            break;
        case "getElementsByTag":
            element =document.getElementById(request.id);
            break;
    }
    //what are we doing
    switch(request.action){
        case "getInnerHTML":
            sendResponse(element.innerHTML);
            break;
        case "getValue":
            sendResponse(element.value);
            break;
        case "setInnerHTML":
            element.innerHTML=request.value;
            break;
        case "setValue":
            element.value=request.value;
            break;
        case "insertResultBodyTR":
            insertResultBodyTR(request.value);
            break;
    }
}
function clickStop() {
    if( document.getElementById("stopSpider").value == "Stop" ){
        document.getElementById("stopSpider").value="Stopping";
    }
    chrome.runtime.sendMessage({
        stop: document.getElementById("stopSpider").value
    });
}

function clickPause() {
    if( document.getElementById("pauseSpider").value == "Pause" ){
        document.getElementById("pauseSpider").value="Resume";
    }
    else{
        document.getElementById("pauseSpider").value="Pause";
    }
    chrome.runtime.sendMessage({
        pause: document.getElementById("pauseSpider").value
    });
}


function pageLoaded() {
    document.getElementById("stopSpider").addEventListener("click",clickStop);
    document.getElementById("pauseSpider").addEventListener("click",clickPause);
    chrome.runtime.onMessage.addListener(messageDispatch);
}

function insertResultBodyTR(innerHTML){
    var tbody = document.getElementById('resultbody');
    var tr = document.createElement('tr');
    tr.innerHTML += innerHTML
    tbody.appendChild(tr);
}

window.addEventListener("load",pageLoaded);

