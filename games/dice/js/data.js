
function GetLogs() {
    $.ajax({
        type: "POST",
        url: urlEtherscan,
        data: {
            module: "logs",
            action: "getLogs",
            fromBlock: 75000,
            toBlock: "latest",
            address: addressContract
        },
        success: function (objData) {
            // console.log(objData);
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
            var arGame = [];
            var thId = "";
            for (var i = 0; i < objData.result.length; i++) {
                var obj = objData.result[i];
                if (thId != obj.transactionHash) {
                    thId = obj.transactionHash;
                    var ar = getArTh(thId);
                    arGame.push(getArTh(thId));
                }
            }
            if (arGame.length > 10) {
                for (var i = arGame.length - 10; i < arGame.length; i++) {
                    if (arGame[i].length > 5) {
                        var tx = arGame[i][0];
                        var player = arGame[i][1].substr(24);
                        //console.log(player);
                        var payout = parseInt(arGame[i][2].substr(2), 16) / 100000000000000000;
                        var profit = parseInt(arGame[i][3].substr(2), 16) / 1000000000000000000;
                        var bet = parseInt(arGame[i][4].substr(2), 16) / 1000000000000000000;
                        var chance = parseInt(arGame[i][5].substr(2), 16) / 100;
                        var result = parseInt(arGame[i][6].substr(2), 16);
                        if (result) result = "win";
                        else {
                            result = "lose";
                            profit = -bet;
                        }
                        $(".dice-table").prepend('<tr><td><a target="_blank" href="https://kovan.etherscan.io/tx/' + tx + ' "> ' + tx.slice(2, 12) + '...</a> <br>' + player.slice(2, 12) + '</td><td>' + chance + ' %</td><td>' + result + '</td><td>' + bet + ' ETH</td><td>x' + (99.2 / chance).toFixed(3) + '</td><td>' + profit.toFixed(3) + '</td></tr>');
                        if ($('#table >tbody >tr').length > 9) {
            document.getElementById("table").deleteRow(9);
    };
                    }
                }
            }

        }
    })
    
};

