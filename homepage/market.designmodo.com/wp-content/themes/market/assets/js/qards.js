$(document).ready(function($) {
    $('html').addClass('ready');
    
    
    
    
    
    
    
    
    
    
    //ON SCROLL and LOAD
    var hiddenOn = 0, incr = 0, lstScrl = 0;
    var menuSpace = 50; startsOn = 80, hideSize = 30;
    $(window).on('scroll load', function() {
        
      //ADD .TIGHT
      if ($(window).scrollTop() + $(window).height() > $('.designmodo-wrapper').outerHeight()) {
        $('body').addClass('tight');
      } else {
        $('body').removeClass('tight');
      }
      
    }).on('scroll', function() {
      
      //HIDE HOME BUTTON
      var st = $(window).scrollTop();
      if (st > hiddenOn + startsOn + menuSpace){
        if (!$('body').hasClass('hideBackButton')){
          hiddenOn = st;
          $('body').addClass('hideBackButton');
        }
      }
      
      if (st < lstScrl - hideSize){
        $('body').removeClass('hideBackButton');
        lstScrl = st;
        hiddenOn = st;
      }
      
      if (st > lstScrl){
        lstScrl = st;
      }
      
    }).load(function() {
      $('html').addClass('loaded');
    });
    
    
    
    
    
    
    
    
    
    //BACK TO PRESENTATION MODE
    $("html").on("click", "body.tight .designmodo-wrapper", function(){
      $('html, body').animate({
        scrollTop:$('.designmodo-wrapper').outerHeight() - $(window).height()
      },500);
    });
    
    
    
    
    
    
    
    
    
    //TRACK SHARES GA
    $("html").on("mousedown", ".share-icon", function(){
      buttonName = $(this).attr('class').replace('share-icon','').trim();
      __gaTracker('send', 'event', 'Market>Product>Share', 'Shared via '+buttonName, window.location.href.split('?')[0]);
    });
    
    
    
    
    
    
   
    
    
    //BUY NOW
    function openBuynowPopup(element) {
        $(element).addClass('visible');
        window.hideTimeout = setTimeout(function(){
          if($(element).hasClass('visible')){
            $("body, html").addClass('noscroll');
          }
        },300);
    }
    function closeBuynowPopup(element) {
        $("#"+element).addClass('hide');
        setTimeout(function(){
          $("#"+element).removeClass('visible').removeClass('hide');
        },500);
        clearTimeout(window.hideTimeout);
        $("body, html").removeClass('noscroll');
    }

    $('.buy-now').click(function() {
        openBuynowPopup('#popup-buynow');
    });
    
    
    
    
    
    
    
    
    
    //FREE VERSION
    $('.free').click(function() {
        if (Cookies.get('market_subscribed')) {
          window.location.href = $(this).data('download-url');
          __gaTracker('send', 'event', 'Market>Product>Freebie', 'Freebie Downloaded (Already Subscribed)', window.location.href.split('?')[0]);
        } else {
          $('.subscribe-container .card-container .card').removeClass('flipped')
          $('.popup-subscribe').removeClass('animate');
          openBuynowPopup('#popup-subscribe');
        }
    });
    
    
    $('#subscribeForm').ajaxForm({
      type: 'post',
      dataType: 'html',
      beforeSubmit: function() {
        var isValdid = true;
        isValdid = $('#subscribeForm').valid();
        return isValdid;
      },
      success: function(data) {
        if (data == "ok"){ 
          Cookies.set('market_subscribed', '1', { expires: 90 });
          download();
        } else {
          $('body').append(data);
        }
      }
    });
    
    $('#subscribeForm').validate({
      onkeyup: false,
      onfocusout: false,
      errorClass: "error-field",
      rules: { email: { required: true, validEmail: true } },
      messages: {email: ""}
    });
    
    function download() {
        $('.subscribe-container .card-container .card').addClass('flipped');
        
        setTimeout(function(){
          window.location.href = $('.free').data('download-url');
          __gaTracker('send', 'event', 'Market>Product>Freebie', 'Freebie Downloaded', window.location.href.split('?')[0]);
        },1500);
        
        setTimeout(function(){
          $('#popup-subscribe').addClass('animate');
          setTimeout(function(){
            closeBuynowPopup('popup-subscribe');
          },100);
        },3000);
    }
    
    $('.close').click(function() {
        var name = $(this).closest("div[class|='popup']").attr('id');
        closeBuynowPopup(name);
    });

    $.validator.addMethod("validEmail", function(value, element) { if (value == '') return true; var temp1; temp1 = true; var ind = value.indexOf('@'); var str2 = value.substr(ind + 1); var str3 = str2.substr(0, str2.indexOf('.')); if (str3.lastIndexOf('-') == (str3.length - 1) || (str3.indexOf('-') != str3.lastIndexOf('-'))) return false; var str1 = value.substr(0, ind); if ((str1.lastIndexOf('_') == (str1.length - 1)) || (str1.lastIndexOf('.') == (str1.length - 1)) || (str1.lastIndexOf('-') == (str1.length - 1))) return false; str = /(^[a-zA-Z0-9]+[\._-]{0,1})+([a-zA-Z0-9]+[_]{0,1})*@([a-zA-Z0-9]+[-]{0,1})+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,3})$/; temp1 = str.test(value); return temp1; }, "Please enter valid email.");
    
    
    
    
    
    
    
    
    
    
    //SHARE
    $('.share-product').bind('click touchstart touchend', function(e) {
        $(this).addClass('hover');
    });
    
   	$('.share-product').sharrre({
      url: window.location.href.split('?')[0],
      urlCurl: '/wp-content/themes/market/assets/js/sharrre.php',
      enableHover: false,
      shorterTotal: true,
      share: {
        pinterest: true,
        facebook: true,
        twitter: true,
        googlePlus: true
      },
      buttons: {
        twitter: {
          custom: $('.share-product').data('name') + ' by ' + $('.share-product').data('author-name'),
          via: "designmodo"
        },
        pinterest: {
          media: $('.share-product').data('pinterest-image'),
          description: $('.share-product').data('name') + " on Market (" + window.location.href.split('?')[0] + ")"
        }
      },
      template: '<div class="share-icon btn">Share <span style="display:none">{total}</span></div><div class="share-icon twitter"><svg><use xlink:href="#twtr"/></svg></div><div class="share-icon facebook"><svg><use xlink:href="#fb"/></svg></div><div class="share-icon googlePlus"><a><svg><use xlink:href="#googlePlus"/></svg></a></div><div class="share-icon pinterest"><svg><use xlink:href="#pntrst"/></svg></div><div class="share-icon mail"><svg><use xlink:href="#mail"/></svg></div>',
      render: function(api, options){
        $(api.element).on('click touchstart', '.twitter', function() {
          api.openPopup('twitter');
        });
        $(api.element).on('click touchstart', '.facebook', function() {
          api.openPopup('facebook');
        });
        $(api.element).on('click touchstart', '.pinterest', function() {
          api.openPopup('pinterest');
        });
        $(api.element).on('click touchstart', '.googlePlus', function() {
          api.openPopup('googlePlus');
        });
        $(api.element).on('click touchstart', '.mail', function() {
          var url = "mailto:?Subject=" + encodeURIComponent($('.share-product').data('name')) + "&Body=Hi%2C%20check%20out%20this%20project%20-%20"+ window.location.href.split('?')[0] +".%20%20I%20hope%20it%20will%20help%20you%20with%20your%20projects.";
          var win = window.open(url, '_blank'); win.focus();
        });
        if (options.total > 0) {
          $('.share-icon.btn span').show();
        }
      }
   	});
});

