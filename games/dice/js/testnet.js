var Timer;

function startGame() {
    game = true;
    if (openkey) {
        $.ajax({
            type: "POST",
            url: urlInfura,
            dataType: 'json',
            async: false,
            data: JSON.stringify({
                "id": 0,
                "jsonrpc": '2.0',
                "method": "eth_getTransactionCount",
                "params": [openkey, "latest"]
            }),
            success: function (d) {
                console.log("urlInfura:", urlInfura);
                console.log("get nonce action " + d.result);
                var callData = "0x1f7b4f30";
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
                    } else {
                        //приватный ключ игрока, подписываем транзакцию
                        var tx = new EthereumTx(options);
                        tx.sign(new buf(privkey, 'hex'));
                        var serializedTx = tx.serialize().toString('hex');
                        console.log("The transaction was signed: " + serializedTx);
                       $.ajax({
                            type: "POST",
                            url: urlInfura,
                            dataType: 'json',
                            async: false,
                            data: JSON.stringify({
                                "id": 0,
                                "jsonrpc": '2.0',
                                "method": "eth_sendRawTransaction",
                                "params": ["0x"+serializedTx]
                            }),
                            success: function (d) {
                                console.log("Транзакция отправлена в сеть:", d.result);
                                lastTx = d.result;
                                if (lastTx == undefined) {
                                    $("#random").text("Sorry, transaction failed");
                                } else {
                                    $("#Tx").html('<a target="_blank" href="https://testnet.etherscan.io/tx/' + lastTx + '">...' + lastTx.slice(2, 24) + '...</a>')
                                    disabled(true);
                                    $("#random").text("Please, wait . . . ");
                                    $("#randomnum").text(" . . . ");
                                    Timer = setInterval(function () {
                                        $.ajax({
                                            type: "POST",
                                            url: urlInfura,
                                            dataType: 'json',
                                            async: false,
                                            data: JSON.stringify({
                                                "id": 0,
                                                "jsonrpc": '2.0',
                                                "method": "eth_call",
                                                "params": [{
                                                    "from": openkey,
                                                    "to": addressContract,
                                                    "data": "0x9288cebc000000000000000000000000" + openkey.substr(2),
                                                }, "latest"]
                                            }),
                                            success: function (d) {
                                                console.log("new_count", hexToNum(d.result));
                                                var new_count = hexToNum(d.result);
                                                console.log("detected count:", new_count, count);
                                                if (new_count != count) {
                                                    console.log("getStatusGame")
                                                    $.ajax({
                                                        type: "POST",
                                                        url: urlInfura,
                                                        dataType: 'json',
                                                        async: false,
                                                        data: JSON.stringify({
                                                            "id": 0,
                                                            "jsonrpc": '2.0',
                                                            "method": "eth_call",
                                                            "params": [{
                                                                "from": openkey,
                                                                "to": addressContract,
                                                                "data": "0x08199931000000000000000000000000" + openkey.substr(2),
                                                            }, "latest"]
                                                        }),
                                                        success: function (d) {
                                                            var result = hexToNum(d.result);
                                                            if (result == 0) {
                                                                console.log("идет игра");
                                                            } else if (result == 1) {
                                                                console.log("YOU WIN!");
                                                                $("#random").text("YOU WIN!!! ");
                                                                disabled(false);
                                                                GetLogs();
                                                                ShowRnd();
                                                                clearInterval(Timer);
                                                                count = new_count;
                                                                game = false;
                                                            } else if (result == 2) {
                                                                console.log("YOU LOSER!");
                                                                $("#random").text("YOU LOSE!!! ");
                                                                disabled(false);
                                                                GetLogs();
                                                                ShowRnd();
                                                                clearInterval(Timer);
                                                                count = new_count;
                                                                game = false;
                                                            } else if (result == 3) {
                                                                console.log("Sorry, No money in the bank");
                                                                $("#random").text("Sorry, no money in the bank");
                                                                disabled(false);
                                                                GetLogs();
                                                                ShowRnd();
                                                                clearInterval(Timer);
                                                                count = new_count;
                                                                game = false;
                                                            }
                                                            //

                                                        }
                                                    })

                                                }
                                            }
                                        });
                                    }, 5000);
                                }

                            }
                        })
                    }
                }
            }
        })
    }
}