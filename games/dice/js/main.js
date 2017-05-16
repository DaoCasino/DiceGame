var abi = [{"constant":true,"inputs":[],"name":"addr_erc20","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getBank","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalEthPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"random_id","type":"bytes32"}],"name":"timeout","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"totalRollsByUser","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ownerStoped","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"random_id","type":"bytes32"}],"name":"getStateByAddress","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"listGames","outputs":[{"name":"player","type":"address"},{"name":"bet","type":"uint256"},{"name":"chance","type":"uint256"},{"name":"seed","type":"bytes32"},{"name":"state","type":"uint8"},{"name":"rnd","type":"uint256"},{"name":"block","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"random_id","type":"bytes32"}],"name":"getStateById","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"random_id","type":"bytes32"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"confirm","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"random_id","type":"bytes32"}],"name":"getShowRnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"Stop","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"usedRandom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"countRolls","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"adr","type":"address"}],"name":"setAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalEthSended","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"PlayerBet","type":"uint256"},{"name":"PlayerNumber","type":"uint256"},{"name":"seed","type":"bytes32"}],"name":"roll","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"time","type":"uint256"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"bet","type":"uint256"},{"indexed":false,"name":"chance","type":"uint256"},{"indexed":false,"name":"seed","type":"uint96"},{"indexed":false,"name":"rnd","type":"uint256"}],"name":"logGame","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"Id","type":"bytes32"}],"name":"logId","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"}],"name":"logPlayer","type":"event"}]
var ks = localStorage.getItem('keystore');
ks = lightwallet.keystore.deserialize(ks);
var sendingAddr;
var rawMsg;
var login_obj = {};
login_obj["confirmedGames"] = {};

var options_mainet = false;
var options_testnet = true;
var options_rpc = false;

var balance = 1;
var urlBalance = ""; //balance
// 6 ETH var addressContract = "0x1c864f1851698ec6b292c936acfa5ac5288a9d27";
// main
//var addressContract = "";
// testrpc
//var	addressRpcContract = "0xdbdb232171a8639603e1341b8d62a5425f5d2ddd";
// testnet
//var	addressTestContract = "0x1c864f1851698ec6b292c936acfa5ac5288a9d27";

// if(options_testnet){
// 	addressContract = addressTestContract;
// } else if(options_rpc){
// 	addressContract = addressRpcContract;
// }

var betEth = 0.01; //0,2 ставка эфира
var mainnet, openkey, privkey, mainnetAddress, testnetAddress;
var chance = 32768;
var urlInfura = "http://46.101.244.101:8545";
//var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var lastTx, count, new_count, sends, paids, password;
var game = false;
var Timer, animate;
var maxBetEth;
var infura = new Infura();
var _callback;
var _arGames = [];
var _arUnconfirmedGames = [];
bankroll = 1000;

var RndGen;
// 100000, 64000, "0x639a1fd07cf885e1453fda734ab8f8bcaf6dcdfe70d3231cfca784323f8aeaaa"
// "0x639a1fd07cf885e1453fda734ab8f8bcaf6dcdfe70d3231cfca784323f8aeaaa", 28, "dsf", "hgf"

function toFixed(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
};

function numToHex(num) {
    return num.toString(16);
};

function hexToNum(str) {
    return parseInt(str, 16);
};

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

function getTimer(){
	var d = new Date();
	var n = d.getTime();
	return n;
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        console.log("localStorage_failed:", e);
        return false;
    }
};

function saveData() {
	if(isLocalStorageAvailable()){
		var login_str = JSON.stringify(login_obj);
		localStorage.setItem('daocasino_dice', login_str);
	}
}

function loadData() {
    if (isLocalStorageAvailable()) {
		if (localStorage.getItem('daocasino_dice')){
			var login_str = localStorage.getItem('daocasino_dice')
			login_obj = JSON.parse(login_str);
		}
		
        testnetAddress = localStorage.getItem(' testnetAddress')
        mainnetAddress = localStorage.getItem('mainnetAddress')
        mainnet = localStorage.getItem('mainnet')
        openkey = localStorage.getItem('openkey')
        privkey = localStorage.getItem('privkey')
        sendingAddr = openkey.substr(2);
    }
    console.log("version 0.54 BET") // VERSION !
    console.log("mainnet:", mainnet)
    console.log("openkey:", openkey)
    console.log("privkey:", privkey)
};

