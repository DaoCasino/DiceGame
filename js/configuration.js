var abi = []; 

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

netname = "ropsten"; // "ropsten", "rinkeby"
erc20address = "none"; 
urlInfura = "none";
//addressDice = "none";
addressBJDeck = "none";
addressBJStorage = "none";
addressBJ = "none";

function changeNet(value){
	netname = value;
	console.log("net:", netname);
	if(netname == "ropsten"){
        netname = "ropsten";

		urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		erc20address = "0x95a48dca999c89e4e284930d9b9af973a7481287";
		// dice
		addressDice = "0x6a8f29e3d9e25bc683a852765f24ecb4be5903fc";
		// blackjack
		addressBJDeck = "0x75dacdec23342b26ff598e3304d3ff632b42077a";
		addressBJStorage = "0x18d4bd271a6123335edca33eec83318b75ae8ae0";
		addressBJ = "0x1903eef30317204fb5aabd9533659d9b23a7ec37";
	} else if(netname == "testrpc"){
		urlInfura = "http://46.101.244.101:8545";
		erc20address = "0xb207301c77a9e6660c9c2e5e8608eaa699a9940f";
		// dice
		addressDice = "0xdbdb232171a8639603e1341b8d62a5425f5d2ddd";
	} else if (netname == "mainnet"){
        netname = "mainnet";

		urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		erc20address = ""; 
		// dice
		addressDice = "";
	} else if (netname == "rinkeby"){
        netname = "rinkeby";
        
		urlInfura = "https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		erc20address = "0xBa2F1399dF21C75ce578630Ff9Ed9285b2146B8D"; 
		// dice
        //addressDice = "0x1c864f1851698ec6b292c936acfa5ac5288a9d27"
	}
}
changeNet(netname);


function getNet(){
	return netname;
}