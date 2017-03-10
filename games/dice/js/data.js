//var arGame = [];
var _countBy24Hours = 0;
var _countBy30Days = 0;
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
            //console.log(objData);
            function getArTh(thId) {
                var array = [];
                
                var mainObj = objData.result;
                for (var i = 0; i < objData.result.length; i++) {
                    var obj = objData.result[i];
                    if (thId == obj.transactionHash) {
                        array[0] = obj.transactionHash;
                        array[1] = obj.timeStamp;
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
           
            if (arGame.length > 9) {
                for (var i = arGame.length - 10; i < arGame.length; i++) {
                    if (arGame[i].length > 5) {
                        var tx = arGame[i][0];
                        var player = arGame[i][2].substr(24);
                        var payout = parseInt(arGame[i][3].substr(2), 16) / 100000000000000000;
                        var profit = parseInt(arGame[i][4].substr(2), 16) / 1000000000000000000;
                        var bet = parseInt(arGame[i][5].substr(2), 16) / 1000000000000000000;
                        var chance = parseInt(arGame[i][6].substr(2), 16) / 100;
                        var result = parseInt(arGame[i][8].substr(2), 16);
                        if (result) result = "win";
                        else {
                            result = "lose";
                            profit = -bet;
                        }
                        var rnd = parseInt(arGame[i][7].substr(2), 16)
                        $(".dice-table").prepend('<tr><td><a target="_blank" href="https://kovan.etherscan.io/tx/' + tx + ' "> ' + tx.slice(2, 12) + '...</a> <br>' + player.slice(2, 12) + '</td><td>' + chance + ' %</td><td>' + result +' ( '+ rnd + ' )</td><td>' + bet + ' ETH</td><td>x' + (99.2 / chance).toFixed(3) + '</td><td>' + profit.toFixed(3) + '</td></tr>');
                        if ($('#table >tbody >tr').length > 9) {
            document.getElementById("table").deleteRow(9);
    };
                    }
                }
            }
_countBy24Hours = 0;
_countBy30Days = 0;
  for( var n = 0; n < arGame.length; n++){
      var _time = parseInt(arGame[n][1].substr(2), 16)*1000;
      var _now = + new Date();
        if (_time > _now - 86400000 ){
            _countBy30Days ++;
            _countBy24Hours ++;
        }
        else if (_time > _now - 2592000000){
           _countBy30Days++; 
        };
        $("#30days").html( _countBy30Days );
        $("#24hours").html( _countBy24Hours );
  }
        }
    })


};

