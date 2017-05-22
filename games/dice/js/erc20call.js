var openkey = localStorage.getItem('openkey');

function allowance() {
    var _allowance;
    $.ajax({
        type:     "POST",
        url:      urlInfura,
        dataType: 'json',
        async:    false,
        
        data: JSON.stringify({
            "id":      0,
            "jsonrpc": '2.0',
            "method":  "eth_call",
            "params":  [{
                "from": openkey,
                "to":   erc20address,
                "data": "0xdd62ed3e" + pad(openkey.substr(2), 64) + pad(addressContract.substr(2), 64)
            }, "latest"]
        }),
        success: function (d) {
            _allowance = hexToNum(d.result);
            console.log("allowance:", _allowance);
        }
    });
    return _allowance;
}

function approve(approveValue) {
    console.log("approve");
    $('#bg_popup').show();
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id":      0,
            "jsonrpc": '2.0',
            "method":  "eth_getTransactionCount",
            "params":  [openkey, "latest"]
        }),
        success: function (d) {
            console.log("get nonce action " + d.result);
            var options = {};
            options.nonce = d.result;
            options.to = erc20address;
            options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
            options.gasLimit = "0x927c0"; //web3.toHex('600000');
            
            keyStore.keyFromPassword("1234", function (err, pwDerivedKey) {
                console.log(err);
                var args = [addressContract, approveValue];
                var registerTx = lightwallet.txutils.functionTx(contract_erc20_abi, 'approve', args, options);
                var signedTx = lightwallet.signing.signTx(keyStore, pwDerivedKey, registerTx, sendingAddr);
                console.log("lightWallet sign:", signedTx);
                $.ajax({
                    type: "POST",
                    url: urlInfura,
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify({
                        "id": 0,
                        "jsonrpc": '2.0',
                        "method": "eth_sendRawTransaction",
                        "params": ["0x" + signedTx]
                    }),
                    success: function (d) {
                        console.log("The transaction was signed:", d.result);
                        if (d.result == undefined) {
                            approve(100000000000);
                        }
                    }
                });
            });
        }
    });
}

function callERC20(callname, adr) {
    var result;
    var callData;
    switch (callname) {
    case "balanceOf":
        callData = "0x70a08231";
        break;
    }
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
                "to":   erc20address,
                "data": callData + pad(numToHex(adr.substr(2)), 64)
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
};

setInterval(function(){if(allowance() != 0){
    $('#bg_popup').hide();
}}, 5000);
