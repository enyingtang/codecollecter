/**
 * 微信统一调用接口
 * 通过meta来获取微信分享的内容
 */
(function(){
     // 获取微信设置信息
    var meta, metas = document.getElementsByTagName('meta');
    for (var i = 0, len = metas.length; i < len; i++) {
        if (metas[i].getAttribute('name') == 'sharecontent') {
            meta = metas[i];
        }
    }

    // 判断是否有输出标间，并配置分享
    if (!meta) { 
        return;
    }

    // 默认图片
    var imgs = document.getElementsByTagName('img'),
        shareImg,
        isImgUrl = /(^data:.*?;base64)|(\.(jpg|png|gif)$)/;
    for (var i = 0, len = imgs.length; i < len; i++) {
        if (isImgUrl.test(imgs[i].getAttribute('src'))) {
            shareImg = imgs[i].getAttribute('src');
            break;
        } else {
            continue;
        }
    }

   // shareImg = document.getElementById('app-logo').getAttribute('value');

    // 分享给朋友设置
    var link = window.location.href;
    var opt_msg = {
        "img_url" : meta.dataset.msgImg ,
        "link" : link,
        "desc" : meta.dataset.msgContent || document.title,
        "title" : meta.dataset.msgTitle || document.title
    };
    
    var handler_msg = {
        "urlCall" : meta.dataset.msgCallback || '',
        callback : function(res){
            if(res[0].err_msg.indexOf('cancel') == -1) {
              
                    if (handler_line.urlCall) {
                        window.location.href = handler_msg.urlCall;
                    }
                
            }
        }
    };

    // 朋友圈分享设置
    var opt_line = {
        "img_url" : meta.dataset.lineImg ,
        "link" : link,
        "desc" : meta.dataset.lineTitle || document.title ,
        "title" : meta.dataset.lineTitle || document.title 
    }; 
	
    var handler_line = {
        "urlCall" : meta.dataset.lineCallback || '',
        callback : function(res){
            if(res[0].err_msg.indexOf('cancel') == -1) {
                
                    if (handler_line.urlCall) {
                        window.location.href = handler_msg.urlCall;
                    }
                
            }
        }
    }

var tid = meta.getAttribute ('data-msg-tid') ; 

function loadXMLDoc()
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
	xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200){
	
	//console.log(xmlhttp.responseText);
				//var data =  xmlhttp.responseText;
				//alert(xmlhttp.responseText)
			var data =  eval('(' + xmlhttp.responseText + ')');
				//console.log(xmlhttp.responseText);
				//console.log(data);
				
				wx.config({
					debug:false,
					appId:data.appId,
					timestamp:data.timestamp,
					nonceStr:data.nonceStr,
					signature:data.signature,
					jsApiList: [
					 'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo'
					]
			 	}); 
						  
				
				wx.ready(function(){
						wx.checkJsApi({
						  jsApiList: [
							'onMenuShareTimeline',
							'onMenuShareAppMessage'
						  ],
						  success: function (res) {
						 //  alert(JSON.stringify(res));
						  }
						});
						
						wx.onMenuShareTimeline({
							title:  meta.dataset.lineTitle || document.title , // 分享标题
							link: link, // 分享链接
							imgUrl: meta.dataset.lineImg, // 分享图标
							success: function (data) { 
								xmlhttp.open("GET","api/index.php?a=wx&id="+tid,true);
								xmlhttp.send();
								if(meta.dataset.lineCallback){
									 window.location.href = meta.dataset.lineCallback;	
								}
							}
						});
						//分享给朋友
						wx.onMenuShareAppMessage({
							title:  meta.dataset.msgTitle || document.title,// 分享标题
							desc: meta.dataset.msgContent || document.title , // 分享描述
							link: link, // 分享链接
							imgUrl: meta.dataset.msgImg, // 分享图标
							type: '', // 分享类型,music、video或link，不填默认为link
							dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
							success: function (data) {
								
								xmlhttp.open("GET","api/index.php?a=wx&id="+tid,true);
								xmlhttp.send();
								
								if(meta.dataset.lineCallback){
									 window.location.href = meta.dataset.lineCallback;	
								}
							}
						});
						
						
						wx.onMenuShareQQ({
						title:  meta.dataset.msgTitle || document.title,// 分享标题
						desc: meta.dataset.msgContent || document.title , // 分享描述
						link: link, // 分享链接
						imgUrl: meta.dataset.msgImg, // 分享图标
						   success: function (data) {
							xmlhttp.open("GET","api/index.php?a=wx&id="+tid,true);
							xmlhttp.send();
							}
						});
						
						wx.onMenuShareWeibo({
						    title:  meta.dataset.msgTitle || document.title,// 分享标题
							desc: meta.dataset.msgContent || document.title, // 分享描述
							link: link, // 分享链接
							imgUrl: meta.dataset.msgImg, 
							success: function (res) {
								xmlhttp.open("GET","api/index.php?a=wx&id="+tid,true);
								xmlhttp.send();
						 	 }
						});
						
						
					});
					wx.error(function(res){
						//alert(res);
					});
    //document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
  }
	var u=location.href.split('#')[0];
	var u=u.replace("&","|"); 
	//alert(u)
	xmlhttp.open("GET","app_jsdk.php?url="+u,true);
	xmlhttp.send();
}

loadXMLDoc();

    // 微信设置配置
   /*	$.get("/open/interface/get_jsconfig",{url:location.href},function(data){
				
	});
	*/	 
})();