function call(callname, adr) {
    var result;
    var callData;
    switch (callname) {
        case "totalRollsByUser":
            callData = "9288cebc";
            break;
        case "getShowRnd":
            callData = "db571498";
            break;
        case "getTotalRollMade":
            callData = "df257ba3";
            break;
        case "getTotalEthSended":
            callData = "efddba39";
            break;
        case "getTotalEthPaid":
            callData = "71b207f7";
            break;
        case "getStateByAddress":
            callData = "08199931"
            break;
        case "balanceOf":
            callData = "70a08231";
            break;
        case "timeout":
            callData = "795ea18e";
            break;
    }
	callData = "0x" + callData;
	
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
                "to": addressContract,
                "data": callData + pad(numToHex(adr.substr(2)), 64)
            }, "pending"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
	
    return result;
};

function getContract(game, network) {
    var result;
    var gameid;
    var networkid;
    switch (game) {
        case "HackDAO":
            gameid = "1";
            break;
        case "Dice":
            gameid = "2";
            break;
        case "Blackjack":
            gameid = "3";
            break;
    }
    switch (network) {
        case "testnet":
            networkid = "1";
            break;
        case "mainnet":
            networkid = "2";
            break;
    }
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
                "to": "0x3b5d9ed79ca06fdb9759b2c39857bf2c76112051",
                "data": "0x3d185fc5" + pad(numToHex(gameid), 64) + pad(numToHex(networkid), 64)
            }, "pending"]
        }),
        success: function (d) {
            result = "0x" + d.result.substr(26);
        }
    });
    return result;
};

function setContract() {
    /*if (mainnet == "on") {
        urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = getContract("Dice", "mainnet");
        disabled(true);
        $('#randomnum').text("Coming soon")
    } else if (mainnet == "off") {
        urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        //addressContract = getContract("Dice", "testnet");
        addressContract = "0x560B674BEaAA429E66E73507A55975B8b2587B0D";
        $('#randomnum').text("");
    }*/
};

function getContractBalance() {
    bankroll = callERC20("balanceOf", addressContract);
    $('#contractBalance').html("CONTRACT ( " + bankroll / 100000000 + " BET )");
};

function timeout() {
	
}

setInterval(function () {
    if (openkey) {
        //balance = callERC20("balanceOf", openkey)/100000000
        balance = $('#balance').html();
        balance = +balance.substr(0, balance.length - 4);
        balance = +balance.toFixed(8);
        if (balance < 0.02 && !game || !balance) {
            disabled(true);
            $("#label").text(" NO MONEY ");
            //$('#randomnum').text("Please, up balance")
        } else if (balance > 0.01 && !game) {
            disabled(false);
            $("#label").text("Click Roll Dice to place your bet:");
        }
        $("#your-balance").val(balance);
        //Refresh();
    } else {
        $("#label").text("Please, sign in");
        disabled(true);
    }
}, 1000);

/*setInterval(function () {
    if (openkey) {
		if(game){
			// Confirm();
			timeout();
		}
    }
}, 1000*60*5);*/

function initGame() {
    loadData();
    setContract();
	_callback = response;
    paids = (call("getTotalEthSended", openkey)) / 100000000;
    sends = (call("getTotalEthPaid", openkey)) / 100000000;
    setContract();
    count = call("totalRollsByUser", openkey)
    console.log("old_count", count);
    $("#total-rolls").html(call("getTotalRollMade", openkey));
    $("#total-paid").html(paids.toFixed(3) + ' BET');
    $("#total-send").html(sends.toFixed(3) + ' BET (' + ((paids / sends) * 100).toFixed(2) + '%)');
    getContractBalance();
    $("#contract").html('<a target="_blank" href="https://ropsten.etherscan.io/address/' + addressContract + '">' + addressContract.slice(0, 24) + '...</a>')
    GetLogs();
    $('#all').click();
    Refresh();
    if (allowance() < 1000000){
        approve(100000000000);
    } 
    
    webSocketConnect("ws://localhost:8081/ws");
};

