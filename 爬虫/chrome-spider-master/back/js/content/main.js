var scrollTopCache = 0;
var clientHeightCache = 0;
var Content = {
  init: function() {
    var isCall = this.isCall = sessionStorage.getItem('isCall');
    console.warn(isCall);
    if (isCall == 'true') {
      Content.toBottom();
    }
  },
  sendMessage: function(Msg, callback) {
    chrome.runtime.sendMessage(Msg, callback && function() {})
  },
  reciveMessage: function(callback) {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      callback && callback(message, sender, sendResponse);
    })
  },
  toBottom: function() {
    if (scrollTopCache != document.body.scrollTop || clientHeightCache != document.body.clientHeight) {
      scrollTopCache = document.body.scrollTop;
      clientHeightCache = document.body.clientHeight;
      document.body.scrollTop = document.body.clientHeight;
      setTimeout(function() {
        Content.toBottom();
      }, 500);
    } else {
      if ($('.no_more').css('display') != 'none') {
        console.log('end')
        var links = this.getLinks();
        Content.sendMessage({ data: links, type: 'content' }, function(response) {
          console.log(response);
        });
      } else {
        location.reload();
      }
    }
  },
  getLinks: function() {
    return [].filter.call(document.getElementsByTagName('a'), function(a) {
      return a.getAttribute('hrefs') != null;
    }).map(function(a) {
      return a.getAttribute('hrefs');
    })
  }
}

Content.init();

Content.reciveMessage(function(msg, sender, sendRes) {
  sendRes('Hello, I\'m content.');
  if (msg.action === 'call') {
    sessionStorage.setItem("isCall", "true");
    Content[msg.name] && Content[msg.name]();
  }
})
