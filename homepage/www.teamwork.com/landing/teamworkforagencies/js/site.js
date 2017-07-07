$(document).ready(function($) {
	

	// SMOOTH page SCROLLING
	$(document.body).on('click', 'a.smscroll[href*=#]:not([href=#])', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
			|| location.hostname == this.hostname) {

			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var offset = 0;
				if( target[0].id.indexOf( "feature-" ) == 0 ) {
					offset = 100;
				}
				$('html,body').animate({
					scrollTop: target.offset().top - offset
				}, 1000, 'easeInOutQuart');
			return false;
			}
		}
	});


	// Toggle button for sliding text
	$(".js_open_more").click( function() {
		$(this).parent().parent().find('.hiden_content').slideDown(800, 'easeInOutQuart');
		$(this).fadeOut();
		return false;
	});

	$(".js_show_less").click( function() {
		$(this).parent().parent().parent().find('.hiden_content').slideUp(800, 'easeInOutQuart');
		$(this).parent().parent().parent().find('.js_open_more').fadeIn();
		return false;
	});
    


    
    // Video closing on Modal hide event
    $('#twVideo').on('hidden.bs.modal', function (e) {
		$('iframe#twVideoPlay').attr('src','//player.vimeo.com/video/84754816');
	})


	setupPage(.6,.38,.02);

});
