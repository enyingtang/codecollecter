function urlParam(url,name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
	var search = url.substr(url.indexOf("?"));
	var r = search.substr(1).match(reg);  
	if (r!=null) return r[2]; return ""; 
}

function clone(obj){  
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(clone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = clone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o;     
}  

var com = new backgroundConnector();
com.name = 'spider';
com.init(function(msg){
	
	switch(msg.act){
		case 'start':
			var spider = msg.data;
			Settings.setObject("spider",spider);
			//console.log(spider);
			var t = new spiderTaskClass();
			t.init(spider,function(){
				//console.log(spider);
				console.log("=====end=====");
				Settings.setValue(spider.id,(new Date()).Format("yyyy-MM-dd hh:mm:ss"));
				Settings.setObject("spider",false);
				com.send({act:'end',data:spider});
			});
			
		break;
	}
	
});



var getRegExec = function(regStr,str,idx,prefix,endfix){
	
	var idx = idx||1;
	var prefix = prefix||"";
	var endfix = endfix||"";
	var reg = new RegExp(regStr);
	var match = reg.exec(str);
	if(match!=null)
		return prefix+match[idx]+endfix;
	else
		return "";
};

var getRegMatch = function(regStr,str){
	if(regStr==undefined)
		return str;
	var reg = new RegExp(regStr,'g');
	return str.match(reg);
}

var getRegMatchStr = function(regStr,str,idx,prefix,endfix){
	
	if(str==null)
		return "";
	var idx = idx||1;
	var prefix = prefix||"";
	var endfix = endfix||"";
	var reg = new RegExp(regStr,'g');
	
	var matches = str.match(reg);
	
	var re = "";
	if(matches!=null){
		for(var i=0;i<matches.length;i++){
			re += getRegExec(regStr,matches[i],idx,prefix,endfix);
		}
	}
	return re;
}



var processDataClass = function(){
	var def = {};
	var datas = [];
	var processIndex = 0;
	var getProcessData = function (dataProcessDef,dataVal,callback) {

		if(processIndex<dataVal.length){
			var data = dataVal[processIndex];
			var process = new processClass();
			process.init(dataProcessDef.process,data[dataProcessDef.field],function(rdata){

				if(rdata.val.length>0){
					for(p in rdata.val[0]){
						dataVal[processIndex][p] = rdata.val[0][p];
					}
				}
				//console.log(dataVal[processIndex]);

				processIndex++;
				getProcessData(dataProcessDef,dataVal,callback);

			});
		}else{
			//debugger;
			if(callback)
				callback(dataVal);
		}


	};

	this.init = function(dataDef,dataVal,callback){
		//debugger;
		/*def = $.map(dataDef, function(obj){
			return $.extend(true,{},obj);
		});*/
		var def = clone(dataDef);
		
		var dataProcessDef;
		for(var i=0;i<def.length;i++){
			if(def[i].process!=undefined&&def[i].process.length>0){
				if(def[i].processed==undefined){
					dataProcessDef = def[i];
					def[i]["processed"] = 1;
				}
			}
		}
		if(dataProcessDef!=undefined){
			getProcessData(dataProcessDef,dataVal,callback);
		}
		else{
			if(callback)
				callback(dataVal);
		}
	};
};



var processClass = function(){
	
	var pindex = 0;
	var getProcessData = function (process,result,callback) {
		//debugger;
		var datas = [];
		var arr;
		if(toString.apply(result)!='[object Array]'){
			arr = [];
			arr.push(result);
		}else
			arr = result;
		for(var a=0; a<arr.length;a++){
			var match = arr[a];
			var data = {};
			if(process.data!=undefined){

				for(var i=0;i<process.data.length;i++){
					var dataset = process.data[i];
					if(dataset.regOp=='g')
						data[dataset.field] = getRegMatchStr(dataset.regExp,match,dataset.matchIndex,dataset.prefix,dataset.endfix);
					else
						data[dataset.field] = getRegExec(dataset.regExp,match,dataset.matchIndex,dataset.prefix,dataset.endfix);
					
					if(data[dataset.field].length<100)
						com.send({"act":"log","text":"获取数据-"+dataset.field+":"+data[dataset.field]});
				}

			}
			datas.push(data);
		}
		if(callback)
			callback({def:process.data,val:datas});
	};

	var getProcess = function(processes,result,callback){	
		var data = data||{};
		
		if(pindex<processes.length){
			var process = processes[pindex];
			pindex++;
			
			switch(process.processType){
				case 3:
					var url = result;
					if(url!=undefined&&url!=""){
						$.ajax({
							url:url,
							dataType:"text",
							success:function(html){
								com.send({"act":"log","text":"获取内容-"+url});
								var text = html;
								if(process.regExp)
									text= getRegExec(process.regExp,html,process.matchIndex,process.prefix,process.endfix);
								
								if(process.data!=undefined){
									getProcessData(process,text,callback);
								}else{
									getProcess(processes,text,callback);
								}
							},
							error:function(){
								if(process.data!=undefined){
									getProcessData(process,"",callback);
								}else{
									getProcess(processes,"",callback);
								}
							}
						});
						
					}else{
						if(process.data!=undefined){
							getProcessData(process,"",callback);
						}else{
							getProcess(processes,"",callback);
						}
					}
				break;
				case 2:
					var matches = getRegMatch(process.regExp,result);
					getProcessData(process,matches,callback);
				break;

			}
		}
	};

	this.init = function(processes,result,callback){
		getProcess(processes,result,callback);
	};

};


var postDataClass = function() {
	var postIndex;
	var post = function(datas,spider,callback){
		if(postIndex===undefined)
			postIndex = (datas.length - 1);
		if(postIndex>=0){
			var data = datas[postIndex];
			if(spider.postData){
				for(var key in spider.postData){
					
					if(spider.postData[key].indexOf("?")!=-1)//判断是否是从URL参数获取数据，格式是“?参数名”
						data[key] = urlParam(spider.homeUrl,spider.postData[key].substr(1));
					else
						data[key] = spider.postData[key];
				}
			}
			var tmp = "";
			if(data.code)
				tmp = data.code;
			if(data.title)
				tmp = data.title;
				
			$.post(spider.postUrl,data,function(result){
				
				postIndex--;
				var json = JSON.parse(result);
				if(json.code==0)
					com.send({"act":"log","text":"保存数据成功-"+tmp+"("+postIndex+")"});
				else
					com.send({"act":"log","text":json.msg+"-"+tmp+"("+postIndex+")"});
				
				setTimeout(function(){
					post(datas,spider,callback);
				},1000);
				
			});
		}else{
			
			
			if(callback){
				callback();
			}
		}

	};
	this.init = function(datas,spider,callback){
		if(!spider.postBatch){
			////debugger;
			post(datas,spider,callback);
		}else{

			var datastr = {data:JSON.stringify(datas)};
			$.post(spider.postUrl,datastr,function(){
				if(callback){
					callback();
				}
			});
		}
	};
};


var spiderTaskClass = function(){
	var taskIndex = 0;

	var taskRun = function(spider,callback){
		
		if(spider.spiderTask.urlDynamic!=undefined){
			
			$.getJSON(spider.spiderTask.urlFrom,function(result){
				
				if(result.code==0){
					
					spider.homeUrl = spider.spiderTask.urlDynamic.replace(/\$param1\$/g,result.data.param1);
					spider.spiderTask.urlReport1 = spider.spiderTask.urlReport.replace("$param1$",result.data.param1);
					var processRoot = new processClass();
					processRoot.init(spider.process,spider.homeUrl,function(datas1){
				
						//console.log(datas1);

						var process2 = new processDataClass();
						process2.init(datas1.def,datas1.val,function(datas2){
							//debugger;
							//console.log(datas2);
							
							var post = new postDataClass();
							
							post.init(datas2,spider,function(){
								
								if(spider.spiderTask.urlReport1!=undefined){
					
									$.get(spider.spiderTask.urlReport1,function(){
										taskIndex++;
										taskRun(spider,callback);
									});
										
								}else{
								
									taskIndex++;
									taskRun(spider,callback);
								}

							});

						});

					});
				}else{
					if(callback)
						callback();
				}
				
			});
			
		}
		else{
			if(taskIndex<spider.spiderTask.urlList.length){
				
				spider.homeUrl = spider.spiderTask.urlList[taskIndex];
				var processRoot = new processClass();
				processRoot.init(spider.process,spider.homeUrl,function(datas1){
			
					//console.log(datas1);

					var process2 = new processDataClass();
					process2.init(datas1.def,datas1.val,function(datas2){
						//debugger;
						//console.log(datas2);
						
						var post = new postDataClass();
						
						post.init(datas2,spider,function(){
							
							taskIndex++;
							taskRun(spider,callback);

						});

					});

				});
			}else{
				if(callback)
					callback();
			}
		}

	};
	this.init = function(spider,callback){
		if(spider.spiderTask==undefined){
			spider.spiderTask = {
				urlList : []
				
			};
		}
		//处理任务抓取信息列表
		if(spider.homeUrl!=""){
			spider.spiderTask.urlList = [];
			spider.spiderTask.urlList.push(spider.homeUrl);
		}else{
			if(spider.spiderTask.urlList.length==0){
				for(var i=spider.spiderTask.urlBegin;i>=spider.spiderTask.urlEnd;i--){
					spider.spiderTask.urlList.push(spider.spiderTask.urlTemplate.replace('(*)',i));
				}
				//console.log(spider.spiderTask.urlList);
			}
		}
		
		taskRun(spider,callback);

	}
};







