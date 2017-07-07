<?php
header("Content-Type:text/html;charset=gb2312");
require_once("./public.php");  //加载方法
//合肥热线
 $appid="wx7f7bbdcd99e6fe8a";
 $jsapi_ticket = getcontents("http://weixin.hefei.cc/games/api/ticketapi.php");
//生成分享秘钥
$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$timestamp = time();
$nonceStr = "heka".rand(1,1000)."string";
$string = "jsapi_ticket=".$jsapi_ticket."&noncestr=".$nonceStr.'&timestamp='.$timestamp."&url=$url";
$signature = sha1($string);
 echo $shareScript='<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script><script type="text/javascript">
window.shareData = {
        "imgUrl": "http://zt.hf.house365.com/ahzy/nvshen/images/dt.jpg",
        "sendFriendLink": "http://zt.hf.house365.com/ahzy/nvshen/index.php",
        "tTitle": "女神来袭，我在这里等你！",
        "tContent":"这一刻，你一定希望自己是单身~"
    };
    wx.config({
        debug: false, 
        appId: "'.$appid.'", 
        timestamp: '.$timestamp.',
        nonceStr:  "'.$nonceStr.'",
        signature: "'.$signature.'",
        jsApiList: ["onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
			"chooseImage",
			"uploadImage"
			]
    });
    
    wx.ready(function (res) {
         //分享到朋友圈
        wx.onMenuShareTimeline({
            title: window.shareData.tTitle, // 分享标题
            link: window.shareData.sendFriendLink, // 分享链接
            imgUrl: window.shareData.imgUrl, // 分享图标
            success: function (res) {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: window.shareData.tTitle, // 分享标题
            desc: window.shareData.tContent, // 分享描述
            link: window.shareData.sendFriendLink, // 分享链接
            imgUrl: window.shareData.imgUrl, // 分享图标
            success: function (res) {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函
            }
        });
        //分享到qq
        wx.onMenuShareQQ({
            title: window.shareData.tTitle, // 分享标题
            desc: window.shareData.tContent, // 分享描述
            link: window.shareData.sendFriendLink, // 分享链接
            imgUrl: window.shareData.imgUrl, // 分享图标
            success: function (res) {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享到微博
        wx.onMenuShareWeibo({
            title: window.shareData.tTitle, // 分享标题
            desc: window.shareData.tContent, // 分享描述
            link: window.shareData.sendFriendLink, // 分享链接
            imgUrl: window.shareData.imgUrl, // 分享图标
            success: function (res) {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });



</script>';
?>