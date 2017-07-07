

// example usage of the arc call : draws a full grey circle background and then an arc on top
function setupPage(){

	var elem = document.createElement('canvas'), isCanvasSupported = !!(elem.getContext && elem.getContext('2d'));



    // The bit that does the work of drawing an arc
    window.arc = function(elementID, startingFraction, fractionComplete, color, lineThickness) {

        var context, endAngle, fullCircle, imageData, parent, rotateToTop, startAngle;
        parent = document.getElementById(elementID);
        if (parent != null) {
            context = parent.getContext('2d');
            fullCircle = Math.PI * 2;
            rotateToTop = Math.PI / 2;
            context.beginPath();
            context.strokeStyle = color;
            context.lineCap = 'butt';
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.closePath();
            context.fill();
            context.lineWidth = lineThickness;
            imageData = context.getImageData(0, 0, parent.width, parent.height);
            startAngle = (fullCircle * startingFraction) - rotateToTop;
            endAngle = (fullCircle * fractionComplete) + startAngle;
            context.putImageData(imageData, 0, 0);
            context.beginPath();
            context.arc(parent.width / 2, parent.height / 2, (parent.width / 2)-10, startAngle, endAngle, false);
            return context.stroke();
        }
    };

	var lineThickness = 20,
		elementId1 = 'happiness1',
		elementId2 = 'happiness2',
		total = latestFeedbackArray.length,
		great = jQuery.grep(latestFeedbackArray,function(n){return n === 'great';}).length,
		ok = jQuery.grep(latestFeedbackArray,function(n){return n === 'ok';}).length,
		bad = jQuery.grep(latestFeedbackArray,function(n){return n === 'bad';}).length,
		greatP = Math.round(great /total * 100),
		okP = Math.round(ok /total * 100),
		badP = Math.round(bad /total * 100);

	jQuery('#happiness_percentage').text(greatP + '%')
	jQuery('.numGreat').text(great);
	jQuery('.numOK').text(ok);
	jQuery('.numBad').text(bad);

    if(isCanvasSupported){
        window.arc(elementId1, 0, greatP / 100, '#64b551', lineThickness);
        window.arc(elementId1, greatP / 100, okP/ 100, '#dbbe64', lineThickness);
        window.arc(elementId1, (greatP + okP ) /100, badP/ 100, '#c94f42', lineThickness);
        window.arc(elementId2, 0, greatP / 100, '#64b551', lineThickness);
        window.arc(elementId2, greatP / 100, okP/ 100, '#dbbe64', lineThickness);
        window.arc(elementId2, (greatP + okP ) /100, badP/ 100, '#c94f42', lineThickness);
    }


	var ulclients = jQuery('#ulclients');
	ulclients.html('');
	for (var i = 0; i <= latestFeedbackArray.length -1; i++) {
		ulclients.append('<span class="smile-' + latestFeedbackArray[i] + '"></span> ');
		if(i > 0 && (i+1) % 10 == 0) {
			ulclients.append(' <br class="visible-xs"/>');
		}
	};
}