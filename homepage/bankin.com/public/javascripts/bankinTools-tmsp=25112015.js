/* ----------------- BankinTools.js ------------------*/
/* ** General Tools for specific function *************/

/*
 *
 */
function isNumber(o)
{
  return ! isNaN (o-0);
}

/*
 * get the height of windows (I believe that we don"t use this function anymore)
 */
function getWindowHeight() {
	// if DOM is good
	if (document.body) {
		return document.body.clientHeight;
	} else {
		return window.innerHeight;
	}
}
/* 
 * Put loader in \tag\ (String)
 * with margin left \ml\ (Number)
 * and margin top \mt\ (Number)
 * return the content of \tag\
 */
function putLoader(tag, ml, mt) {
	var savedHtml = $(tag).html(); 
	$(tag).html("<span class='loading' style='margin-left:" + ml + "px; margin-top:" + mt + "px;'><img src='/public/images/app/loader.gif'></span>");
	return savedHtml;
}

/* delete the html tag of string "html" */
function strip_tags(html) {
	var clean_string = html.replace(/<.*>|javascript:|vbscript|onload(.*?)=/gi, '');

	var result = trim(clean_string);
	
	return result;
}

/* Redirection function */
function redirectMe(redirect_url, delay) {
	var url = redirect_url;
	self.setTimeout(function () {
						window.location = url;
					}, delay) ;
}

/* Delete the space at the begin and the end of string*/
function trim (str) {
	return str.replace(/^\s+/g,'').replace(/\s+$/g,'')
}

/* Change border color to grey */
function greyThisField(field) {
	field.css("border-color", "#EEE");
}

/* Put the result of "source_url" in element "id" */
function putControllerInThisTag(source_url, id) {
	$.ajax({
		type: "GET",
		url: source_url,
		error:function(msg) { },
		success:function(data) {
			checkLogin(data);
			$('#' + id).html(data);
			$("#" + id).fadeIn("slow");
		}
	});
}

/* Return true if the email format is valid, false otherwise */
function check_mail(email) {
	var reg = new RegExp('^[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)+[a-z]{2,6}$', 'i');

	if (reg.test(email)) {
		return true;
	} else {
		return false;
	}
}

function checkIntField(fid) {
	var chkZ = 1;

	var str = $('#' + fid).val();
	
	$('#' + fid).css("color","black");
	for(var i=0; i<str.length; i++) {
		if(str.charAt(i) < "0" || str.charAt(i) > "9") {
			$('#' + fid).css("color","red");
			$('#' + fid).focus();
		}
	}
}

function checkInt(evt, type) {
	evt = evt || window.event;
	var charCode = evt.which || evt.keyCode;
	var charStr = String.fromCharCode(charCode);
 
    // Numbers
	if (charStr % 1 == 0) {
		return true;
    } else {
    	return false ;
    }
}


function checkInt(element, evt, type) {
	evt = evt || window.event;
	var charCode = evt.which || evt.keyCode;
	// Firefox fix for backspace and arrow
	if (charCode === 8 || charCode === 37 || charCode === 38 || charCode === 39 || charCode === 40) {
		return;
	}
	var charStr = String.fromCharCode(charCode);
	if (charStr % 1 == 0) {
		$(element).css('border', 'none');
		return true;
	} else { 
		alertError(_ressources.fr.ONLY_NUMBERS_ALLOWED, 4000);
    	$(element).css('border', '2px solid #FF0000');
    	setTimeout(function() {
    		$(element).css('border', 'none');
    	}, 4000)
    	return false;
	}
}
 
function getSelectedValue(selectId) {
	var selectElmt = document.getElementById(selectId);
	
	return selectElmt.options[selectElmt.selectedIndex].value;
}

function convertFloatToEuro(amount)
{
	return amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
}

function checkLogin(message) {
	
	
	if (message.indexOf('<div id="status">') != -1) {
		window.location = "/?type=0";
		return false;
	}
	return true;
}

