if (typeof _pro === "undefined") {
	var _pro = {};
}

_pro = {
	//animates the slideshow for iphone 
	screenScroller : function(animateThisScreen) {
		var screenSize = 543;
		var marginTop = 0;

		for (var i = 0; i < 3; i++) {
			marginTop += screenSize;
			$(animateThisScreen).delay(3000).animate({
				"margin-top" : "-" + marginTop,
				"easing" : "linear"
			}, 750);
		}
		$(animateThisScreen).delay(3000).fadeOut().animate({
			"margin-top" : "-0px"
		}, 100).fadeIn();
	},
	
	isValidEmail : function(mail) {
		var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return pattern.test(mail);
	},
	
	//adds email in the signup form on homepage into url
	emailSignupRedirect : function() {

		var email = $('#signupEmail').val();

		if (_pro.isValidEmail(email)) {
			url = "inscription.html?email=" + encodeURIComponent($("#signupEmail").val());
			window.location.href = url;
			return false;
		}
		if (!_pro.isValidEmail(email)) {
			_pro.alertError(_ressources.fr.EMAIL_INVALID, 5000);
		}
		return false;
	},
	// slides down the navbar after scrolling offset_show_down 
	navbarSlider : function() {
		var windowframe = $(window);
		var offset_stuck = 100;
		var offset_show_down = 250;
		if ($(windowframe).scrollTop() > offset_stuck) {
			$('nav').addClass('navbar-fixed-top');
			$('nav').removeClass('navbar-static-top');
			$(".navbar-inverse").css({
				"background-color" : "white",
				"border-bottom" : "1px solid #0a64a0"
			});
			// …
		} else {
			$('nav').removeClass('navbar-fixed-top');
			$('nav').addClass('navbar-static-top');
			$(".navbar-inverse").css({
				"background-color" : "transparent"
			});
			// …
		}
		if ($(windowframe).scrollTop() > offset_show_down) {
			$('nav').addClass('navbar-show-down');
			$("#signup").hover(function() {
				$(this).css({
					"color" : "#fff",
					"backgroundColor" : "#0a64a0",
					"border-color" : "#0a64a0"
				});
			}, function() {
				$(this).css({
					"color" : "#0a64a0",
					"backgroundColor" : "transparent",
					"border-color" : "#0a64a0"
				});
			});
		} else {
			$('nav').removeClass('navbar-show-down');
			$(".navbar-inverse").css({
				"border-bottom" : "1px solid transparent"
			});
			$(".navbar-inverse .navbar-nav > li > a").css({
				"color" : "#fff"
			});
			$(".navbar-inverse .navbar-nav>li>a").hover(function() {
				$(this).css("color", "#3d98cf");
			}, function() {
				$(this).css("color", "#fff");
			});

			$("#signup").css({
				"background-color" : "transparent",
				"border" : "1px solid #0a64a0",
				"color" : "#0a64a0"
			});

			$("#signup").hover(function() {
				$(this).css({
					"color" : "#fff",
					"backgroundColor" : "#0a64a0",
					"border-color" : "#0a64a0"
				});
			}, function() {
				$(this).css({
					"color" : "#0a64a0",
					"backgroundColor" : "transparent",
					"border-color" : "#0a64a0"
				});
			});
		}
	},
	//slides the page down to the start of the copy 
	bannerSlider : function() {
		$('html, body').animate({
			scrollTop : $("#users").offset().top - "180"
		}, 500);
	},

	// slides the page down to the sign up form
	signUpSlider : function() {
		$('html, body').animate({
			scrollTop : $(".testimonials").offset().top - "183"
		}, 500);

	},

	//
	checkUriForEmail : function() {
		var queryString = new Array();
		if (queryString.length == 0) {
			if (window.location.search.split('?').length > 1) {
				var params = window.location.search.split('?')[1].split('&');
				for (var i = 0; i < params.length; i++) {
					var key = params[i].split('=')[0];
					var value = decodeURIComponent(params[i].split('=')[1]);
					queryString[key] = value;
				}
			}
		}
		if (queryString["email"] != null) {

			$('#input-email').val(queryString["email"]);
			_pro.openLoginFormWithEmail(queryString["email"]);
		}
	},
	isValidEmail : function(mail) {
		var pattern = new RegExp(
				/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return pattern.test(mail);
	},

	initClickOnForgottentPassword : function() {
		$("#forgottenPwd")
				.click(
						function() {
							if (_pro.isValidEmail($("#login_email").val())) {
								_pro
										.confirmation(
												_ressources.fr.FORGOTTEN_PWD_CONFIRM,
												_ressources.fr.CONFIRM,
												_ressources.fr.CANCEL,
												function() {
												}, _pro.changePassword,
												function() {
												});
							} else {
								_pro.alertError(_ressources.fr.EMAIL_EMPTY_FORGOTTEN_PWD, 6000);
							}
						});

	},

	changePassword : function() {
		var email = $("#login_email").val();
		//
		_services.ajax.postForgottenPassword(
				{
					'email' : email
				},
				function(res) {
					if (res.status != _services.status.OK) {
						_pro.alertError(_ressources.fr.ERROR_BASIC, 6000);
					} else {
						_pro.alertInfo(_ressources.fr.FORGOTTEN_PWD_EMAIL_SENT, 8000);
					}
				},
				function(err) {
					pro.alertError(_ressources.fr.ERROR_BASIC, 6000);
				}
		);
	},

	openLoginFormWithEmail : function(msg) {
		$('#login_email').val(msg);

		if (!$('#dropdown_menu').hasClass('open')) {
			$('.dropdown-toggle').dropdown('toggle');
		}

	},

	highlightBadField : function(field) {
		$(field).addClass('invalid');
	},

	alertInfo : function(msg, delay) {
		$("#information_popup span").html(msg);
		$("#information_popup").stop().animate({
			"bottom" : "-5px",
			"opacity" : "1"
		}, "slow");
		alertInfoTimer = setTimeout('_pro.hideAlert()', delay);

	},

	alertError : function(msg, delay) {
		$("#error_popup span").html(msg);
		$("#error_popup").stop().animate({
			"bottom" : "-5px",
			"opacity" : "1"
		}, "slow");
		alertErrorTimer = setTimeout('_pro.hideAlert()', delay);
	},

	hideAlert : function() {
		clearTimeout(_pro.alertInfoTimer);
		clearTimeout(_pro.alertErrorTimer);
		$("#information_popup").stop().animate({
			"bottom" : "-40px",
			"opacity" : "0"
		}, "fast");
		$("#error_popup").stop().animate({
			"bottom" : "-40px",
			"opacity" : "0"
		}, "fast");
	},

	confirmation : function(msg, label_ok, label_cancel, func_close,
			func_confirm, func_cancel) {
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
				_pro.confirmation_hidePopup();
			});
		} else {
			cancel.click(function(e) {
				_pro.confirmation_hidePopup();
			});
		}

		confirm.unbind('click');
		if (func_confirm != null) {
			confirm.click(function(e) {
				func_confirm.call();
				_pro.confirmation_hidePopup();
			});
		} else {
			confirm.click(function(e) {
				_pro.confirmation_hidePopup();
			});
		}

		close.unbind('click');
		blackback.unbind('click');
		if (func_close != null) {
			close.click(function(e) {
				func_close.call();
				_pro.confirmation_hidePopup();
			});

			blackback.click(function(e) {
				func_close.call();
				_pro.confirmation_hidePopup();
			});
		} else {
			close.click(function(e) {
				_pro.confirmation_hidePopup();
			});
			blackback.click(function(e) {
				_pro.confirmation_hidePopup();
			});
		}

		_pro.confirmation_center();

		$('#confirmationPopup').slideDown(/* confirmation_showClose */);
	},

	confirmation_center : function() {
		$('#confirmationPopup').css('top',
				($(window).height() - $('#confirmationPopup').height()) / 2);
		$('#confirmationPopup').css('left',
				($(window).width() - $('#confirmationPopup').width()) / 2);
	},

	confirmation_hidePopup : function() {
		$('#confirmationPopup').slideUp();
		$('#confirmationBlackback').fadeOut();
		enableScroll = true;
	},

	logIn : function() {
		if (!_pro.isValidEmail($('#login_email').val())
				|| $('#login_password').val().length < 6) {
			if (!_pro.isValidEmail($('#login_email').val())) {
				$('#login_email').css('border', '2px red solid');
				$('#login_email').focus(function() {
					$(this).css('border', '0px');
				});
			}
			if ($('#login_password').val().length < 6) {
				$('#login_password').css('border', '2px red solid');
				$('#login_password').focus(function() {
					$(this).css('border', '0px');
				});
			}
			return false;
		}
		$('#login_button').val('');
		$('#forLoader').html("<img src='/public/images/app/loader.gif'>");

		// 
		_services.ajax
				.postAuthenticate(
						{
							'email' : $('#login_email').val(),
							'password' : $('#login_password').val(),
							'authenticityToken' : $("input[name=authenticityToken]").first().val(),
							'clientId' : _analytic.clientId
						},
						function(res) {
							$("#forLoader").css('display', 'none');
							$('#login_button').val('Connexion');
							if (res.status == _services.status.ERROR
									&& (res.data == "email" || res.data == "password")) {

								$('#login_email')
										.css('border', '2px red solid');
								$('#login_email').focus(function() {
									$(this).css('border', '0px');
								});
								$('#login_password').css('border',
										'2px red solid');
								$('#login_password').focus(function() {
									$(this).css('border', '0px');
								});
								_pro.alertError(_ressources.fr.LOGIN_FAILED, 3000);
							} else if (res.status == _services.status.OK) {
								$('#home').fadeOut(0);
								$('#header').fadeOut(0);
								$('#scroll').fadeOut(0);
								$(".nav").fadeOut(0);
								$('#loading').css('display', 'block');

								if (res.data == "firstSteps") {
									redirectMe("/Accounts/index?firstSteps=true", 1000);
								} else {
									redirectMe("/Accounts/index", 1000);
								}
							} else {
								_pro.alertError(_ressources.fr.LOGIN_FAILED, 3000);
							}
						},
						function(err) {
							_pro.alertError(_ressources.fr.ERROR_INTERNAL, 3000);

						});
		return false;
	}
} //end _pro

