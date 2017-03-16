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

var secretSeed = lightwallet.keystore.generateRandomSeed();
$("#seed").html(secretSeed);

function wallet_open(secretSeed) { //box aerobic sweet proof warfare alone atom snake amateur spy couple side
	lightwallet.keystore.deriveKeyFromPassword('123123', function (err, pwDerivedKey) {
		var ks = new lightwallet.keystore(secretSeed, pwDerivedKey);
		ks.generateNewAddress(pwDerivedKey, 1);
		var address = ks.getAddresses()[0];
		var prv_key = ks.exportPrivateKey(address, pwDerivedKey);

		localStorage.setItem("openkey", "0x" + address);
		localStorage.setItem("privkey", prv_key);
		localStorage.setItem("isreg", 1);
		localStorage.setItem("mainnet", "off");
		console.log('address and key: ', address, prv_key);
		window.location = 'balance.html';


	});
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
	if (!totalwei) $("#balance").html("? ETH");
	setTimeout(function () {
		var u = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		if (localStorage.getItem("mainnet") == "on") u = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		$.ajax({
			type: "POST",
			url: u,
			dataType: 'json',
			async: false,
			data: JSON.stringify({
				"id": 0,
				"jsonrpc": '2.0',
				"method": 'eth_getBalance',
				"params": [localStorage.getItem("openkey"), "latest"]
			}),
			success: function (d) {
				totalwei = d.result;
				$("#balance").html(d.result / 1000000000000000000 + " ETH");
				if (localStorage.getItem("mainnet") == "off" && totalwei == 0) {
					$.get("https://platform.dao.casino/api/?a=faucet&to=" + localStorage.getItem("openkey"));
				}
			}
		})

		;

	}, 1000);
}

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