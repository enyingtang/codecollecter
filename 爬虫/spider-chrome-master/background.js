/**
 * Copyright 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * How long to wait before one gives up on a connection.
 * @type {number}
 */
var HTTP_REQUEST_TIMEOUT = 30 * 1000;
var HEAD_REQUEST_TIMEOUT = 5 * 1000;
/**
 * Title of the results page (while spidering).
 * @type {string}
 */
var RESULTS_TITLE = 'Site Spider Results';
/**
 * List of mime types that we will load for further spidering.
 * text/plain is due to some web servers sending html using the wrong mime type.
 * @type {Array.<string>}
 */
var SPIDER_MIME = ['text/html', 'text/plain', 'text/xml'];

var popupDoc = null;
var allowedText = '';
var allowedRegex = null;
var allowPlusOne = false;
var allowArguments = false;
var checkInline = false;
var checkScripts = false;
var pagesTodo = {};
var pagesDone = {};
var spiderTab = null;
var resultsTab = null;
var httpRequest = null;
var httpRequestWatchDogPid = 0;
var newTabWatchDogPid = 0;
var started = false;
var paused = false;
var currentRequest ={
    requestedURL:null,
    returnedURL:null,
    referrer:null
};


/**
 * Save a reference to the popup's document object,
 * then initialize the popup's fields.
 * Called by the popup as soon as it is loaded.
 * @param {Document} doc The popup's document object.
 */
function popupLoaded(doc) {
    popupDoc = doc;
    chrome.tabs.getSelected(null, setDefaultUrl_);
}

/**
 * Initialize the popup's fields.
 * Callback from chrome.tabs.getSelected.
 * @param {Tab} The currently selected tab.
 * @private
 */
