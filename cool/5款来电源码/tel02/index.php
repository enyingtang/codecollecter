<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>7.21 让爱更易到</title>
    <!--<link rel="icon" type="image/GIF" href="res/favicon.ico"/>-->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="full-screen" content="yes"/>
    <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>
    <script src="http://game.cocos2d-js.cn/Public/jquery.min.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script>
        /**
         * Created by Willar_mini_Mac_003 on 2015/3/11.
         */
        /*
         * 注意：
         * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
         * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
         * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html

         *
         * 如有问题请通过以下渠道反馈：
         * 邮箱地址：weixin-open@qq.com
         * 邮件主题：【微信JS-SDK反馈】具体问题
         * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
         */
        wx.config({
            appId: 'wxfdfb61341a0c51da',
            timestamp: 1437717398,
            nonceStr: 'CAva4vzVsG5fpfau',
            signature: 'c73df093925d5f9a0a7c80085dd10103f2362ffe',
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              "onMenuShareTimeline",
              "onMenuShareAppMessage"
            ]
          });
        /***
        wx.error(function(res){
            for ( i in res) {
                alert(i + "||" + res[i]);
            }

        });
		***/

        var shareData = {
            desc: '所有努力，只为让爱更易到！', // 分享标题
            title: '7.21 让爱更易到', // 分享描述
            link: 'http://html5.cocos2d-js.cn/ydyc/yd_721', // 分享链接
            imgUrl: 'http://wx.willar.net/sharelogo/ydyc_721_sharelogo.png'  // 分享图标
        };

        wx.ready(function () {
            // 在这里调用 API
            wx.onMenuShareTimeline({
                title: shareData.desc, // 分享标题
                link: shareData.link, // 分享链接
                imgUrl: shareData.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    // alert("share success");
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // alert("share canceled");
                }
            });

            wx.onMenuShareAppMessage({
                title: shareData.title, // 分享标题
                link: shareData.link, // 分享链接
                desc: shareData.desc, // 分享描述
                imgUrl: shareData.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    // alert("share success");
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // alert("shareF canceled");
                }
            });
        });
</script>
    <style>
        body, canvas, div {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
    </style>
</head>
<body style="padding:0; margin: 0; background: #000;">
<canvas id="gameCanvas"></canvas>
<audio id="bgAudio" src = "res/bg_music.mp3" loop preload type="audio/mp3"></audio>

<script cocos src="game.min.js"></script>

</body>
</html>
