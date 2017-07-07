	/* All alert, information, error, confirmation popups are here */
var alertInfoTimer;
var alertErrorTimer;

function alertInfo(msg, delay) {
	$("#information_popup span").html(msg);
	$("#information_popup").stop().animate({
		"bottom" : "-5px",
		"opacity" : "1"
	}, "slow");
	alertInfoTimer = setTimeout('hideAlert()', delay);
}

function alertError(msg, delay) {
	$("#error_popup span").html(msg);
	$("#error_popup").stop().animate({
		"bottom" : "-5px",
		"opacity" : "1"
	}, "slow");
	alertErrorTimer = setTimeout('hideAlert()', delay);
}

function hideAlert() {
	clearTimeout(alertInfoTimer);
	clearTimeout(alertErrorTimer);
	$("#information_popup").stop().animate({
		"bottom" : "-40px",
		"opacity" : "0"
	}, "fast");
	$("#error_popup").stop().animate({
		"bottom" : "-40px",
		"opacity" : "0"
	}, "fast");
}

/*******************************************************************************
 * function confirmation popup example : confirmation("Voulez-vous vraiment
 * effacer d�finitivement le compte LIVRET A", "confirmer", "annuler",
 * function() { alert("Vous avez force close"); }, confirm(), function() {
 * alert("vous avez annuler"); });
 */
function confirmation(msg, label_ok, label_cancel, func_close, func_confirm,
		func_cancel) {
	enableScroll = false;
	/* get jquery object */
	var blackback = $('#confirmationBlackback');
	var content = $("#confirmationContent");
	var close = $('#confirmationClose');
	var confirm = $('#confirmationOKButton');
	var cancel = $('#confirmationCancelButton');

	blackback.fadeIn();

	/* put the msg */
	content.html(msg);

	/* put the button label */
	if (label_ok != "") {
		confirm.html(label_ok);
	}

	if (label_cancel != "") {
		cancel.html(label_cancel);
	}

	/* bind and add function */
	cancel.unbind('click');
	if (func_cancel != null) {
		cancel.click(function(e) {
			func_cancel.call();
			confirmation_hidePopup();
		});
	} else {
		cancel.click(function(e) {
			confirmation_hidePopup();
		});
	}

	confirm.unbind('click');
	if (func_confirm != null) {
		confirm.click(function(e) {
			func_confirm.call();
			confirmation_hidePopup();
		});
	} else {
		confirm.click(function(e) {
			confirmation_hidePopup();
		});
	}

	close.unbind('click');
	blackback.unbind('click');
	if (func_close != null) {
		close.click(function(e) {
			func_close.call();
			confirmation_hidePopup();
		});

		blackback.click(function(e) {
			func_close.call();
			confirmation_hidePopup();
		});
	} else {
		close.click(function(e) {
			confirmation_hidePopup();
		});
		blackback.click(function(e) {
			confirmation_hidePopup();
		});
	}

	confirmation_center();

	$('#confirmationPopup').slideDown(/* confirmation_showClose */);
}

function confirmation_center() {
	$('#confirmationPopup').css('top',
			($(window).height() - $('#confirmationPopup').height()) / 2);
	$('#confirmationPopup').css('left',
			($(window).width() - $('#confirmationPopup').width()) / 2);
}

function confirmation_hidePopup() {
	$('#confirmationPopup').slideUp();
	$('#confirmationBlackback').fadeOut();
	enableScroll = true;
}

function popUpPremium() {
	enableScroll = false;
	/* get jquery object */
	$.ajax({
		type: "POST",
		url: "/popups/productsPopUp",
		data: "type=" + encodeURIComponent("1"),
		error:function(msg) {
		},
		success:function(res) {
			if (res.status == _services.status.OK) {
				try {
					var data = JSON.parse(res.data);
					
					$("#premiumMonth").attr('href', data.monthly.pl);
					$("#premiumMonth").html(data.monthly.price + ' &euro;');
					$("#premiumYear").attr('href', data.yearly.pl);
					$("#premiumYear").html(data.yearly.price + ' &euro;');
					
					var blackback = $('#premiumBlackback');
					var content = $("#premiumContent");
					var close = $('#premiumClose');
					var cancel = $('#premiumCancelButton');
					var ok = $('#premiumOKButton');
					
					blackback.fadeIn();
				
					ok.unbind('click');
					ok.click(function(e) {
						redirectMe("/pluspro", 100);
					});
					
					// bind and add function 
					cancel.unbind('click');
					cancel.click(function(e) {
						premium_hidePopup();
					});
				
					close.unbind('click');
					blackback.unbind('click');
					close.click(function(e) {
						premium_hidePopup();
					});
					blackback.click(function(e) {
						premium_hidePopup();
					});
				
					popUpPremium_center();
					
					var email = encodeURIComponent($('#userMail').html().split(' : ')[1]);
					$('#premiumMonth').attr('href', $('#premiumMonth').attr('href').replace('_USER_UUID_', email));
					$('#premiumYear').attr('href', $('#premiumYear').attr('href').replace('_USER_UUID_', email));
					$('#premiumPopup').slideDown();
				} catch (e) {
					alertError(_ressources.fr.ERROR_INTERNAL, 4000);
				}
			} else {
				alertError(_ressources.fr.ERROR_INTERNAL, 4000);
			}
		}
	});
}

