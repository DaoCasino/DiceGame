var erc20abi = [{
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "name": "",
        "type": "uint8"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "standard",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }, {
        "name": "_extraData",
        "type": "bytes"
    }],
    "name": "approveAndCall",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }, {
        "name": "",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "inputs": [],
    "payable": false,
    "type": "constructor"
}, {
    "payable": false,
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}]

var openkey = localStorage.getItem('openkey');

function getAllowance(addressContract) {
	if(openkey == undefined){
		return false;
	}
	
    var _allowance;
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
                "to": erc20address,
                "data": "0xdd62ed3e" + pad(openkey.substr(2), 64) + pad(addressContract.substr(2), 64)
            }, "latest"]
        }),
        success: function (d) {
            _allowance = hexToNum(d.result);
            console.log("allowance:", _allowance);
        }
    })
    return _allowance
}

function approve(addressContract, approveValue) {
	if(openkey == undefined){
		return false;
	}
	
    console.log("approve")
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
			console.log("get nonce action " + d.result);
			var options = {};
			options.nonce = d.result;
			options.to = erc20address;
			options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
			options.gasLimit = "0x927c0"; //web3.toHex('600000');
			ks.keyFromPassword("1234", function (err, pwDerivedKey) {
				console.log(err);
				var args = [addressContract, approveValue];
				var registerTx = lightwallet.txutils.functionTx(erc20abi, 'approve', args, options)
				var signedTx = lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, sendingAddr)
				console.log("lightWallet sign:", signedTx)
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
							approve(addressContract,100000000000);
						}
					}
				})
			})
		}
	})
}

function callERC20(callname, adr) {
	if(openkey == undefined){
		return false;
	}
	
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
                "to": erc20address,
                "data": callData + pad(numToHex(adr.substr(2)), 64)
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
};