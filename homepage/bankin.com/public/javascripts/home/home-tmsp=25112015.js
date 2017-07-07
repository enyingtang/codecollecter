if (typeof _home === "undefined") {
	var _home = {};
}

_home = {
		//animates the slideshow for iphone 
		screenScroller : function (animateThisScreen) {
			    var screenSize = 543;
			    var marginTop = 0;

			    for (var i = 0 ; i < 3; i++) {
			        marginTop += screenSize;
			        $(animateThisScreen).delay(3000).animate({"margin-top" : "-"+marginTop, "easing" : "linear"}, 750);
			    }
			    $(animateThisScreen).delay(3000).fadeOut().animate({"margin-top" : "-0px"}, 100).fadeIn();
				},
		//adds email in the signup form on homepage into url
		emailSignupRedirect : function() {		
	            var email = $.trim($('#signupEmail').val());
	            
	            if (_home.isValidEmail(email)) {
	            	url = "inscription?email=" + encodeURIComponent($("#signupEmail").val());
	            	window.location.href = url;
	            	return false; 
	            }
	            if (!_home.isValidEmail(email)) {
	                var error = "";
	                error = "Le mail renseign&eacute; ne semble pas valide";
	             }
	                _home.alertError(error, 5000);
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
				        $(".navbar-inverse").css({"background-color": "white",
					        					 "border-bottom": "1px solid #3d98cf"
				        });
				        // â€¦
				    } else {
				        $('nav').removeClass('navbar-fixed-top');
				        $('nav').addClass('navbar-static-top');
				        $(".navbar-inverse").css({"background-color": "transparent" 
				        });
				        // â€¦
				    }
				    if ($(windowframe).scrollTop() > offset_show_down) {
				        $('nav').addClass('navbar-show-down');
				         
				        
				      $(".navbar-brand").css({
				        "width": "40px",
				        "height": "40px",
				        "margin-top": "5px",
				        "background-position": "0 -35px"});   
				        
				      $(".navbar-inverse .navbar-nav > li > a").css({
				       "color": "#b4bec8"});
				       
				      $(".navbar-inverse .navbar-nav>li>a").hover(
					  			function () {
						  		$(this).css("color", "#3d98cf");
						  			}, 
							  function () {
							    $(this).css("color", "#b4bec8");
							  }
							);
				       
				      $("#signup").css({
				        "background-color": "#3d98cf",
				        "border": "1px solid #3d98cf",
				        "color": "#fff"});
				        
				      $("#signup").hover(
					  			function () {
						  		$(this).css({
						  			"color": "#fff",
						  			"backgroundColor": "#0a64a0",
						  			"border-color": "#0a64a0"});
						  			}, 
							  function () {
							  	$(this).css({
							  		"color": "#fff",
							  		"backgroundColor": "#3d98cf",
							  		"border-color": "#3d98cf"});
							  }
							);
				       
				    } else {
				        $('nav').removeClass('navbar-show-down');
				        $(".navbar-brand").css({
				        "width": "100px",
				        "height": "25px",
				        "margin-top": "9px",
				        "background-position": "0 0px"});

				        $(".navbar-inverse").css({
				       
						"border-bottom": "1px solid transparent"});
						
						$(".navbar-inverse .navbar-nav > li > a").css({
						"color": "#fff"});
						
						$(".navbar-inverse .navbar-nav>li>a").hover(
					  			function () {
						  		$(this).css("color", "#3d98cf");
						  			}, 
							  function () {
							    $(this).css("color", "#fff");
							  }
							);
						
						$("#signup").css({
				        "background-color": "transparent",
				        "border": "1px solid #3d98cf",
				        "color": "#3d98cf"});
						
						$("#signup").hover(
					  			function () {
						  		$(this).css({
						  			"color": "#fff",
						  			"backgroundColor": "#3d98cf",
						  			"border-color": "#3d98cf"});
						  			}, 
							  function () {
							    $(this).css({
						  			"color": "#3d98cf",
						  			"backgroundColor": "transparent",
						  			"border-color": "#3d98cf"});
						  			}
							  
							);
						
				    }
			},
				//slides the page down to a certain point 
			   bannerSlider: function() {
					    $('html, body').animate({
					        scrollTop: $("#users").offset().top - "180"
					    }, 500);
				},
				//
				checkUriForEmail : function () {
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
				            _home.openLoginFormWithEmail(queryString["email"]);
				        }
   				 },
   				isValidEmail : function(mail) {
   					var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    				return pattern.test(mail);
   				},

   				initClickOnForgottentPassword : function() {
   						$("#forgottenPwd").click(function() {
							if (_home.isValidEmail($.trim($("#login_email").val()))) {
								_home.confirmation("&Ecirc;tes vous s&ucirc;r d'avoir oubli&eacute; votre mot de passe Bankin' ?",
										"Confirmer",
										"Annuler",
										function() { },
										_home.changePassword,
										function() { });
							} else {
								var msg = "Veuillez renseigner votre mail dans le champ correspondant afin que nous puissions vous envoyer les instructions pour r&eacute;cup&eacute;rer votre mot de passe.";
								_home.alertError(msg, 6000);
							}
					});

   				},

   				changePassword : function () { 
   					var email = $.trim($("#login_email").val());
					//
					_services.ajax.postForgottenPassword(
							{
								'authenticityToken' : $("input[name=authenticityToken]").first().val(),
								'email': email
							},
							function(res) {
								if (res.status != _services.status.OK) {
									if (res.status == _services.status.NOT_LOGGED_IN) {
										alertError(_ressources.fr.ERROR_TOKEN, 2000);
										redirectMe(window.location, 2000);
									} else {
										_home.alertError(_ressources.fr.ERROR_BASIC, 6000);
									}
								} else {
									var msg = "Un email contenant les informations pour changer votre mot de passe vient de vous &ecirc;tre envoy&eacute;.";
									_home.alertInfo(msg, 8000);
								}
							},
							function(err) {
								var msg = _ressources.fr.ERROR_BASIC;
								_home.alertError(msg, 6000);
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
				alertInfoTimer = setTimeout('_home.hideAlert()', delay);

   			},

   			alertError : function(msg, delay) {
   				$("#error_popup span").html(msg);
				$("#error_popup").stop().animate({
					"bottom" : "-5px",
					"opacity" : "1"
				}, "slow");
				alertErrorTimer = setTimeout('_home.hideAlert()', delay);
   			},

   			hideAlert : function() {
   				clearTimeout(_home.alertInfoTimer);
				clearTimeout(_home.alertErrorTimer);
				$("#information_popup").stop().animate({
					"bottom" : "-40px",
					"opacity" : "0"
				}, "fast");
				$("#error_popup").stop().animate({
					"bottom" : "-40px",
					"opacity" : "0"
				}, "fast");
   			},

			confirmation : function (msg, label_ok, label_cancel, func_close, func_confirm, func_cancel) {
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
							_home.confirmation_hidePopup();
						});
					} else {
						cancel.click(function(e) {
							_home.confirmation_hidePopup();
						});
					}

					confirm.unbind('click');
					if (func_confirm != null) {
						confirm.click(function(e) {
							func_confirm.call();
							_home.confirmation_hidePopup();
						});
					} else {
						confirm.click(function(e) {
							_home.confirmation_hidePopup();
						});
					}

					close.unbind('click');
					blackback.unbind('click');
					if (func_close != null) {
						close.click(function(e) {
							func_close.call();
							_home.confirmation_hidePopup();
						});

						blackback.click(function(e) {
							func_close.call();
							_home.confirmation_hidePopup();
						});
					} else {
						close.click(function(e) {
							_home.confirmation_hidePopup();
						});
						blackback.click(function(e) {
							_home.confirmation_hidePopup();
						});
					}

					_home.confirmation_center();

					$('#confirmationPopup').slideDown(/* confirmation_showClose */);
				}, 

				 confirmation_center : function() {
				$('#confirmationPopup').css('top',
						($(window).height() - $('#confirmationPopup').height()) / 2);
				$('#confirmationPopup').css('left',
						($(window).width() - $('#confirmationPopup').width()) / 2);
				},

				 confirmation_hidePopup: function () {
					$('#confirmationPopup').slideUp();
					$('#confirmationBlackback').fadeOut();
					enableScroll = true;
				},

				logIn : function() {
					var logEmail = $.trim($('#login_email').val());
					var logPwd = $.trim($('#login_password').val());
					
					if (!_home.isValidEmail(logEmail) || logPwd.length < 6) {
						if (!_home.isValidEmail(logEmail)) {
							$('#login_email').css('border', '2px red solid');
							$('#login_email').focus(function () {
								$(this).css('border', '0px');
							});
						} 
						if (logPwd.length < 6) {
							$('#login_password').css('border', '2px red solid');
							$('#login_password').focus(function () {
								$(this).css('border', '0px');
							});
						}
						return false;
					}
					
					var cssLoginButton = $()
					$('#login_button').css({background: "url(/public/images/app/loader.gif) no-repeat center center", color: "transparent"});
					
					// 
					_services.ajax.postAuthenticate(
							{
								'email' : logEmail, 
								'password' : logPwd, 
								'authenticityToken' : $("input[name=authenticityToken]").first().val(),
								'clientId' : _analytic.clientId
							},
							function(res) {	
								$("#login_button").css({background : "", color: "#60b934"});
								$("#forLoader").css('display', 'none');
								$('#login_button').val('Connexion');
								if (res.status == _services.status.ERROR && 
										(res.data == "email" || res.data == "password")) {
									
									$('#login_email').css('border', '2px red solid');
									$('#login_email').focus(function () {
										$(this).css('border', '0px');
									});
									$('#login_password').css('border', '2px red solid');
									$('#login_password').focus(function () {
										$(this).css('border', '0px');
									});
									_home.alertError(_ressources.fr.LOGIN_FAILED, 3000);
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
								} else if (res.status == _services.status.NOT_LOGGED_IN) {
									alertError(_ressources.fr.ERROR_TOKEN, 1000);
									redirectMe(window.location, 1000);
								} else {
									alertError(_ressources.fr.LOGIN_FAILED, 3000);
								}
							},
							function(err) {
								_home.alertError(_ressources.fr.ERROR_BASIC, 3000);
								
							}
					);
					return false;
				},


				signUpForm : function() {
						var email = $.trim($('#input-email').val());
						var confirmation = $.trim($('#input-email2').val());
						var password = $.trim($('#input-password').val());
						if (!_home.isValidEmail(email) || !_home.isValidEmail(confirmation) || password == undefined || password.length < 6 || email != confirmation) {
							var error = "";
							if (!_home.isValidEmail(email)) {
								_home.highlightBadField('#input-email');
								error = _ressources.fr.EMAIL_INVALID;
							} else if (!_home.isValidEmail(confirmation)) {
								_home.highlightBadField('#input-email2');
								error += _ressources.fr.EMAIL_NOT_SAME;
							} else if (email != confirmation) {
								_home.highlightBadField('#input-email');
								_home.highlightBadField('#input-email2');
								error += _ressources.fr.EMAIL_NOT_SAME;
							}
							if (password == undefined || password.length < 6) {
								_home.highlightBadField('#input-password');
								if (error.length != 0) {
									error += "<br/>";
								} 
								error += _ressources.fr.PWD_TOO_SHORT;
							}
							_home.alertError(error, 5000);
							return false;
						}
						
						// Check if email is valid and not yet used
						_services.ajax.postSimRegister(
								{'email' : email, 'confirmation': confirmation, 'password': password},
								function(res) {
									if (res.status == _services.status.ERROR) {
										if (res.data == 'EMAIL_EXISTS') {
											_home.alertError(_ressources.fr.CREATE_ACCOUNT_EMAIL_EXIST, 3000);
											_home.highlightBadField('#input-email');
											_home.highlightBadField('#input-email2');
										} else if (res.data.indexOf('EMAIL') != -1) {
											_home.alertError(_ressources.fr.EMAIL_INVALID, 3000);
											_home.highlightBadField('#input-email');
											_home.highlightBadField('#input-email2');
										} else {
											_home.alertError(_ressources.fr.PWD_TOO_SHORT, 3000);
										}
									} else if (res.status == _services.status.OK) {
										$('#home').fadeOut(0);
										$('#header').fadeOut(0);
										$('#scroll').fadeOut(0);
										$('#loading').css('display', 'block');
										redirectMe("/cguInscription");
									} else {
										_home.alertError(_ressources.LOGIN_FAILED, 3000);
									}
								},
								function(err) {
									_home.alertError(_ressources.fr.ERROR_BASIC, 6000);
								}
						);
						return false;
			}


} //end _home



