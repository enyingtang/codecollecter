if (typeof _services === "undefined") {
	var _services = {};
}

_services.ajax = {

	communicate : function(callBack, callBackError, apiPath, data, method) {
		var url = "" + apiPath;

		var conf = {
			url : url,
			timeout : 60000
		};
		if (method == 'POST') {
			conf['method'] = 'POST';
			conf['headers'] = {
				'Content-Type' : 'application/x-www-form-urlencoded'
			};
			conf["data"] = $.param(data);
		} else {
			conf['method'] = 'GET';
			if (data) {
				conf['data'] = data;
			}
			conf['headers'] = {};
		}

		$.ajax({
			type : conf['method'],
			url : conf['url'],
			data : conf['data'],
			headers : conf['headers'],
			error : function(err) {
				callBackError(err);
			},
			success : function(res) {
				if (res.status == _services.status.NOT_LOGGED_IN && apiPath != '/Application/authenticate' &&
						apiPath != '/Application/startForgottenPassword' && apiPath != '/Application/startForgottenPassword' &&
						apiPath != '/Application/signupAjax' && apiPath != '/Application/registerProInformation') {
					window.location = "https://bankin.com";
				}
				callBack(res);
			}
		});
	},
	//
	// Home
	//
	postAuthenticate : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Application/authenticate', data, 'POST');
	},

	postSimRegister : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Application/simRegister', data, 'POST');
	},

	postForgottenPassword : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Application/startForgottenPassword', data, 'POST');
	},
	
	postRegister : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Application/signupAjax', data, 'POST');
	},
	
	postRegisterProInformation : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Application/registerProInformation', data, 'POST');
	},
	//
	// Accounts
	//
	
	postNeedRemind : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Application/needRemind', data, 'POST');
	},
	
	postCgu : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Application/getCGU', data, 'POST');
	},

	postAnalysis : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Analysis/index', data, 'POST');
	},
	
	postShowEditIdsAccount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/showEditIdsAccount', data, 'POST');
	},
	
	postListTransactions : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/listTransactions', data, 'POST');
	},
	
	postUpdateTransactionCategory : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/updateTransactionCategory', data, 'POST');
	},
	
	postExport : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Export/index', data, 'POST');
	},
	
	postUpdateTransactionNote : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/updateTransactionNote', data, 'POST');
	},
	
	postShowTransaction : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/showTransaction', data, 'POST');
	},
	
	postUpdateTransactionMoveToMonth : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/updateTransactionMoveToMonth', data, 'POST');
	},
	
	postAccountRefresh : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/refresh', data, 'POST');
	},
	
	postAccountRefreshGetStatus : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/getStatus', data, 'POST');
	},
	
	//
	// Analysis
	//
	postChangeBudgetAccount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Analysis/changeBudgetAccountsList', data, 'POST');
	},
	
	postAccountIndex : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Accounts/index', data, 'POST');
	},
	
	postListSortedCategoriesWithAmount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Analysis/listSortedCategoriesWithAmountAjax', data, 'POST');
	},
	
	//
	// Settings
	//
	postSettingsEditAccount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/showEditAccount', data, 'POST');
	},
	
	postUpdateUserAlertEmail : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/updateUserAlertEmail', data, 'POST');
	},
	
	postAddAlertBalance : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/addAlertBalance', data, 'POST');
	},
	
	postDelAlertBalance : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/delAlertBalance', data, 'POST');
	},
	
	postAddAlertTransaction : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/addAlertTransaction', data, 'POST');
	},
	
	postDelAlertTransaction : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/delAlertTransaction', data, 'POST');
	},
	
	postUpdateDailyPush : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/updateDailyPush', data, 'POST');
	},
	
	postUpdateDailyMail : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/updateDailyMail', data, 'POST');
	},
	
	postUpdateHideInternalTransactions : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/updateHideInternalTransactions', data, 'POST');
	},
	
	postUpdateMoveWages : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/updateMoveWages', data, 'POST');
	},
	
	postDeleteAccount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/deleteAccount', data, 'POST');
	},
	
	postDeleteBankinAccount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/deleteBankinAccount', data, 'POST');
	},
	
	postDeactivateBankinAccount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/deactivateBankinAccount', data, 'POST');
	},
		
	//
	// AddAccount
	//
	postAddAccount : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AddAccount/addAccount', data, 'POST');
	},
	
	postGetStatus : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AddAccount/getStatus', data, 'POST');
	},
	
	postSetInfoRequired : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AddAccount/setInfoRequired', data, 'POST');
	},
	
	//
	// Custom Cat
	//
	postAddCustomCat : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/addCustomCat', data, 'POST');
	},

	postEditCustomCat : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/renCustomCat', data, 'POST');
	},

	postDelCustomCat : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Settings/delCustomCat', data, 'POST');
	},

	postListCategories : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/AccountsAjax/listCategories', data, 'POST');
	},
	
	//
	// Feedback
	//
	postSendFeedBack : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/Feedback/sendFeedback', data, 'POST');
	},
	
	//
	// FirstSteps
	//
	postInviteFriendMail : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/FirstSteps/inviteFriendByMail', data, 'POST');
	},
	
	postEditProfile : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/FirstSteps/editProfile', data, 'POST');
	},
	
	postUseSCode : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/FirstSteps/useSCode', data, 'POST');
	},
	
	postAuthFb : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/FirstSteps/authFb', data, 'POST');
	},
	
	//
	// Popups
	//
	getBecomeProTrial : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/popups/becomeProTrial', data, 'GET');
	},
	
	//
	// Payment
	//
	paymentSubscribe : function(data, callBack, callBackError) {
		return this.communicate(callBack, callBackError, '/payment/subscribe', data, 'POST');
	}
}