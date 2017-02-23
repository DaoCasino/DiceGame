$(document).ready(initGame());

//function CheckBet() {
//    if (betEth > _balance) {
//        EnableButton(false);
//    }
//    else {
//        EnableButton(true);
//    }
//};

$("#roll-dice").click(function () { //действие при нажатии
    //    if (betEth > _balance) {
    //        console.log("sorry"); //ответ при недостатке средств
    //    }
    //    else {
    OldBalance = _balance;
    FirstRequest = false;
    startGameEth();
    EnableButton(false);
    var Timer = setInterval(function () {
        sendUrlRequest(urlBalance, "getBalance");
        if (OldBalance < _balance) {
            EnableButton(true);
            FirstRequest = true;
            console.log("you Win!");
            OldBalance = _balance;
            clearInterval(Timer);
            $("#label").text("You Win!");
            $("#balance").html(_balance);
            $("#your-balance").val(_balance);
        }
        else if (OldBalance > _balance) {
            EnableButton(true);
            FirstRequest = true;
            console.log("You Lose!")
            OldBalance = _balance;
            clearInterval(Timer);
            $("#label").text("You Loser!");
            $("#balance").html(_balance);
            $("#your-balance").val(_balance);
        }
        else {
            console.log("пока ничего");
        }
    }, 10000);
    //    }
});
// START
function startGameEth() {
    if (openkey == undefined) {
        console.log("ERROR_KEY");
        return false;
    }
    var callData = "0xacfff3770000000000000000000000000000000000000000000000000000000000000032";
    var openKey = openkey.substr(2);
    callData = callData.substr(0, 10);
    console.log("startGameEth:", openKey)
    $.get(urlSite + "api?module=proxy&action=eth_getTransactionCount&address=" + openkey + "&tag=latest&apikey=YourApiKeyToken", function (d) {
        console.log("получили nonce " + d.result);
        var options = {};
        options.nonce = d.result;
        options.to = addressContract; //адрес нашего смарт контракта
        options.data = callData + pad(numToHex(chance), 64); //шанс 
        options.gasPrice = "0x737be7600";
        options.gasLimit = 0x927c0;
        options.value = betEth * 1000000000000000000; //ставка
        if (privkey) {
            if (buf == undefined) {
                console.log("ERROR_TRANSACTION");
            }
            else {
                var tx = new EthereumTx(options);
                tx.sign(new buf(privkey, 'hex')); //приватный ключ игрока, подписываем транзакцию
                var serializedTx = tx.serialize().toString('hex');
                console.log("Транзакция подписана: " + serializedTx);
                $.getJSON(urlSite + "api?module=proxy&action=eth_sendRawTransaction&hex=" + serializedTx + "&apikey=YourApiKeyToken", function (d) {
                    //                    здесь будет ethereum txid по которому мы позже сможем вытащить результат.
                    response("idGame", d.result)
                    console.log("Транзакция отправлена в сеть:", d.result);
                });
            }
        }
    }, "json");
}

function CheckBalance() {
    if (FirstRequest) {
        OldBalance = _balance;
    };
};

function EnableButton(status) {
    if (status) {
        $("#roll-dice").removeAttr("style");
        //        $("#label").text("Click Roll Dice to place your bet:");
        $("#roll-dice").attr('disabled', false);
    }
    else {
        $("#roll-dice").css("background", "gray");
        //        $("#label").text("Sorry!");
        $("#roll-dice").attr('disabled', true);
    }
};

function Refresh() {
    $("#profit-on-win").val((betEth * 100 / chance)-betEth);
    $("#payout").val(((betEth * 100 / chance)-betEth)/betEth);
    
};