$(document).ready(function(){
	
	//navbar slidedown
		 $(window).scroll(function () {
		 		_home.navbarSlider();
		 });

		 // animate screen to slide down to a specific point
		  $(".bannerSlider").click(function() {
		  		_home.bannerSlider();
		  });

		 // bind click and submit events on email signup form on homepage to function
		 $(document).on('submit', '#signupForm', function(e) {
		 		e.preventDefault();
 				_home.emailSignupRedirect(); 
 			});

 		$(document).on('click', '#enregistrer', function(e) {
 				e.preventDefault();
 				_home.emailSignupRedirect();
 				 }); 
	
	init();
	// initialisation 
	// --------------
	function init() {
		
		_home.checkUriForEmail();

		//placeholders in forms for ie8 

		    if(!window.Modernizr.input.placeholder){

		    $('[placeholder]').prev().removeClass("sr-only");
 
			}


		//start animating iPhone screens
		 setInterval(function(){
				    _home.screenScroller("#screen");
				    },1000);

		// Form validation for login form 
		$('#login').submit(function(e) {
			e.preventDefault();
			_home.logIn();

		} );
		
		// Form validation for signup form
		$('#form-signup').submit(function(e) {
			e.preventDefault();
			_home.signUpForm();
		} 

		);
		
		_home.initClickOnForgottentPassword();
		
		// If error when login or subscription
		if ($('#result').html().length > 0) {
			var msg = $('#result').html();
			if (msg.indexOf("EMAIL_ALREADY_EXISTS") != -1) {
				_home.confirmation(_ressources.fr.CREATE_ACCOUNT_EMAIL_EXIST,
						_ressources.fr.CONFIRM,
						_ressources.fr.CANCEL,
						function() { },
						function() { _home.openLoginFormWithEmail(msg); },
						function() { });
			} else {
				_home.alertError(msg, 10000);
			}
		}


	} //end init()
	
});

