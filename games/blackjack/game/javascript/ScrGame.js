
function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

var TIME_GET_CARDS = 10000;
var urlResult = "http://api.dao.casino/daohack/api.php?a=getreuslt&id";
var urlEtherscan = "https://api.etherscan.io/";
var urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var urlBalance = "";
var addressContract = "0xa65d59708838581520511d98fb8b5d1f76a96cad";
var betEth = 200000000000000000; //ставка эфира
var betGame = betEth/1000000000000000000; //ставка 0.2 эфира
var obj_game = {};
var _mouseX;
var _mouseY;
var blockNumber;
var idOraclizeGame = undefined;
var resultTxid = undefined;
var gasAmount = 4000000;

var accounts;
var account;
var gameInited = false;
var gameIsGoingOn;
var suit = {0: 'Hearts', 1: 'Diamonds', 2: 'Spades', 3: 'Clubs'};
var cardType = {0: 'King', 1: 'Ace', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
                11: 'Jacket', 12: 'Queen'};

var gameState = {
  0: "Your turn",
  1: "You won!",
  2: "House won!",
  3: "Tie!"
}
var lastPlayerCard = 0;
var lastHouseCard = 0;

	
ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.back_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();
	
	this.startTime = getTimer();
	this.gameTime = getTimer();
	this._arButtons = [];
	this.timeGetCards = 0;
	this.timeTotal = 0;
	this.gameTxHash = undefined;
	this.startGame = false;
	this._gameOver = false;
	this.bSendRequest = false;
	this.bWindow = false;
	this.bCardP0 = false;
	this.bCardP1 = false;
	
	this.bg = addObj("bgGame", _W/2, _H/2);
	this.addChild(this.bg);
	
	if(options_debug){
		var tfDebug = addText("Debug", 20, "#FF0000", "#000000", "right", 400)
		tfDebug.x = _W-20;
		tfDebug.y = 10;
		this.face_mc.addChild(tfDebug);
		
		options_mainet = true;
		options_testnet = false
		
		if(openkey && privkey){
		} else {
			if(options_testnet){
				openkey = "0x746DCDC5541fe2d9CA9b65F4cA1A15a816e14F3c";
				privkey = "deef4f0a38670685083201329b1d31e3d593c76779fc56a3489096757838f0f8";
			} else {
				openkey = "0x04df40420e808a5e6abc670049126ba60cfa4c2d";
				privkey = "962f2a988d0f0eb4b2a0664deb3cfd4af449d13ecd6739a0f1ffd54435d594ae";
			}
		}
	}
	
	if(options_testnet){
		urlEtherscan = "https://testnet.etherscan.io/";
		urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
		addressContract = "0xb22cd5f9e5f0d62d47e52110d9eec3a45be54498";
	} else {
		betEth = 200000000000000000; //ставка эфира
		betGame = betEth/1000000000000000000; //ставка 1 эфир
	}
	
	obj_game["game"] = this;
	obj_game["balance"] = 0;
	
	this.addChild(this.back_mc);
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	this.createGUI();
	this.sendRequest("getBalance");
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.createGame = function(){
	gameInited = true;
	oldState = gameIsGoingOn;
	gameIsGoingOn = true;
	this.showGameButtons();
}

