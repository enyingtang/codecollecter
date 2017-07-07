// JavaScript Document
// @Author Belenk
// @Update 2014-6-4

(function($){
	$.fn.extend({
		waterfall : function(options){
			$.fn.waterfall.defaults = {
				boxWidth : 230,
				marginTop : 10,
				marginRight: 10
			};
			
			var option=$.extend({},$.fn.waterfall.defaults,options),
				$container = $(this),
				$box = $container.find(".box"),
				column = new Array();
				
			$box.width(option.boxWidth);
			
			function setPosition(){
				var boxNumber = Math.floor($container.width() / $box.width());
				
				for(var i = 0; i < boxNumber; i++){
					var offsetX = i * ($box.width() + option.marginRight);
					var offsetY = option.marginTop;
					$box.eq(i).css({
						top : offsetY,
						left : offsetX
					})
					column[i] = {
						top : offsetY, 
						left : offsetX,
						height: $box.eq(i).height() + option.marginTop * 2
					}
				}
				
				for(var i = boxNumber; i < $box.size(); i++){
					for(var ii = 0; ii < boxNumber; ii++){
						for(var j = 0; j < boxNumber - ii - 1; j++){
							if(column[j].height > column[j+1].height){
								var temp = column[j];
								column[j] = column[j+1];
								column[j+1] = temp;
							}
						}
					}
					var offsetX = column[0].left;
					var offsetY = column[0].height;
					$box.eq(i).css({
						top : offsetY,
						left : offsetX
					})
					column[0].height += ($box.eq(i).height() + option.marginTop);
					
				}
				
			};
			
			setPosition();
			$(window).resize(function(){
				setPosition();
			})
		}
	})
})(jQuery);