/**
 * Created by Sergey Pomorin on 07.03.2017.
 */
 
var urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";

var Infura = function() {
    if(options_testnet){
		urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		addressContract = addressTestContract;
	}
};

Infura.prototype.sendRequest = function(name, params, callback, obj){
	if(options_ethereum && openkey){
		var method = name;
		switch(name){
			case "deal":
			case "hit":
			case "hitB":
			case "stand":
			case "split":
				method = "eth_getTransactionCount";
				break;
			case "gameTxHash":
			case "sendRaw":
				method = "eth_sendRawTransaction";
				break;
			case "getBalance":
			case "getBalanceBank":
				method = "eth_getBalance";
				break;
			default:
				method = "eth_call";
				break;
		}
		
		var arParams = [params, "latest"];
		if(method == "eth_sendRawTransaction"){
			arParams = [params];
		}
		
		$.ajax({
			type: "POST",
			url: urlInfura,
			dataType: 'json',
			async: false,
			data: JSON.stringify({"jsonrpc":'2.0',
									"method":method,
									"params":arParams,
									"id":1}),
			success: function (d) {
				callback(name, d.result, obj);
			}
		})
	}
};