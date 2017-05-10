/**
 * Created by Sergey Pomorin on 07.03.2017.
 * v 1.0.2
 */
 
var urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var gThis;
var repeatRequest = 0;

var Infura = function() {
	gThis = this;
	if(options_rpc){
		urlInfura = "http://46.101.244.101:8545";
    } else if(options_testnet){
		urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
	}
};

Infura.prototype.makeID = function(){
    var str = "0x";
    var possible = "abcdef0123456789";

    for( var i=0; i < 64; i++ ){
		if(getTimer()%2==0){
			str += possible.charAt(Math.floor(Math.random() * possible.length));
		} else {
			str += possible.charAt(Math.floor(Math.random() * (possible.length-1)));
		}
	}

	str = numToHex(str);
    return str;
}

Infura.prototype.sendRequest = function(name, params, callback, seed){
	if(openkey){
		var method = name;
		var arParams = [params, "latest"]; // latest, pending
		
		switch(name){
			case "roll":
				method = "eth_getTransactionCount";
				break;
			case "sendRaw":
				method = "eth_sendRawTransaction";
				arParams = [params];
				break;
			case "getBalance":
			case "getBalanceBank":
				method = "eth_getBalance";
				break;
			case "getBlockNumber":
				method = "eth_blockNumber";
				arParams = [];
				break;
			default:
				method = "eth_call";
				break;
		}
		
		$.ajax({
			url: urlInfura,
			type: "POST",
			async: false,
			dataType: 'json',
			data: JSON.stringify({"jsonrpc":'2.0',
									"method":method,
									"params":arParams,
									"id":1}),
			success: function (d) {
				if(method == "eth_sendRawTransaction"){
					gThis.sendRequestServer("responseServer", d.result, callback, seed);
				}
				callback(name, d.result);
			},
			error: function(jQXHR, textStatus, errorThrown)
			{
				alert("An error occurred whilst trying to contact the server: " + 
						jQXHR.status + " " + textStatus + " " + errorThrown);
			}
		})
	}
};

Infura.prototype.sendRequestServer = function(name, txid, callback, seed){
	console.log("success gameTxHash:", txid);
	repeatRequest = 0;
	var url = "https://platform.dao.casino/api/proxy.php?a=roll&";
	$.get(url+"txid="+txid+"&vconcat="+seed, 
		function(d){
			gThis.checkJson(name, seed, callback);
		}
	);
}

Infura.prototype.checkJson = function(name, seed, callback){
	$.ajax({
		url: "https://platform.dao.casino/api/proxy.php?a=get&vconcat="+seed,
		type: "POST",
		async: false,
		success: function (obj) {
			if(obj){
				if(obj > 0){
					repeatRequest = 0;
					// console.log("checkJson:", seed);
					callback(name, obj, seed);
				} else {
					setTimeout(function () {
						if(repeatRequest < 60){
							repeatRequest++;
							gThis.checkJson(name, seed, callback);
						}
					}, 1000);
				}
			} else {
				setTimeout(function () {
					if(repeatRequest < 60){
						repeatRequest++;
						gThis.checkJson(name, seed, callback);
					}
				}, 1000);
			}
		}
	})
}