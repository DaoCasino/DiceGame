function ScrTest() {
	PIXI.Container.call( this );
	this.init();
}

ScrTest.prototype = Object.create(PIXI.Container.prototype);
ScrTest.prototype.constructor = ScrTest;


var urlSite = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var addressContract = "0x5c430fa24f782cf8156ca97208c42127b17b0494";
var obj_game = {};

ScrTest.prototype.init = function() {
	obj_game["game"] = this;
	
	if(options_testnet){
		urlSite = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		addressContract = "0xb22cd5f9e5f0d62d47e52110d9eec3a45be54498";
	}
	
	this.startGame();
}

// START
ScrTest.prototype.startGame = function(){
	if(openkey == undefined){
		openkey = "0x746DCDC5541fe2d9CA9b65F4cA1A15a816e14F3c"
		privkey = "deef4f0a38670685083201329b1d31e3d593c76779fc56a3489096757838f0f8"
		console.log("ERROR KEY");
		// return false;
	}
	
	$.ajax({
		type: "POST",
		url: urlSite,
		dataType: 'json',
		async: false,
		data: JSON.stringify({"jsonrpc":"2.0",
							"method":"eth_getTransactionCount",
							"params":[openkey,"latest"],
							"id":1}),
		success: function (d) {
			console.log("get nonce "+d.result);
			var options = {};
			options.nonce = d.result;
			options.to = addressContract;
			// call function game() in contract
			options.data = '0xcddbe729000000000000000000000000000000000000000000000000000000000000000'+String(obj_game["game"].curLevel);
			options.gasPrice="0x737be7600";//web3.toHex('31000000000');
			options.gasLimit=0x927c0; //web3.toHex('600000');
			options.value = betEth;

			if(privkey){
				if(buf == undefined){
					console.log("ERROR TRANSACTION");
				} else {
					var tx = new EthereumTx(options);
					tx.sign(new buf(privkey, 'hex')); //приватный ключ игрока, подписываем транзакцию

					var serializedTx = tx.serialize().toString('hex');
					console.log("The transaction was signed: "+serializedTx);
										
					$.ajax({
						type: "POST",
						url: urlSite,
						dataType: 'json',
						async: false,
						data: JSON.stringify({"id":0,
											"jsonrpc":'2.0',
											"method":'eth_sendRawTransaction',
											"params":["0x"+String(serializedTx)]}),
						success: function (d) {
							console.log("Транзакция отправлена в сеть:", d.result);
						}
					})
				}
			}
		}
	})
}