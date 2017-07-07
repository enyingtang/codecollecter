//$(document).ready(function(){
	var url = "http://cms.dz.renren.com";
	//var url = "http://top20.cc";
	var spiders;
	$.getJSON(url+"/index.php?api=spider&act=all",function(json){
		if(json.data.list&&json.data.list.length>0){
			spiders = json.data.list;
			buildSelect();
		}
	});
	
	var buildSelect = function(){
		$("select option").remove();
		for(var i=0;i<spiders.length;i++){
			var date = Settings.getValue(spiders[i].id)||"尚未采集";
			$("select").append('<option data-id="'+spiders[i].spiderid+'" value="'+spiders[i].id+'">'+spiders[i].sname+'(最后采集：'+date+')</option>');
		}
	}
	
	
	var log = {
		success:function(text){
			log.write('green',text);
		},
		error:function(text){
			log.write('red',text);
		},
		log:function(text){
			log.write('black',text);
		},
		write:function(color,text){
			$("#log").prepend('<li class="'+color+'">'+text+'</li>');
		}
	};
	
	var com = new mainConnector();
	com.name = 'spider';
	com.init();
	com.onMessage(function(msg){
		switch(msg.act){
			case "end":
				log.success(msg.data.spiderName+'已经执行结束');
				$("button").text("Go");
				buildSelect();
				$("select").show();
				
			break;
			case "log":
				log.log(msg.text);
			break;
			
			
		}
	});
	
	var doit = function(spider){
		com.send({act:"start",data:spider});
	};
	
	$(".button").click(function(){
		var spiderCache = Settings.getObject("spider");
		if(spiderCache===false||spiderCache===undefined){
			var rootid = $("select option:selected").data("id");
			var id = $("select option:selected").val();
			if(rootid=="0"){
				$.getJSON(url+"/index.php?api=spider&act=get&id="+id,function(json){
					var spider = JSON.parse(json.data.spider);
					spider["id"] = id;
					doit(spider);
					$(".button").text(spider.spiderName+" is Running Now ...");
				});
			}else{
				$.getJSON(url+"/index.php?api=spider&act=get&id="+id,function(json){
					var spiderMeta = JSON.parse(json.data.spider);
					$.getJSON(url+"/index.php?api=spider&act=get&id="+rootid,function(jsonRoot){
						var spider = JSON.parse(jsonRoot.data.spider);
						for(var key in spiderMeta){
							spider[key] = spiderMeta[key];
						}
						spider["id"] = id;
						//console.log(spider);
						doit(spider);
						$(".button").text(spider.spiderName+" is Running Now ...");
						
					});
				});
			}
			$("select").hide();
			
		}
	});
	
	var spiderCache = Settings.getObject("spider");
	if(spiderCache!==undefined&&spiderCache!==false){
		var spider = Settings.getObject("spider");
		$(".button").text(spider.spiderName+" is Running Now");
		$(".btn").show();
		$(".btn").click(function(){
			Settings.setObject("spider",false);
			$("select").show();
			$(".button").text("GO");
		});
		$("select").hide();
	}
	
	
//});