function setDefaultUrl_(tab) {
    // Use the currently selected tab's URL as a start point.
    var url;
    if (tab && tab.url && tab.url.match(/^\s*https?:\/\//i)) {
        url = tab.url;
    } else {
        url = 'http://www.example.com/';
    }
    popupDoc.getElementById('start').value = url;

    // Compute a default regex which will limit the spider
    // to the current directory.
    allowedText = url;
    // Trim off any hash.
    allowedText = trimAfter(allowedText, '#');
    // Trim off any arguments.
    allowedText = trimAfter(allowedText, '?');
    // Trim off any filename, leaving the path.
    var div = allowedText.lastIndexOf('/');
    if (div > 'https://'.length) {
        allowedText = allowedText.substring(0, div + 1);
    }
    // Sanitize regex characters in URL.
    allowedText =
    allowedText.replace(/([\^\$\.\*\+\?\=\!\:\|\\\(\)\[\]\{\}])/g,
        '\\$1');
    allowedText = '^' + allowedText;
    popupDoc.getElementById('regex').value = allowedText;

    // Restore previous setting for checkboxes.
    popupDoc.getElementById('plusone').checked = allowPlusOne;
    popupDoc.getElementById('arguments').checked = !allowArguments;
    popupDoc.getElementById('inline').checked = checkInline;
    popupDoc.getElementById('scripts').checked = checkScripts;
}

/**
 * Truncate a string to remove the specified character and anything after.
 * e.g. trimAfter('ab-cd-ef', '-') -> 'ab'
 * @param {string} string String to trim.
 * @param {string} sep Character to split on.
 * @return {string} String with character and any trailing substring removed.
 */
function trimAfter(string, sep) {
    var div = string.indexOf(sep);
    if (div != -1) {
        return string.substring(0, div);
    }
    return string;
}

/**
 * Start a spidering session.
 * Called by the popup's Go button.
 */
function popupGo() {

    console.log('popupGo');
    // Terminate any previous execution.
    popupStop();

    // Rename title of any previous results so we don't edit them.
    var resultsWindows = chrome.extension.getViews({
        type: 'tab'
    });
    for (var x = 0; x < resultsWindows.length; x++) {
        var doc = resultsWindows[x].document;
        if (doc.title == RESULTS_TITLE) {
            doc.title = RESULTS_TITLE + ' - Closed';
        }
    }

    // Attempt to parse the allowed URL regex.
    var input = popupDoc.getElementById('regex');
    allowedText = input.value;
    try {
        allowedRegex = new RegExp(allowedText);
    } catch (e) {
        alert('Restrict regex error:\n' + e);
        popupStop();
        return;
    }

    // Save settings for checkboxes.
    allowPlusOne = popupDoc.getElementById('plusone').checked;
    allowArguments = !popupDoc.getElementById('arguments').checked;
    checkInline = popupDoc.getElementById('inline').checked;
    checkScripts = popupDoc.getElementById('scripts').checked ;

    // Initialize the todo and done lists.
    pagesTodo = {};
    pagesDone = {};
    // Add the start page to the todo list.
    var startPage = popupDoc.getElementById('start').value;
    pagesTodo[startPage] = '[root page]';

    /**
   * Record a reference to the results tab so that output may be
   * written there during spidering.
   * @param {Tab} The new tab.
   * @private
   */
    function resultsLoadCallback_(tab) {
        resultsTab = tab;
        window.setTimeout(resultsLoadCallbackDelay_, 100);
    }
    function resultsLoadCallbackDelay_(){
        chrome.tabs.sendMessage(resultsTab.id, {
            method:"getElementById",
            id:"startingOn",
            action:"setInnerHTML",
            value:setInnerSafely(startPage)
        });
        chrome.tabs.sendMessage(resultsTab.id, {
            method:"getElementById",
            id:"restrictTo",
            action:"setInnerHTML",
            value:setInnerSafely(allowedText)
        });
        // Start spidering.
        started = true;
        spiderPage();
    }

    // Open a tab for the results.
    chrome.tabs.create({
        url: 'results.html'
    }, resultsLoadCallback_);
}

/**
 * Set the innerHTML of a named element with a message.  Escape the message.
 * @param {Document} doc Document containing the element.
 * @param {string} id ID of element to change.
 * @param {*} msg Message to set.
 */
function setInnerSafely(msg) {
    msg = msg.toString();
    msg = msg.replace(/&/g, '&amp;');
    msg = msg.replace(/</g, '&lt;');
    msg = msg.replace(/>/g, '&gt;');
    return msg;
}
/**
 * Cleanup after a spidering session.
 */
function popupStop() {
    started= false;
    pagesTodo = {};
    closeSpiderTab();
    spiderTab = null;
    resultsTab = null;
    window.clearTimeout(httpRequestWatchDogPid);
    window.clearTimeout(newTabWatchDogPid);
    // Reenable the Go button.
    popupDoc.getElementById('siteSpiderGo').disabled = false;
}

/**
 * Start spidering one page.
 */
function spiderPage() {
    console.log('spiderPage');
    currentRequest ={
        requestedURL:null,
        returnedURL:null,
        referrer:null
    };

    if(paused){
        return;
    }
    setStatus('Next page...');
    if (!resultsTab) {
        // Results tab was closed.
        return;
    }

    // Pull one page URL out of the todo list.
    var url = null;
    for (url in pagesTodo) {
        break;
    }
    if (!url) {
        // Done.
        setStatus('Complete');
        popupStop();
        return;
    }
    // Record page details.
    currentRequest.referrer=pagesTodo[url];
    currentRequest.requestedURL =url;
    delete pagesTodo[url];
    pagesDone[url] = true;

    // Fetch this page using Ajax.
    setStatus('Prefetching ' + url);
    httpRequestWatchDogPid = window.setTimeout(httpRequestWatchDog, HEAD_REQUEST_TIMEOUT);
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = httpRequestChange;
    httpRequest.open('HEAD', url, false);
    // For some reason this request only works intermitently when called directly.
    // Delay request by 1ms.
    window.setTimeout(function() {
        httpRequest.send(null);
    }, 1);
}

/**
 * Terminate an http request that hangs.
 */
function httpRequestWatchDog() {
    console.log("httpRequestWatchDog");
    setStatus('Aborting HTTP Request');
    if (httpRequest) {
        httpRequest.abort();
        // Log your miserable failure.
        currentRequest.returnedURL=null;
        recordPage(currentRequest);
        httpRequest = null;
    }
    window.setTimeout(spiderPage, 1);
}

/**
 * Terminate a new tab that hangs (happens when a binary file downloads).
 */
function newTabWatchDog() {
    console.log("newTabWatchDog");
    setStatus('Aborting New Tab');
    closeSpiderTab();

    // Log your miserable failure.
    currentRequest.returnedURL=null;
    recordPage(currentRequest);

    window.setTimeout(spiderPage, 1);
}

/**
 * Callback for when the status of the Ajax fetch changes.
 */
function httpRequestChange() {
    console.log("httpRequestChange");

    if (!httpRequest || httpRequest.readyState < 2) {
        // Still loading.  Wait for it.
        return;
    }
    var code = httpRequest.status
    var mime = httpRequest.getResponseHeader('Content-Type') || '[none]';
    httpRequest = null;
    window.clearTimeout(httpRequestWatchDogPid);
    setStatus('Prefetched ' + currentRequest.requestedURL + ' (' + mime + ')');

    // 'SPIDER_MIME' is a list of allowed mime types.
    // 'mime' could be in the form of "text/html; charset=utf-8"
    // For each allowed mime type, check for its presence in 'mime'.
    var mimeOk = false;
    for (var x = 0; x < SPIDER_MIME.length; x++) {
        if (mime.indexOf(SPIDER_MIME[x]) != -1) {
            mimeOk = true;
            break;
        }
    }

    // If this is a redirect or an HTML page, open it in a new tab and
    // look for links to follow.  Otherwise, move on to next page.
    if (currentRequest.requestedURL.match(allowedRegex) &&
        ((code >= 300 && code < 400) || (code < 300 && mimeOk))) {
        setStatus('Fetching ' + currentRequest.requestedURL);
        newTabWatchDogPid = window.setTimeout(newTabWatchDog, HTTP_REQUEST_TIMEOUT);
        chrome.tabs.create({
            url: currentRequest.requestedURL,
            selected: false
        }, spiderLoadCallback_);
    } else {
        // Close this page and mark done.
        currentRequest.returnedURL ="Skipped";
        recordPage(currentRequest);

        window.setTimeout(spiderPage, 1);
    }
}

/**
 * Inject the spider code into the newly opened page.
 * @param {Tab} The new tab.
 * @private
 */
function spiderLoadCallback_(tab) {
    spiderTab = tab;
    setStatus('Spidering ' + spiderTab.url);
    chrome.tabs.executeScript(spiderTab.id, {
        file: 'spider.js'
    });
}


// Add listener for message events from the injected spider code.
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if ('links' in request) {
            spiderInjectCallback(request.links, request.inline, request.scripts, request.url);
        }
        if ('stop' in request) {
            if(started){
                if (request.stop =="Stopping"){
                    setStatus("Stopped");
                    chrome.tabs.sendMessage(resultsTab.id, {
                        method:"getElementById",
                        id:"stopSpider",
                        action:"setValue",
                        value:"Stopped"
                    });
                    popupStop();
                }
            }
        }
        if ('pause' in request) {
            if (request.pause =="Resume" && started && !paused){
                paused=true;
            }
            if (request.pause =="Pause" && started && paused){
                paused=false;
                spiderPage();

            }
        }

    });