function popUpPremium_center() {
	$('#premiumPopup').css('top',
			($(window).height() - $('#premiumPopup').height()) / 2);
	$('#premiumPopup').css('left',
			($(window).width() - $('#premiumPopup').width()) / 2);
}

function premium_hidePopup() {
	$('#premiumPopup').slideUp();
	$('#premiumBlackback').fadeOut();
	enableScroll = true;
}

function popUpPro() {
	enableScroll = false;
	/* get jquery object */
	
	$.ajax({
		type: "POST",
		url: "/popups/productsPopUp",
		data: "type=" + encodeURIComponent("3"),
		error: function(msg) {},
		success: function(res) {
			if (res.status == _services.status.OK) {
				try {
					var data = JSON.parse(res.data);
				
					$("#proMonth").attr('href', data.monthly.pl);
					$("#proMonth").html(data.monthly.price + ' &euro;');
					$("#proYear").attr('href', data.yearly.pl);
					$("#proYear").html(data.yearly.price + ' &euro;');
					if (data.trial) {
						$("#p_free").html("Bankin' Pro " + parseInt(data.trial.duration) + " jours");
					}
					if (data.hide_pro_trial) {
						$("#proFree").css('display', 'none');
						$("#p_free").css('display', 'none');
						$("#proMonth").css('left', '17%');
						$("#pro_m").css('left', '17%');
						$("#proYear").css('right', '17%');
						$("#pro_y").css('right', '19%');
					}
					
					var blackback = $('#proBlackback');
					var content = $("#proContent");
					var close = $('#proClose');
					var cancel = $('#proCancelButton');
					var ok = $('#proOKButton');
					
					blackback.fadeIn();
				
					ok.unbind('click');
					ok.click(function(e) {
						redirectMe("/pluspro", 100);
					});
					
					// bind and add function 
					cancel.unbind('click');
					cancel.click(function(e) {
						pro_hidePopup();
					});
		
					close.unbind('click');
					blackback.unbind('click');
					close.click(function(e) {
						pro_hidePopup();
					});
					blackback.click(function(e) {
						pro_hidePopup();
					});
		
					popUpPro_center();			
					
					var email = encodeURIComponent($('#userMail').html().split(' : ')[1]);
					$('#proMonth').attr('href', $('#proMonth').attr('href').replace('_USER_UUID_', email));
					$('#proYear').attr('href', $('#proYear').attr('href').replace('_USER_UUID_', email));
					$('#proPopup').slideDown();
				} catch (e) {
					alertError(_ressources.fr.ERROR_INTERNAL, 4000);
				}
			} else {
				alertError(_ressources.fr.ERROR_INTERNAL, 4000);
			}
		}
	});
}

function popUpPro_center() {
	$('#proPopup').css('top',
			($(window).height() - $('#proPopup').height()) / 2);
	$('#proPopup').css('left',
			($(window).width() - $('#proPopup').width()) / 2);
}

function pro_hidePopup() {
	$('#proPopup').slideUp();
	$('#proBlackback').fadeOut();
	enableScroll = true;
}

