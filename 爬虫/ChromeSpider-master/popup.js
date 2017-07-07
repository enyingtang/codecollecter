/**
 * Created by Tim on 2014/4/7.
 */

var bg;

$('document').ready(function(){

    chrome.runtime.getBackgroundPage(function(page){
        bg=page;
        initPopup(page);
        //console.log(bg);
    });


    $('#newCrawlerButton').click(function(){
        bg.createCrawlerTab();
    });


    $('#cancelNewTask').click(function(){
        $('#newTaskPanel').css({height:'0px'});
    });



    $('#newTabButton').click(function () {


        $('#newTaskPanel').css({height:'200px'});


        chrome.tabs.create({url: 'http://stackoverflow.com/questions/4479260/change-height-of-popup-window', active: false}, function (tab) {
            chrome.tabs.executeScript(tab.id, {file: 'inject.js'});
        });
    });


});


function initPopup(engine){

}



//$('#new')








