var url = location.href;

function queryToJSON(str) {
  var param = str.split('&');
  var result = {};
  param.forEach(function(item, index) {
    var pair = item.split(/\b=\b/);
    result[pair[0]] = decodeURIComponent(pair[1]);
  })
  console.log(result);
  return result;
}

function JSONToQuery(obj) {
  var str = '';
  var startMsgID = attr($('.msg_list [msgid]'), 'msgid');
  console.log(startMsgID);
  var o = {
    __biz: obj.__biz,
    uin: obj.uin,
    key: obj.key,
    f: 'json',
    frommsgid: startMsgID,
    count: 10,
    pass_ticket: obj.pass_ticket,
    wxtoken: '',
    x5: 0
  }
  for (var name in o) {
    str += name + '=' + encodeURIComponent(o[name]) + '&';
  }
  console.log(str);
  return '?' + str;
}

function createXHR() {
  return new XMLHttpRequest();
}

function $(selector, all) {
  return all ? document.querySelectorAll(selector) : document.querySelector(selector);
}

function attr(dom, name, value) {
  return value ? dom.setAttribute(name, value) : dom.getAttribute(name);
}

var data = JSONToQuery(queryToJSON(location.search.replace(/^\?/, '')));

var xhr = createXHR();
xhr.onreadystatechange = ajax;
xhr.open("get", 'https://mp.weixin.qq.com/mp/getmasssendmsg' + data, true);
xhr.send(null);

function ajax() {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      dealData(xhr.responseText);
    } else {
      console.log('Request was unsuccessful: ' + xhr.status);
    }
  }
}

function dealData(data) {
  var json = JSON.parse(data);
  var dataDb = JSON.parse(json.general_msg_list);
  console.log(dataDb);
}
