/*
 * 全站公共脚本,基于jquery-1.9.1脚本库
 */
$(function() {
//阻止默认行为
	$(document).on("touchstart touchmove mousedown mousemove",function(event){
		var tag = $(event.target).parents()[0].tagName;
		var thistag = event.target.tagName;
		if ( tag != "A" && tag != "INPUT" && tag != "TEXTAREA" && tag != "SELECT" && thistag != "A" && thistag != "INPUT" && thistag != "TEXTAREA" && thistag != "SELECT"  )
		{
			event.preventDefault();
		}
	})
	

//微信分辨率纠错
	function is_weixn()
	{
	    var ua = navigator.userAgent.toLowerCase();  
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
	        return true;  
	    } else {  
	        return false;  
	    }  
	}  
	function isIos()  
	{  
       var userAgentInfo = navigator.userAgent;  
       var Agents = new Array("iPhone");  
       var flag = false;  
       for (var v = 0; v < Agents.length; v++) {  
           if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }  
       }  
       return flag;  
	}
	var fullHeight = document.documentElement.clientHeight;
	var fullWidth = $("body").width();
	if ( is_weixn() == true && isIos() == true )
	{

		if ( fullHeight >= 1008 && fullHeight <= 1040 && window.screen.width == 320 )
		{
			fullHeight = 1008;//1008---1008*(640/640)//for ios7.0&&iphone5
		}
		if ( fullHeight >= 1008 && fullHeight < 1020 )
		{
			fullHeight = 1008;//1008---1008*(640/640)
		}
		else if ( fullHeight >= 1020 && fullHeight < 1035 )
		{
			fullHeight = 1029;//1029.12---1206*(640/750)
		}
		else if ( fullHeight >= 1035 )
		{
			fullHeight = 1039;//1038.84058---1344*(640/828)
		}
		else if ( fullHeight < 1008 )
		{
			fullHeight = 832;//832---832*(640/640)
		}
	}
	$("html,body,body>.page1").height(fullHeight);
	//alert(window.screen.height +'--'+document.documentElement.clientHeight);
	//初始加载分屏动画
		var page = 0;
		mySwiper = $("#mySwiper").swiper({
			mode:"vertical",
			loop: false,
			noSwiping:true,
			noSwipingNext:true,
			noSwipingPrev:true,
			queueEndCallbacks:true,
			moveStartThreshold:10,
		    onSlideChangeEnd : function(){
		    	if ( page != mySwiper.activeIndex )
		    	{
			    	remove($("#mySwiper>.swiper-wrapper>.swiper-slide:eq("+mySwiper.previousIndex+")"));
			    	page = mySwiper.activeIndex;
					animates($(mySwiper.activeSlide()));
		    	}
		    }
		})
    //设置html
		var html = new Array();
	//移除动画后的效果
		function remove(slide)
		{
			slide.html(html[page]);
		}
	//判断动画类型
		function animates(slide)
		{
			var type = parseInt(slide.attr("data-page"));
			switch ( type )
			{
				case 1:
					page1(slide);
					break;
				case 2:
					page2(slide);
					break;
				case 3:
					page3(slide);
					break;
			}
		}
		$("body").append("<div class='page hidden' id='full'></div>");
		
	//第一屏动画
		function page1(slide)
		{
			document.getElementById("dxmusic2").play();
			var timeid = window.setInterval(function(){
				var i = parseInt(11*Math.random());
				var n = parseInt($(".icons span").eq(i).html());
				$(".icons span").eq(i).html(n + 1);
				$(".icons span").eq(i).animate({zoom:'1.1'},50);
				$(".icons span").eq(i).animate({zoom:'1'},50);
			},100);

			window.setTimeout(function(){
				document.getElementById("dxmusic2").pause();
				$(".temp3").fadeIn(10);  
				$(".zhezhao").fadeIn(10);
				$(".mm").fadeOut(10);
				$(".m1").fadeIn(100);
				document.getElementById("dxmusic").play();
			},3000);

			$(document).on("tap",".leftbtn",function(event){
				$(".temp2").fadeOut(100); 
				window.setTimeout(function(){
					$(".temp2").fadeIn(100); 
					document.getElementById("dxmusic").play();
				},500);
			});

			$(document).on("tap",".rightbtn",function(event){
				window.clearInterval(timeid);
				$(".zhezhao").fadeOut(10);
				$(".tishi").fadeOut(10);
				$(".weixin").fadeIn(10);
				
				var wxbu = 4;
				window.setTimeout(function(){
					$(".xinxi").fadeIn(10);
					$(".wx_title img").attr('src',"images/wx_title.png");
					$(".wx_title p").html('郭姐');
					$(".wx4 span").fadeOut(10);
					document.getElementById("dxmusic").play();
					$(".xx2").fadeIn(10).delay(2000).fadeOut(10,function(){

						document.getElementById("dxmusic").play();
						$(".wx_title img").attr('src',"images/wx_title.png");
						$(".wx_title p").html('tommy仔');
						$(".wx5 span").fadeOut(10);
						$(".xx4").fadeIn(10).delay(3000).animate({opacity:1},10,function(){
							$(".tishi2").fadeIn(10);
							$(".zhezhao").fadeIn(10);
						});
					});
				},500);
			});

			/*
			$(document).on("tap",".wx1",function(event){
				$(".wx_title p").html('内内内内部工作群');
				$(".wx_title img").attr('src',"images/wx_title21.png");
				$(".zhuxx").fadeOut(10);
				$(".xinxi").fadeIn(10);
				$(".xx5").fadeIn(10);
				$(".wx1 span").fadeOut(10);

				var timeid2 = window.setInterval(function(){
					var bu = parseInt($(".xx5").css('background-position-y'));
					bu = bu - 160;
					$(".xx5").animate({'background-position-y':bu + 'px'});
				},500);

				window.setTimeout(function(){
					window.clearInterval(timeid2);
					$(".tishi2").fadeIn(10);
					$(".zhezhao").fadeIn(10);
				},10000);
			});

			$(document).on("tap",".wx2",function(event){
				$(".wx_title img").attr('src',"images/wx_title.png");
				$(".zhuxx").fadeOut(10);
				$(".xinxi").fadeIn(10);
				$(".xx1").fadeIn(10);
				$(".wx2 span").fadeOut(10);
			});
			$(document).on("tap",".wx3",function(event){
				$(".wx_title p").html('老同学群');
				$(".wx_title img").attr('src',"images/wx_title.png");
				$(".zhuxx").fadeOut(10);
				$(".xinxi").fadeIn(10);
				$(".xx3").fadeIn(10);
				$(".wx3 span").fadeOut(10);
			});
			$(document).on("tap",".wx4",function(event){
				$(".wx_title p").html('郭姐');
				$(".wx_title img").attr('src',"images/wx_title.png");
				$(".zhuxx").fadeOut(10);
				$(".xinxi").fadeIn(10);
				$(".xx2").fadeIn(10);
				$(".wx4 span").fadeOut(10);
			});
			$(document).on("tap",".wx5",function(event){
				$(".wx_title p").html('tommy仔');
				$(".wx_title img").attr('src',"images/wx_title.png");
				$(".zhuxx").fadeOut(10);
				$(".xinxi").fadeIn(10);
				$(".xx4").fadeIn(10);
				$(".wx5 span").fadeOut(10);
			});
			*/
			$(document).on("tap",".rightbtn2",function(event){
				$(".temp2").fadeOut(10);
				$(".temp1 .icons_wx span").fadeOut(100);
				$(".temp4").delay(1000).fadeIn(100); 
				document.getElementById("dxmusic").play();
				$(".zhifubaotishi").fadeIn(10);
				$(".fuceng").fadeIn(10);
			});
			
			window.m_bu = 2;
			$(document).on("tap",".leftbtn2",function(event){
				$(".mm").fadeOut(10);
				$(".zhezhao").fadeOut(10);
				$(".message").fadeOut(10);
				if(m_bu < 3){
					$(".zhezhao").delay(500).fadeIn(10);
					$(".message").delay(500).fadeIn(10);
					$(".m" + m_bu).delay(500).fadeIn(100);
					document.getElementById("dxmusic").play();
					m_bu = m_bu + 1;
				}else{
					$(".temp3").fadeOut(10);
					$(".temp1 .icons_message span").fadeOut(100);
					$(".temp2").delay(500).fadeIn(100);
					$(".zhezhao").fadeIn(10);
					document.getElementById("dxmusic").play();
				}
			});
			

			$(document).on("tap",".sq3",function(event){
				$(".fuceng").fadeIn(10);
				$(".zhifu").fadeIn(10);
				$(".querenzhifu").fadeOut(10);
				$(".zhifubaotuichu").fadeIn(10);

				window.setTimeout(function(){
					$(".temp1").fadeOut(10);
					$(".temp4").fadeOut(10);
					$(".temp1 .icons_zfb span").fadeOut(100);
					$(".temp6").delay(1000).fadeIn(100);
					document.getElementById("ldmusic").play();
				},2000);
			});

			$(document).on("tap",".sq2",function(event){
				$(".sq2").fadeOut(10);
			});

			$(document).on("tap",".zt3",function(event){
				$(".zhifu").fadeOut(10);
				$(".querenzhifu").fadeIn(10);
			});
			
			$(document).on("tap",".zs3",function(event){
				$(".zhifubaotishi").fadeOut(10);
				$(".fuceng").fadeOut(10);
				$(".shenqingzhifu").fadeIn(10);
			});
			/*
			$(document).on("tap",".qf3",function(event){
				$(".zhifu").fadeIn(10);
				$(".querenzhifu").fadeOut(10);
				$(".zhifubaotuichu").fadeIn(10);

				window.setTimeout(function(){
					$(".temp1").fadeOut(10);
					$(".temp4").fadeOut(10);
					$(".temp1 .icons_zfb span").fadeOut(100);
					$(".temp6").delay(1000).fadeIn(100);
					document.getElementById("ldmusic").play();
				},2000);
			});
			*/
			
			$(document).on("tap",".zc3",function(event){ 
				$(".temp1").fadeOut(10);
				$(".temp4").fadeOut(10);
				$(".temp1 .icons_zfb span").fadeOut(100);
				$(".temp6").delay(1000).fadeIn(100);
				document.getElementById("ldmusic").play();
			});
			/*
			$(document).on("tap",".mm3",function(event){
				$(".momo_tishi").fadeOut(10);
				$(".fuceng2").fadeOut(10);
				$(".momo_xinxi").fadeIn(10);
			});
			
			$(document).on("tap",".mx2",function(event){
				$(".momo_mes").fadeIn(10);
			});

			$(document).on("tap",".ms1",function(event){
				$(".momo_mes").fadeOut(10);
				$(".mx2 span").fadeOut(10);
				window.setTimeout(function(){
					$(".momo_tuichu").fadeIn(10);
					$(".fuceng2").fadeIn(10);
				},1000);
			});
			$(document).on("tap",".mc3",function(event){
				$(".temp5").fadeOut(10);
				$(".temp1").fadeOut(10);
				$(".temp1 .icons_mm span").fadeOut(100);
				$(".temp6").delay(1000).fadeIn(100);
				document.getElementById("ldmusic").play();
			});
			*/

			$(document).on("tap",".cl2",function(event){
				$(".temp1").fadeIn(10);
				$(".temp6").fadeOut(10);
				window.setTimeout(function(){
					$(".temp6").fadeIn(10);
					$(".temp1").fadeOut(10);
				},1000);
			});
			
			$(document).on("tap",".cl3",function(event){
				document.getElementById("ldmusic").pause();
				document.getElementById("dianhua").play();
				$(".cl2").fadeOut(10);
				$(".cl3").fadeOut(10);
				$(".cl4").fadeIn(10);
				$(".cl5").fadeIn(10);
				window.setTimeout(function(){
					if(!guaduan){
						$(".call_tishi").fadeOut(10);
						document.getElementById("luanting").play();
						$(".luantan").fadeIn(500);
						$(".lt1").delay(200).fadeIn(100);
						$(".lt8").delay(400).fadeIn(100);
						$(".lt6").delay(600).fadeIn(100);
						$(".lt4").delay(800).fadeIn(100);
						$(".lt5").delay(1000).fadeIn(100);
						$(".lt3").delay(1200).fadeIn(100);
						$(".lt7").delay(1400).fadeIn(100);
						$(".lt2").delay(1600).fadeIn(100);
						$(".lt9").delay(1800).fadeIn(100);
						$(".lt10").delay(2000).fadeIn(100);
						$(".lt11").delay(2200).fadeIn(100);
						$(".lt12").delay(2400).fadeIn(100);
						$(".lt14").delay(2600).fadeIn(100);
						$(".lt13").delay(2800).fadeIn(100);
						$(".lt16").delay(3000).fadeIn(100);
						$(".lt15").delay(3200).fadeIn(100);
						$(".lt17").delay(3400).fadeIn(1500);
						window.setTimeout(function(){
							document.getElementById("luanting").pause();
							document.getElementById("dianhua").pause();
							$(".temp6").fadeOut(1000);
							$(".temp7").fadeIn(1000);
							$(".jingjing_tishi").fadeIn(2000,function(){
								document.getElementById("zhuti").play();
							});
						},6000);
					}
				},16000);
			});
			var guaduan = false;
			$(document).on("tap",".cl4",function(event){
				guaduan = true;
				$(".call_tishi").fadeOut(10);
				document.getElementById("luanting").play();
				$(".luantan").fadeIn(500);
				$(".lt1").delay(200).fadeIn(100);
				$(".lt8").delay(400).fadeIn(100);
				$(".lt6").delay(600).fadeIn(100);
				$(".lt4").delay(800).fadeIn(100);
				$(".lt5").delay(1000).fadeIn(100);
				$(".lt3").delay(1200).fadeIn(100);
				$(".lt7").delay(1400).fadeIn(100);
				$(".lt2").delay(1600).fadeIn(100);
				$(".lt9").delay(1800).fadeIn(100);
				$(".lt10").delay(2000).fadeIn(100);
				$(".lt11").delay(2200).fadeIn(100);
				$(".lt12").delay(2400).fadeIn(100);
				$(".lt14").delay(2600).fadeIn(100);
				$(".lt13").delay(2800).fadeIn(100);
				$(".lt16").delay(3000).fadeIn(100);
				$(".lt15").delay(3200).fadeIn(100);
				$(".lt17").delay(3400).fadeIn(1500);
				window.setTimeout(function(){
					document.getElementById("luanting").pause();
					document.getElementById("dianhua").pause();
					$(".temp6").fadeOut(1000);
					$(".temp7").fadeIn(1000);
					$(".jingjing_tishi").fadeIn(2000,function(){
						document.getElementById("zhuti").play();
					});
				},6000);
			});
			
			$(document).on("tap",".js2",function(event){
				$(".jingjing_tishi").fadeOut(10);
				$(".fengdi_box").fadeIn(10);
				$(".fd1").fadeIn(1000);
				$(".fd2").delay(1500).fadeIn(2000);
				$(".fd3").delay(3000).fadeIn(2000);
				$(".fd4").delay(4500).fadeIn(2000);
				$(".fd5").delay(6000).fadeIn(2000);
				$(".fd6").delay(7500).fadeIn(2000);
				$(".fd7").delay(9000).fadeIn(2000);
				$(".fd8").delay(10500).fadeIn(2000);
				window.setTimeout(function(){
					$(".1pg").removeClass("swiper-no-next");
					$(".shang").fadeIn(200);
				},11000);
			});
		}
		function page2(slide)
		{
			$(".temp7").fadeOut(1000);
			$(".temp1").fadeIn(1000);
			$(".temp8").fadeIn(1000);
			$(".logo1").delay(1000).fadeIn(1000);
			$(".fengdi3").delay(2000).fadeIn(1000);
			$(".fengdi4").delay(3000).fadeIn(1000);
			$(".logo2").delay(4000).animate({bottom:'4%'},500);
		}
		function page3(slide)
		{
			window.location.href = "http://www.innokids.cn/case/paul/nbh5/";
		}
		

	//加载成功
		window.onload = function()
		{
			loadImage();
		}

			var imgList = ['./images/page_bg2.jpg'];

			function loadImage() {
				var imgSize = imgList.length, loadnum = 0;
				var pic = [];
				//图片加载完毕执行方法
				function imagesLoad(){
					loadnum++;
					var shu = parseInt(loadnum/imgSize*100);
					$(".progress").html(shu+"%");

					// return false;
					if(loadnum == pic.length){
					   $("body").removeClass("loading");
						loadend();
					}
				}
				for (var i = 0; i < imgSize; i++) {

					pic[i] = new Image();
					pic[i].src = imgList[i];
					pic[i].onload = function(){
						imagesLoad();
					}
					pic[i].onerror = function(){
						imagesLoad();
						//alert("图片加载失败");
					}
				}
				
			}
		function loadend(){
			$(".loading-wrapper").remove();
			$("#mySwiper").css({"visibility":"visible",y:fullHeight});
			$("#mySwiper").transition({y:0,complete:function(){
				animates($("#mySwiper .swiper-slide:first"));
				//mySwiper.swipeTo(10,600);
			}},100);
		}

		//背景音乐开关
		$(".mc").on("tap",function(){
			if ( $(this).hasClass("play") )
			{
				$(this).removeClass("play");
				document.getElementById("bgmusic").pause();
				$(".yinyue").attr('src',"images/music_off.png");
			}
			else
			{
				$(this).addClass("play");
				document.getElementById("bgmusic").play();
				$(".yinyue").attr('src',"images/music_on.png");
			}
		})

		function getPar(par){
			//获取当前URL
			var local_url = document.location.href; 
			//获取要取得的get参数位置
			var get = local_url.indexOf(par +"=");
			if(get == -1){
				return false;   
			}   
			//截取字符串
			var get_par = local_url.slice(par.length + get + 1);    
			//判断截取后的字符串是否还有其他get参数
			var nextPar = get_par.indexOf("&");
			if(nextPar != -1){
				get_par = get_par.slice(0, nextPar);
			}
			return get_par;
		}
})