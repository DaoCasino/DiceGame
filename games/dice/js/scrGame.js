$(document).ready(initGame());
//function CheckBet() {
//    if (betEth > _balance) {
//        EnableButton(false);
//    }
//    else {
//        EnableButton(true);
//    }
//};
// $("#roll-dice").click(function () { //действие при нажатии
//     //    if (betEth > _balance) {
//     //        console.log("sorry"); //ответ при недостатке средств
//     //    }
//     //    else {
//     OldBalance = _balance;
//     FirstRequest = false;
//     startGame();
//     EnableButton(false);
//     var Timer = setInterval(function () {
//         sendUrlRequest(urlBalance, "getBalance");
//         if (OldBalance < _balance) {
//             EnableButton(true);
//             FirstRequest = true;
//             console.log("you Win!");
//             OldBalance = _balance;
//             clearInterval(Timer);
//             GetLogs();
//             getBalance();
//             $("#label").text("You Win!");
//             $("#balance").html(_balance);
//             $("#your-balance").val(_balance);
//         }
//         else if (OldBalance > _balance) {
//             EnableButton(true);
//             FirstRequest = true;
//             console.log("You Lose!")
//             OldBalance = _balance;
//             clearInterval(Timer);
//             GetLogs();
//             getBalance();
//             $("#label").text("You Loser!");
//             $("#balance").html(_balance);
//             $("#your-balance").val(_balance);
//         }
//         else {
//             console.log("пока ничего");
//         }
//     }, 10000);
//     //    }
// });
// START
// function startGameEth() {
//     if (options_ethereum && openkey) {
//         $.ajax({
//             type: "POST"
//             , url: urlInfura
//             , dataType: 'json'
//             , async: false
//             , data: JSON.stringify({
//                 "jsonrpc": "2.0"
//                 , "method": "eth_getTransactionCount"
//                 , "params": [openkey, "latest"]
//                 , "id": 1
//             })
//             , success: function (d) {
//                 console.log("urlInfura:", urlInfura);
//                 console.log("get nonce action " + d.result);
//                 var options = {};
//                 options.nonce = d.result;
//                 options.to = addressContract;
//                 // call function game() in contract
//                 options.data = 0xacfff3770000000000000000000000000000000000000000000000000000000000000032; // method from contact
//                 options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
//                 options.gasLimit = 0x927c0; //web3.toHex('600000');
//                 options.value = 0;
//                 if (privkey) {
//                     if (buf == undefined) {
//                         console.log("ERROR_TRANSACTION");
//                     }
//                     else {
//                         //приватный ключ игрока, подписываем транзакцию
//                         var tx = new EthereumTx(options);
//                         tx.sign(new buf(privkey, 'hex'));
//                         var serializedTx = tx.serialize().toString('hex');
//                         console.log("The transaction was signed: " + serializedTx);
//                         $.ajax({
//                             type: "POST"
//                             , url: urlInfura
//                             , dataType: 'json'
//                             , async: false
//                             , data: JSON.stringify({
//                                 "id": 0
//                                 , "jsonrpc": '2.0'
//                                 , "method": 'eth_sendRawTransaction'
//                                 , "params": ["0x" + String(serializedTx)]
//                             })
//                             , success: function (d) {
//                                 obj_game["game"].response(name, d.result)
//                                 console.log("Транзакция отправлена в сеть:", d.result);
//                             }
//                         })
//                     }
//                 }
//             }
//         })
//     }
// }

// function CheckBalance() {
//     if (FirstRequest) {
//         OldBalance = _balance;
//     };
// };

function EnableButton(status) {
    if (status) {
        $("#roll-dice").removeAttr("style");
        //        $("#label").text("Click Roll Dice to place your bet:");
        $("#roll-dice").attr('disabled', false);
    } else {
        $("#roll-dice").css("background", "gray");
        //        $("#label").text("Sorry!");
        $("#roll-dice").attr('disabled', true);
    }
};

function Refresh() {
    $("#profit-on-win").val(((betEth * 10000 / chance) - betEth).toFixed(4));
   // $("#payout").val("x" + (betEth * 10000 / chance).toFixed(4));
    $("#payout").val("x" + (10000/chance).toFixed(3));

};

$("#roll-dice").click(function () {
    startGame();
    EnableButton(false);
    disabled(true);
    $("#label").text("Please, wait . . . ");
    var Timer = setInterval(function () {


        var data = "0xa87d942c";
        var params = {
            "from": openkey,
            "to": addressContract,
            "data": data
        };
        $.ajax({
            type: "POST",
            url: urlInfura,
            dataType: 'json',
            async: false,
            data: JSON.stringify({
                "id": 0,
                "jsonrpc": '2.0',
                "method": "eth_call",
                "params": [params, "latest"]
            }),
            success: function (d) {
                console.log("new_count", hexToNum(d.result));
                var new_count = hexToNum(d.result);
                if (new_count != count) {

                    var data = "0x1865c57d";
                    var params = {
                        "from": openkey,
                        "to": addressContract,
                        "data": data
                    };
                    $.ajax({
                        type: "POST",
                        url: urlInfura,
                        dataType: 'json',
                        async: false,
                        data: JSON.stringify({
                            "id": 0,
                            "jsonrpc": '2.0',
                            "method": "eth_call",
                            "params": [params, "latest"]
                        }),
                        success: function (d) {
                            var result = hexToNum(d.result);
                            console.log(result);
                            if (result == 0) {
                                console.log("идет игра");
                            } else if (result == 1) {
                                console.log("YOU WIN!");
                                disabled(false);
                                getBalance();
                                Check();
                                GetLogs();
                                TotalRolls();
                               checkMaxBet();
                                $("#label").text("YOU WIN!!! ");
                                clearInterval(Timer);
                            } else if (result == 2) {
                                console.log("YOU LOSER!");
                                disabled(false);
                                getBalance();
                                Check();
                                GetLogs();
                                TotalRolls();
                               checkMaxBet();
                                $("#label").text("YOU LOSE!!! ");
                                clearInterval(Timer);
                            } else if (result == 3) {
                                console.log("Sorry, dont money in bank");
                                disabled(false);
                                getBalance();
                                Check();
                                GetLogs();
                                TotalRolls();
                                checkMaxBet();
                                $("#label").text("Sorry, dont money in bank");
                                clearInterval(Timer);
                            }
                        }
                    })
                    count = new_count;
                }
            }
        });








    }, 5000);
});


// $.ajax({
//             type: "POST",
//             url: urlInfura,
//             dataType: 'json',
//             async: false,
//             data: JSON.stringify({
//                 "id": 74,
//                 "jsonrpc": '2.0',
//                 "method": 'eth_getLogs',
//                 "params": [{
//                     "fromBlock": "600000",
//                     "toBlock": "latest",
//                     "address": addressContract,
//                 }]
//             }),
//             success: function (objData) {
//                 var n = objData.result.length - 1;
//                 obj = objData.result[n];
//                 if (obj.transactionHash = lastTx) {
//                     var result = parseInt(obj.Data.substr(2), 16);
//                     if (result) {
//                         EnableButton(true);
//                         console.log("you Win!");
//                         clearInterval(Timer);
//                         GetLogs();
//                         getBalance();
//                         $("#label").text("You Win!");
//                     } else {
//                         EnableButton(true);
//                         console.log("You Lose!")
//                         clearInterval(Timer);
//                         GetLogs();
//                         getBalance();
//                         $("#label").text("You Loser!");
//                     }
//                 } else {
//                     console.log("пока ничего");
//                 }
//             }
//         })