function disabled(status) {
    $("#slider-dice-one").slider({
        disabled: status
    });
    $("#slider-dice-two").slider({
        disabled: status
    });
    $("#amount-one").attr('readonly', status);
    $("#less-than-wins").attr('readonly', status);
    $("#roll-dice").attr('disabled', status);
    status ? $("#roll-dice").css({
        background: 'gray'
    }) : $("#roll-dice").removeAttr('style');

};

function Refresh() {
    if (betEth == NaN) {
        betEth = 0;
    }
    if (balance != 0) {
        var _bet = (30) / ((65536 - 1310) / chance);
        maxBetEth = Math.min(_bet, balance, 10);
        if (betEth > maxBetEth) {
            betEth = +maxBetEth.toFixed(4);
            // $("#slider-dice-one").slider("option", "max", maxBetEth * 1000);
            // $("#amount-one").val(betEth);
        }
        if (betEth < 0.0001) {
            betEth = 0.0001;
            // $("#amount-one").val(betEth);
        }
        $("#profit-on-win").val(((betEth * (65536 - 1310) / chance) - betEth).toFixed(6));
        $("#payout").val("x" + ((65536 - 1310) / chance).toFixed(5));
        $("#slider-dice-one").slider("option", "max", maxBetEth * 1000);
        $("#amount-one").val(betEth);
        $("#slider-dice-one").slider("value", betEth * 1000);
    }
};

function makeid(){
    var str = "0x";
    var possible = "abcdef0123456789";

    for( var i=0; i < 64; i++ ){
		if(getTimer()%2==0){
			str += possible.charAt(Math.floor(Math.random() * possible.length));
		} else {
			str += possible.charAt(Math.floor(Math.random() * (possible.length-1)));
		}
	}

	str = numToHex(str);
	// console.log("makeid:", str);
    return str;
}

function startGame() {
	if(openkey){
		game = true;
		infura.sendRequest("roll", openkey, _callback);
	} else {
		$("#randomnum").text("Sorry, you do not have a key");
	}
}

function responseServer(value, seed) {
	console.log("responseServer:", value);
	
	var chance = _arGames[seed];
	if(chance){
		if (value > chance) {
			$("#randomnum").text("YOU LOSE");
			gameend();
		} else {
			$("#randomnum").text("YOU WIN!");
			gameend();
		}
	} else {
		console.log("Game " + seed + " undefined");
	}
}

function responseTransaction(name, value) {
	var data = "";
	var price = 0;
	var nameRequest = "sendRaw";
	var gasPrice="0x9502F9000";//web3.toHex('40000000000');
	var gasLimit=0x927c0; //web3.toHex('600000');
	if(name == "roll"){
		data = "0x1f7b4f30" + pad(numToHex(chance), 64);
		price = betEth * 100000000;
	}
	
	var options = {};
	options.nonce = value;
	options.to = addressContract;
	options.gasPrice = gasPrice;
	options.gasLimit = gasLimit;
	// options.value = price;
	// options.data = data;
	
	if(privkey){
		if(buf == undefined){
			console.log("ERROR_TRANSACTION");
		} else {
			// console.log("The transaction was signed:", name);
			
			if(ks){
				ks.keyFromPassword("1234", function (err, pwDerivedKey) {
					if (err) {
						console.log("ERROR_TRANSACTION:", err);
						return false;
					}
					var seed = makeid();
					var args = [price, chance, seed];
					var registerTx = lightwallet.txutils.functionTx(abi, name, args, options);
					var params = "0x"+lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, sendingAddr);
					infura.sendRequest(nameRequest, params, _callback, seed);
					// create list games
					_arGames[seed] = chance;
					// var objGame = {time=getTimer(), seed=seed, endGame=false};
					// _arUnconfirmedGames.push(objGame);
				})
			} else {
				console.log("ERROR_TRANSACTION");
			}
		}
	}
}

