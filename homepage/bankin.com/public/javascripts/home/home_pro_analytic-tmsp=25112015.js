/*Bankin Pro Analytics tracking */

/*Custom variables for Google analytics. There are 5 slots in total that can be used.

 Variable 1: It logs whether a user is on the Bankin' Pro, Bankin' Plus or Bankin' plan. It is set on session scope.
 Variable 2: It logs the source of a Bankin Pro user -> whether the subscription was from a partner or not. It is set on a vistor scope. Therefore, never override!
 Variable 3: not used.
 Variable 4: not used.
 Variable 5: not used.

 */
$(document).ready(function() {
	
	function findReferrersNameforProPage() {
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
		if (queryString["partner"] != null) {
			return queryString["partner"];
		} else {
			return "Not from a Partner"
		}
	
	}
	var referralSource = findReferrersNameforProPage();
	
	_gaq('set', 'Pro Partner', referralSource);
		
	/*Events for Pro Page */
	
	$('div#btnNext0').click(
			function() {
				_gaq('send', 'event', {
					eventCategory: 'Bankin Pro Landing Page',
				    eventAction: 'Click',
				    eventLabel: 'Clicked on Suivant on Signup Form'
				});
			});
	
	$('form#formPaypal input').click(
			function() {
				_gaq('send', 'event', {
					eventCategory: 'Bankin Pro Landing Page',
				    eventAction: 'Click',
				    eventLabel: 'Clicked on Proceder a linscription on Signup Form'
				});	
			});
});
