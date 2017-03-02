var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";

function getBalance(){
    $.ajax({
        type: "POST"
        , url: urlInfura
        , dataType: 'json'
        , async: false
        , data: JSON.stringify({
            "id": 0
            , "jsonrpc": '2.0'
            , "method": 'eth_getBalance'
            , "params": [openkey, "latest"]
        })
        , success: function (d) {
            console.log("balance!: ", d.result, toFixed((Number(d.result) / 1000000000000000000), 4));
            _balance = toFixed((Number(d.result) / 1000000000000000000), 4);
            $("#balance").html(_balance);
            $("#your-balance").val(_balance);
        }
    })
};





function startGame() {
    if (openkey) {
        $.ajax({
            type: "POST"
            , url: urlInfura
            , dataType: 'json'
            , async: false
            , data: JSON.stringify({
                "jsonrpc": "2.0"
                , "method": "eth_getTransactionCount"
                , "params": [openkey, "latest"]
                , "id": 1
            })
            , success: function (d) {
                console.log("urlInfura:", urlInfura);
                console.log("get nonce action " + d.result);
                var callData = "0x1f7b4f300000000000000000000000000000000000000000000000000000000000001388";
                callData = callData.substr(0, 10);
                var options = {};
                options.nonce = d.result;
                options.to = addressContract;
                // call function game() in contract
                options.data = callData + pad(numToHex(chance), 64); // method from contact
                options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
                options.gasLimit = 0x927c0; //web3.toHex('600000');
                options.value = betEth * 1000000000000000000;
                if (privkey) {
                    if (buf == undefined) {
                        console.log("ERROR_TRANSACTION");
                    }
                    else {
                        //приватный ключ игрока, подписываем транзакцию
                        var tx = new EthereumTx(options);
                        tx.sign(new buf(privkey, 'hex'));
                        var serializedTx = tx.serialize().toString('hex');
                        console.log("The transaction was signed: " + serializedTx);
                        $.ajax({
                            type: "POST"
                            , url: urlInfura
                            , dataType: 'json'
                            , async: false
                            , data: JSON.stringify({
                                "id": 0
                                , "jsonrpc": '2.0'
                                , "method": 'eth_sendRawTransaction'
                                , "params": ["0x" + String(serializedTx)]
                            })
                            , success: function (d) {
                                console.log("Транзакция отправлена в сеть:", d);
                                LastTx = d.result;
                            }
                        })
                    }
                }
            }
        })
    }
}


