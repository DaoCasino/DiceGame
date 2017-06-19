// Vault keystore

if (!localStorage.getItem('keystore')) {
    $('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="' + window.location.origin + window.location.search + '">Platform</a>');
}

var ks = lightwallet.keystore.deserialize(localStorage.getItem('keystore'));

var sendingAddr, mainnet, openkey, privkey,
    mainnetAddress, testnetAddress,
    maxBetEth, lastTx, count, new_count,
    sends, paids, password,
    Timer, animate, RndGen, addressDice, socket;

var login_obj = {
    'confirmedGames': {}
};
var balance = 1;
var urlBalance = "";
var betEth = 0.01;
var chance = 32768;
var game = false;
var bInitGame = false;
var bankroll = 1000;
var nonceTx = "";

var _arGames = [];
var _arUnconfirmedGames = [];
var _arEndGames = [];

var _callback;

var infura = new Infura();

function loadData() {
    if (isLocalStorageAvailable()) {
        if (localStorage.getItem('daocasino_dice')) {
            var login_str = localStorage.getItem('daocasino_dice');
            login_obj = JSON.parse(login_str);
        }

        testnetAddress = localStorage.getItem(' testnetAddress');
        mainnetAddress = localStorage.getItem('mainnetAddress');
        mainnet = localStorage.getItem('mainnet');
        openkey = localStorage.getItem('openkey');
        privkey = localStorage.getItem('privkey');
        sendingAddr = openkey.substr(2);
    }

    console.log("version 0.6 BET"); // VERSION !
    console.log("mainnet:", mainnet);
    console.log("openkey:", openkey);
    console.log("privkey:", privkey);
};

function getContractBalance() {
    bankroll = callERC20("balanceOf", addressDice);
    console.log(addressDice);
    $('#contractBalance').html("CONTRACT ( " + bankroll / 100000000 + " BET )");
};

function setContract() {
    var q_params = (function () {
        var params = {};
        if (window.location.href.split('?').length < 2) {
            return params;
        }
        var parts = window.location.href.split('?')[1].split('&');
        for (var k in parts) {
            var kv = parts[k].split('=');
            params[kv[0]] = kv[1];
        }
        return params;
    }());

    $.ajax("https://platform.dao.casino/api/proxy.php?a=bankrolls").done(function (d) {
        setTimeout(setContract, 3000);
        var _arr = JSON.parse(d);
        var valid = new Array();
        if (!_arr) {
            // Действие в случае отсутсвия банкролла
            $('#bg_popup.bankroll').show().find('h1').html('No online bankroller. Come back later or <a href="http://casino.us1.list-manage1.com/subscribe?u=a3e08ccb6588d9d43141f24a3&id=c5825597c2">become a bankroller</a> !<br>');
            return;
        }
        $('#bg_popup.bankroll').hide()
        if (_arr.length && !bInitGame) {
            for (var j = 0; j < _arr.length; j++) {
                console.log()
                if (validGames(_arr[j])) {
                    valid.push(_arr[j])
                }
            }
            if (valid.length) {
                $("#bankrollers").html("Bankrollers: " + valid.length);
                addressDice = valid[0];
                if (q_params.address) {
                    addressDice = q_params.address;
                }
                initGame();
                return;
            } else {
                $('#bg_popup.bankroll').show().find('h1').html('No online bankroller. Come back later or <a href="http://casino.us1.list-manage1.com/subscribe?u=a3e08ccb6588d9d43141f24a3&id=c5825597c2">become a bankroller</a> !<br>');
                return;
            }
        }
    });
}

function validGames(contract) {
    var res = false;
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
                "to": "0x1dd99846d322e30dc299cbd953b026dc590cdf11",
                "data": "0xfb97a77e" + pad(contract.substr(2), 64)
            }, "latest"]
        }),
        success: function (d) {
            if (d.result.substr(-1) == "1") {
                res = true;
            }
        }
    })
    return res;

};

