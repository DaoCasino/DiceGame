//var arGame = [];
var _countBy24Hours = 0;
var _countBy30Days = 0;
var arGame = [];

function GetLogs() {

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
                "fromBlock": "599000",
                "toBlock": "latest",
                "address": addressContract,
            }]
        }),
        success: function (objData) {
                if(objData.result.length == 0){
                    $("#bg_popup").show();
                }
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
                } else if (_time > _now - 2592000000) {
                    _countBy30Days++;
                };
                $("#30days").html(_countBy30Days);
                $("#24hours").html(_countBy24Hours);
            }
        }
    })
    getContractBalance();
    paids = (call("getTotalEthSended") / 10000000000000000000).toFixed(6);
    sends = (call("getTotalEthPaid") / 10000000000000000000).toFixed(6);
    $("#total-rolls").html(call("getTotalRollMade"));
    $("#total-paid").html(paids + ' ETH');
    $("#total-send").html(sends + ' ETH (' + ((paids / sends) * 100).toFixed(2) + '%)');
};

function getMyLogs() {
    $('tbody').empty();
    if (arGame.length > 9) {
        for (var i = arGame.length-1; i > 0; i--) {
            if (arGame[i].length > 5) {
                var tx = arGame[i][0];
                var player = '0x' + arGame[i][2].substr(26);
                var payout = parseInt(arGame[i][3].substr(2), 16) / 100000000000000000;
                var profit = parseInt(arGame[i][4].substr(2), 16) / 1000000000000000000;
                var bet = parseInt(arGame[i][5].substr(2), 16) / 1000000000000000000;
                var chance = parseInt(arGame[i][6].substr(2), 16) / 65536 * 100;
                var result = parseInt(arGame[i][8].substr(2), 16);
                var rnd = parseInt(arGame[i][7].substr(2), 16)
                if (result) {
                    result = "<div class=\"icon-w\">WIN</div>";
                    color = "#d08c49";
                } else {
                    result = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
                    profit = -bet;
                    color = "gray";
                }
                if (player == openkey && ($('tbody tr').length != 10)) {
                $(".dice-table#table").append('<tr><td  aria-label="TRANSACTION"><a target="_blank" href="https://ropsten.etherscan.io/tx/' + tx + ' "> 0x' + player.slice(2, 12) + '...</a> <br></td><td  aria-label="">' +
                    "<div class=\" tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content \" style=\" height:10px\" ><div class=\"ui-progressbar-value ui-corner-left ui-widget-header \" style=\"width:" + chance.toFixed() + "%; background:" + color + ";margin:0px;\"></div></div><div class=\"tooltip\" style=\"left:" + rnd / 65536 * 100 + "%\">" + rnd + "</div>" + ' </td><td  aria-label="RESULT">' + result + '</td><td  aria-label="BET">' + bet.toFixed(3) + ' ETH</td><td  aria-label="PAYOUT">x' + (payout / bet / 10).toFixed(3) + '</td><td  aria-label="PROFIT">' + profit.toFixed(3) + ' ETH</td></tr>');
                }
            }
        }
    }
    if (game) {
        $(".dice-table#table").prepend('<tr><td><a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + ' "> 0x' + openkey.slice(0, 12) + '...</a> <br></td><td colspan="5"  style="height: 63px"> ...pending... </td></tr>');
    }
}

function getAllLogs() {
    var color;
    $('tbody').empty();
    if (arGame.length > 9) {
        for (var i = arGame.length - 10; i < arGame.length; i++) {
            if (arGame[i].length > 5) {
                var tx = arGame[i][0];
                var player = '0x' + arGame[i][2].substr(26);
                var payout = parseInt(arGame[i][3].substr(2), 16) / 100000000000000000;
                var profit = parseInt(arGame[i][4].substr(2), 16) / 1000000000000000000;
                var bet = parseInt(arGame[i][5].substr(2), 16) / 1000000000000000000;
                var chance = parseInt(arGame[i][6].substr(2), 16) / 65536 * 100;
                var result = parseInt(arGame[i][8].substr(2), 16);
                if (result) {
                    result = "<div class=\"icon-w\">WIN</div>";
                    color = "#d08c49";
                    
                    
                } else {
                    result = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
                    profit = -bet;
                    color = "gray";
                }
                var rnd = parseInt(arGame[i][7].substr(2), 16)
                $(".dice-table#table").prepend('<tr><td  aria-label="TRANSACTION"><a target="_blank" href="https://ropsten.etherscan.io/tx/' + tx + ' "> 0x' + player.slice(2, 12) + '...</a> <br></td><td  aria-label="">' +
                    "<div class=\" tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content \" style=\" height:10px\" ><div class=\"ui-progressbar-value ui-corner-left ui-widget-header \" style=\"width:" + chance.toFixed() + "%; background:" + color + ";margin:0px;\"></div></div><div class=\"tooltip\" style=\"left:" + rnd / 65536 * 100 + "%\">" + rnd + "</div>" + ' </td><td  aria-label="RESULT">' + result + '</td><td  aria-label="BET">' + bet.toFixed(3) + ' ETH</td><td  aria-label="PAYOUT">x' + (payout / bet / 10).toFixed(3) + '</td><td  aria-label="PROFIT">' + profit.toFixed(3) + ' ETH</td></tr>');
            }
        }
    }
    if (game) {
        $(".dice-table#table").prepend('<tr><td><a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + ' "> 0x' + openkey.slice(0, 12) + '...</a> <br></td><td colspan="5" style="height: 63px"> ...pending... </td></tr>');
    }
}