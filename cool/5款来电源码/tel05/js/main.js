$(function(){
    var mobile   = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    var touchstart = mobile ? "touchstart" : "mousedown";
    var touchend = mobile ? "touchend" : "mouseup";
    var touchmove = mobile ? "touchmove" : "mousemove";

    //阻止屏幕滑动
    $('html,body').on(touchmove,function(e){
        e.preventDefault()
    });

    var stageW=$(window).width();
    var stageH=$(window).height();
    var musicFirst=true;
    var motionObj = {};

    //可调节的参数
    var loadingPath='images/';
    var manifest=[
        {src:loadingPath+'sharepop.png'},
        {src:loadingPath+'alert.png'},
        {src:loadingPath+'del.png'},
        {src:loadingPath+'icon.png'},
        {src:loadingPath+'icons.jpg'},
        {src:loadingPath+'load.png'},
        {src:loadingPath+'p1.jpg'},
        {src:loadingPath+'p2_1.png'},
        {src:loadingPath+'p2_2.png'},
        {src:loadingPath+'p2_3.png'},
        {src:loadingPath+'p2_4.png'},
        {src:loadingPath+'p2_5.png'},
        {src:loadingPath+'p2.jpg'},
        {src:loadingPath+'share0.jpg'},
        {src:loadingPath+'share1.jpg'},
        {src:loadingPath+'share2.jpg'},
        {src:loadingPath+'share3.jpg'},
        {src:loadingPath+'share4.jpg'},
        {src:loadingPath+'share5.jpg'},
        {src:loadingPath+'share6.jpg'},
        {src:loadingPath+'share7.jpg'},
        {src:loadingPath+'share8.jpg'},
        {src:loadingPath+'share9.jpg'},
        {src:loadingPath+'share10.jpg'},
        {src:loadingPath+'share11.jpg'},
        {src:loadingPath+'share12.jpg'},
        {src:loadingPath+'share13.jpg'},
        {src:loadingPath+'share14.jpg'},
        {src:loadingPath+'share15.jpg'},
        {src:loadingPath+'share16.jpg'},
        {src:loadingPath+'share17.jpg'},
        {src:loadingPath+'share18.jpg'}
    ];
    //可调节的参数

    var sounds = [
        {src: "di.mp3", id: 1},
        {src: "jiesuo.mp3", id: 2}
    ];
    createjs.Sound.alternateExtensions = ["ogg"];
    createjs.Sound.registerSounds(sounds, loadingPath);

    motionObj["page"] = new TimelineMax();

    //初始化阻止屏幕双击，当有表单页的时候，要关闭阻止事件，否则不能输入文字了，请传入false值，再次运行即可
    initPreventPageDobuleTap(true);

    //loading
    function handleOverallProgress(event){
        //TweenMax.to('.loadingbarmove',2,{width:Math.ceil(event.loaded*100)*2});
    }
    function handleOverallComplete(event){
        _mz_wx_view (1);//秒针监测，第一页
        TweenMax.to('.loadingbarmove',2.5,{width:200,ease:Linear.easeNone});
        TweenMax.to('.loading',.3,{scale:.4,alpha:0,delay:2.5,onComplete:function(){
            $('.loading').remove();
            createjs.Sound.play("2");
            initPageMotion();
        }});
    }

    setTimeout(function(){
        $('.blackBox').fadeOut(1000,getLoadBar);
    },1000);

    function getLoadBar(){
        $('.loading').fadeIn(500);
        var loader = new createjs.LoadQueue(false);
        loader.addEventListener("progress", handleOverallProgress);
        loader.addEventListener("complete", handleOverallComplete);
        loader.setMaxConnections(1);
        loader.loadManifest(manifest);
    }
    //loading

    var testMode=true;
    /*var testMode=getQueryString('auto');

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }*/

    //滑动事件
    var ul = document.getElementById('icons');
    var apps=['照片','百度地图','优酷视频','微信','大众点评','手机淘宝','Uber','携程旅行','新浪微博','Airbnb','网易新闻','QQ音乐','美颜相机','支付宝','QQ','京东','Instagram','Facebook','滴滴打车'];

    var st=Math.floor(Math.random()*apps.length);
    //var mt;
    //testMode ? mt="?auto=true" : mt="?auto=false";
    imgurl="http://didi.hecoe.com/images/share"+st+".jpg";
    wxDefault = {
        title: "连"+apps[st]+"都被它打败了！！",
        desc: "这是一个怎样神奇的APP！连"+apps[st]+"都被它打败了，点击查看详情 >>",
        success: function () {
        }
    };
    wxShare();

    var baoliuLi;

    function closeClick(){
        var mul=document.getElementById('icons');
        var mlis=mul.getElementsByTagName('li');
        for(var s=0;s<mlis.length;s++){
            $(mlis[s]).off(touchstart);
            $(mlis[s]).off(touchend);
        }
    }

    //初始化动画
    function initPageMotion(){
        /*自定义动画*/
        _mz_wx_view (2);//秒针监测，第2页
        motionObj['page'].add(TweenMax.from('.page1',.8,{scale:3,alpha:0,ease:Expo.easeOut,onStart:function(){
            //createjs.Sound.play("2");
        },onComplete:function(){
            if(testMode){
                var ms=createjs.Sound.play("1");
                ms.volume=0.9;
                $('.alertm').fadeIn();
                $('#alerts').on(touchstart,function(){
                    $('.alertm').fadeOut();
                    _mz_wx_custom(21);
                });

                var ul = document.getElementById('icons');
                var lis = ul.getElementsByTagName('li');
                for(var i=0;i<lis.length;i++){
                    $(lis[i]).on(touchstart,function(){
                        $(this).css('transform','scale(1.1)',
                            '-webkit-transform','scale(1.1)'
                        );
                    });

                    $(lis[i]).on(touchend,function(){

                        closeClick();

                        _mz_wx_custom(parseInt($(this).attr('num').split("e")[1])+1);
                        console.log(parseInt($(this).attr('num').split("e")[1])+1);

                        $(this).css('transform','scale(1)',
                            '-webkit-transform','scale(1)'
                        );

                        baoliuLi=$(this);
                        baoliuLi.attr('id','baoliu');

                        var tt=baoliuLi.attr('cont');
                        imgurl="http://didi.hecoe.com/images/"+baoliuLi.attr('num')+".jpg";
                        wxDefault = {
                            title: "连"+tt+"都被它打败了！！",
                            desc: "这是一个怎样神奇的APP！连"+tt+"都被它打败了，点击查看详情 >>",
                            success: function () {
                            }
                        };
                        wxShare();

                        console.log(tt,baoliuLi.attr('num'));

                        setTimeout(alertimg,600);
                    });
                }
            }else{
                setTimeout(getLi,1000);
            }
        }}));
        motionObj['page'].pause();

        /*自定义动画*/
        $(".main").fadeIn(500,function(){
            motionObj['page'].play();
        });
    }
    //初始化动画

    function alertimg(){
        $('#alertimg').attr('src','images/'+baoliuLi.attr('num')+'.jpg');
        var ms=createjs.Sound.play("1");
        ms.volume=0.9;
        $('.alerts').fadeIn();
        $('#alerta').on(touchend,function(){
            $('.alerts').fadeOut(500);
            setTimeout(alerter,1000);
            _mz_wx_custom(22);
        });
    }

    function alerter() {
        $('.alertq').fadeIn();
        var ms=createjs.Sound.play("1");
        ms.volume=0.9;

        TweenMax.to('.alertm', 3, {
            left: 300,
            onUpdate: function () {
                var b = Math.ceil((300 - parseInt($('.alertm').css('left'))) / 100);
                $('.daojishi').text(b);
            },
            onComplete: function () {
                $('.alertq').fadeOut();
                setTimeout(getLi, 800);
            },
            ease: Linear.easeNone
        })
    }

    initApps();
    function initApps(){
        for(var i in apps){
            var mli=$('<li></li>');
            var mdiv=$('<div></div>');
            mdiv.addClass('icon');
            mli.attr('cont',apps[i]);
            mli.attr('num','share'+i);
            mdiv.attr('id',i);
            mdiv.appendTo(mli);
            $(mli).append(apps[i]);
            mli.appendTo(ul);

            var dd=document.getElementById(i);
            dd.style.backgroundPosition=-94*i+'px top';
        }

        TweenMax.set('.page1_1',{scale:.2,alpha:0});
        TweenMax.set('.page2',{scale:.1,alpha:0,x:-267,y:-482});
        TweenMax.set('.page2_2',{y:20,alpha:0});
        TweenMax.set('.page2_3',{y:20,alpha:0});
        TweenMax.set('.page2_4',{y:20,alpha:0});
        TweenMax.set('.page2_5',{y:20,alpha:0});
        TweenMax.set('.page2_6',{scale:0});
        TweenMax.set('.page2_7',{y:30,alpha:0});
    }

    var liArr=[];

    function getLi(){
        _mz_wx_view (3);//秒针监测，第3页
        var lis = ul.getElementsByTagName('li');
        for(var i=0;i<lis.length;i++){

            var s=Math.floor(Math.random()*3+1);
            var xx=$('<div class="closeX"></div>');

            if($(lis[i]).attr('id')!='baoliu'){
                $(lis[i]).addClass('shake');
                $(lis[i]).addClass('shake'+s);
                xx.appendTo($(lis[i]));
                liArr.push(lis[i]);
            }
        }

        $('#ico1').addClass('shake');
        $('#ico2').addClass('shake');
        $('#ico3').addClass('shake');
        $('#ico4').addClass('shake');

        for(var j=0;j<liArr.length;j++){
            motionObj['page'].add(TweenMax.to($(liArr[j]),.2,{scale:.2,alpha:0,delay:.2,ease:Linear.easeNone,onComplete:function(){
                document.getElementById('icons').removeChild(liArr.shift());
            },onStart:function(){
                $(liArr[0]).addClass('shakes');
                $(liArr[0]).removeClass('shake');
            }
            }));
        }

        motionObj['page'].add(TweenMax.to('.page1_1',.4,{x:0,onComplete:function(){

            motionObj['page'].pause();

            $('#ico1').removeClass('shake');
            $('#ico2').removeClass('shake');
            $('#ico3').removeClass('shake');
            $('#ico4').removeClass('shake');

            var ms=createjs.Sound.play("1");
            ms.volume=0.9;
            $('.alertn').fadeIn();
            $('#alertb').on(touchstart,function(){
                _mz_wx_custom(23);
                $('.alertn').fadeOut();
                motionObj['page'].play();
            });
        }}));

        motionObj['page'].add(TweenMax.fromTo('.page1_1',1,{x:400,scale:1,alpha:0},{x:0,scale:1,alpha:1,delay:.5,ease:Bounce.easeOut,onStart:function(){
            TweenMax.to('#baoliu',.4,{x:-200,delay:.3,ease:Bounce.easeIn,onComplete:function(){
            }});
        }}));

        motionObj['page'].add(TweenMax.to('.page1_1',.5,{scale:1,alpha:1,ease:Expo.easeOut}));
        motionObj['page'].add(TweenMax.to('.page1',.6,{x:930,y:1245,scale:4,delay:.5,ease:Linear.easeNone}));
        motionObj['page'].add(TweenMax.to('.page2',.5,{x:0,y:0,scale:1,delay: -.5,alpha:1,ease:Expo.easeOut,onStart:function(){
            TweenMax.set('page2',{alpha:1});
            _mz_wx_view (4);//秒针监测，第4页
        }}));
        motionObj['page'].add(TweenMax.to('.page2_2',.6,{y:0,alpha:1,ease:Expo.easeOut}));
        motionObj['page'].add(TweenMax.to('.page2_3',.6,{y:0,alpha:1,ease:Expo.easeOut}));
        motionObj['page'].add(TweenMax.to('.page2_4',.6,{y:0,alpha:1,ease:Expo.easeOut}));
        motionObj['page'].add(TweenMax.to('.page2_5',.6,{y:0,alpha:1,ease:Expo.easeOut}));
        motionObj['page'].add(TweenMax.to('.page2_6',.6,{scale:1,ease:Back.easeOut}));

        motionObj['page'].play();
    }

    //阻止屏幕双击以后向上位移

    //当有表单页的时候，要关闭阻止事件，否则不能输入文字了
    function initPreventPageDobuleTap(isPreventPageDobuleTap){
        if(isPreventPageDobuleTap){
            $('.page').on(touchstart,function(e){
                e.preventDefault();
            })
        }else{
            $('.page').off(touchstart);
        }
    }
    //阻止屏幕双击以后向上位移

    $('.page2_8').on(touchstart,function(){
       //$('.sharemask').fadeIn();
        _mz_wx_custom(20);
        TweenMax.fromTo('.page2_7',.5,{alpha:0,y:30},{alpha:1,y:0,ease:Expo.easeOut,onComplete:function(){
            TweenMax.to('.page2_7',.5,{alpha:0,y:-20,ease:Expo.easeOut,delay:2})
        }})
    });

    //关闭浮层
    /*$('.sharemask').on(touchstart,function(){
        $(this).hide();
    })*/
});