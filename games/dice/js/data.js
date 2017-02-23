function RefreshTable(){
$.get(urlSite + "api?module=logs&action=getLogs&fromBlock=379224&toBlock=latest&address=0xb7c90df0888fee75ecfc8e85ed35fcd6ea1f3370&apikey=YourApiKeyToken", function (objData) {
    $(".dice-table>tbody").empty();
    function getArTh(thId){
    var array = [];
    var mainObj = objData.result;
    for (var i = 0; i < objData.result.length; i++){
        var obj = objData.result[i];
        if(thId == obj.transactionHash){
            array.push(obj.data);
        }
    }
    
    return array;
}
    var arGame = [];
    var thId = ""
    for (var i = 0; i < objData.result.length; i++){
        var obj = objData.result[i];
        if(thId != obj.transactionHash){
            thId = obj.transactionHash;
            console.log("thId:", i, thId)
            var ar = getArTh(thId);
            arGame.push(getArTh(thId));
            //arGame[thId] = getArTh(thId);
        }
    }
    console.log("arGame:", arGame)
    console.log("arGame:", arGame[1][1])
    console.log("получены логи" + objData.result[0].data);
    var logs = objData.result[11].data;
    console.log(arGame);
    logs = logs.substr(2);
    for(var i=0; i<=objData.result.length/6;i++){
        console.log(i, arGame[i][0]);
      var time = parseInt(arGame[i][0].substr(2), 16) / 3600;
    var payout = parseInt(arGame[i][1].substr(2), 16) / 100000000000000000;
    var profit = parseInt(arGame[i][2].substr(2), 16) / 1000000000000000000;
       var bet = parseInt(arGame[i][3].substr(2), 16) / 1000000000000000000;
    var chance = parseInt(arGame[i][4].substr(2), 16);
    var result = parseInt(arGame[i][5].substr(2), 16);
    if (result) result = "win";
    else {
        result = "lose";
        profit = -bet;
    }
    $(".dice-table").prepend('<tr><td>' + time.toFixed(3) + '</td><td>' + chance + ' %</td><td>' + result + '</td><td>' + bet + ' ETH</td><td>x' + payout.toFixed(3) + '</td><td>' + profit.toFixed(3) + '</td></tr>');
         
        }
}, "json");
};