$(document)
		.ready(
				function() {

					// image slider for piechart
					$('.carousel').carousel({
						interval : 2000
					});

					//navbar slidedown
					$(window).scroll(function() {
						_pro.navbarSlider();
					});
					var timerId;
					$(window).bind('scroll', function() {
						clearTimeout(timerId)
						timerId = setTimeout(function() {

						}, 50)
					});

					// animate screen to slide down to a specific point
					$(".bannerSlider").click(function(e) {
						_pro.bannerSlider();
						e.preventDefault();
					});

					// animate screen to slide down to a specific point
					$(".signup_button").click(function() {
						_pro.signUpSlider();
					});

					init();
					// initialisation 
					// --------------
					function init() {

						_pro.checkUriForEmail();

						//placeholders in forms for ie8 

						if (!window.Modernizr.input.placeholder) {
							$('[placeholder]').prev().removeClass("sr-only");
						}

						//start animating iPhone screens
						setInterval(function() {
							_pro.screenScroller("#screen");
						}, 1000);

						// Form validation for login form 
						$('#login').submit(function(e) {
							e.preventDefault();
							_pro.logIn();

						});

						_pro.initClickOnForgottentPassword();

						// If error when login or subscription
						if ($('#result').html().length > 0) {
							var msg = $('#result').html();
							if (msg.indexOf("EMAIL_ALREADY_EXISTS") != -1) {
								_pro.confirmation(
												_ressources.fr.CREATE_ACCOUNT_EMAIL_EXIST,
												_ressources.fr.CONFIRM,
												_ressources.fr.CANCEL,
												function() {
												},
												function() {
													_pro.openLoginFormWithEmail(msg);
												}, function() {
												});
							} else {
								_pro.alertError(msg, 10000);
							}
						}

					} //end init()

				});