function initGame() {
    if (bInitGame) {
        return false;
    }
    bInitGame = true;

    loadData();

    _callback = response;

    $("#contract").html(
        '<a target="_blank" href="https://' + getNet() +
        '.etherscan.io/address/' + addressDice + '">' +
        addressDice.slice(0, 24) + '...</a>'
    );

    paids = infura.ethCall("getTotalEthSended", openkey, "pending") / 100000000;
    sends = infura.ethCall("getTotalEthPaid", openkey, "pending") / 100000000;
    count = infura.ethCall("totalRollsByUser", openkey, "pending");

    var totalRollMade = infura.ethCall("getTotalRollMade", openkey, "pending");

    $("#total-rolls").html(totalRollMade);
    $("#total-paid").html(paids.toFixed(3) + ' BET');
    $("#total-send").html(sends.toFixed(3) + ' BET (' + ((paids / sends) * 100).toFixed(2) + '%)');

    getContractBalance();

    Refresh();

    if (getAllowance(addressDice) < 1000000) {
        $('#bg_popup.allowance').show().find('h1').html('Bankroll connect... Please, wait one minute... <br>');
        animateTimer(60);
        approve(addressDice, 100000000000);
        window.approveT = setTimeout(function () {
            window.location.reload();
        }, 42000);
    }

    var AllowanceProc = setInterval(function () {
        if (getAllowance(addressDice) > 1000000) {
            $('#bg_popup.allowance').hide();
            clearInterval(AllowanceProc);
            clearTimeout(window.approveT);
        }
    }, 5000);

    webSocket("wss://ws.dao.casino/ws").onmessage = function (event) {
        if (!event || !event.data) {
            return;
        }

        var msg = JSON.parse(event.data).data.substr(2);

        var player = "0x" + msg.substr(24, 64);
        var bet = hexToNum(msg.substr(64, 64)) / 100000000;

        var playerNum = hexToNum(msg.substr(128, 64));
        var chance = playerNum / (65536) * 100;

        var payout = (65536 - 1310) / playerNum;
        var profit = payout * bet - bet;



        var state = hexToNum(msg.substr(256, 64));
        var rnd = hexToNum(msg.substr(320, 64));
        var tx = JSON.parse(event.data).transaction

        if (rnd != 0) {

            addRow(seed, tx, player, bet, playerNum, rnd, state);
        }




        if ($('#table tr').length > 10) {
            $('tr:eq(11)').remove();
        }
    };

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
        var _bet = ((bankroll / 100000000) / 10) / ((65536 - 1310) / chance);
        maxBetEth = Math.min(_bet, balance, 10);
        if (betEth > maxBetEth) {
            betEth = +maxBetEth.toFixed(4);
        }
        if (betEth < 0.001) {
            betEth = 0.001;
        }
        $("#profit-on-win").val(((betEth * (65536 - 1310) / chance) - betEth).toFixed(6));
        $("#payout").val("x" + ((65536 - 1310) / chance).toFixed(5));
        $("#slider-dice-one").slider("option", "max", maxBetEth * 1000);
        $("#amount-one").val(betEth);
        $("#slider-dice-one").slider("value", betEth * 1000);
    }
};

function makeid() {
    var str = "0x";
    var possible = "abcdef0123456789";

    for (var i = 0; i < 64; i++) {
        if (getTimer() % 2 == 0) {
            str += possible.charAt(Math.floor(Math.random() * possible.length));
        } else {
            str += possible.charAt(Math.floor(Math.random() * (possible.length - 1)));
        }
    }
    str = numToHex(str);
    return "0x" + web3_sha3(str);
}

function startGame() {
    if (openkey) {
        game = true;
        if (nonceTx != "") {
            nonceTx = numToHex(hexToNum(nonceTx) + 1);
            console.log("NONCE:", nonceTx);
            responseTransaction("roll", nonceTx);
        } else {
            infura.sendRequest("roll", openkey, _callback);
        }
    } else {
        $("#randomnum").text("Sorry, you do not have a key");
    }
}

function gameend() {
    disabled(false);
    getAllLogs();
    clearInterval(Timer);
    clearInterval(animate);
    count = new_count;
    game = false;
    //$('.active').click();
    $('#amount-one').change();
    $("#randomnum").fadeIn("slow", 1);
    Refresh();
};

function addRow(idGame, tx, player, bet, playerNum, rnd, state) {
    var color;
    var chance = playerNum / (65536) * 100;
    var payout = (65536 - 1310) / playerNum;
    var profit = payout * bet - bet;

    if (state == 1) {
        state = "<div class=\"icon-w\">WIN</div>";
        color = "#d08c49";
    } else if (state == 2) {
        state = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
        profit = -bet;
        color = "gray";
    } else {
        state = "...pending...";
        color = "gray";
    }

    $(".dice-table#table").prepend([
        '<tr id="' + idGame + '">',
        '<td  aria-label="TRANSACTION"><a target="_blank" href="https://' + getNet() + '.etherscan.io/tx/' + tx + '">' + "0x" + player.slice(2, 12) + '...</a> <br></td>',

        '<td  aria-label="" class="progress">',
        '<div class="tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content" style="height:10px" >',
        '<div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width:' + chance + '%; background:' + color + ';margin:0px;"></div></div>',
        '<div class="tooltip" style="left:' + rnd / 65536 * 100 + '%">' + rnd + '</div>',
        '</td>',

        '<td class="state" aria-label="RESULT">' + state + '</td>',
        '<td  aria-label="BET">' + bet.toFixed(3) + ' BET</td><td  aria-label="PAYOUT">x' + payout.toFixed(3) + '</td><td  aria-label="PROFIT">' + profit.toFixed(3) + ' BET</td></tr>'
    ].join(''));
};

function updateRow(seed, rnd) {
    var chance = _arGames[seed];
    var color;
    var state;
    if (chance > rnd) {
        state = "<div class=\"icon-w\">WIN</div>";
        color = "#d08c49";
    } else {
        state = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
        color = "gray";
    }

    $('tr#' + seed.substr(0, 10) + ' td.state').html(state);
    $('tr#' + seed.substr(0, 10) + ' td.progress').html(
        ['<div class="tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content" style="height:10px" >',
            '<div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width:' + chance / 65536 * 100 + '%; background:' + color + ';margin:0px;"></div></div>',
            '<div class="tooltip" style="left:' + rnd / 65536 * 100 + '%">' + rnd + '</div>'
        ].join('')
    );

}

