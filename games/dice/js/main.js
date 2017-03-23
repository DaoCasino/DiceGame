var balance = ".::::.";
var urlBalance = ""; //balance
// 6 ETH var addressContract = "0x1c864f1851698ec6b292c936acfa5ac5288a9d27";
var addressContract = "0xe061a411d69853155d221edc7c837b338f23730d";
var betEth; //0,2 ставка эфира
var mainnet, openkey, privkey, mainnetAddress, testnetAddress;
var chance = 32768;
var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var lastTx, count, new_count, sends, paids;
var game = false;
var Timer, animate;

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

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        console.log("localStorage_failed:", e);
        return false;
    }
};

function loadData() {
    if (isLocalStorageAvailable()) {
        testnetAddress = localStorage.getItem(' testnetAddress')
        mainnetAddress = localStorage.getItem('mainnetAddress')
        kovanAddress = localStorage.getItem('kovanAddress')
        mainnet = localStorage.getItem('mainnet')
        openkey = localStorage.getItem('openkey')
        privkey = localStorage.getItem('privkey')
    }
    console.log("version 0.42c Infura") // VERSION !
    console.log("mainnet:", mainnet)
    console.log("openkey:", openkey)
    console.log("privkey:", privkey)
};

function call(callname) {
    var result;
    var callData;
    switch (callname) {
        case "totalRollsByUser":
            callData = "0x9288cebc";
            break;
        case "getShowRnd":
            callData = "0xdb571498";
            break;
        case "getTotalRollMade":
            callData = "0x9e92c991";
            break;
        case "getTotalEthSended":
            callData = "0x46f76648";
            break;
        case "getTotalEthPaid":
            callData = "0xf6353590";
            break;
        case "getStateByAddress":
            callData = "0x08199931"
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
                "to": addressContract,
                "data": callData + pad(numToHex(openkey.substr(2)), 64)
            }, "latest"]
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
            }, "latest"]
        }),
        success: function (d) {
            result = "0x" + d.result.substr(26);
        }
    });
    return result;
};

function setContract() {
    if (mainnet == "on") {
        urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = getContract("Dice", "mainnet");
        disabled(true);
        $('#randomnum').text("Coming soon")
    } else if (mainnet == "off") {
        urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = getContract("Dice", "testnet");
        $('#randomnum').text("");
    }
};

function getContractBalance() {
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": 'eth_getBalance',
            "params": [addressContract, "latest"]
        }),
        success: function (d) {
            $('#contractBalance').html("CONTRACT ( " + (d.result / 1000000000000000000).toFixed(5) + " ETH )");
        }
    });
};
setInterval(function () {
    if (openkey) {
        balance = $('#balance').html();
        balance = +balance.substr(0, balance.length - 4);
        balance = +balance.toFixed(8);
        if (balance < 0.02 && !game) {
            disabled(true);
            $("#label").text(" NO MONEY ");
            $('#randomnum').text("Please, top up balance")
        } else if (balance > 0.01 && !game) {
            disabled(false);
            $("#label").text("Click Roll Dice to place your bet:");
        }
        $("#your-balance").val(balance);
        if (balance) {
            $("#slider-dice-one").slider("option", "max", (balance * 1000) - 20);
        }
    } else {
        $("#label").text("Please, sign in");
        disabled(true);
    }
}, 100);

function initGame() {
    loadData();
    setContract();
    paids = (call("getTotalEthSended") / 10000000000000000000).toFixed(6);
    sends = (call("getTotalEthPaid") / 10000000000000000000).toFixed(6);
    Refresh();
    setContract();
    count = call("totalRollsByUser")
    console.log("old_count", count);
    $("#total-rolls").html(call("getTotalRollMade"));
    $("#total-paid").html(paids + ' ETH');
    $("#total-send").html(sends + ' ETH (' + ((paids / sends) * 100).toFixed(2) + '%)');
    getContractBalance();
    $("#contract").html('<a target="_blank" href="https://testnet.etherscan.io/address/' + addressContract + '">' + addressContract.slice(0, 24) + '...</a>')
    GetLogs();
    $('#all').click();

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
    $("#profit-on-win").val(((betEth * (65536 - 1310) / chance) - betEth).toFixed(6));
    $("#payout").val("x" + ((65536 - 1310) / chance).toFixed(5));
};

