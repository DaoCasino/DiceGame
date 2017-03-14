var Timer;
function startGame() {
    game = true;
    if (openkey) {
        $.ajax({
            method: "POST",
            url: urlEtherscan,
            data: {
                module: "proxy",
                async: false,
                action: "eth_getTransactionCount",
                address: openkey,
                tag: "latest"
            },
            success: function (d) {
                console.log("urlEtherscan:", urlEtherscan);
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
                    } else {
                        //приватный ключ игрока, подписываем транзакцию
                        var tx = new EthereumTx(options);
                        tx.sign(new buf(privkey, 'hex'));
                        var serializedTx = tx.serialize().toString('hex');
                        console.log("The transaction was signed: " + serializedTx);
                        $.ajax({
                            method: "POST",
                            url: urlEtherscan,
                            data: {
                                async: false,
                                module: "proxy",
                                action: "eth_sendRawTransaction",
                                address: openkey,
                                hex: serializedTx,
                                // to: addressContract,
                                // tag: "latest"
                            },
                            success: function (d) {
                                console.log("Транзакция отправлена в сеть:", d.result);
                                lastTx = d.result;
                                if (lastTx == undefined) {
                                    $("#random").text("Sorry, transaction failed");
                                } else {
                                    $("#Tx").html('<a target="_blank" href="https://testnet.etherscan.io/tx/' + lastTx + '">...' + lastTx.slice(2, 24) + '...</a>')
                                    disabled(true);
                                    $("#random").text("Please, wait . . . ");
                                    Timer = setInterval(function () {
                                        $.ajax({
                                            method: "POST",
                                            url: "https://testnet.etherscan.io/api",
                                            data: {
                                                module: "proxy",
                                                action: "eth_call",
                                                address: openkey,
                                                data: "0x9288cebc000000000000000000000000" + openkey.substr(2),
                                                to: addressContract,
                                                //tag: "latest"
                                            },
                                            success: function (d) {
                                                console.log("new_count", hexToNum(d.result));
                                                var new_count = hexToNum(d.result);
                                                console.log("detected count:", new_count, count);
                                                if (new_count != count) {
                                                    console.log("getStatusGame")
                                                    $.ajax({
                                                        method: "POST",
                                                        url: "https://testnet.etherscan.io/api",
                                                        data: {
                                                            module: "proxy",
                                                            action: "eth_call",
                                                            //address: openkey,
                                                            data: "0x08199931000000000000000000000000" + openkey.substr(2),
                                                            to: addressContract,
                                                            tag: "latest"
                                                        },
                                                        success: function (d) {
                                                            var result = hexToNum(d.result);
                                                            if (result == 0) {
                                                                console.log("идет игра");
                                                            } else if (result == 1) {
                                                                console.log("YOU WIN!");
                                                                $("#random").text("YOU WIN!!! ");
                                                                disabled(false);
                                                                TotalRolls();
                                                                TotalPaid();
                                                                GetLogs();
                                                                getContractBalance();
                                                                clearInterval(Timer);
                                                                count = new_count;
                                                                game = false;
                                                            } else if (result == 2) {
                                                                console.log("YOU LOSER!");
                                                                $("#random").text("YOU LOSE!!! ");                                                                
                                                                disabled(false);
                                                                TotalRolls();
                                                                TotalPaid();
                                                                GetLogs();
                                                                getContractBalance();
                                                                clearInterval(Timer);
                                                                count = new_count;
                                                                game = false;
                                                            } else if (result == 3) {
                                                                console.log("Sorry, No money in the bank");
                                                                $("#random").text("Sorry, no money in the bank");                                                                
                                                                disabled(false);
                                                                TotalRolls();
                                                                TotalPaid();
                                                                GetLogs();
                                                                getContractBalance();
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

