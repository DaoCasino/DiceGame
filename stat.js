//var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var result;
var address = "0x9f93bfe34bdac77e4ddc10971b0ab827e9289f00";

function GetLogs(addressContract) {
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 74,
            "jsonrpc": '2.0',
            "method": 'eth_getLogs',
            "params": [{
                "fromBlock": "650000",
                "toBlock": "latest",
                "address": addressContract,
            }]
        }),
        success: function (objData) {
            function getArTh(thId) {
                var array = [];

                var mainObj = objData.result;
                for (var i = 0; i < objData.result.length; i++) {
                    var obj = objData.result[i];
                    if (thId == obj.transactionHash) {
                        array[0] = obj.transactionHash;
                        array.push(obj.data);
                    }
                }
                return array;
            }
            arGame = [];
            var thId = "";
            for (var i = 0; i < objData.result.length; i++) {
                var obj = objData.result[i];
                if (thId != obj.transactionHash) {
                    thId = obj.transactionHash;
                    var ar = getArTh(thId);
                    arGame.push(getArTh(thId));
                }
            }
            _countBy24Hours = 0;
            _countBy30Days = 0;
            for (var n = 0; n < arGame.length; n++) {
                var _time = parseInt(arGame[n][1].substr(2), 16) * 1000;
                var _now = +new Date();
                if (_time > _now - 86400000) {
                    _countBy30Days++;
                    _countBy24Hours++;
                } 
                $("#30days").html(_countBy30Days);
                $("#24hours").html(_countBy24Hours);
            }
        }
    })
};

function getContractBalance(addressContract) {
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
            result = (d.result / 1000000000000000000).toFixed(5);
        }
    });
    return result;
};

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

function toFixed(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
};

function call(callname, address) {
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
            callData = "0xdf257ba3";
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
                "to": address,
                "data": callData + pad(numToHex(address.substr(2)), 64),
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
};

function numToHex(num) {
    return num.toString(16);
};

function hexToNum(str) {
    return parseInt(str, 16);
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
                // "from": openkey,
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

function total(){
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
                "to": address,
                "data":  "0xdf257ba3"
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
}

function getStatistics(game, network) {
    console.log("Platform version: 0.11")
    var bankroll;
    var bankroll = callERC20("balanceOf", address);
    //GetLogs(address);
    $('#bankroll').html(bankroll/100000000 +" BET");
    $("#total").html(total());
};
getStatistics("Dice", "testnet");