/**
 * Process the data returned by the injected spider code.
 * @param {Array} links List of links away from this page.
 * @param {Array} inline List of inline resources in this page.
 */
function spiderInjectCallback(links, inline, scripts, url) {
    window.clearTimeout(newTabWatchDogPid);

    setStatus('Scanning ' + url);
    currentRequest.returnedURL =url;

    // In the case of a redirect this URL might be different than the one we
    // marked spidered above.  Mark this one as spidered too.
    pagesDone[url] = true;

    if (checkInline) {
        links = links.concat(inline);
    }
    if (checkScripts) {
        links = links.concat(scripts);
    }
    // Add any new links to the Todo list.
    for (var x = 0; x < links.length; x++) {
        var link = links[x];
        link = trimAfter(link, '#');  // Trim off any anchor.
        if (link && !(link in pagesDone) && !(link in pagesTodo)) {
            if (allowArguments || link.indexOf('?') == -1) {
                if (link.match(allowedRegex) ||
                    (allowPlusOne && url.match(allowedRegex))) {
                    pagesTodo[link] =url;
                }
            }
        }
    }

    // Close this page and mark done.
    recordPage(currentRequest);
    //We want a slight delay before closing as a tab may have scripts loading
    window.setTimeout(function(){
        closeSpiderTab();
    },18);
    window.setTimeout(function(){
        spiderPage();
    },20);
}

function closeSpiderTab(){
    if (spiderTab)
        chrome.tabs.remove(spiderTab.id);
    spiderTab = null;

}
/**
 * Record the details of one url to the results tab.
 */
function recordPage() {
    if (currentRequest.requestedURL!=null && (currentRequest.returnedURL ==null)) {
        var codeclass = 'x0';
        currentRequest.returnedURL = "Error"
    } 
    var requestedURL = '<a href="' + currentRequest.requestedURL + '" target="spiderpage" title="' + currentRequest.requestedURL + '">' + currentRequest.requestedURL + '</a>';
    value ='<td>' + requestedURL + '</td>' +
    '<td class="' + codeclass + '"><span title="' + currentRequest.returnedURL + '">' + currentRequest.returnedURL + '</span></td>' +
    '<td><span title="' + currentRequest.referrer + '">' + currentRequest.referrer + '</span></td>';

    chrome.tabs.sendMessage(resultsTab.id, {
        method:"custom",
        action:"insertResultBodyTR",
        value:value
    });
}

/**
 * Set the current status message to the results tab.
 * Print count of number of items left in queue.
 * @param {string} msg Status message.
 */
function setStatus(msg) {
    if(started){
        try{
            chrome.tabs.sendMessage(resultsTab.id, {
                method:"getElementById",
                id:"stopSpider",
                action:"getValue"
            }, function(response) {
                if (started && (response =="" || response== null)){
                    popupStop();
                    alert('Lost access to results pane. Halting.');
                }
            });
            chrome.tabs.sendMessage(resultsTab.id, {
                method:"getElementById",
                id:"queue",
                action:"setInnerHTML",
                value:Object.keys(pagesTodo).length
            });
            chrome.tabs.sendMessage(resultsTab.id, {
                method:"getElementById",
                id:"status",
                action:"setInnerHTML",
                value:setInnerSafely(msg)
            });
        }catch(err){
            popupStop();
        }
    }
}