function exportPopUp(itemId, name, msg) {
	enableScroll = false;
	/* get jquery object */
	var blackback = $('#exportBlackback');
	var content = $("#exportContent");
	var close = $('#exportClose');
	var confirm = $('#exportOKButton');
	var cancel = $('#exportCancelButton');
	var title = $('#exportTitle');

	blackback.fadeIn();

	var titleText = "Exporter le compte " + name;
	title.html(titleText);

	/* put the msg */
	content.html(msg);

	cancel.click(function(e) {
		hideExport();
	});

	confirm.unbind('click');

	confirm.click(function(e) {
		checkFieldsAndExport(itemId);
	});

	close.unbind('click');
	blackback.unbind('click');

	close.click(function(e) {
		hideExport();
	});
	blackback.click(function(e) {
		hideExport();
	});

	exportPopUpCenter();

	$('#exportPopup').slideDown(/* confirmation_showClose */);
}

function exportPopUpCenter() {
	$('#exportPopup').css('top',
			($(window).height() - $('#confirmationPopup').height()) / 2);
	$('#exportPopup').css('left',
			($(window).width() - $('#confirmationPopup').width()) / 2);
}

/*
 * function confirmation_showClose() { var offset =
 * $('#confirmationPopup').offset(); $('#confirmationClose').css('top',
 * offset.top - 10); $('#confirmationClose').css('left', offset.left +
 * $('#confirmationPopup').width() - 15); $('#confirmationClose').show(); }
 */

function hideExport() {
	enableScroll = true;
	$('#exportPopup').slideUp();
	$('#exportBlackback').fadeOut();
	$('#exportContent').find('span').remove();
}

function checkFieldsAndExport(itemId) {
	var needMonth = 'Veuillez séléctionner un mois.';
	var date = $('#dateExport').val();
	if (date == undefined || date.length == 0) {
		alertError(needMonth, 4000);
		return false;
	} else {
		var month = date.split("/")[0];
		var year = date.split("/")[1];
		if (month == undefined || year == undefined || parseFloat(month) <= 0
				|| parseFloat(month) > 12) {
			alertError(needMonth, 4000);
			return false;
		}
	}
	_accounts.exportData.exportData(itemId, month, year);
}

function cgu(type) {
	enableScroll = false;
	/* get jquery object */
	var blackback = $('#cguBlackback');
	var content = $("#cguContent");
	var confirm = $('#cguOKButton');

	blackback.fadeIn();

	var msgError = "Vous devez accepter les CGU pour pouvoir utiliser Bankin'";
	
	confirm.unbind('click');
	confirm.click(function(e) {
		if (confirm.hasClass('notOk')) {
			var messageError = "Veuillez faire d&eacute;filer les CGU.";
			alertError(messageError, 4000)
		} else if(type == 2){
			signUp();
			cgu_hidePopup();
		} else if (type == 1){
			$.ajax({
				type: "POST",
				url: "/Application/acceptNewCGU",
				error:function(msg) { 
					var msg = _ressources.fr.ERROR_BASIC;
					alertError(msg, 6000);
				},
				success:function(data) {
					var msg = "Les nouvelles CGU sont acceptées.";
					alertInfo(msg, 3000);
				}
			});
			cgu_hidePopup();
		}
	});
	
	content.scroll(function(e) {
		confirm.removeClass('notOk');
	});

	cgu_center();
	
	// scrollBar
	/*addScrollBar('#cguContent');
	$('#cguContent').css('overflow', 'auto');
	$('#cguContent').css('overflowX', 'hidden');*/
	
	$('#cguPopup').slideDown();
}

function cgu_center() {
	$('#cguPopup').css('top',
			($(window).height() - $('#cguPopup').height()) / 2);
	$('#cguPopup').css('left',
			($(window).width() - $('#cguPopup').width()) / 2);
}

function cgu_hidePopup() {
	$('#cguPopup').slideUp();
	$('#cguBlackback').fadeOut();
}

function popUpRemindToShare(nbDaysOffered) {
	/* get jquery object */
	var blackback = $('#remindToShareBlackback');
	var close = $('#remindToShareClose');
	var cancel = $('#remindToShareCancelButton');
	var ok = $('#remindToShareOKButton');

	blackback.fadeIn();

	/* bind and add function */
	ok.unbind('click');
	ok.click(function(e) {
		fromRemindToShareToShareNow(nbDaysOffered);
	});

	cancel.unbind('click');
	cancel.click(function(e) {
		remindToShare_updateDate(2);
		hidePopupToLeftSide($('#remindToSharePopup'), $('#remindToShareBlackback'));
	});

	close.unbind('click');
	blackback.unbind('click');
	close.click(function(e) {
		remindToShare_updateDate(2);
		hidePopupToLeftSide($('#remindToSharePopup'), $('#remindToShareBlackback'));
	});
	blackback.click(function(e) {
		remindToShare_updateDate(2);
		hidePopupToLeftSide($('#remindToSharePopup'), $('#remindToShareBlackback'));
	});

	setTimeout(function() {popUpRemindToShare_center();}, 100);
	setTimeout(function() {popUpRemindToShare_animateMen();}, 250);
}

