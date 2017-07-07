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
    var pageUrl = location.href;
    $.ajax({
        url:"http://zt.house365.com/project/wh/weixin/demo/tel04/api.php",
        dataType:"jsonp",
        jsonp:"jsoncallback",
        data:{url:encodeURIComponent(pageUrl)},
        success:function(data){
            data.debug = false;
            wx.config(data);
            wx.ready(function(){
                wxShare();
            });
        }
    })
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