function response(command, value, seed) {
	if(value == undefined){
		if(command == "sendRaw"){
			$("#randomnum").text("Sorry, transaction failed");
            gameend();
		}
		return false;
	}
	
	if(command == "sendRaw"){
		// console.log("sendRaw:", value);
		var lastTx = value;
		$("#Tx").html('<a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + '">' + lastTx.slice(0, 24) + '...</a>')
		$(".dice-table#table").prepend('<tr><td><a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + ' "> ' + openkey.slice(0, 12) + '...</a> <br></td><td colspan="5" style="height: 63px"> ...pending... </td></tr>');
		disabled(true);
		$("#randomnum").text("Please, wait . . . ");
		
		Timer = setInterval(function () {
			new_count = call("totalRollsByUser", openkey);
			// console.log("detected count:", new_count, count);
			if (new_count != count) {
				var result = call("getStateByAddress", openkey);
				// console.log("getStatusGame:", result);
				switch (result) {
					case 1:
						// console.log("YOU WIN!");
						$("#randomnum").text("YOU WIN!");
						gameend();
						break;
					case 2:
						// console.log("LOSS");
						$("#randomnum").text("YOU LOSE");
						gameend();
						break;
					case 3:
						// console.log("Sorry, No money in the bank");
						$("#randomnum").text("Sorry, no money in the bank");
						gameend();
						break;
					default:
						// console.log("run game");
						break;
				}
			}
		}, 3000);
	} else if(command == "responseServer"){
		responseServer(value, seed);
	} else if(command == "roll"){
		responseTransaction(command, value);
	}
}

function gameend() {
    disabled(false);
    GetLogs();
    clearInterval(Timer);
    clearInterval(animate);
    count = new_count;
    game = false;
    //$('.active').click();
    $('#amount-one').change();
    $("#randomnum").fadeIn("slow", 1)
    Refresh();
};

var socket;


function webSocketConnect(address) {
    var socket = new WebSocket(address);
    socket.onmessage = function (event) {
        JSON.parse(event.data, function (key, value) {
            if (key == 'data')
            parseMsg(value)
        });
    };
    socket.onerror = function (error) {
        console.log("Ошибка " + error.message);
    };

    socket.onopen = function () {
        console.log("Соединение установлено.");
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            alert('Соединение закрыто чисто');
        } else {
            console.log('Обрыв соединения');
           setTimeout(webSocketConnect(address), 5000);  // например, "убит" процесс сервера
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

}

function parseMsg(mes){
console.log("message:",mes)
var msg = mes.substr(2);
var player = "0x"+msg.substr(24,64);
var bet = hexToNum(msg.substr(64,64)) / 100000000;
var chance = hexToNum(msg.substr(128,64))  / (65536) * 100;
var playerNum = hexToNum(msg.substr(128,64))
console.log("num",playerNum)
var payout = (65536 - 1310) / playerNum
var profit = payout*bet - bet;

var state =  hexToNum(msg.substr(256,64));
var rnd = hexToNum(msg.substr(320,64));
var tx = msg.substr(384,66)
console.log("message:", player, bet, chance, playerNum, payout, profit)
 if (state == 1) {
                    state = "<div class=\"icon-w\">WIN</div>";
                    color = "#d08c49";
                } else if (state == 2) {
                    state = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
                    profit = -bet;
                    color = "gray";
                }else{
                     state = "...pending..."
                     color = "gray";

                }

//console.log(player, bet, chance, payout, profit, state, rnd)
console.log(tx)
$(".dice-table#table").prepend('<tr><td  aria-label="TRANSACTION"><a target="_blank" href="https://ropsten.etherscan.io/tx/' + tx + '">'+ "0x" + player.slice(2, 12) + '...</a> <br></td><td  aria-label="">' +
                    "<div class=\" tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content \" style=\" height:10px\" ><div class=\"ui-progressbar-value ui-corner-left ui-widget-header \" style=\"width:" + chance + "%; background:" + color +  ";margin:0px;\"></div></div><div class=\"tooltip\" style=\"left:" + rnd / 65536 * 100 + "%\">" + rnd + "</div>" + ' </td><td  aria-label="RESULT">' + state + '</td><td  aria-label="BET">' + bet.toFixed(3) + ' BET</td><td  aria-label="PAYOUT">x' + payout.toFixed(3) + '</td><td  aria-label="PROFIT">' + profit.toFixed(3) + ' BET</td></tr>');
 if( $('#table tr').length > 10 ){
    $('tr:eq(11)').remove(); 
}   
          
    
}




