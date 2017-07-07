var links;

$('.get_list').click(function() {
  console.log('h-begin')
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'call', name: 'toBottom' }, function(response) {
      console.log(response);
    })
  });
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message);
    if (message.type != 'content') return;
    console.log(sender);
    sendResponse('Hello, I recived links.');
    localStorage.setItem("links", JSON.stringify(message.data));
  });
})
$('.show_record').click(function() {
  links = localStorage.getItem("links");
  links = JSON.parse(links);
  $('.all').html('共有' + links.length + '条记录')
})
$('.test_down').click(function() {
  chrome.runtime.sendMessage({ type: 'popup', data: links.splice(1, 3) }, function(response) {
    console.log(response);
  });
})
$('.save_all_page').click(function() {
  chrome.runtime.sendMessage({ type: 'popup', data: links }, function(response) {
    console.log(response);
  });
})