ScrGame.prototype.createGUI = function() {	
	var icoKey = addObj("icoKey", 40, 40);
	this.face_mc.addChild(icoKey);
	var icoEthereum = addObj("icoEthereum", 40, 80);
	this.face_mc.addChild(icoEthereum);
	var icoTime = addObj("icoTime", 40, 120);
	this.face_mc.addChild(icoTime);
	
	var offsetY = 25;
	var strUser = 'id'
	this.tfIdUser = addText(strUser, 20, "#ffffff", "#000000", "left", 1000, 4, fontMain)
	this.tfIdUser.x = icoKey.x + 24;
	this.tfIdUser.y = icoKey.y - 12;
	this.face_mc.addChild(this.tfIdUser);
	this.tfBalance = addText("0", 20, "#ffffff", "#000000", "left", 400, 4, fontMain)
	this.tfBalance.x = icoEthereum.x + 24;
	this.tfBalance.y = icoEthereum.y - 12;
	this.face_mc.addChild(this.tfBalance);
	this.tfTotalTime = addText("0", 20, "#ffffff", "#000000", "left", 400, 4, fontMain)
	this.tfTotalTime.x = icoTime.x + 24;
	this.tfTotalTime.y = icoTime.y - 12;
	this.face_mc.addChild(this.tfTotalTime);
	
	if(openkey){
		this.tfIdUser.setText(openkey);
	}
	
	var btnStart = addButton2("btnDefault", _W/2, _H/2+250);
	btnStart.name = "btnStart";
	btnStart.interactive = true;
	btnStart.buttonMode=true;
	this.addChild(btnStart);
	this._arButtons.push(btnStart);
	var tf = addText("Play", 24, "#FFFFFF", undefined, "center", 350, 2)
	tf.x = 0;
	tf.y = - 17;
	btnStart.addChild(tf);
	var btnHit = addButton2("btnGreen", _W/2-150, _H/2+200, 0.5);
	btnHit.name = "btnHit";
	btnHit.interactive = true;
	btnHit.buttonMode=true;
	btnHit.visible = false;
	this.addChild(btnHit);
	this._arButtons.push(btnHit);
	var tf = addText("Hit", 48, "#FFFFFF", undefined, "center", 350, 2)
	tf.x = 0;
	tf.y = - 17;
	btnHit.addChild(tf);
	this.btnHit = btnHit;
	var btnStand = addButton2("btnOrange", _W/2+150, _H/2+200, 0.5);
	btnStand.name = "btnStand";
	btnStand.interactive = true;
	btnStand.buttonMode=true;
	btnStand.visible = false;
	this.addChild(btnStand);
	this._arButtons.push(btnStand);
	var tf = addText("Stand", 48, "#FFFFFF", undefined, "center", 350, 2)
	tf.x = 0;
	tf.y = - 17;
	btnStand.addChild(tf);
	this.btnStand = btnStand;
}

ScrGame.prototype.checkGameState = function() {
	console.log("Checking game state");
  
}

ScrGame.prototype.showGameButtons = function() {	
  if (!gameInited) return;
  if (gameIsGoingOn) {
    this.btnHit.visible = true;
    this.btnStand.visible = true;
  } else {
    this.btnHit.visible = false;
    this.btnStand.visible = false;
  }
}

ScrGame.prototype.showPlayerCard = function(card){
  // if (!oldState && !gameIsGoingOn) return;
  card.x = _W/2 - card.w/2 + lastPlayerCard*card.w/3;
  card.y = _H/2 + 100;
  this.game_mc.addChild(card);
  lastPlayerCard++;
  // dealedCards.push(card);
  // renderer.render(stage);
}

ScrGame.prototype.getCard = function(cardIndex){
  var cardType = Math.floor(cardIndex / 4);
  var cardSymbol = String(cardType);
  switch (cardType) {
    case 0:
      cardSymbol = "K";
      break;
    case 1:
      cardSymbol = "A";
      break;
    case 11:
      cardSymbol = "J";
      break;
    case 12:
      cardSymbol = "Q";
      break;
  }
  var suit = String(cardIndex % 4 + 1);
  var spriteName = suit + "_" + cardSymbol;
  var newCard = addObj(spriteName, 0, 0, 0.5);
  newCard.zIndex = 10;
  return newCard;
}

ScrGame.prototype.getPlayerCard = function(value){
    var callData = "0xd02d13820000000000000000000000000000000000000000000000000000000000000000";
    callData = callData.substr(0, 10);
	var data = callData + pad(numToHex(value), 64);
	console.log("data:", data);
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	this.sendInfuraRequest("getPlayerCard", params, value);
}

// START
ScrGame.prototype.startGameEth = function(){
	if(openkey == undefined){
		console.log("ERROR_KEY");
		return false;
	}
	
	$.ajax({
		type: "POST",
		url: urlInfura,
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
			options.data = "0x553df021"; // deal();
			options.gasPrice="0x737be7600";//web3.toHex('31000000000');
			options.gasLimit=0x927c0; //web3.toHex('600000');
			options.value = betEth;
			
			if(privkey){
				if(buf == undefined){
					console.log("ERROR_TRANSACTION");
				} else {
					//приватный ключ игрока, подписываем транзакцию
					var tx = new EthereumTx(options);
					tx.sign(new buf(privkey, 'hex'));

					var serializedTx = tx.serialize().toString('hex');
					obj_game["game"].createGame();
					obj_game["game"].bSendRequest = false;
					obj_game["game"].startGame = true;
					console.log("The transaction was signed: "+serializedTx);
					
					$.ajax({
						type: "POST",
						url: urlInfura,
						dataType: 'json',
						async: false,
						data: JSON.stringify({"id":0,
											"jsonrpc":'2.0',
											"method":'eth_sendRawTransaction',
											"params":["0x"+String(serializedTx)]}),
						success: function (d) {
							obj_game["game"].response("gameTxHash", d.result) 
							console.log("Транзакция отправлена в сеть:", d.result);
						}
					})
				}
			}
		}
	})
}

