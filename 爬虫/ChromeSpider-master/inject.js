/**
 * Created by Tim on 2014/4/6.
 */
/*, "background", "notifications", "unlimitedStorage", "webRequest", "webRequestBlocking"*/
var div = $('div');
var port = chrome.runtime.connect();
var bg;
//console.log(chrome.tabs);
//chrome.runtime.getBackgroundPage(function(back){
//    bg=back;
//    bg.removeCurrentTab();
//
//    alert('hi');
//});


port.postMessage($('title').text());

$('document').ready(function(){
    port.postMessage('fin');
});



port.onMessage.addListener(function (msg) {
    console.log(msg);
});

div.hover(function (e) {
    var me = $(this);
    this.borderTmp = me.css('border');
    me.css({border: '1px solid red'});
    e.stopPropagation();
}, function (e) {
    var me = $(this);
    me.css({border: this.borderTmp});
});

div.click(function (e) {
    var doms=$(getDomPath(this)).css({transition:'background 1s', backgroundColor: '#FFccFF'});
    //console.log(getDomPath(this));
    doms.each(function(){
       var me = this;
       port.postMessage(me.innerText);
    });
    port.postMessage(getDomPath(this));
    //alert(getDomPath(this));
    e.stopPropagation();
});

function getDomPath(element) {
    var path = '';
    for (; element && element.nodeType == 1 && element.tagName!="html"; element = element.parentNode) {
        //var inner = $(element).children().length == 0 ? $(element).text() : '';
        var eleSelector = element.tagName.toLowerCase();
        if(element.id){
            //console.log(element.id);
            //console.log(element.id);
            try{
                var testID="#" + element.id;
                if($(testID).length!= 0){
                    eleSelector = testID;
                }
                console.log(testID);
            }
            catch(e){
                console.log(e);
            }
        }

        //console.log(eleSelector);
//        +
//            ((inner.length > 0) ? ':contains(\'' + inner + '\')' : '');
        if (element.className) {
            var testClass=eleSelector + "." + element.className.trim().replace(/ ./g, '.');
            try{
                if($(testClass).length!= 0){
                    eleSelector = testClass;
                }
            }
            catch(e){

            }

            //console.log(element.className);
            //eleSelector += "." + element.className.trim().replace(/ ./g, '.');
        }

        path = ' ' + eleSelector + path;
    }
    return path;
}


//chrome.runtime.sendMessage("hello");

//$(".rightArrow").click(function() {
//    var rightArrowParents = [];
//    $(this).parents().not('html').each(function() {
//        var entry = this.tagName.toLowerCase();
//        if (this.className) {
//            entry += "." + this.className.replace(/ /g, '.');
//        }
//        rightArrowParents.push(entry);
//    });
//    rightArrowParents.reverse();
//    alert(rightArrowParents.join(" "));
//});