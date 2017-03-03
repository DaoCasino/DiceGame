var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";

function GetLogs() {
    $(".dice-table>tbody").empty();
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
                "fromBlock": "580000",
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
                        array.push(obj.data);
                    }
                }
                return array;
            }
            var arGame = [];
            var thId = "";
            for (var i = 0; i < objData.result.length; i++) {
                var obj = objData.result[i];
                if (thId != obj.transactionHash) {
                    thId = obj.transactionHash;
                    var ar = getArTh(thId);
                    arGame.push(getArTh(thId));
                    //arGame[thId] = getArTh(thId);
                    //console.log("arGame:", arGame[0][0])
                }
            }
            if (arGame.length > 10) {
                for (var i = arGame.length - 10; i <= arGame.length - 1; i++) {
                    if (arGame[i].length > 5) {
                        console.log(arGame);
                        var time = arGame[i][0].substr(24);
                        var payout = parseInt(arGame[i][1].substr(2), 16) / 100000000000000000;
                        var profit = parseInt(arGame[i][2].substr(2), 16) / 1000000000000000000;
                        var bet = parseInt(arGame[i][3].substr(2), 16) / 1000000000000000000;
                        var chance = parseInt(arGame[i][4].substr(2), 16) / 100;
                        var result = parseInt(arGame[i][5].substr(2), 16);
                        if (result) result = "win";
                        else {
                            result = "lose";
                            profit = -bet;
                        }
                        $(".dice-table").prepend('<tr><td><a target="_blank" href="https://testnet.etherscan.io/address/0x'+time.substr(2)+' "> ' + time.slice(2, 12) + '...</a> </td><td>' + chance + ' %</td><td>' + result + '</td><td>' + bet + ' ETH</td><td>x' + payout.toFixed(3) + '</td><td>' + profit.toFixed(3) + '</td></tr>');
                    }
                }
            }
        }
    })
};