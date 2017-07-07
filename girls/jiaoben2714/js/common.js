// 常用方法脚本
/*====================================
*架构：基于JQuery 1.8.1主框架
*作者：张元连
*时间：2014年6月5日
====================================*/
//验证是否有此ID
function exist(id) {
    var s = document.getElementById(id);
    if (s) {
        return true;
    }
    else {
        return false;
    }
}
//判断空格
function checkkongge(obj) {
    if (obj.length == 0)
        return false;
    else
        return true;
}
//===========================点击类函数============================
$(function () {
    if (exist("channel_ChID") && exist("channel_ID")) {
        var ChID = $("#channel_ChID").val();
        var ids = $("#channel_ID").val();
        $.ajax({
            type: "get",
            url: "http://www.askci.com/tools/getclick.ashx?jsoncallback=?",
            dataType: "jsonp",
            data: { "chid": ChID, "id": ids },
            //dataType: "jsonp",      //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            //jsonp: "jsoncallback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            //jsonpCallback: "?",     //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function (data) {
                if (data.status == "-1") {
                    //alert("参数不正确无法提交,请重新提交.");
                } else {
                    //alert(data);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //alert("状态：" + textStatus + ";出错提示：" + errorThrown);
            },
            timeout: 20000
        })
    }
})
//===========================加入购物车============================
function addShoppingCar(chid,id) {
    if (chid != "" && id != "") {
        $.ajax({
            type: "get",
            url: "http://www.askci.com/tools/addShopCart.ashx?jsoncallback=?",
            data: { "chid": chid, "id": id },
            dataType: "jsonp",
            success: function (data) {
                if (data.context == "-1") {
                    alert("参数不正确无法提交,请刷新该页面重新提交.");
                } else {
                    if (confirm("加入购物车成功,是否前往购物车")) {
                        window.location = "http://www.askci.com/user/shopCart/";
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("状态：" + textStatus + ";出错提示：" + errorThrown);
            },
            timeout: 20000
        })
    }
}
//===========================搜索类函数============================
$(function () {
    $("#search").keydown(function (event) {
        if (event.keyCode == 13) {  //enter键
            $("#searchbtn1").click(); //激发搜索
        }
    });
   $("#search").focus(function(){
	          var getvalue=$(this).val();
	          if (getvalue == "请输入您要搜索的内容" || getvalue == "請輸入您要搜索的內容") {
				  $(this).val("").css("color","#333333");
			  }
	});
	$("#search").blur(function(){
		var getvalue=$(this).val();
		if(getvalue.length==0){
			$(this).val("请输入您要搜索的内容").css("color","#8e8e8e");
		}
	})
	$("#searchcontext").focus(function(){
	          var getvalue=$(this).val();
	          if (getvalue == "请输入您要搜索的内容" || getvalue == "請輸入您要搜索的內容") {
				  $(this).val("").css("color","#333333");
			  }
	});
	$("#searchcontext").blur(function(){
		var getvalue=$(this).val();
		if(getvalue.length==0){
			$(this).val("请输入您要搜索的内容").css("color","#8e8e8e");
		}
	})
		$("#reportsWord").focus(function(){
	          var getvalue=$(this).val();
	          if (getvalue == "请输入您要搜索的内容" || getvalue == "請輸入您要搜索的內容") {
				  $(this).val("").css("color","#333333");
			  }
	});
	$("#reportsWord").blur(function(){
		var getvalue=$(this).val();
		if(getvalue.length==0){
			$(this).val("请输入您要搜索的内容").css("color","#8e8e8e");
		}
	})
    $("#searchcontext").keydown(function (event) {
        if (event.keyCode == 13) {
            $("#searchbtn1").click(); //激发搜索
        }
    });
    $("#reportsWord").keydown(function (event) {
        if (event.keyCode == 13) {
            $("#reportsbtn").click(); //激发搜索
        }
    });
    $("#searchbox").keydown(function (event) {
        if (event.keyCode == 13) {
            $("#searchbtn").click(); //激发搜索
        }
    });
    $("#searchcontextIndex").keydown(function (event) {
        if (event.keyCode == 13) {
            $("#searchbtn").click(); //激发搜索
        }
    });
})
//报告列表导航旁边搜索
function SearchBaogao2() {
    var searchValues = $("#searchbox").val();
    if (searchValues == "") {
        alert("请输入关键词")
        return false;
    }
    else if (!checkkongge(searchValues)) {
        alert("请输入关键词")
        return false;
    }
    else if (IsFilterKey(searchValues)) {
        alert("请输入其他关键词");
        return false;
    }
    else {
        window.location.href = "http://www.askci.com/search/1/baogao/" + encodeURI(searchValues) + "/";
    }
}
//研究报告首页中间搜索
function SearchBaogao1() {
    var searchValues = $("#reportsWord").val();
    if (searchValues == "") {
        alert("请输入关键词")
        return false;
    }
    else if (!checkkongge(searchValues)) {
        alert("请输入关键词")
        return false;
    }
    else if (IsFilterKey(searchValues)) {
        alert("请输入其他关键词");
        return false;
    }
    else {
        window.location.href = "http://www.askci.com/search/1/baogao/" + encodeURI(searchValues) + "/";
    }
}
//搜索1
function SearchCommon(values) {
    var searchValues = $("#search").val();
    if (values == "") {
        values = "baogao";
    }
    if (searchValues == "") {
        alert("请输入关键词")
        return false;
    }
    else if (!checkkongge(searchValues)) {
        alert("请输入关键词")
        return false;
    }
    else if (IsFilterKey(searchValues)) {
        alert("请输入其他关键词");
        return false;
    }
    else {
        if (values == "baogao") {
            window.location.href = "http://www.askci.com/search/1/" + values + "/" + encodeURI(searchValues) + "/";
        } else {
            window.location.href = "http://www.askci.com/common/search/1/" + values + "/" + encodeURI(searchValues) + "/";
        }
    }
}
//搜索2
function SearchCommon1(values) {
    var searchValues = $("#searchcontext").val();
    if (values == "") {
        values = "baogao";
    }
    if (searchtxt == "") {
        alert("请输入关键词")
        return false;
    }
    else if (!checkkongge(searchValues)) {
        alert("请输入关键词")
        return false;
    }
    else if (IsFilterKey(searchValues)) {
        alert("请输入其他关键词");
        return false;
    }
    else {
        if (values == "baogao") {
            window.location.href = "http://www.askci.com/search/1/" + values + "/" + encodeURI(searchValues) + "/";
        } else {
            window.location.href = "http://www.askci.com/common/search/1/" + values + "/" + encodeURI(searchValues) + "/";
        }
    }
}
//首页搜索
function SearchIndex() {
    var name = $("#hiddname").val();
    var searchtxt = $("#searchcontextIndex").val();
    if (searchtxt == "") {
        alert("请输入关键词")
        return false;
    }
    else if (!checkkongge(searchtxt)) {
        alert("请输入关键词")
        return false;
    }
    else if (IsFilterKey(searchtxt)) {
        alert("请输入其他关键词");
        return false;
    }
    else {
        if (name == "") {
            name = "baogao";
        }
        if (name == "baogao") {
            window.location.href = "http://www.askci.com/search/1/" + name + "/" + encodeURI(searchtxt) + "/";
        } else {
            window.location.href = "http://www.askci.com/common/search/1/" + name + "/" + encodeURI(searchtxt) + "/";
        }
    }
}
function IsFilterKey(obj) {
    var filterKeys = "行业|行業|研究报告|研究報告|报告|報告|中国|市场|市場|研究|分析|投资|调查|调研|咨询|前景|预测|关键字|關鍵字|"; //过滤的搜索关键字,以"|"分隔
    var _array = filterKeys.split("|");
    for (var i = 0; i < _array.length; i++) {
        if (obj == _array[i])
            return true;
    }
    return false;
}
//===========================手机访问============================
/* 手机访问 */
function Phonebrowser(xurl) {
    //    var bs = {
    //        versions: function () {
    //            var u = navigator.userAgent, app = navigator.appVersion;
    //            //alert(navigator.userAgent);
    //            return {//移动终端浏览器版本信息
    //                trident: u.indexOf('Trident') > -1, //IE内核
    //                presto: u.indexOf('Presto') > -1, //opera内核
    //                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    //                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
    //                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
    //                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    //                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    //                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
    //                iPad: u.indexOf('iPad') > -1, //是否iPad
    //                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    //            };
    //        } (),
    //        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    //    }

    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    var xCookies = getCookie("xsite");

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        if (xCookies != "pc") {
            window.location.href = xurl;
        }
    }
}
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;domain=askci.com";
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}  