function popUpRemindToShare_animateMen() {
	$('.man_big').animate({
		opacity: '1',
	    margin: '10px 0px 5px 130px'
	  }, 600, function() {});	
	$('.man').animate({
		opacity: '1',
	    margin: '15px 125px 5px 0px'
	  }, 600, function() {});
}

function popUpRemindToShare_center() {
	$('#remindToSharePopup').css('top',
			($(window).height() - $('#remindToSharePopup').height()) / 2);
	$('#remindToSharePopup').css('left',
			($(window).width() - $('#remindToSharePopup').width()) / 2);
	$('#remindToSharePopup').show();

	var topDim = ($(window).height() - $('#remindToSharePopup').height()) / 2 + 5;
	var leftDim = ($(window).width() - $('#remindToSharePopup').width()) / 2 + 5;
	$('#remindToSharePopup').animate({
	    top: topDim,
	    left: leftDim,
	    width: '260px',
	    height: '180px'
	  }, 200, function() {});

	$('#remindToSharePopup').animate({
	    top: topDim - 5,
	    left: leftDim - 5,
	    width: '270px',
	    height: '190px'
	  }, 50, function() {});
}

function fromRemindToShareToShareNow(nbDaysOffered) {
	hidePopupToLeftSide($('#remindToSharePopup'), $('#remindToShareBlackback'));
	setTimeout(function() {popUpShareNow(nbDaysOffered);}, 150);
}

function popUpShareNow(nbDaysOffered) {
	/* get jquery object */
	var blackback = $('#shareNowBlackback');
	var close = $('#shareNowClose');
	var cancel = $('#shareNowCancelButton');
	var ok = $('#shareNowOKButton');

	blackback.fadeIn();

	$("#shareNowText").html("Postez maintenant</br>votre code parrain sur Facebook et</br>gagnez instantanément " + 
			nbDaysOffered + " jrs de B+")
	
	/* bind and add function */
	cancel.unbind('click');
	cancel.click(function(e) {
		remindToShare_updateDate(1);
		fromShareNowToShareNowShareNowResult("Invitez des amis !", "A chaque action de parrainage,</br>vous gagnez des jours B+.");
	});

	ok.unbind('click');
	ok.click(function(e) {
		hidePopupToLeftSide($('#shareNowPopup'), $('#shareNowBlackback'));
		_firstSteps.postFb();
	});

	close.unbind('click');
	blackback.unbind('click');
	close.click(function(e) {
		remindToShare_updateDate(1);
		fromShareNowToShareNowShareNowResult("Invitez des amis !", "A chaque action de parrainage,</br>vous gagnez des jours B+.");
	});
	blackback.click(function(e) {
		remindToShare_updateDate(1);
		fromShareNowToShareNowShareNowResult("Invitez des amis !", "A chaque action de parrainage,</br>vous gagnez des jours B+.");
	});

	popUpShareNow_center();
}

function popUpShareNow_center() {
	$('#shareNowPopup').css('top',
			($(window).height() - $('#shareNowPopup').height()) / 2);
	$('#shareNowPopup').css('left',
			($(window).width() - $('#shareNowPopup').width()) / 2);

	$('#shareNowPopup').show();
	$('#shareNowPopup').animate({
	      marginLeft: '0px',
	      opacity: '1'
	    }, 200, function() {});
}

function fromShareNowToShareNowShareNowResult(title, text) {
	hidePopupToLeftSide($('#shareNowPopup'), $('#shareNowBlackback'));
	setTimeout(function() {popUpShareNowResult(title, text);}, 450);
}

function hidePopupToLeftSide($marginLefty, $back) {
    $marginLefty.animate({
      marginLeft: '40px'
    }, 200, function() {});
    $marginLefty.animate({
	      left: '-500px',
	      opacity: '0'
	    }, 200, function() {});
    $back.fadeOut();
	enableScroll = true;
}

