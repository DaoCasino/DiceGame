$(document).ready(function () {

	/* POPUP */

	$('.open-register').click(function () {
		$('.window-open-registr').slideDown();
		$('#popup-open-text-before').slideDown();
		$('.window-seed').slideUp();
		$('.popup-button').slideUp();
		$('#popup-open-text-after').slideUp();
	});

	$('.dialog-window-cancel').click(function () {
		$('.popup-button').slideDown();
		$('.window-open-registr').slideDown();
		$('#popup-open-text-after').slideDown();
		$('.window-seed').slideDown();
		$('#popup-open-text-before').slideUp();
		$('.window-open-registr').slideUp();
	});

	$('.open-dialog-window').click(function () {
		$('.dialog-content').slideUp();
		$('.popup-button').slideUp();
		$('.dialog-window-two').slideDown();
	});

	$('.dialog-window-cancel-two').click(function () {
		$('.dialog-window-two').slideUp();
		$('.popup-button').slideDown();
	});

	/* AND POPUP */

	$('.toggle-bg input').click(function () {
		if ($('input#checked-on:checked')) {
			$('.free-money').toggleClass('free-money__enable');
			$('.real-money').toggleClass('free-money__disabled');
		}
	});

	$('.open-menu').click(function () {
		$('.mobile-menu').toggleClass('open-mobile-menu');
		$('.mobile-menu-overlay').toggleClass('open-menu-overlay');
	});

	$('.mobile-menu-overlay, .closed-mnu').click(function () {
		$('.mobile-menu').removeClass('open-mobile-menu');
		$('.mobile-menu-overlay').removeClass('open-menu-overlay');
	});

	$(".cat-menu").click(function () {
		$(this).next().slideToggle();
	});

	// Popup window

	$('.popup-with-move-anim').magnificPopup({
		type: 'inline',

		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: true,
		preloader: false,

		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-slide-bottom'
	});

});

if (localStorage.getItem("isreg")) {
	$("#isreg").show();
	$("#regbut").hide();
} else {
	$("#isreg").hide();
	$("#regbut").css("visibility", "visible");

}

if(localStorage.getItem('isreg')!= null && !localStorage.getItem('keystore') ){
	$('#alarm').html("THIS ACCOUNT DOES NOT SUPPORT TOKENS.<br> CREATE A NEW ACCOUNT!")
}

var secret = lightwallet.keystore.generateRandomSeed();
$("#seed").html(secret);
function wallet_open(secretSeed) {
	
	if(secretSeed == secret){
		$('#btnContinue').html("wait..");
	var password = "1234";
	lightwallet.keystore.createVault({
		password: password,
		seedPhrase: secretSeed, // Optionally provide a 12-word seed phrase
	}, function (err, ks) {
		ks.keyFromPassword(password, function (err, pwDerivedKey) {
			if (err) throw err;
			ks.generateNewAddress(pwDerivedKey, 1);
			var addr = ks.getAddresses()[0];
			var prv_key = ks.exportPrivateKey(addr, pwDerivedKey);
			var keystorage = ks.serialize();
			var openkey = "0x"+addr;
			localStorage.setItem("keystore", keystorage);
			localStorage.setItem("isreg", 1);
			localStorage.setItem("openkey", "0x" + addr);
		 	localStorage.setItem("privkey", prv_key);
			localStorage.setItem("mainnet", "off");
			console.log(addr, prv_key);
			$.get( "https://platform.dao.casino/api/?a=faucet&to="+openkey);
			window.location = "balance.html";
			
		});
	});
	
	
}
else{
	$('#popup-open-text-before').html('Please, enter your seed phrase')

}



	// lightwallet.keystore.deriveKeyFromPassword('123123', function (err, pwDerivedKey) {
	// 	ks = new lightwallet.keystore(secretSeed, pwDerivedKey);
	// 	ks.generateNewAddress(pwDerivedKey, 1);
	// 	var ser = ks.serialize()
	// 	console.log(ser);

	// 	var address = ks.getAddresses()[0];
	// 	var prv_key = ks.exportPrivateKey(address, pwDerivedKey);
	// 	localStorage.setItem("openkey", "0x" + address);
	// 	localStorage.setItem("privkey", prv_key);
	// 	localStorage.setItem("isreg", 1);
	// 	localStorage.setItem("mainnet", "off");
	// 	localStorage.setItem("keystore", ser);
	// 	console.log('address and key: ', address, prv_key);
	// 	//


	// });
}



function setCookie(name, value, options) {
	options = options || {};
	options.expires = 10000000;
	var expires = options.expires;

	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	var updatedCookie = name + "=" + value;

	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

var lochash = location.hash.substr(1);
if (ref = lochash.substr(lochash.indexOf('ref_')).split('_')[1]) {
	setCookie("ref", ref);
}


$(".toggle-bg").click(function () {

	localStorage.setItem("mainnet", $("input[name=toggle]:checked").val());
	mainnet = localStorage.getItem('mainnet');
	if (!localStorage.getItem("mainnet")) {
		localStorage.setItem("mainnet", "off");
	}

	rebalance();
});



if (localStorage.getItem("mainnet") == "on") {

	$(".free-money").addClass("free-money__enable");
	$(".real-money").addClass("free-money__disabled");
	rebalance();
	$("#checked-on").click();
	localStorage.setItem("mainnet", "on");
} else {
	rebalance();
	$.get()
}
var totalwei;

function rebalance() {
var openkey = localStorage.getItem('openkey')
	if(openkey){
	if (!totalwei) $("#balance").html("? BET");
	setTimeout(function () {
		//var erc20address = "0x95a48dca999c89e4e284930d9b9af973a7481287"; // tesnet
		// var erc20address = "0xb207301c77a9e6660c9c2e5e8608eaa699a9940f"; // testrpc
		callData = "0x70a08231";
		//var urlInfura = "https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl";	
		// var urlInfura = "http://46.101.244.101:8545";
		//if (localStorage.getItem("mainnet") == "on") u = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		$.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [{
                "from": openkey,
                "to": erc20address,
                "data": callData + pad(numToHex(openkey.substr(2)), 64)
            }, "latest"]
        }),
			success: function (d) {
				totalwei = d.result;

				$("#balance").html(d.result / 100000000 + " BET");
				if (localStorage.getItem("mainnet") == "off" && totalwei == 0) {
				}
			}
		})

		;

	}, 1000);
}}

setInterval(rebalance, 5000);



$.removeCookie = function (key, options) {
	if ($.cookie(key) === undefined) { // this line is the problem
		return false;
	}

	// Must not alter options, thus extending a fresh object...
	$.cookie(key, '', $.extend({}, options, {
		expires: -1
	}));
	return !$.cookie(key);
};

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};