/// jquery taken from old subscribe pro page

var step0 = $(".step0");
var step1 = $(".step1");
var step2 = $(".step2");

window.onload = function() {
	$(function() {
		$("#buyer_email").watermark("Entrez votre adresse e-mail");
		$("#email2").watermark("Confirmez votre adresse e-mail");
		$("#pwd1").watermark("Entrez votre mot de passe");
		$("#pwd2").watermark("Confirmez votre mot de passe");
		$("#raisonsociale").watermark("Raison sociale de l'entreprise *");
		$("#activity").watermark("Votre activité *");
		$("#employees").watermark("Nombre de salariés *");
		$("#billing_address1").watermark("Rue *");
		$("#billing_city").watermark("Ville *");
		$("#billing_zip").watermark("Code Postal *");
		$("#country").watermark("Pays *");
	});

	$("#btnNext0").mouseup(function() {
		nextstep1();
	});
	
	

	function nextstep1() {
		var email1 = $("#buyer_email").val();
		var email2 = $("#email2").val();
		var pwd1 = $("#pwd1").val();
		var pwd2 = $("#pwd2").val();

		if (email1 == "" || email2 == "") {
			$("#errorMsg").html(_ressources.fr.EMAIL_EMPTY);
			if (email1 == "") {
				$("#buyer_email").focus();
				return;
			}
			if (email2 == "") {
				$("#email2").focus();
				return;
			}
		}
		if (email1 != email2) {
			$("#errorMsg").html(_ressources.fr.EMAIL_NOT_SAME);
			$("#email2").focus();
			return;
		}
		if (!_pro.isValidEmail(email1)) {
			$("#errorMsg").html(_ressources.fr.EMAIL_INVALID);
			$("#buyer_email").focus();
			return;
		}
		if (pwd1 == "" || pwd2 == "") {
			$("#errorMsg").html(_ressources.fr.PWD_EMPTY);
			if (pwd1 == "") {
				$("#pwd1").focus();
				return;
			}
			if (pwd2 == "") {
				$("#pwd2").focus();
				return;
			}
		}
		if (pwd1 != pwd2) {
			$("#errorMsg").html(_ressources.fr.PWD_NOT_SAME);
			$("#pwd2").focus();
			return;
		}

		if (pwd1.length < 6) {
			$("#errorMsg").html(_ressources.fr.PWD_TOO_SHORT);
			return;
		}
		if ($("#cgu_check").prop('checked') == false) {
			$("#errorMsg").html(_ressources.fr.NEED_CGU_CONFIRM);
			return;
		}
		$("#loader1").css("visibility", "visible");
		$("#errorMsg").html("");
		_services.ajax
				.postSimRegister(
						{
							'email' : email1,
							'confirmation' : email2,
							'password' : pwd1
						},
						function(res) {
							$("#loader1").css("visibility", "hidden");
							if (res.status == _services.status.ERROR) {
								errorOnRegister(res);
							} else if (res.status == _services.status.OK) {
								_services.ajax.postRegister(
										{
											'optIn' : $("#cgu_check").prop('checked'),
											'mktCampaign' : $("#partner_name").val(),
											'authenticityToken' : $("input[name=authenticityToken]").first().val(),
											'clientId' : _analytic.clientId
										},
												function(res) {
													if (res.status == _services.status.ERROR) {
														errorOnRegister(res);
													} else {
														$(".step1").css("visibility", "visible");
														$(".step1").fadeTo(200, 1, function() {
															$("#btnNext0").fadeTo(200, 0, function() {
																$("#btnNext0").hide(200);
															});
														});
													}
												},
												function(err) {
													$("#errorMsg").html(_ressources.fr.LOGIN_FAILED);
												});
							} else {
								$("#errorMsg").html(_ressources.fr.LOGIN_FAILED);
							}
						},
						function(err) {
							$("#loader1").css("visibility", "hidden");
							$("#errorMsg").html(_ressources.fr.ERROR_BASIC);
						});
	}

	function errorOnRegister(res) {
		if (res.data == 'EMAIL_EXISTS') {
			$("#errorMsg").html(_ressources.fr.CREATE_ACCOUNT_EMAIL_EXIST);
		} else if (res.data.indexOf('EMAIL') != -1) {
			$("#errorMsg").html(_ressources.fr.EMAIL_INVALID);
		} else {
			$("#errorMsg").html(_ressources.fr.PWD_TOO_SHORT);
		}
	}

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	$("#raisonsociale").keydown(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#activity").keydown(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#employees").keydown(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#billing_address1").keydown(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#billing_city").keydown(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#billing_zip").keydown(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#country").keydown(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	//
	//
	$("#raisonsociale").keyup(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#activity").keyup(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#employees").keyup(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#billing_address1").keyup(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#billing_city").keyup(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#billing_zip").keyup(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});
	$("#country").keyup(function() {
		if (allFieldCompleted()) {
			completeSubscription();
		}
	});

	$("#submitText").click(function() {
		completeSubscription();
	});

	$("#submitText2").click(function() {
		completeSubscription();
	});

	function allFieldCompleted() {
		var raisonsocial = $("#raisonsociale").val();
		var activity = $("#activity").val();
		var nbemployees = $("#employees").val();
		var street = $("#billing_address1").val();
		var city = $("#billing_city").val();
		var zip = $("#billing_zip").val();
		var country = $("#country").val();
		if (raisonsocial == "" || activity == "" || street == "" || city == ""
				|| zip == "" || country == "") {
			return false;
		}
		return true;
	}

	function completeSubscription() {
		$("#errorMsg2").html("");
		//(String email, String raisonsocial, String activity, String nbemployees,
		//		String street, String city, String state, String zip, String country)
		var raisonsocial = $("#raisonsociale").val();
		var activity = $("#activity").val();
		var nbemployees = $("#employees").val();
		var street = $("#billing_address1").val();
		var city = $("#billing_city").val();
		var zip = $("#billing_zip").val();
		var country = $("#country").val();
		if (!isNumber(zip)) {
			$("#errorMsg2").html(_ressources.fr.ZIP_CODE_INCORRECT);
			return;
		}
		if (!isNumber(nbemployees)) {
			$("#errorMsg2").html(_ressources.fr.EMPLOYEE_NUMBER_INCORRECT);
			return;
		}

		if (raisonsocial == "" || activity == "" || nbemployees == ""
				|| street == "" || city == "" || zip == "" || country == "") {
			$("#errorMsg2").html(_ressources.fr.ALL_FIELD_MANDATORY);
			return;
		}

		if (zip.length < 5) {
			$("#errorMsg2").html(_ressources.fr.ZIP_CODE_LENGTH);
			return;
		}

		$("#errorMsg2").html("");
		_services.ajax.postRegisterProInformation({
			'authenticityToken' : $("input[name=authenticityToken]").first().val(),
			'raisonsocial' : raisonsocial,
			'activity' : activity,
			'nbemployees' : nbemployees,
			'street' : street,
			'city' : city,
			'zip' : zip,
			'country' : country
		}, function(res) {
		}, function(err) {
		});
		if ($("#submitText").length > 0) {
			$("#submitText").css({
				cursor : "default"
			});
		}
		$("input[name=item_number]").val($("#buyer_email").val());
		$("#formPaypal").css({
			opacity : 0.0,
			visibility : "visible"
		}).animate({
			opacity : 1.0
		});
	}
}