function getMyLogs() {
    $("#table tbody tr").each(function () {
        var t = $(this).find('td[aria-label="TRANSACTION"] a').text();
        if (t.substr(0, 10) != openkey.substr(0, 10)) {
            $(this).hide();
        }
    });
}

function getAllLogs() {
    $("tr").show();
}

function showResult(value, rnd, seed) {
    if (_arEndGames[seed]) {
        return false;
    }

    switch (value) {
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

    updateRow(seed, rnd);
}

// RESPONSE (SERVER, CONTRACT)
function responseServer(rnd, seed) {
    // console.log("responseServer:", value);
    var result = 0;

    var chance = _arGames[seed];
    if (chance) {
        if (rnd > chance) {
            result = 2;
        } else {
            result = 1;
        }
        console.log("showResult: client", result, rnd);
        showResult(result, rnd, seed);
    } else {
        console.log("Game " + seed + " undefined");
    }
}

function responseTransaction(name, value) {
    var data = "";
    var price = 0;
    var nameRequest = "sendRaw";
    var gasPrice = "0x9502F9000"; //web3.toHex('40000000000');
    var gasLimit = 0x927c0; //web3.toHex('600000');
    if (name == "roll") {
        data = "0x1f7b4f30" + pad(numToHex(chance), 64);
        price = betEth * 100000000;
    }

    var options = {};
    options.nonce = value;
    options.to = addressDice;
    options.gasPrice = gasPrice;
    options.gasLimit = gasLimit;
    // options.value = price;
    // options.data  = data;

    if (!privkey || !ks) {
        console.log("ERROR_TRANSACTION");
        console.error(privkey, buf, ks);
        return;
    }

    ks.keyFromPassword("1234", function (err, pwDerivedKey) {
        if (err) {
            console.log("ERROR_TRANSACTION:", err);
            return false;
        }
        var seed = makeid();
        console.log("SEED:", seed)
        var args = [price, chance, seed];
        var registerTx = lightwallet.txutils.functionTx(contract_dice_abi, name, args, options);
        var params = "0x" + lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, sendingAddr);

        infura.sendRequest(nameRequest, params, _callback, seed);
        // create list games
        _arGames[seed] = chance;

        if (typeof ga == "function") {

            ga('ecommerce:addTransaction', {
                'id': seed,
                'affiliation': 'RollDice',
                'revenue': price / 100000000,
                //'shipping': '0',
                //'tax': '0',
                'currency': 'USD' // local currency code.
            });
            ga('ecommerce:send');
            ga('send', 'event', "click", "rolldice");
        }

        // var objGame = {time=getTimer(), seed=seed, endGame=false};
        // _arUnconfirmedGames.push(objGame);
    });
}

function response(command, value, seed) {
    if (value == undefined) {
        if (command == "sendRaw") {
            $("#randomnum").text("Sorry, transaction failed");
            gameend();
        }
        return false;
    }
    if (command == "sendRaw") {
        // console.log("sendRaw:", value);
        var lastTx = value;
        console.log("addRow:", count);
        addRow(seed.substr(0, 10), lastTx, openkey, betEth, chance, 0, 0);
        $("#Tx").html('<a target="_blank" href="https://' + getNet() + '.etherscan.io/tx/' + lastTx + '">' + lastTx.slice(0, 24) + '...</a>');
        $("#randomnum").text("Please, wait . . . ");

        Timer = setInterval(function () {
            new_count = infura.ethCall("totalRollsByUser", openkey, "pending");
            // console.log("detected count:", new_count, count);
            if (new_count != count) {
                var result = infura.ethCall("getStateByAddress", seed, "pending");
                var rnd = infura.ethCall("getShowRnd", seed, "pending");
                console.log("showResult: contract", result, rnd, seed);
                if (result > 0) {
                    console.log("!!!");
                    showResult(result, rnd, seed);
                    _arEndGames[seed] = true;
                }
            }
        }, 3000);
    } else if (command == "responseServer") {
        responseServer(value, seed);
    } else if (command == "roll") {
        nonceTx = value;
        responseTransaction(command, value);
    }
}

// UPDATE
function update() {
    if (!openkey) {
        $("#label").text("Please, sign in");
        disabled(true);
        return;
    }

    balance = $('#balance').html();
    balance = +balance.substr(0, balance.length - 4);
    balance = +balance.toFixed(8);
    if (balance < 0.02 && !game || !balance) {
        disabled(true);
        $("#label").html(" You don't have money, please visit <a href='" + window.location.origin + "/balance.html'>balance page</a>");

        //$('#randomnum').text("Please, up balance")
    } else if (balance > 0.01 && !game) {
        disabled(false);
        $("#label").text("Click Roll Dice to place your bet:");
    }
    $("#your-balance").val(balance);
}

setInterval(update, 1000);

function animateTimer(second) {
    var time = second;
    var t = setInterval(function () {
        $("#timer").html(time + " second");
        time--;
        if (time < 0) {
            clearInterval(t);
        }

    }, 1000)
}