/* CSS Browser Selector v0.4.0 */
function css_browser_selector(u){var ua=u.toLowerCase(),is=function(t){return ua.indexOf(t)>-1},g='gecko',w='webkit',s='safari',o='opera',m='mobile',h=document.documentElement,b=[(!(/opera|webtv/i.test(ua))&&/msie\s(\d)/.test(ua))?('ie ie'+RegExp.$1):is('firefox/2')?g+' ff2':is('firefox/3.5')?g+' ff3 ff3_5':is('firefox/3.6')?g+' ff3 ff3_6':is('firefox/3')?g+' ff3':is('gecko/')?g:is('opera')?o+(/version\/(\d+)/.test(ua)?' '+o+RegExp.$1:(/opera(\s|\/)(\d+)/.test(ua)?' '+o+RegExp.$2:'')):is('konqueror')?'konqueror':is('blackberry')?m+' blackberry':is('android')?m+' android':is('chrome')?w+' chrome':is('iron')?w+' iron':is('applewebkit/')?w+' '+s+(/version\/(\d+)/.test(ua)?' '+s+RegExp.$1:''):is('mozilla/')?g:'',is('j2me')?m+' j2me':is('iphone')?m+' iphone':is('ipod')?m+' ipod':is('ipad')?m+' ipad':is('mac')?'mac':is('darwin')?'mac':is('webtv')?'webtv':is('win')?'win'+(is('windows nt 6.0')?' vista':''):is('freebsd')?'freebsd':(is('x11')||is('linux'))?'linux':'','js']; c = b.join(' '); h.className += ' '+c; return c;}; css_browser_selector(navigator.userAgent);