function popUpShareNowResult(title, text) {
	/* get jquery object */

	$('#shareNowResultTitle').html(title);
	$('#shareNowResultText').html(text);

	var blackback = $('#shareNowResultBlackback');
	var close = $('#shareNowResultClose');
	var ok = $('#shareNowResultOKButton');

	blackback.fadeIn();

	close.unbind('click');
	blackback.unbind('click');
	close.click(function(e) {
		hidePopupToLeftSide($('#shareNowResultPopup'),	$('#shareNowResultBlackback'));
	});

	ok.unbind('click');
	ok.click(function(e) {
		hidePopupToLeftSide($('#shareNowResultPopup'),	$('#shareNowResultBlackback'));
	});

	blackback.click(function(e) {
		hidePopupToLeftSide($('#shareNowResultPopup'), $('#shareNowResultBlackback'));
	});

	popUpShareNowResult_center();
}

function popUpShareNowResult_center() {
	$('#shareNowResultPopup').css('top',
			($(window).height() - $('#shareNowResultPopup').height()) / 2);
	$('#shareNowResultPopup').css('left',
			($(window).width() - $('#shareNowResultPopup').width()) / 2);

	$('#shareNowResultPopup').show();
	$('#shareNowResultPopup').animate({
	      marginLeft: '0px',
	      opacity: '1'
	    }, 300, function() {});
}

function remindToShare_updateDate(type) {
	$.ajax({
		type: "POST",
		url: "/Application/updateRemindDate",
		data: 'type=' + type,
		error:function(msg) { 
			var msg = _ressources.fr.ERROR_BASIC;
			alertError(msg, 6000);
		},
		success:function(data) {}
	});
}

function popUpProCongratulations() {
	var blackback = $('#popUpProCongratulationsBlackback');
	var close = $('#popUpProCongratulationsClose');
	var ok = $('#popUpProCongratulationsOKButton');

	blackback.fadeIn();

	close.unbind('click');
	close.click(function(e) {
		hidePopupToLeftSide($('#popUpProCongratulationsPopup'),	$('#popUpProCongratulationsBlackback'));
		_addAccount.addAccountBankList.showAddSimpleAccount();
		//redirectMe("/Accounts/index", 2000);
	});

	ok.unbind('click');
	ok.click(function(e) {
		hidePopupToLeftSide($('#popUpProCongratulationsPopup'),	$('#popUpProCongratulationsBlackback'));
		_addAccount.addAccountBankList.showAddSimpleAccount();
		//redirectMe("/Accounts/index", 2000);
	});

	blackback.unbind('click');
	blackback.click(function(e) {
		hidePopupToLeftSide($('#popUpProCongratulationsPopup'), $('#popUpProCongratulationsBlackback'));
		_addAccount.addAccountBankList.showAddSimpleAccount();
		//redirectMe("/Accounts/index", 1000);
	});

	popUpProCongratulations_center();
}

function popUpProCongratulations_center() {
	$('#popUpProCongratulationsPopup').css('top',
			($(window).height() - $('#popUpProCongratulationsPopup').height()) / 2);
	$('#popUpProCongratulationsPopup').css('left',
			($(window).width() - $('#popUpProCongratulationsPopup').width()) / 2);

	$('#popUpProCongratulationsPopup').show();
	$('#popUpProCongratulationsPopup').animate({
	      opacity: '1'
	    }, 500, function() {});
}

function popUpProInfo() {
	var blackback = $('#popUpProInfoBlackback');
	var close = $('#popUpProInfoClose');
	var ok = $('#popUpProInfoOKButton');
	var cancel = $('#popUpProInfoCancelButton');

	blackback.fadeIn();

	close.unbind('click');
	blackback.unbind('click');
	close.click(function(e) {
		hidePopupToLeftSide($('#popUpProInfoPopup'), $('#popUpProInfoBlackback'));
	});

	ok.unbind('click');
	ok.click(function(e) {
		redirectMe("/pluspro", 100);
	});
	
	cancel.unbind('click');
	cancel.click(function(e) {
		hidePopupToLeftSide($('#popUpProInfoPopup'), $('#popUpProInfoBlackback'));
	});

	blackback.click(function(e) {
		hidePopupToLeftSide($('#popUpProInfoPopup'), $('#popUpProInfoBlackback'));
	});

	popUpProInfo_center();
}