/* escape in local browser the special caracters*/
/* caution : it's only safe on local */
function HTMLentities(text)
{
	text = text.replace(/"/g,'&quot;'); // 34 22
	text = text.replace(/&/g,'&amp;'); // 38 26
	text = text.replace(/\'/g,'&#39;'); // 39 27
	text = text.replace(/</g,'&lt;'); // 60 3C
	text = text.replace(/>/g,'&gt;'); // 62 3E
	text = text.replace(/\^/g,'&circ;'); // 94 5E
	text = text.replace(/‘/g,'&lsquo;'); // 145 91
	text = text.replace(/’/g,'&rsquo;'); // 146 92
	text = text.replace(/“/g,'&ldquo;'); // 147 93
	text = text.replace(/”/g,'&rdquo;'); // 148 94
	text = text.replace(/•/g,'&bull;'); // 149 95
	text = text.replace(/–/g,'&ndash;'); // 150 96
	text = text.replace(/—/g,'&mdash;'); // 151 97
	text = text.replace(/˜/g,'&tilde;'); // 152 98
	text = text.replace(/™/g,'&trade;'); // 153 99
	text = text.replace(/š/g,'&scaron;'); // 154 9A
	text = text.replace(/›/g,'&rsaquo;'); // 155 9B
	text = text.replace(/œ/g,'&oelig;'); // 156 9C
	text = text.replace(//g,'&#357;'); // 157 9D
	text = text.replace(/ž/g,'&#382;'); // 158 9E
	text = text.replace(/Ÿ/g,'&Yuml;'); // 159 9F
	// text = text.replace(/ /g,'&nbsp;'); // 160 A0
	text = text.replace(/¡/g,'&iexcl;'); // 161 A1
	text = text.replace(/¢/g,'&cent;'); // 162 A2
	text = text.replace(/£/g,'&pound;'); // 163 A3
	//text = text.replace(/ /g,'&curren;'); // 164 A4
	text = text.replace(/¥/g,'&yen;'); // 165 A5
	text = text.replace(/¦/g,'&brvbar;'); // 166 A6
	text = text.replace(/§/g,'&sect;'); // 167 A7
	text = text.replace(/¨/g,'&uml;'); // 168 A8
	text = text.replace(/©/g,'&copy;'); // 169 A9
	text = text.replace(/ª/g,'&ordf;'); // 170 AA
	text = text.replace(/«/g,'&laquo;'); // 171 AB
	text = text.replace(/¬/g,'&not;'); // 172 AC
	text = text.replace(/­/g,'&shy;'); // 173 AD
	text = text.replace(/®/g,'&reg;'); // 174 AE
	text = text.replace(/¯/g,'&macr;'); // 175 AF
	text = text.replace(/°/g,'&deg;'); // 176 B0
	text = text.replace(/±/g,'&plusmn;'); // 177 B1
	text = text.replace(/²/g,'&sup2;'); // 178 B2
	text = text.replace(/³/g,'&sup3;'); // 179 B3
	text = text.replace(/´/g,'&acute;'); // 180 B4
	text = text.replace(/µ/g,'&micro;'); // 181 B5
	text = text.replace(/¶/g,'&para'); // 182 B6
	text = text.replace(/·/g,'&middot;'); // 183 B7
	text = text.replace(/¸/g,'&cedil;'); // 184 B8
	text = text.replace(/¹/g,'&sup1;'); // 185 B9
	text = text.replace(/º/g,'&ordm;'); // 186 BA
	text = text.replace(/»/g,'&raquo;'); // 187 BB
	text = text.replace(/¼/g,'&frac14;'); // 188 BC
	text = text.replace(/½/g,'&frac12;'); // 189 BD
	text = text.replace(/¾/g,'&frac34;'); // 190 BE
	text = text.replace(/¿/g,'&iquest;'); // 191 BF
	text = text.replace(/À/g,'&Agrave;'); // 192 C0
	text = text.replace(/Á/g,'&Aacute;'); // 193 C1
	text = text.replace(/Â/g,'&Acirc;'); // 194 C2
	text = text.replace(/Ã/g,'&Atilde;'); // 195 C3
	text = text.replace(/Ä/g,'&Auml;'); // 196 C4
	text = text.replace(/Å/g,'&Aring;'); // 197 C5
	text = text.replace(/Æ/g,'&AElig;'); // 198 C6
	text = text.replace(/Ç/g,'&Ccedil;'); // 199 C7
	text = text.replace(/È/g,'&Egrave;'); // 200 C8
	text = text.replace(/É/g,'&Eacute;'); // 201 C9
	text = text.replace(/Ê/g,'&Ecirc;'); // 202 CA
	text = text.replace(/Ë/g,'&Euml;'); // 203 CB
	text = text.replace(/Ì/g,'&Igrave;'); // 204 CC
	text = text.replace(/Í/g,'&Iacute;'); // 205 CD
	text = text.replace(/Î/g,'&Icirc;'); // 206 CE
	text = text.replace(/Ï/g,'&Iuml;'); // 207 CF
	text = text.replace(/Ð/g,'&ETH;'); // 208 D0
	text = text.replace(/Ñ/g,'&Ntilde;'); // 209 D1
	text = text.replace(/Ò/g,'&Ograve;'); // 210 D2
	text = text.replace(/Ó/g,'&Oacute;'); // 211 D3
	text = text.replace(/Ô/g,'&Ocirc;'); // 212 D4
	text = text.replace(/Õ/g,'&Otilde;'); // 213 D5
	text = text.replace(/Ö/g,'&Ouml;'); // 214 D6
	text = text.replace(/×/g,'&times;'); // 215 D7
	text = text.replace(/Ø/g,'&Oslash;'); // 216 D8
	text = text.replace(/Ù/g,'&Ugrave;'); // 217 D9
	text = text.replace(/Ú/g,'&Uacute;'); // 218 DA
	text = text.replace(/Û/g,'&Ucirc;'); // 219 DB
	text = text.replace(/Ü/g,'&Uuml;'); // 220 DC
	text = text.replace(/Ý/g,'&Yacute;'); // 221 DD
	text = text.replace(/Þ/g,'&THORN;'); // 222 DE
	text = text.replace(/ß/g,'&szlig;'); // 223 DF
	text = text.replace(/à/g,'&aacute;'); // 224 E0
	text = text.replace(/á/g,'&aacute;'); // 225 E1
	text = text.replace(/â/g,'&acirc;'); // 226 E2
	text = text.replace(/ã/g,'&atilde;'); // 227 E3
	text = text.replace(/ä/g,'&auml;'); // 228 E4
	text = text.replace(/å/g,'&aring;'); // 229 E5
	text = text.replace(/æ/g,'&aelig;'); // 230 E6
	text = text.replace(/ç/g,'&ccedil;'); // 231 E7
	text = text.replace(/è/g,'&egrave;'); // 232 E8
	text = text.replace(/é/g,'&eacute;'); // 233 E9
	text = text.replace(/ê/g,'&ecirc;'); // 234 EA
	text = text.replace(/ë/g,'&euml;'); // 235 EB
	text = text.replace(/ì/g,'&igrave;'); // 236 EC
	text = text.replace(/í/g,'&iacute;'); // 237 ED
	text = text.replace(/î/g,'&icirc;'); // 238 EE
	text = text.replace(/ï/g,'&iuml;'); // 239 EF
	text = text.replace(/ð/g,'&eth;'); // 240 F0
	text = text.replace(/ñ/g,'&ntilde;'); // 241 F1
	text = text.replace(/ò/g,'&ograve;'); // 242 F2
	text = text.replace(/ó/g,'&oacute;'); // 243 F3
	text = text.replace(/ô/g,'&ocirc;'); // 244 F4
	text = text.replace(/õ/g,'&otilde;'); // 245 F5
	text = text.replace(/ö/g,'&ouml;'); // 246 F6
	text = text.replace(/÷/g,'&divide;'); // 247 F7
	text = text.replace(/ø/g,'&oslash;'); // 248 F8
	text = text.replace(/ù/g,'&ugrave;'); // 249 F9
	text = text.replace(/ú/g,'&uacute;'); // 250 FA
	text = text.replace(/û/g,'&ucirc;'); // 251 FB
	text = text.replace(/ü/g,'&uuml;'); // 252 FC
	text = text.replace(/ý/g,'&yacute;'); // 253 FD
	text = text.replace(/þ/g,'&thorn;'); // 254 FE
	text = text.replace(/ÿ/g,'&yuml;'); // 255 FF
	return text;
}

function isTouchScreenDevice() {
	var uagent = navigator.userAgent.toLowerCase();
	if (navigator.platform.indexOf("iPad") != -1)    	return true; 
	if (navigator.userAgent.match(/iPad/i) != null)  	return true; 
	if (uagent.search("iPad") > -1)                  	return true;
	if (navigator.platform.indexOf("iPhone") != -1)   	return true; 
	if (navigator.userAgent.match(/iPhone/i) != null)  	return true; 
	if (uagent.search("iPhone") > -1)                  	return true;
	if (navigator.platform.indexOf("android") != -1)   	return true; 
	if (navigator.userAgent.match(/android/i) != null)  return true; 
	if (uagent.search("android") > -1)                  return true;
	return false;
}

function zoomDisable(){
	$('head meta[name=viewport]').remove();
	$('head').prepend('<meta name="viewport" content="user-scalable=0" />');
}

function getUserAgent()
{
	var ua = navigator.userAgent;
	
	// For use within normal web clients 
	if(ua.match(/iPad/i) != null)
		return "iPad";
	else if (ua.match(/iPhone/i) != null)
		return "iPhone";
	else if (ua.match(/android/i) != null)
		return "Android";

	return ua;
}

function isLeapYear(year) {
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
		return true;
	} 
}

function removeOneDay(date) {
	var temp = date.split("-");
	var d;
	if (parseFloat(temp[2]) - 1 > 0) {
		d = parseFloat(temp[2]) - 1;
		return temp[0] + "-" + temp[1] + "-" + (d < 10 ? "0" : "" ) + d;
	} else {
		return getEndMonth(addMonth(date, -1));
	}
}

function getEndMonth(date) {
	var temp = date.split("-");
	var month = parseFloat(temp[1]); 
	if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
		d = 31;
	} else if (month == 4 || month == 6 || month == 9 || month == 11 || month == 8) {
		d = 30;
	} else if (isLeapYear(temp[0])) {
		d = 29;
	} else {
		d = 28;
	}
	return temp[0] + "-" + temp[1] + "-" + d;
}

function addMonth(date, months) {
	var items = date.split("-");
	var day = items[2];
	var month = parseFloat(items[1]) + months;
	var year = parseFloat(items[0]);
	var diff = month < 1 ? 1 : -1;
	var diffInYear = 0;
	while (month < 1 || month > 12) {
		month += diff * 12;
		diffInYear -= diff;
	}
	month = (month > 9 ? "" : "0") + month;
	
	year = parseFloat(year) + diffInYear;
	return year + "-" + month + "-" + day
}
