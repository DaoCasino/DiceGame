var _countBy24Hours = 0;
var _countBy30Days = 0;
var arGame = [];

function GetLogs() {
   arGame = []; 
var block;
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 74,
            "jsonrpc": '2.0',
            "method": 'eth_blockNumber',
            "params": []
        }),
        success: function(d){
            block = hexToNum(d.result) - 5000;
        }
    })

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
                "fromBlock": block,
                "toBlock": "latest",
                "address": addressContract,
            }]
        }),
        success: function (objData) {
            if(objData.result.length == 0){
                    $("#bg_popup").show();
                }

            var array = [];
            
            for(var i = 0; i < objData.result.length;i++){
                var d = objData.result[i].data.substr(2);
                array[0] = objData.result[i].transactionHash;
                var t = hexToNum(d.substr(0,64));
                var a = d.substr(64,64);
                var b = hexToNum(d.substr(128,64));
                var c = hexToNum(d.substr(192, 64));
                var r = hexToNum(d.substr(256, 64));
                array.push(t,a,b,c,r)
                arGame.push(array)
                array = [];
            }

        }})
            
                

            // function getArTh(thId) {
            //     var array = [];

            //     var mainObj = objData.result;
            //     for (var i = 0; i < objData.result.length; i++) {
            //         var obj = objData.result[i];
            //         if (thId == obj.transactionHash) {
            //             array[0] = obj.transactionHash;
            //             array.push(obj.data);
            //         }
            //     }
            //     return array;
            // }
            // arGame = [];
            // var thId = "";
            // for (var i = 0; i < objData.result.length; i++) {
            //     var obj = objData.result[i];
            //     if (thId != obj.transactionHash) {
            //         thId = obj.transactionHash;
            //         var ar = getArTh(thId);
            //         arGame.push(getArTh(thId));
            //     }
            // }
            _countBy24Hours = 0;
            _countBy30Days = 0;
            for (var n = 0; n < arGame.length; n++) {
                var _time = arGame[n][1] * 1000;
                var _now = +new Date();
                if (_time > _now - 86400000) {
                    _countBy24Hours++;
                }
                $("#24hours").html(_countBy24Hours);
            }
        };
    // paids = (call("getTotalEthSended", openkey) / 10000000000000000000).toFixed(6);
    // sends = (call("getTotalEthPaid", openkey) / 10000000000000000000).toFixed(6);
    // $("#total-rolls").html(call("getTotalRollMade", openkey));
    // $("#total-paid").html(paids + ' ETH');
    // $("#total-send").html(sends + ' ETH (' + ((paids / sends) * 100).toFixed(2) + '%)');


function getMyLogs() {
    $('tbody').empty();
    if (arGame.length > 10) {
        var i = arGame.length - 10;}
        else {
            i = 0;
        }
        for (var i = arGame.length-1; i > 0; i--) {
            if (arGame[i].length > 5) {
                var tx = arGame[i][0];
                var player = '0x' + arGame[i][2].substr(24);
                var bet = arGame[i][3] / 100000000;
                var chance = arGame[i][4] / 65536 * 100;
                var rnd = arGame[i][5];
                var payout = bet * chance;
                var profit = payout - bet;
                var result;
                
                if (rnd < arGame[i][4] ) {
                    result = "<div class=\"icon-w\">WIN</div>";
                    color = "#d08c49";
                } else {
                    result = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
                    profit = -bet;
                    color = "gray";
                }
                if (player == openkey && ($('tbody tr').length != 10)) {
                $(".dice-table#table").append('<tr><td  aria-label="TRANSACTION"><a target="_blank" href="https://ropsten.etherscan.io/tx/' + tx + ' "> 0x' + player.slice(2, 12) + '...</a> <br></td><td  aria-label="">' +
                    "<div class=\" tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content \" style=\" height:10px\" ><div class=\"ui-progressbar-value ui-corner-left ui-widget-header \" style=\"width:" + chance.toFixed() + "%; background:" + color + ";margin:0px;\"></div></div><div class=\"tooltip\" style=\"left:" + rnd / 65536 * 100 + "%\">" + rnd + "</div>" + ' </td><td  aria-label="RESULT">' + result + '</td><td  aria-label="BET">' + bet.toFixed(3) + ' BET</td><td  aria-label="PAYOUT">x' + (payout / bet / 10).toFixed(3) + '</td><td  aria-label="PROFIT">' + profit.toFixed(3) + ' BET</td></tr>');
                }
            }
        }
    
    // if (game) {
    //     $(".dice-table#table").prepend('<tr><td><a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + ' "> 0x' + openkey.slice(0, 12) + '...</a> <br></td><td colspan="5"  style="height: 63px"> ...pending... </td></tr>');
    // }
}

function getAllLogs() {
    var color;
    $('tbody').empty();
    if (arGame.length > 10) {
        var i = arGame.length - 10;}
        else {
            i = 0;
        }
        for (var i ; i < arGame.length; i++) {
            if (arGame[i].length > 5) {
                var tx = arGame[i][0];
                var player = '0x' + arGame[i][2].substr(26);
                var bet = arGame[i][3] / 100000000;
                var chance = arGame[i][4] / 65536 * 100;
                var rnd = arGame[i][5];
                var payout = bet * chance;
                var profit = payout - bet;
                var result;
                
                if (rnd < arGame[i][4] ) {
                    result = "<div class=\"icon-w\">WIN</div>";
                    color = "#d08c49";
                } else {
                    result = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
                    profit = -bet;
                    color = "gray";
                }

                $(".dice-table#table").prepend('<tr><td  aria-label="TRANSACTION"><a target="_blank" href="https://ropsten.etherscan.io/tx/' + tx + ' "> 0x' + player.slice(2, 12) + '...</a> <br></td><td  aria-label="">' +
                    "<div class=\" tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content \" style=\" height:10px\" ><div class=\"ui-progressbar-value ui-corner-left ui-widget-header \" style=\"width:" + chance.toFixed() + "%; background:" + color + ";margin:0px;\"></div></div><div class=\"tooltip\" style=\"left:" + rnd / 65536 * 100 + "%\">" + rnd + "</div>" + ' </td><td  aria-label="RESULT">' + result + '</td><td  aria-label="BET">' + bet.toFixed(3) + ' BET</td><td  aria-label="PAYOUT">x' + (payout / bet / 10).toFixed(3) + '</td><td  aria-label="PROFIT">' + profit.toFixed(3) + ' BET</td></tr>');
            }
        }
    }
    // if (game) {
    //     $(".dice-table#table").prepend('<tr><td><a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + ' "> 0x' + openkey.slice(0, 12) + '...</a> <br></td><td colspan="5" style="height: 63px"> ...pending... </td></tr>');
    // }
