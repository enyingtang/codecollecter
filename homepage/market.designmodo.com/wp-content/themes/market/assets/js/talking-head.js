jQuery(document).ready(function(jQuery) {
  if (!Cookies.get('th-summer-discount-2015')) {
    
    setTimeout(function(){
      jQuery('.talking-head').show().addClass('shown');
    }, 5000);
    
    jQuery('.talking-head').bind('click touchstart touchend', function(e) {
        jQuery(this).addClass('hover');
    });
    
    jQuery(window).on('scroll',function(){
      jQuery('.talking-head').removeClass('hover');
    });
    
    
    jQuery('.close-head').click(function(){
      jQuery('.talking-head').addClass('hide');
      setTimeout(function(){
        jQuery('.talking-head').css('display','none');
      },500);
      
      Cookies.set('th-summer-discount-2015', '1', { expires: 1 });
      __gaTracker('send', 'event', 'Market>Talking Head>Summer Discount', 'Bubble Closed', window.location.href.split('?')[0]);
    });
    
    jQuery('.read-more-head').click(function(){
      location.href = jQuery(this).data('href');
      
      Cookies.set('th-summer-discount-2015', '1', { expires: 1 });
      __gaTracker('send', 'event', 'Market>Talking Head>Summer Discount', 'Link Visited', window.location.href.split('?')[0]);
    });
  }
});