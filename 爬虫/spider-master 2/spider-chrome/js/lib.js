var backgroundConnector = function(){
	this.cache = null;//chrome extention connect object
	this.name = null;//connect name
	this.onConnect = null;//function
	this.onDisConnect = null;//function
	//接收消息
	this.onMessage = function(fn){
		if(this.cache != null){
			var port = this.cache;
			if(port.name==this.name){
				port.onMessage.addListener(function(msg){
					fn(msg);
				});
			}
		}
	};
	//发送消息
	this.send = function(msg){
		if(this.cache != null){
			var port = this.cache;
			if(port.name==this.name){
				port.postMessage(msg);
			}
		}
	};
	//初始化
	this.init = function(fn){
		var This = this;
		chrome.extension.onConnect.addListener(function(port){
			This.cache = port;
			if(port.name==This.name){
				port.onDisconnect.addListener(function(){
					This.cache = null;
					if(typeof(This.onDisConnect)=="function")
						This.onDisConnect();
				});
				port.onMessage.addListener(function(msg){
					fn(msg)	;
				});
			}
			port.postMessage({act:"connected"});
		});
	};
};

var mainConnector = function(){
	this.cache=null;//chrome extention connect object
	this.name=null;//connect name
	//初始化
	this.init=function(){
		console.log(this);
		var port = chrome.extension.connect({name:this.name});
		this.cache = port;
	};
	//发送消息
	this.send=function(msg){
		
		if(this.cache != null){
			var port = this.cache;
			port.postMessage(msg);
		}
	};
	//接收消息
	this.onMessage=function(fn){
		if(this.cache != null){
			var port = this.cache;
			if(port.name==this.name){
				port.onMessage.addListener(function(msg){
					fn(msg);
				});
			}
		}
	};
};


var Settings = {};//localstorage配置信息

Settings.configCache = {};

Settings.setValue = function setValue(key, value) {
    Settings.configCache[key] = value;

    var config = {};
    if (localStorage.config)
        config = JSON.parse(localStorage.config);

    config[key] = value;
    localStorage.config = JSON.stringify(config);
    return value;
};

Settings.getValue = function getValue(key, defaultValue) {
    if (typeof Settings.configCache[key] != "undefined")
        return Settings.configCache[key];

    if (!localStorage.config)
        return defaultValue;

    var config = JSON.parse(localStorage.config);
    if (typeof config[key] == "undefined")
        return defaultValue;

    Settings.configCache[key] = config[key];
    return config[key];
};

Settings.keyExists = function keyExists(key) {
    if (!localStorage.config)
        return false;

    var config = JSON.parse(localStorage.config);
    return (config[key] != undefined);
};

Settings.setObject = function setObject(key, object) {
    localStorage[key] = JSON.stringify(object);
    return object;
};

Settings.getObject = function getObject(key) {
    if (localStorage[key] == undefined)
        return undefined;

    return JSON.parse(localStorage[key]);
};



// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  


