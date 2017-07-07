var Util = {}

var Option = Object.create({
  container: $('.j_container'),
  init: function() {
    this.getTabs(this.renderList.bind(this));
    this.bind();
    return this;
  },
  render: function(tmpl, config) {
    return doT.template($(tmpl).html())(config || {});
  },
  bind: function() {
    var self = this;
    this.container.on('change', '#tabList', function() {
      var $this = $(this);
      self.injectJs($this.val());
    })
  },
  getTabs: function(callback) {
    chrome.tabs.query({
      windowId: chrome.windows.WINDOW_ID_CURRENT
    }, function(tabs) {
      var tabs = tabs.filter(function(item, index) {
        if (/mp.weixin.qq.com\/mp\//.test(item.url)) {
          return item;
        }
      });
      console.log(tabs);
      callback(tabs)
    })
  },
  renderList: function(tabs) {
    var html = this.render('#tmpl_tablist', {
      tabs: tabs
    })
    $('.j_head').html(html);
    return this;
  },
  injectJs: function(id) {
    chrome.tabs.executeScript(parseInt(id), {
      file: '/js/options/inject.js',
      runAt: 'document_idle'
    }, function(result) {
      console.log('result', result)
    })
  }
}).init();
