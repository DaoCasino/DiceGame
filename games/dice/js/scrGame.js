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
    $("#profit-on-win").val((betEth * 100 / chance) - betEth);
    $("#payout").val(((betEth * 100 / chance) - betEth) / betEth);
};

$("#roll-dice").click(function () {
    startGame();
    var Timer = setInterval(function () {
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
                    "fromBlock": "600000",
                    "toBlock": "latest",
                    "address": addressContract,
                }]
            }),
            success: function (objData) {
                var n = objData.result.length - 1;
                obj = objData.result[n];
                console.log("N:", objData.result[n])
                if (obj.transactionHash = lastTx) {
                    var result = parseInt(obj.Data.substr(2), 16);
                    if (result) {
                        EnableButton(true);
                        console.log("you Win!");
                        clearInterval(Timer);
                        GetLogs();
                        getBalance();
                        $("#label").text("You Win!");
                    } else {
                        EnableButton(true);
                        console.log("You Lose!")
                        clearInterval(Timer);
                        GetLogs();
                        getBalance();
                        $("#label").text("You Loser!");
                    }
                } else {
                    console.log("пока ничего");
                }
            }
        })

    }, 5000);
});