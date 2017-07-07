function createTab(links, i) {
  chrome.tabs.create({ url: links[i] }, function(tab) {
    var tabId = tab.id;
    chrome.tabs.onUpdated.addListener(function(tid, changeInfo, tab) {
      if (tid != tabId || changeInfo.status != 'complete') {
        return;
      }
      chrome.tabs.onUpdated.removeListener(arguments.callee);
      chrome.tabs.executeScript(tid, { file: 'js/lib/common.js' }, function(result) {
        chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, function(mhtml) {
          console.log(tab.id, mhtml);
          var url = window.URL.createObjectURL(mhtml),
            p = (tab.title || tab.url) + '_' + Date.now() + '.mhtml';
          saveAs2(url, gM('zdesc') + '/MHTML', p, '', function(id) {
            console.log(id)
            chrome.tabs.remove(tid, function() {
              console.log('remove ' + tid + ' success!');
            })
            if (i < links.length) {
              i++;
              setTimeout(function() {
                // createTab(links, i);
              }, 500)
            }
          });
        });
      });
    })
  })
}

function gM(msg, str) {
  return chrome.i18n.getMessage(msg, str) || msg
}

function saveAs2(Url, path, filename, conflictAction, cb) {
  //uniquify overwrite prompt
  return chrome.downloads.download({ url: Url, conflictAction: conflictAction || 'uniquify', filename: pathTxt(pathTxt(path) + '/' + pathTxt(filename)) }, cb);
}

function pathTxt(t) {
  return t.replace(/\\/g, '/').replace(/(\s*\/+\s*)/g, '/').trim().replace(/^\/+|\/+$/g, '').replace(/["\\:\?\*<>\|]/g, '-')
}

var Back = {
  init: function(links) {
    var i = 0;
    createTab(links, i);
  }
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type != 'popup') return;
  console.log(message);
  sendResponse('Hello from background.');
  Back.init(message.data);
});
