<!DOCTYPE html>
<html>
<head>
<meta charset="gb2312">
<meta name="viewport" content="target-densitydpi=device-dpi,width=750,user-scalable=0" />
<title>女神来袭，我在这里等你！</title>
<?php
require_once("share.php");
?>
<link rel="stylesheet" type="text/css" href="css/animate.min.css">
<link rel="stylesheet" type="text/css" href="css/qixi.css?v=67">
</head>
<body>
	<div id="loading">
		<p style="font-size:42px">别着急，女神马上就到...</p>
	</div>
	<div class="main">
		<div class="section" id="p-index">
			<div class="time">
				<strong></strong>
				<span>8月20日 星期四</span>
			</div>
			<ul class="weixin"></ul>
			<div class="slide" id="slideIndex" style="display:none">
				<p>滑动来解锁</p>
			</div>
			<div class="bottom"></div>
			<div class="camera"></div>
		</div>
		<div class="section animated slideInLeft after" id="p-chat">
			<div id="chatImg" style="width:100%;opacity:0.8;height:100%;position:fixed;z-index:1000;top:0;left:0;transition:all 0.5s ease-in-out;transform:translateY(-100%);-webkit-transform:translateY(-100%)">
				<span id="chatImgSpan"><img src="images/11.jpg" /></span>
				<div style="width:138px;height:138px;background:url(images/2.png);position:absolute;top:2px;left:420px;pointer-events:none;-webkit-animation:p-chat-input 2s infinite;animation:p-chat-input 2s infinite">
				</div>
			</div>
			<div class="scroll">
				<div class="time">短信/彩信</div>
				<div>
					<img src="images/22.jpg" />
					<span id="sendWordSpan" style="display:none"><img src="images/33.jpg" /></span>
				</div>
			</div>
			<div class="bar after" style="z-index:1000">
				<span class="icon-1"></span>
				<div class="input"><p id="noYou"></p></div>
				<span style="width:90px;font-size:30px;color:#02cb47;text-align:center;line-height:56px">
					发送
				</span>
				<div id="wordSend" style="width:138px;height:138px;background:url(images/1.png);position:absolute;top:-18px;right:-10px;-webkit-animation:p-chat-input 2s infinite;animation:p-chat-input 2s infinite;display:none" onClick="wordSendClick();">
				</div>
			</div>
			<div class="area">
				<span><img src="images/44.jpg" /></span>
			</div>
		</div>
		<div class="section animated slideInLeft" id="p-weixin-1">
			<div id="weixin-1-max" style="width:100%;height:100%;position:absolute;top:0;left:0;background:#000;opacity:0.6;z-index:100;display:none;"></div>
			<div id="weixin-1-tk" style="width:60%;position:absolute;background:#fff;border-radius:6px;z-index:101;text-align:center;top:50%;margin-top:-220px;left:50%;margin-left:-30%;font-size:32px;display:none">
				<ul>
					<li style="padding:60px 0">
						女神来电话了！
					</li>
					<li style="padding:40px 0;color:#007aff;border-top:#e5e5e5 1px solid" id="gouwucheOk">
						接听
					</li>
				</ul>
			</div>
			<div id="daojishi" style="width:30%;position:absolute;top:40%;left:40%;font-size:240px;z-index:100;color:#e4e4e4;display:none">
				5
			</div>
			<div class="scroll">
				<img src="images/55.jpg" />
			</div>
		</div>
		<div class="section animated slideInLeft" id="p-weixin-2">
			<div id="weixin-2-max" style="width:100%;height:100%;position:absolute;top:0;left:0;background:#000;opacity:0.6;z-index:100;display:none;"></div>
			<div id="weixin-2-tk" style="width:60%;position:absolute;background:#fff;border-radius:6px;z-index:101;top:50%;margin-top:-300px;left:50%;margin-left:-30%;display:none">
				<ul>
					<li style="padding:20px 0;">
						<img style="margin:0 auto" src="images/66.jpg" />
					</li>
					<li style="padding:20px 0;color:#007aff;border-top:#e5e5e5 1px solid" id="gouwucheOk">
						<img style="margin:0 auto" src="images/77.jpg" />
					</li>
				</ul>
			</div>
			<div class="scroll">
				<img src="images/88.jpg" />
			</div>
		</div>
		<div class="section animated slideInLeft" style="background:#141414;" id="p-weixin-3">
			<div class="scroll">
				<div>
					<ul>
						<li><img src="images/99.jpg" /></li>
						<li style="margin-top:480px"><img src="images/00.jpg" /></li>
						<li id="playArea">
							<img src="images/001.jpg" />
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="section animated slideInLeft" id="p-weixin-4">
			<div class="scroll">
				<img src="images/220.jpg" />
			</div>
		</div>
		<div class="section animated slideInLeft" id="p-weixin-5">
			<div class="scroll">
				<ul>
					<li>
						<img src="images/330.jpg" />
					</li>
					<li>
						<img src="images/440.jpg" />
					</li>
					<li style="margin-top:30px">
						<a href="http://mp.weixin.qq.com/s?__biz=MzA4MjQ3MDIzNA==&mid=207326554&idx=1&sn=483ad8dd24723682d63005cddf937398#rd" id="jump_url"><img style="margin:0 auto" src="images/550.png" /></a>
					</li>
					<li style="margin-top:30px">
						<a href="tel:055165538888"><img style="margin:0 auto" src="images/660.png" /></a>
					</li>
				</ul>
				<p style="width:100%; text-align:center; height: 65px; margin-top: 20px;line-height: 65px; font-size:24px;color:#FFFFFF;">Powered by: 365淘房</p>
			</div>
		</div>
	</div>
	
	<audio preload="load" src="http://taofen8image.oss-cn-hangzhou.aliyuncs.com/qixi-1.mp3" id="audio-1"></audio>
	<audio preload="load" src="http://taofen8image.oss-cn-hangzhou.aliyuncs.com/qixi-2.mp3" id="audio-2"></audio>
	<audio preload="load" src="http://taofen8image.oss-cn-hangzhou.aliyuncs.com/qixi-3.mp3" id="audio-3"></audio>
	<audio preload="load" src="http://zt.hf.house365.com/ahzy/nvshen/images/m.m4a" id="audio-4"></audio>
	
	<script src="js/jquery-2.1.3.min.js"></script>
	<script src="js/jquery.imgpreload.min.js"></script>
	<script src="js/touch.js"></script>
	<script src="js/qixi.js?v=31"></script>
	<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">

function signatureJsonCallback(result) {
	wx.config({
		debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId : result.appId, // 必填，公众号的唯一标识
		timestamp : result.timestamp, // 必填，生成签名的时间戳
		nonceStr :  result.nonceStr, // 必填，生成签名的随机串
		signature : result.signature,// 必填，签名，见附录1
		jsApiList : [ 'checkJsApi', 'onMenuShareTimeline',
				'onMenuShareAppMessage', 'onMenuShareQQ',
				'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems',
				'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
				'translateVoice', 'startRecord', 'stopRecord',
				'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice',
				'uploadVoice', 'downloadVoice', 'chooseImage',
				'previewImage', 'uploadImage', 'downloadImage',
				'getNetworkType', 'openLocation', 'getLocation',
				'hideOptionMenu', 'showOptionMenu', 'closeWindow',
				'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
				'addCard', 'chooseCard', 'openCard' ]
	});
}

</script>
</body>
</html>