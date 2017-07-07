function pageLoaded() {
    document.getElementById("siteSpiderGo").addEventListener("click",clickGo);
    chrome.extension.getBackgroundPage().popupLoaded(document);
}

function clickGo() {
    chrome.extension.getBackgroundPage().popupGo();
    window.close();
}
  
window.addEventListener("load",pageLoaded);

