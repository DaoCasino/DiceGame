function error(mes) {
    
    alert(mes)
}


var urlSite = "https://api.etherscan.io/";
urlSite = "https://testnet.etherscan.io/";
var urlBalance = "";
var optionsTo = "0xb8b53caa3ff81699f4641e028f1561cbd5ef2577 "; // cotract
var betEth = 200000000000000000; //ставка эфира
var obj_game = {};
obj_game["game"] = this;
var mainet, openkey, privkey;

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
		console.log("localStorage_failed:",e);
        return false;
    }
}

function loadData() {
	if(isLocalStorageAvailable()){
		mainet = localStorage.getItem('mainnet')
		openkey = localStorage.getItem('openkey')
		privkey = localStorage.getItem('privkey')
	}
	console.log("mainet:", mainet)
	console.log("openkey:", openkey)
	console.log("privkey:", privkey)
	startGameEth();
}

// START
function startGameEth() {
	if(openkey == undefined){
		obj_game["game"].showError(ERROR_KEY);
		return false;
	}
	// To play the game send 1 ether [confirm]
	// win odds ... mult...
	var openKey = openkey.substr(2);
	console.log("startGameEth:", openKey)
	$.get(urlSite+"api?module=proxy&action=eth_getTransactionCount&address="+openkey+"&tag=latest&apikey=YourApiKeyToken",function(d){
		console.log("получили nonce "+d.result);
		var options = {};
		options.nonce = d.result;
		
		options.to = optionsTo; //адрес нашего смарт контракта
		options.data = '0xacfff3770000000000000000000000000000000000000000000000000000000000000032';
		options.gasPrice="0x737be7600";
		options.gasLimit=0x927c0;
		options.value = betEth; //ставка

		if(privkey){
			if(buf == undefined){
				console.log("ERROR_TRANSACTION");
			} else {
				var tx = new EthereumTx(options);
				tx.sign(new buf(privkey, 'hex')); //приватный ключ игрока, подписываем транзакцию

				var serializedTx = tx.serialize().toString('hex');
				
				console.log("Транзакция подписана: "+serializedTx);
				$.getJSON(urlSite+"api?module=proxy&action=eth_sendRawTransaction&hex="+serializedTx+"&apikey=YourApiKeyToken",function(d){
					//здесь будет ethereum txid по которому мы позже сможем вытащить результат.
					// obj_game["game"].response("idGame", d.result) 
					console.log("Транзакция отправлена в сеть:", d.result);
				});
			}
		}
	}, "json");
}