function startGame() {
    game = true;
    if (openkey) {
        $.ajax({
            type: "POST",
            url: urlInfura,
            dataType: 'json',
            async: false,
            data: JSON.stringify({
                "id": 0,
                "jsonrpc": '2.0',
                "method": "eth_getTransactionCount",
                "params": [openkey, "latest"]
            }),
            success: function (d) {
                console.log("urlInfura:", urlInfura);
                console.log("get nonce action " + d.result);
                var callData = "0x1f7b4f30";
                var options = {};
                options.nonce = d.result;
                options.to = addressContract;
                // call function game() in contract
                options.data = callData + pad(numToHex(chance), 64); // method from contact
                options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
                options.gasLimit = 0x927c0; //web3.toHex('600000');
                options.value = betEth * 1000000000000000000;
                if (privkey) {
                    if (buf == undefined) {
                        console.log("ERROR_TRANSACTION");
                    } else {
                        //приватный ключ игрока, подписываем транзакцию
                        var tx = new EthereumTx(options);
                        tx.sign(new buf(privkey, 'hex'));
                        var serializedTx = tx.serialize().toString('hex');
                        console.log("The transaction was signed: " + serializedTx);
                        $.ajax({
                            type: "POST",
                            url: urlInfura,
                            dataType: 'json',
                            async: false,
                            data: JSON.stringify({
                                "id": 0,
                                "jsonrpc": '2.0',
                                "method": "eth_sendRawTransaction",
                                "params": ["0x" + serializedTx]
                            }),
                            success: function (d) {
                                console.log("Транзакция отправлена в сеть:", d.result);
                                lastTx = d.result;
                                if (lastTx == undefined) {
                                    $("#randomnum").text("Sorry, transaction failed");
                                    gameend();
                                } else {
                                    $("#Tx").html('<a target="_blank" href="https://testnet.etherscan.io/tx/' + lastTx + '">' + lastTx.slice(0, 24) + '...</a>')
                                    $(".dice-table#table").prepend('<tr><td><a target="_blank" href="https://testnet.etherscan.io/tx/' + lastTx + ' "> ' + openkey.slice(0, 12) + '...</a> <br></td><td colspan="5" style="height: 63px"> ...pending... </td></tr>');
                                    disabled(true);
                                    $("#randomnum").text("Please, wait . . . ");
                                    Timer = setInterval(function () {
                                        new_count = call("totalRollsByUser");
                                        console.log("detected count:", new_count, count);
                                        if (new_count != count) {
                                            console.log("getStatusGame");
                                            var result = call("getStateByAddress");
                                            switch (result) {
                                                case 1:
                                                    console.log("YOU WIN!");
                                                    $("#randomnum").text("YOU WIN!");
                                                    gameend();
                                                    break;
                                                case 2:
                                                    console.log("LOSS");
                                                    $("#randomnum").text("YOU LOSE");
                                                    gameend();
                                                    break;
                                                case 3:
                                                    console.log("Sorry, No money in the bank");
                                                    $("#randomnum").text("Sorry, no money in the bank");
                                                    gameend();
                                                    break;
                                                default:
                                                    console.log("идет игра");
                                            }
                                        }
                                    }, 3000);
                                }

                            }
                        })
                    }
                }
            }
        })
    }
};

function gameend() {
    disabled(false);
    GetLogs();
    $("#randomnum").fadeIn("slow")
    clearInterval(Timer);
    clearInterval(animate);
    count = new_count;
    game = false;
    $('.active').click();
    //$('#amount-one').val(balance/2);
    $('#amount-one').change();
};