function popUpProInfo_center() {
	$('#popUpProInfoPopup').css('top',
			($(window).height() - $('#popUpProInfoPopup').height()) / 2);
	$('#popUpProInfoPopup').css('left',
			($(window).width() - $('#popUpProInfoPopup').width()) / 2);

	$('#popUpProInfoPopup').show();
	$('#popUpProInfoPopup').animate({
	      opacity: '1'
	    }, 500, function() {});
}

function popUpOptIn() {
	var blackback = $('#optInBlackback');
	var close = $('#optInClose');
	var cancel = $('#optInCancelButton');
	var ok = $('#optInOKButton');

	blackback.fadeIn();

	cancel.unbind('click');
	cancel.click(function(e) {
		hidePopupToLeftSide($('#optInPopup'), $('#optInBlackback'));
		window.location = "/Application/signup?optIn=" + encodeURIComponent(false) + 
		"&authenticityToken=" +  $("input[name=authenticityToken]").first().val() +
		"&clientId=" + _analytic.clientId;
	});

	ok.unbind('click');
	ok.click(function(e) {
		hidePopupToLeftSide($('#optInPopup'), $('#optInBlackback'));
		window.location = "/Application/signup?optIn=" + encodeURIComponent(true) +
		"&authenticityToken=" +  $("input[name=authenticityToken]").first().val() +
		"&clientId=" + _analytic.clientId;
	});

	close.unbind('click');
	close.click(function(e) {
		hidePopupToLeftSide($('#optInPopup'), $('#optInBlackback'));
		window.location = "/Application/signup?optIn=" + encodeURIComponent(false) + 
		"&authenticityToken=" +  $("input[name=authenticityToken]").first().val() +
		"&clientId=" + _analytic.clientId;
	});
	
	blackback.unbind('click');
	blackback.click(function(e) {
		hidePopupToLeftSide($('#optInPopup'), $('#optInBlackback'));
		window.location = "/Application/signup?optIn=" + encodeURIComponent(false) + 
		"&authenticityToken=" +  $("input[name=authenticityToken]").first().val() +
		"&clientId=" + _analytic.clientId;
	});

	popUpOptIn_center();
}

function popUpOptIn_center() {
	$('#optInPopup').css('top',
			($(window).height() - $('#optInPopup').height()) / 2);
	$('#optInPopup').css('left',
			($(window).width() - $('#optInPopup').width()) / 2);

	$('#optInPopup').show();
	$('#optInPopup').animate({
	      marginLeft: '0px',
	      opacity: '1'
	    }, "slow", function() {});
}

function popUpOTPNow(message, itemId, callback) {
	/* get jquery object */
	var blackback = $('#OTPBackBlack');
	var input = $('#OTPCodeValue');
	var ok = $('#OTPCodeOK');
	var content = $('#OTPPopContent');
	var title = $('#OTPPopTitle');
	var close = $('#OTPClose');
	
	content.html(message);

	var bankName = $("#bank_" + itemId).find('.bankname').html();
	if (bankName) {
		title.html(bankName);
	} else {
		bankName = $("#AABankName").val();
		title.html(bankName);
	}
	blackback.fadeIn();

	ok.unbind('click');
	ok.click(function(e) {
		sendInfo();
	});

	input.unbind('click');
	blackback.unbind('click');
	
	close.click(function(e) {
		sendInfo();
	});
	
	blackback.click(function(e) {
		ok.effect("shake", {distance : 10}, 300);
	});
	
	function sendInfo() {
		hidePopupToLeftSide($('#OTPPopUp'), $('#OTPBackBlack'));
		_services.ajax.postSetInfoRequired(
				{'itemId' : itemId, 'info' : input.val()},
				function(res) {
					if (res.status == _services.status.ERROR) {
						alertError(_ressources.fr.ERROR_INTERNAL, 4000);
					}
					setTimeout(function() {
						callback(itemId);
					}, 8000);
				},
				function(err) {
					alertError(_ressources.fr.ERROR_INTERNAL, 4000);
					setTimeout(function() {
						callback(itemId);
					}, 8000);
				}
		);
		input.val("");
	}
	popUpOTP_center();
	input.focus();
}

function popUpOTP_center() {
	$('#OTPPopUp').css('top',
			($(window).height() - $('#OTPPopUp').height()) / 2);
	$('#OTPPopUp').css('left',
			($(window).width() - $('#OTPPopUp').width()) / 2);

	$('#OTPPopUp').show();
	$('#OTPPopUp').animate({
	      marginLeft: '0px',
	      opacity: '1'
	    }, 200, function() {});
}
