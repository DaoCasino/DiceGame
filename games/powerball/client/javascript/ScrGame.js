
function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

var TIME_GET_STATE = 10000;
var TIME_WAIT = 500;
var C_BUY_TICKET = "7a65ea5f";

var urlResult = "http://api.dao.casino/daohack/api.php?a=getreuslt&id";
var urlEtherscan = "https://api.etherscan.io/";
var urlBalance = "";

var obj_game = {};
var _wndInfo;
var _callback;
var _mouseX = 0;
var _mouseY = 0;
var priceTicket = 20000000000000000; // 0.02 ether
var priceGTicket = 0;
var _bWindow = false;

ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.back_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();
	
	this.startTime = getTimer();
	this.gameTime = getTimer();
	this._arButtons = [];
	
	this.addChild(this.back_mc);
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	if(options_debug){
		var tfDebug = addText("Debug", 20, "#FF0000", "#000000", "right", 400)
		tfDebug.x = _W-20;
		tfDebug.y = _H-30;
		this.face_mc.addChild(tfDebug);
	}
	
	if(options_rpc){
		urlEtherscan = "https://ropsten.etherscan.io/";
		addressContract = addressRpcContract;
	}else if(options_testnet){
		urlEtherscan = "https://ropsten.etherscan.io/";
		addressContract = addressTestContract;
	}
	
	obj_game["game"] = this;
	obj_game["balance"] = 0;
	obj_game["balanceBank"] = 0;
	_callback = obj_game["game"].response;
	priceGTicket = toFixed((priceTicket/1000000000000000000), 4);
	
	this.initArt();
	this.initGUI();
	this.initText();
	this.testGame();
	
	infura.sendRequest("getBalance", openkey, _callback);

	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.initArt = function(){
	var bg = addObj("bg", _W/2, _H/2);
	bg.scale.x =  _W/bg.w;
	bg.scale.y =  _H/bg.h;
	this.back_mc.addChild(bg);
}

ScrGame.prototype.initGUI = function(){
	var scGui = 0.5;
	var stepY = 50;
	var icoKey = addObj("icoKey", 40, 40, scGui);
	icoKey.interactive = true;
	icoKey.buttonMode=true;
	icoKey._selected=false;
	this.face_mc.addChild(icoKey);
	this._arButtons.push(icoKey);
	var icoEthereum = addObj("icoEthereum", 40, 40+stepY*1, scGui);
	this.face_mc.addChild(icoEthereum);
	var icoTime = addObj("icoTime", 40, 40+stepY*2, scGui);
	this.face_mc.addChild(icoTime);
	var btnFrame = addButton2("btnFrame", 345, 38, 1, 1.2);
	btnFrame.name = "btnKey";
	btnFrame.interactive = true;
	btnFrame.buttonMode=true;
	this.face_mc.addChild(btnFrame);
	this._arButtons.push(btnFrame);
	var btnBuy = this.createButton("btnBuy", _W/2, 900, "Buy", 1, 36);
	this.btnBuy = btnBuy;
	
	this.icoKey = icoKey;
	this.icoEthereum = icoEthereum;
	this.icoTime = icoTime;
	
	this.checkBuy();
}

ScrGame.prototype.initText = function(){
	var strUser = openkey || 'id';
	var fontSize = 24;
	this.tfIdUser = addText(strUser, fontSize, "#ffffff", "#000000", "left", 1000, 4)
	this.tfIdUser.x = this.icoKey.x + 30;
	this.tfIdUser.y = this.icoKey.y - 12;
	this.face_mc.addChild(this.tfIdUser);
	this.tfBalance = addText(String(obj_game["balance"]), fontSize, "#ffffff", "#000000", "left", 400, 4)
	this.tfBalance.x = this.icoEthereum.x + 30;
	this.tfBalance.y = this.icoEthereum.y - 12;
	this.face_mc.addChild(this.tfBalance);
	this.tfTotalTime = addText("0", fontSize, "#ffffff", "#000000", "left", 400, 4)
	this.tfTotalTime.x = this.icoTime.x + 30;
	this.tfTotalTime.y = this.icoTime.y - 12;
	this.face_mc.addChild(this.tfTotalTime);
	this.tfVers= addText(version, fontSize, "#ffffff", "#000000", "left", 400, 4)
	this.tfVers.x = this.icoTime.x - 10;
	this.tfVers.y = this.tfTotalTime.y + 40;
	this.face_mc.addChild(this.tfVers);
}

ScrGame.prototype.createButton = function(name, x, y, label, sc, size, skin) {
	if(sc){}else{sc=1}
	if(size){}else{size=22}
	if(skin){}else{skin="btnDefault"}
	
	var btn = addButton2(skin, x, y, sc);
	btn.name = name;
	btn.interactive = true;
	btn.buttonMode=true;
	btn.overSc=true;
	if(name == "btnSmart" || name == "btnDao"){
		this.addChild(btn);
	} else {
		this.face_mc.addChild(btn);
	}
	this._arButtons.push(btn);
	var tf = addText(label, size, "#FFFFFF", undefined, "center", 350)
	tf.x = 0;
	tf.y = -tf.height/2;
	btn.addChild(tf);
	
	return btn;
}

