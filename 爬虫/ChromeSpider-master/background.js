/**
 * Created by Tim on 2014/4/6.
 */
//var i = 0;

//var spider=(function(){
//
//}());

var crawlerTabs = {};
var idleCrawlers = 0;

var task = {};
task.name = "";
task.urls = {};
task.finishedURLs = {};
task.infoPatterns = {};
task.sourcePatterns = {};
task.state = 'idle';

function startTask() {
    task.state = 'run';
}

function stopTask() {
    task.state = 'idle';
}

function createCrawlerTab() {
    chrome.tabs.create({url: 'blank:', active: false, pinned: true}, function (tab) {
        idleCrawlers++;
        var crawlerData = {};
        crawlerData.id = tab.id;
        crawlerData.state = 'idle';
        crawlerData.url = '';
        crawlerTabs[tab.id] = crawlerData;
    });
}

chrome.tabs.onRemoved.addListener(function (tid) {
    console.log(crawlerTabs);
    console.log(tid);
    console.log(crawlerTabs[tid]);
    if (crawlerTabs[tid]) {
        var crawlerData = crawlerTabs[tid];
        if (crawlerData.state = 'crawling') {

        }

        delete crawlerTabs[tid];
        //TODO remove logic
        //remove(tab, crawlerTabs);
    }
});

function getIdelCrawler() {

}

function getCrawlPage(crawler) {
    chrome.tabs.update(crawler.id, {url: crawler.url}, function (tab) {
        chrome.tabs.executeScript(tab.id, {file: 'inject.js'}, function () {
            //TODO send current tab.id
            chrome.tabs.executeScript(tab.id, {code: ''});
        });


    });
}

function remove(obj, array) {
    return $.grep(array, function (value) {
        return value != obj;
    });
}

function size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

setInterval(loop, 500);


function releaseCrawlerTab(tid) {
    idleCrawlers++;

}
//window.open("background.html#0", "bg", "background");

function loop() {
    if (task.state = 'run') {
        if (size(task.urls) > 0) {
            if (idleCrawlers > 0) {

                var crawler = getIdelCrawler();


            }
        }

    }
//    chrome.tabs.

//    chrome.tabs.captureVisibleTab(function (dataURL) {

//    chrome.tabs.create({url: 'http://s.weibo.com/weibo/%E5%8C%97%E4%BA%AC', active: false}, function (tab) {
////            chrome.windows.create({tabId: tab.id,  focused: false}, function (window) {
////                chrome.windows.update(window.id, {state: 'minimized'});
//
////            chrome.tabs.highlight({tabs:tab.id},function(){
////
////            });
//        chrome.tabs.executeScript(tab.id, {file: 'inject.js'});
//        i += 1;
//
////        var iframe=$('<iframe>');
////        iframe.prop('src','http://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension');
////        iframe.appendTo($('body'));
////        iframe.width=500;
////        iframe.height=500;
//
//
////        setTimeout(function () {
////            var notification = webkitNotifications.createNotification("",
////                    "Simple Background App " + i,
////                    "A background window has been created" + tab.status);
////            notification.show();
////            chrome.tabs.remove(tab.id);
////            iframe.remove();
////        }, 2000);
//
//
////            });
//
//    });
//
//
////    });

}

//function removeCurrentTab() {
//    chrome.tabs.getCurrent(function (tab) {
//        chrome.tabs.remove(tab.id);
//    });
//}


//chrome.tabs.onUpdated.addListener(function () {
//
//});

//chrome.webRequest.onHeadersReceived.addListener(
//    function(info) {
//        var headers = info.responseHeaders;
//        for (var i=headers.length-1; i>=0; --i) {
//            var header = headers[i].name.toLowerCase();
//            if (header == 'x-frame-options' || header == 'frame-options') {
//                headers.splice(i, 1); // Remove header
//            }
//        }
//        return {responseHeaders: headers};
//    },
//    {
//        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
//        types: [ 'sub_frame' ]
//    },
//    ['blocking', 'responseHeaders']
//);

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript({file: 'inject.js'});
    //alert(i);
//    var notification = webkitNotifications.createNotification("",
//            "Simple Background App " + i,
//        "A background window has been created");
//    notification.show();
//    chrome.tabs.captureVisibleTab(function (dataURL) {
//        chrome.tabs.create({url: dataURL});
//    });
//    chrome.tabs.highlight(null,tab);
//    var iframe=$('<iframe>').text('HI').appendTo($('body'));

});

chrome.runtime.onConnect.addListener(function (port) {
    //console.log(port.name == "knockknock");
    var tab = port.sender.tab;

    port.onMessage.addListener(function (data) {
        var msg = data.type;
        console.log(msg);
        //port.postMessage({ack: "200"});

        switch (msg) {
            case 'start':
                port();
                //chrome.tabs.remove(tab.id);
                break;
            case 'fin':
                var tid = data.tid;
                releaseCrawlerTab();
                //chrome.tabs.remove(tid);

                break;
            default :
                break;
        }
    });
});