ScrGame.prototype.sendInfuraRequest = function(name, params, ind) {
	var method = name;
	switch(name){
		case "getBalance":
			method = "eth_getBalance";
			break;
		case "getPlayerCard":
			method = "eth_call";
			break;
	}
	
	$.ajax({
		type: "POST",
		url: urlInfura,
		dataType: 'json',
		async: false,
		data: JSON.stringify({"id":0,
							"jsonrpc":'2.0',
							"method":method,
							"params":[params, "latest"]}),
		success: function (d) {
			obj_game["game"].response(name, d.result, ind);
		}
	})
}

ScrGame.prototype.sendRequest = function(value) {
	if(options_ethereum && openkey){
		if(value == "game"){
			
		} else if(value == "getBalance"){
			this.sendInfuraRequest("getBalance", openkey);
		}
	}
}

ScrGame.prototype.response = function(command, value, index) {
	if(value == undefined){
		return false;
	}
	
	console.log("response:", command, value)
	if(command == "gameTxHash"){
		obj_game["gameTxHash"] = value;
		login_obj["gameTxHash"] = value;
		this.gameTxHash = obj_game["gameTxHash"];	
		if(!this.bCardP0){
			this.getPlayerCard(0);
		}
		if(!this.bCardP1){
			this.getPlayerCard(1);
		}
	} else if(command == "getBalance"){
		obj_game["balance"] = toFixed((Number(hexToNum(value))/1000000000000000000), 4);
		login_obj["balance"] = obj_game["balance"];
		this.tfBalance.setText(obj_game["balance"]);
	} else if(command == "getPlayerCard"){
		switch(index){
			case 0:
				this.bCardP0 = true;
				break;
			case 1:
				this.bCardP1 = true;
				break;
		}
		
		var card = hexToNum(value);
		console.log("card:", index, card);
		this.showPlayerCard(this.getCard(card));
		
		if(this.bCardP0 && this.bCardP1){
			this.bSendRequest = true;
		}
	}
}

ScrGame.prototype.resetTimer  = function(){
	
}

ScrGame.prototype.update = function(){
	var diffTime = getTimer() - this.startTime;
	
	if(this.startGame){
		this.timeTotal += diffTime;
		this.tfTotalTime.setText(Math.round(this.timeTotal/1000));
	}
	if(this.gameTxHash){
		this.timeGetCards += diffTime;
		if(this.timeGetCards >= TIME_GET_CARDS &&
		this.bSendRequest == false){
			this.timeGetCards = 0;
			if(!this.bCardP0){
				this.getPlayerCard(0);
			}
			if(!this.bCardP1){
				this.getPlayerCard(1);
			}
		}
	}
	
	this.startTime = getTimer();
}

ScrGame.prototype.clickCell = function(item_mc) {
	if(item_mc.name.search("btn") != -1){
		item_mc._selected = false;
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	
	if(item_mc.name == "btnStart"){
		item_mc.visible = false;
		this.startGameEth();
	}
}

ScrGame.prototype.checkButtons = function(evt){
	_mouseX = evt.data.global.x;
	_mouseY = evt.data.global.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, _mouseX, _mouseY) &&
		item_mc.visible && item_mc.dead != true){
			if(item_mc._selected == false){
				item_mc._selected = true;
				if(item_mc.over){
					item_mc.over.visible = true;
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				}
			}
		}
	}
}

ScrGame.prototype.touchHandler = function(evt){
	if(this.bWindow){
		return false;
	}
	var phase = evt.type;
	
	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	} else if (phase == 'mousedown' || phase == 'touchend') {
		for (var i = 0; i < this._arButtons.length; i++) {
			var item_mc = this._arButtons[i];
			if(item_mc._selected){
				this.clickCell(item_mc);
				return;
			}
		}
	}
}

ScrGame.prototype.removeAllListener = function(){
	if(this.wndInfo){
		this.wndInfo.removeAllListener();
	}
	if(this.wndResult){
		this.wndResult.removeAllListener();
	}
	
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}