ScrGame.prototype.createWndInfo = function(str, callback, addStr) {
	if(_wndInfo == undefined){
		_wndInfo = new WndInfo(this);
		_wndInfo.x = _W/2;
		_wndInfo.y = _H/2;
		this.face_mc.addChild(_wndInfo);
	}
	
	this.bWindow = true;
	_wndInfo.show(str, callback, addStr);
	_wndInfo.visible = true;
	this.curWindow = _wndInfo;
}

ScrGame.prototype.showError = function(value, callback) {
	if(_wndInfo == undefined){
		_wndInfo = new WndInfo(this);
		_wndInfo.x = _W/2;
		_wndInfo.y = _H/2;
		this.face_mc.addChild(_wndInfo);
	}
	
	this.bWindow = true;
	_wndInfo.showError(value, callback);
	_wndInfo.visible = true;
	this.curWindow = _wndInfo;
}

ScrGame.prototype.closeWindow = function(wnd) {
	obj_game["game"].curWindow = wnd;
	obj_game["game"].timeCloseWnd = 200;
}

ScrGame.prototype.checkBuy  = function(countWhite, countRed){
	var val = true;
	
	if(countWhite == 5 && countRed == 1 && 
	obj_game["balance"] > priceGTicket){
		val = false;
	}
	
	var btn = this.btnBuy;
	btn.locked = val;
	btn.lock.visible = val;
}

ScrGame.prototype.testGame  = function(){
	var ticket = new ItemTicket(this);
	ticket.x = _W/2;
	ticket.y = _H/2;
	this.game_mc.addChild(ticket);
}

ScrGame.prototype.buyTicket  = function(){
	if(openkey == undefined){
		obj_game["game"].showError(ERROR_KEY, showHome);
		return false;
	}
	// [1,2,3,4,5],5,0
	infura.sendRequest("buyTicket", openkey, _callback);
}

ScrGame.prototype.responseTransaction = function(name, value) {
	console.log("get nonce action: ", name);
	var prnt = obj_game["game"];
	var data = "";
	var price = 0;
	var nameRequest = "sendRaw";
	var gasPrice="0x9502F9000";//web3.toHex('40000000000');
	var gasLimit=0x927c0; //web3.toHex('600000');
	if(name == "buyTicket"){
		data = "0x"+C_BUY_TICKET;
		price = priceTicket;
		nameRequest = "gameTxHash";
	}
	
	infura.sendRequest("getBalance", openkey, _callback);
	var options = {};
	options.nonce = value;
	options.to = addressContract;
	options.data = data; // method from contact
	options.gasPrice = gasPrice;
	options.gasLimit = gasLimit;
	options.value = price;
	
	if(privkey){
		if(buf == undefined){
			obj_game["game"].showError(ERROR_BUF);
		} else {
			//приватный ключ игрока, подписываем транзакцию
			var tx = new EthereumTx(options);
			tx.sign(new buf(privkey, 'hex'));

			var serializedTx = tx.serialize().toString('hex');
			console.log("The transaction was signed");
			
			var params = "0x"+String(serializedTx);
			infura.sendRequest(nameRequest, params, _callback);
		}
	}
}

ScrGame.prototype.response = function(command, value) {
	var prnt = obj_game["game"];
	if(value == undefined || options_debug){
		if(command == "sendRaw" && !options_debug){
			prnt.showError(ERROR_TRANSACTION);
		}
		return false;
	}
	
	if(command == "gameTxHash"){
		infura.sendRequest("getBalance", openkey, _callback);
	} else if(command == "getBalance"){
		obj_game["balance"] = toFixed((Number(hexToNum(value))/1000000000000000000), 4);
		login_obj["balance"] = obj_game["balance"];
		prnt.tfBalance.setText(obj_game["balance"]);
	}
}

ScrGame.prototype.resetTimer  = function(){
	
}

ScrGame.prototype.update = function(){
	var diffTime = getTimer() - this.startTime;
	
	//TODO
	
	this.startTime = getTimer();
}


ScrGame.prototype.clickCell = function(item_mc) {
	var name = item_mc.name;
	if(item_mc.name.search("btn") != -1){
		item_mc._selected = false;
		if(item_mc.over){
			item_mc.over.visible = false;
		}
	}
	if(item_mc.overSc){
		item_mc.scale.x = 1*item_mc.sc;
		item_mc.scale.y = 1*item_mc.sc;
	}
	
	if(item_mc.name == "btnBuy"){
		this.buyTicket();
	} else if(item_mc.name == "btnKey" || item_mc.name == "icoKey"){
		copyToClipboard(openkey);
	}
}

ScrGame.prototype.checkButtons = function(evt){
	_mouseX = evt.data.global.x;
	_mouseY = evt.data.global.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, _mouseX, _mouseY) &&
		item_mc.visible && item_mc.dead != true && !item_mc.locked &&
		item_mc.alpha == 1){
			if(item_mc._selected == false){
				item_mc._selected = true;
				if(item_mc.over){
					item_mc.over.visible = true;
				} else if(item_mc.overSc){
					item_mc.scale.x = 1.1*item_mc.sc;
					item_mc.scale.y = 1.1*item_mc.sc;
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				} else if(item_mc.overSc){
					item_mc.scale.x = 1*item_mc.sc;
					item_mc.scale.y = 1*item_mc.sc;
				}
			}
		}
	}
}

ScrGame.prototype.touchHandler = function(evt){
	if(_bWindow){
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