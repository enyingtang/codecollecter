<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
</head>
<body>
<script src='http://res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>
<script>wx.config({debug:false,appId: 'wx479541bbd35396bf',timestamp: 10000,nonceStr: 'house365',signature: '<?=$signature?>',jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']});
</script>
<div class="loading hide">
    <div class="loadingicon"></div>
    <div class="loadingbar"></div>
    <div class="loadingbarmove"></div>
</div>
<div class="main hide">
    <div class="page" id="page">

        <div class="page1">
            <div class="page1_1"><img src="images/icon.png"></div>
            <ul class="topicons" id="icons"></ul>
            <ul class="btmicons">
                <li id="ico1"><div class="ico1"></div>电话</li>
                <li id="ico2"><div class="ico2"></div>邮件</li>
                <li id="ico3"><div class="ico3"></div>Safari</li>
                <li id="ico4"><div class="ico4"></div>相机</li>
            </ul>
        </div>

        <div class="page2">
            <div class="page2_1"><img src="images/p2_1.png"></div>
            <div class="page2_2"><img src="images/p2_2.png"></div>
            <div class="page2_3"><img src="images/p2_3.png"></div>
            <div class="page2_4"><img src="images/p2_4.png"></div>
            <div class="page2_5"><img src="images/p2_5.png"></div>
            <div class="page2_6"><img src="images/p2_6.png"></div>
            <div class="page2_7"><img src="images/p2_7.png"></div>
            <div class="page2_8"></div>
        </div>

    </div>
    <div class="guideTop"></div>
    <!--<div class="sharemask hide"><img src="images/sharepop.png"></div>-->
    <div class="alertm hide"><img id="alerts" src="images/alert.png"></div>
    <div class="alertn hide"><img id="alertb" src="images/alert2.png"></div>
    <div class="alertq hide">
        <img src="images/alert3.png">
        <div class="daojishi">3</div>
    </div>
    <div class="alerts hide">
        <img id="alerta" src="images/alert4.png">
        <img id="alertimg">
    </div>
</div>
<div class="blackBox"></div>

<script type="text/javascript" src="js/setviewport.js"></script>
<script type="text/javascript" src="js/preloadjs-0.6.0.min.js"></script>
<script type="text/javascript" src="js/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="js/TweenMax.min.js"></script>
<script type="text/javascript" src="js/soundjs-0.6.0.min.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript" src="http://js.miaozhen.com/wx.1.0.js"></script>


<script>
imgurl="http://zt.house365.com/project/wh/weixin/demo/tel04/images/share5.jpg";
var wxDefault = {
    title:"连手机淘宝都被它打败了！！",
    desc:"这是一个怎样神奇的APP！连手机淘宝都被它打败了，点击查看详情 >>",
    imgUrl:imgurl,
    link:"http://zt.house365.com/project/wh/weixin/demo/tel04/",
    //link:_mz_wx_shareUrl("http://h5.hecoe.com/test"),
    success:function(){
    }
};
$(function(){
            wx.ready(function(){
                wxShare();
            });
});

function wxShare(data){
    if(typeof(wx) == "undefined"){
        return;
    }
    var newData = $.extend({},wxDefault, data);
    wx.onMenuShareAppMessage({
        title:newData.title,
        desc:newData.desc,
        //imgUrl:newData.imgUrl,
        imgUrl:imgurl,
        link:_mz_wx_shareUrl("http://didi.hecoe.com"),
        success: function(){
            _mz_wx_friend();
        }
    });

    wx.onMenuShareQQ({
        title:newData.title,
        //imgUrl:newData.imgUrl,
        imgUrl:imgurl,
        link:_mz_wx_shareUrl("http://didi.hecoe.com"),
        success: function(){
            _mz_wx_qq();
        }
    });

    wx.onMenuShareWeibo({
        title:newData.title,
        //imgUrl:newData.imgUrl,
        imgUrl:imgurl,
        link:_mz_wx_shareUrl("http://didi.hecoe.com"),
        success: function(){
            _mz_wx_weibo();
        }
    });

    wx.onMenuShareTimeline({
        title:newData.title,
        //imgUrl:newData.imgUrl,
        imgUrl:imgurl,
        link:_mz_wx_shareUrl("http://didi.hecoe.com"),
        success: function(){
            _mz_wx_timeline();
        }
    });
}
</script>

<script type="text/javascript" src="js/main.js?d=3"></script>
<script type="text/javascript" src="js/author.js"></script>

<!--监测代码，秒针提供-->
<script type="text/javascript">
    _mwx=window._mwx||{};
    _mwx.siteId=8000250;
//    _mwx.openId=xxxxxxxxxxx; //OpenID为微信提供的用户唯一标识,需要开发者传入，如果没有OpenID，去掉该代码即可。
    _mwx.debug=true;//代码调试阶段，加入此代码，正式上线之后去掉该代码
</script>
<div style="display:none;">
<script src="http://s4.cnzz.com/z_stat.php?id=1256280145&web_id=1256280145" language="JavaScript"></script></div>
</body>
</html>