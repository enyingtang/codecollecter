try {
	var rightContainerTop = $('#rightContainer').offset().top;
	var rightContainerBottom = parseInt(rightContainerTop + $('#rightFixedBlock').height());
	var rsBlogMenuTrigger = $('#rsBlogMenuTrigger').offset().top;
	var rsBlogMenu = $('#rsBlogMenu');
	var rightFixedBlock = $('#rightFixedBlock');
	
	if ($(window).width() >= 768) {
		var scrollTriggers = true;
	} else {
		var scrollTriggers = false;
	}
	
	$(window).resize(function() {
		if ($(window).width() >= 768) {
			scrollTriggers = true;
		} else {
			scrollTriggers = false;
			rsBlogMenu.hide().clearQueue().css('top', -100);
		}
	});

	$(window).scroll(function() {
		if (! scrollTriggers) {
			return false;
		}
		
		var rsHeader = $('#rsBlogMenu').is(":visible") ? $('#rsBlogMenu').height() : 0;
		var scrollTop = $(window).scrollTop();

		if (scrollTop > rsBlogMenuTrigger) {
			rsBlogMenu.show().animate({ top: 0 }, 300);
		} else {
			rsBlogMenu.hide().clearQueue().css('top', -100);
		}

		if ((scrollTop + rsHeader) > rightContainerTop) {
			var gap = (scrollTop + rsHeader) - rightContainerTop;
			rightFixedBlock.css('position', 'fixed').css('top', '60px');
		} else {
			rightFixedBlock.css('position', '').css('top', 0);
		}
	});
	
	$('.sharingLink').click(function(e) {
		e.preventDefault();
		window.open($(this).attr('href'),'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	});
	
	$('.openSearch').click(function() {
		$('.searchField').css('display', 'table');
		$('.blogLinks ul').hide();
		$('.searchField input').focus();
		$('.openSearch').hide();
		$('.closeSearch').show();
	});
	
	$('.closeSearch').click(function() {
		$('.searchField').hide();
		$('.blogLinks ul').show();
		$('.closeSearch').hide();
		$('.openSearch').show();
	});
	
	$('.rsOpenSearch').click(function() {
		$('.rsSearchField').css('display', 'table');
		$('#rsBlogMenu.blogLinks ul').hide();
		$('.rsSearchField input').focus();
		$('.rsOpenSearch').hide();
		$('.rsCloseSearch').show();
	});
	
	$('.rsCloseSearch').click(function() {
		$('.rsSearchField').hide();
		$('#rsBlogMenu.blogLinks ul').show();
		$('.rsCloseSearch').hide();
		$('.rsOpenSearch').show();
	});
	
} catch(e) {}