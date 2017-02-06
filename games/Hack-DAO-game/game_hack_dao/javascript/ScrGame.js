function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

var TIME_GET_RESULT = 10000;
var urlRequest = "http://92.243.94.148/daohack/api.php?a=start";
var urlResult = "http://92.243.94.148/daohack/api.php?a=getreuslt&id";
var urlBalance = "";
var obj_game = {};
var _mouseX;
var _mouseY;
	
ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.back_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();
	
	this.startTime = getTimer();
	this._arButtons = [];
	this._arObject = [];
	this._arText = [];
	this._arHolder = [];
	this.timeGetResult = 0;
	this.timeTotal = 0;
	this.timeCloseWnd = 0;
	this.idGame = undefined;
	this.clickDAO = false;
	this.startGame = false;
	this._gameOver = false;
	this.bSendRequest = false;
	this.bWindow = false;
	this.bResult = false;
	this.damage = 20;
	this.resurrectionCur = 1;
	this.showWinEthereum = 0;
	this.showTimeEthereum = 100;
	this.resurrection = this.resurrectionCur;
	this.curLevel = Number(login_obj["level"]) || 1;
	this.wndInfo;
	this.curWindow;
	
	if(options_debug){
		var tfDebug = addText("Debug", 20, "#FF0000", "#000000", "right", 400)
		tfDebug.x = _W-20;
		tfDebug.y = 10;
		this.face_mc.addChild(tfDebug);
		
		this.curLevel = 2;
	}
	
	this.arTitle = ["",
		"30.04.2016 \n The DAO is live",
		"ICO \n The DAO raised over US $100m from more than 11,000 participants",
		"Proposal",
		"16.06.2016 \n Dao get attacked, DAO price fell, ETH price fell",
		"White hat attack",
		"Hard Fork 1",
		"Back to main network",
		"Hard Fork 2 \n Hard fork cafe",
		"Ethereum Classiс"
	]
	
	obj_game["game"] = this;
	obj_game["balance"] = 0;
	
	this.addChild(this.back_mc);
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	this.bgGame = addObj("bgLevel"+this.curLevel, _W/2, _H/2);
	this.back_mc.addChild(this.bgGame);
	
	this.tfTitleLevel = addText("", 24, "#00FF00", "#000000", "center", 1000, 3)
	this.tfTitleLevel.x = _W/2;
	this.tfTitleLevel.y = 120;
	this.face_mc.addChild(this.tfTitleLevel);
	
	this.itemDao = new ItemDao();
	this.game_mc.addChild(this.itemDao);
	this._arButtons.push(this.itemDao);
	this._arObject.push(this.itemDao);
	
	this.createObj({x:700, y:150}, "cloud1")
	this.createObj({x:150, y:200}, "cloud2")
	this.createObj({x:-400, y:100}, "cloud1")
	
	this.btnExport = this.createButton("btnExport", 90, 120, "Export keys", 21)
	this.btnStart = this.createButton("btnStart", _W/2, 550, "Start", 21)
	this.btnTry = this.createButton("btnTry", _W/2, 550, "Try again", 21)
	this.btnTry.visible = false;
	this.btnNext = this.createButton("btnNext", _W/2, 550, "Next level", 21)
	this.btnNext.visible = false;
	if(options_debug){
		this.btnReset = this.createButton("btnReset", 90, 180, "Clear log", 26, 17)
	}
	
	this.createGUI();
	this.createAccount();
	this.sendRequest("getBalance");
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.resetGame = function() {
	this.timeGetResult = 0;
	this.timeTotal = 0;
	this.timeCloseWnd = 0;
	this.clickDAO = false;
	this.startGame = false;
	this._gameOver = false;
	this.tfTotalTime.setText("time: " + Math.round(this.timeTotal/1000));
	this.itemDao.healthMax = 1000;
	this.itemDao.health = this.itemDao.healthMax;
	this.btnStart.visible = true;
	this.itemDao.visible = false;
}

ScrGame.prototype.clearLog = function() {	
	resetData();
	this.resetGame();
	this.createAccount();
}

ScrGame.prototype.createButton = function(name, x, y, label, size, offset) {	
	if(size){}else{size=22}
	if(offset){}else{offset=15}
	
	var btn = addButton2("btnDefault", x, y);
	btn.name = name;
	this.face_mc.addChild(btn);
	this._arButtons.push(btn);
	var tf = addText(label, size, "#FFFFFF", "#000000", "center", 350)
	tf.x = 0;
	tf.y = - offset;
	btn.addChild(tf);
	
	return btn;
}

// ALL LEVELS
ScrGame.prototype.createLevel = function() {
	if(this.bgGame){
		this.back_mc.removeChild(this.bgGame);
	}
	this.bgGame = addObj("bgLevel"+this.curLevel, _W/2, _H/2);
	if(this.bgGame){
	} else {
		console.log("bgLevel"+this.curLevel + " is undefined")
		this.bgGame = addObj("bgLevel1", _W/2, _H/2);
	}
	this.back_mc.addChild(this.bgGame);
	this.tfTitleLevel.setText(this.arTitle[this.curLevel]);
	if(this.hintArrow){
		this.hintArrow.visible = false;
	}
	
	switch (this.curLevel){
		case 1:
			this.itemDao.setSkin("egg");
			this.itemDao.setAct("Stay")
			this.itemDao.dead = false;
			this.itemDao.visible = true;
			this.hintArrow.visible = true;
			this.itemDao.x = _W/2;
			this.itemDao.y = 500;
			break;
		case 2:
			this.itemDao.setSkin("dao");
			this.itemDao.setAct("Stay")
			this.itemDao.dead = false;
			this.itemDao.visible = true;
			this.itemDao.x = _W/2;
			this.itemDao.y = 500;
			break;
		case 4:
		default:
			this.itemDao.setSkin("dao");
			this.itemDao.setAct("Stay")
			this.itemDao.dead = false;
			this.itemDao.visible = true;
			this.hintArrow.visible = true;
			this.itemDao.x = 900;
			this.itemDao.y = 500;
			
			this.hero = addObj("itemHero", 400, 500, 1, -1);
			this.game_mc.addChild(this.hero);
			break;
	}
	
	if(this.hintArrow){
		this.hintArrow.x = this.itemDao.x + 70;
		this.hintArrow.y = this.itemDao.y - 90;
	}
}

ScrGame.prototype.createAccount = function() {	
	if(login_obj["privkey"]){
		this.tfIdUser.setText("you: " + login_obj["openkey"]);
	}else{
		var tfCreateKey = addText("Now you generate address", 40, "#FF8611", "#000000", "center", 800)
		tfCreateKey.x = _W/2;
		tfCreateKey.y = 150;
		this.face_mc.addChild(tfCreateKey);
		createjs.Tween.get(tfCreateKey).wait(2000).to({alpha:0},500)
		if(keyethereum){
			var dk = keyethereum.create();
			var privateKey = dk.privateKey;
			var address = ethUtil.privateToAddress(privateKey);
			address = ethUtil.toChecksumAddress(address.toString('hex'));
			privateKey = privateKey.toString('hex');
			login_obj["privkey"] = privateKey;
			login_obj["openkey"] = address;
			this.tfIdUser.setText("your key: " + address);
			saveData();
		} else {
			this.showError(ERROR_KEYTHEREUM);
		}
	}
}

ScrGame.prototype.createGUI = function() {
	this.itemResult = new PIXI.Container();
	this.itemResult.x = _W/2;
	this.itemResult.y = 130;
	this.itemResult.visible = false;
	this.face_mc.addChild(this.itemResult);
	
	var tfResult = addText("time:", 50, "#FF0000", "#000000", "center", 400)
	this.itemResult.addChild(tfResult);
	this.itemResult.tf = tfResult;
	var tfBalance = addText("+0", 30, "#FF0000", "#000000", "center", 400)
	tfBalance.y = 55;
	this.itemResult.addChild(tfBalance);
	this.itemResult.tfBalance = tfBalance;
	
	this.hintArrow = new PIXI.Container();
	this.hintArrow.x = this.itemDao.x + 70;
	this.hintArrow.y = this.itemDao.y - 90;
	this.game_mc.addChild(this.hintArrow);
	var hintArrow = addObj("hintArrow");
	hintArrow.rotation = 35*Math.PI/180;
	this.hintArrow.addChild(hintArrow);
	
	var offsetY = 25;
	var strUser = 'id'
	this.tfIdUser = addText("your key: " + strUser, 20, "#ffffff", "#000000", "left", 1000)
	this.tfIdUser.x = 20;
	this.tfIdUser.y = 10;
	this.face_mc.addChild(this.tfIdUser);
	this.tfBalance = addText("balance: 0", 20, "#ffffff", "#000000", "left", 400)
	this.tfBalance.x = 20;
	this.tfBalance.y = this.tfIdUser.y + offsetY*1;
	this.face_mc.addChild(this.tfBalance);
	this.tfTotalTime = addText("time: 0", 20, "#ffffff", "#000000", "left", 400)
	this.tfTotalTime.x = 20;
	this.tfTotalTime.y = this.tfIdUser.y + offsetY*2;
	this.face_mc.addChild(this.tfTotalTime);
	this.tfLevel = addText("Level " + this.curLevel, 50, "#FFEF0B", "#000000", "center", 400, 4)
	this.tfLevel.x = _W/2;
	this.tfLevel.y = 50;
	this.face_mc.addChild(this.tfLevel);
}

ScrGame.prototype.createWndInfo = function(str, callback, addStr) {
	if(this.wndInfo == undefined){
		this.wndInfo = new WndInfo(this);
		this.wndInfo.x = _W/2;
		this.wndInfo.y = _H/2;
		this.face_mc.addChild(this.wndInfo);
	}
	
	this.bWindow = true;
	this.wndInfo.show(str, callback, addStr)
	this.wndInfo.visible = true;
	this.curWindow = this.bWindow;
}

ScrGame.prototype.closeWindow = function(wnd) {
	this.curWindow = wnd;
	this.timeCloseWnd = 200;
}

ScrGame.prototype.refillBalance = function() {
	if(login_obj["openkey"] && options_ethereum){
		var url = "http://platform.dao.casino/topup/?client=" + login_obj["openkey"];
		window.open(url, "_blank"); 
	}
}

ScrGame.prototype.exportKeys = function() {
	if(login_obj["openkey"] && options_ethereum){
		var url = "http://platform.dao.casino/export/?privkey="+login_obj["privkey"]+"&openkey="+login_obj["openkey"]
		window.open(url, "_blank"); 
	}
}

ScrGame.prototype.showError = function(value) {
	var str = "ERR"
	switch(value){
		case ERROR_KEYTHEREUM:
			str = "OOOPS! \n The key is not created. Try a different browser."
			break;
		case ERROR_TRANSACTION:
			str = "OOOPS! \n Transaction failed."
			this.resetGame();
			break;
		default:
			str = "ERR: " + value;
			break;
	}
	this.createWndInfo(str);
}

ScrGame.prototype.warningBalance = function() {
	var str = "Refill your account in the amount of 0.05 ETH."
	var addStr = "Refill";
	this.createWndInfo(str, this.refillBalance, addStr);
}

ScrGame.prototype.showWndClearLog = function() {
	var str = "Do you want to overwrite the keys?"
	var addStr = "Yes";
	this.createWndInfo(str, this.clearLog, addStr);
}

ScrGame.prototype.createIcoEthereum = function() {
	var dX = 100
	var _x = this.itemDao.x + Math.random()*dX - dX/2
	var _y = this.itemDao.y - 50
	var pt = {x:_x, y:_y}
	var str = "-"+String(this.damage)
	this.createObj(pt, "iconEthereum");
}

ScrGame.prototype.createText = function(point, str, color, t) {
	if(color){}else{color = "#FFFFFF"};
	if(t){}else{t = 1000};
	
	var mc = null;
	var newTf = true;
	
	for (var i = 0; i < this._arText.length; i++ ) {
		mc = this._arText[i];
		if (mc) {
			if (mc.dead) {
				mc.visible = true;
				mc.setText(str);
				newTf = false;
				break;
			}
		}
	}
	
	if (newTf) {
		// addText(text, size, color, glow, _align, width, px, bSc, font)
		mc = addText(str, 40, color, "0x000000");
		this.gfx_mc.addChild(mc);
		this._arText.push(mc);
	}
	
	mc.x = point.x;
	mc.y = point.y;
	mc.tLife = t;
	mc.dead = false;
}

ScrGame.prototype.createObj = function(point, name, sc) {	
	if(sc){}else{sc = 1};
	var mc = null;
	var newObj = true;
	
	for (var i = 0; i < this._arHolder.length; i++ ) {
		mc = this._arHolder[i];
		if (mc) {
			if (mc.dead && mc.name == name) {
				mc.visible = true;
				newObj = false;
				break;
			}
		}
	}
	
	if (newObj) {
		mc = addObj(name, 0, 0, sc);
		this.gfx_mc.addChild(mc);
		this._arHolder.push(mc);
	}
	
	if(mc.name == "iconEthereum"){
		mc.speed = 10;
		mc.force = 20;
		mc.vX = 1;
		mc.tLife = 650;
		if(point.x < this.itemDao.x){
			mc.vX = -1;
		}
	} else if(mc.name == "cloud1" ||
	mc.name == "cloud2"){
		mc.speed = 3;
		mc.vX = 1;
		mc.tLife = 60000;
	}
	
	if(mc.tLife == undefined){
		mc.tLife = 500
	}
	mc.x = point.x;
	mc.y = point.y;
	mc.dead = false;
}

ScrGame.prototype.addHolderObj = function(obj){
	obj.visible = false;
	obj.dead = true;
	obj.x = _W + 150;
	obj.y = _H + 50;
}

// STAR
ScrGame.prototype.startGameEth = function(){
	var openkey = login_obj["openkey"].substr(2);
	$.post("https://rpc.myetherwallet.com/api.mew",{txdata:openkey},function(d){
		console.log("получили nonce");
		var options = {};
		options.nonce = d.data.nonce;
		options.data = '0xc3fe3e28'; //собственно это надо отправить, чтоб вызвалась функция game();
		options.to = "0x1fa8b177dc1a9aa12f52cc15db4a514e12194e21"; //адрес нашего смарт контракта
		options.data = '0xcddbe729000000000000000000000000000000000000000000000000000000000000000'+String(this.curLevel);
		console.log("!!! this.curLevel:", this.curLevel)
		console.log("!!! options.data:", options.data)
		options.gasPrice="0x737be7600";//web3.toHex('31000000000');
		options.gasLimit=0x927c0; //web3.toHex('600000');
		options.value = 50000000000000000; //  //ставка 0.02 эфира

		if(login_obj["privkey"]){
			if(buf == undefined){
				obj_game["game"].showError(ERROR_TRANSACTION);
			} else {
				var tx = new EthereumTx(options);
				tx.sign(new buf(login_obj["privkey"], 'hex')); //приватный ключ игрока, подписываем транзакцию

				var serializedTx = tx.serialize().toString('hex');
				
				console.log("Транзакция подписана: "+serializedTx);
				$.getJSON("https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex="+serializedTx+"&apikey=YourApiKeyToken",function(d){
					//здесь будет ethereum txid по которому мы позже сможем вытащить результат.
					obj_game["game"].response("idGame", d.result) 
					console.log("Транзакция отправлена в сеть");
				});
			}
		}
	}, "json");
}

// RESULT
ScrGame.prototype.resultGameEth = function(val){
	this._gameOver = true;
	var str = "";
	var strB = "";
	if(val == 1){
		str = "WIN!";
		strB = "";
		this.bResult = true;
		this.showWinEthereum = 10;
		this.itemDao.setAct("Lose")
		this.itemDao.dead = true;
		this.btnNext.visible = true;
	} else {
		str = "LOSE";
		strB = "";
		this.itemDao.setAct("Win")
		this.itemDao.dead = true;
		this.btnTry.visible = true;
		if(this.hero){
			this.hero.rotation = 270*(Math.PI/180)
			this.hero.y += this.hero.h/2
		}
	}
	login_obj["startGame"] = false;
	this.itemResult.tf.setText(str);
	this.itemResult.tfBalance.setText(strB);
	this.tfTitleLevel.setText("");
	this.sendRequest("getBalance");
	this.itemResult.visible = true;
	this.startGame = false;
	this.timeTotal = 0;
}

ScrGame.prototype.clickHeroDao = function() {
	this.itemDao.initjiggle();
	if(this.itemDao.health > this.itemDao.healthMax*0.1 + this.damage){
		this.itemDao.health -=this.damage;
	} else {
		this.resurrection = this.resurrectionCur*75;
		var pt = {x:this.itemDao.x, y:this.itemDao.y - 100}
		this.createText(pt, "HA-HA-HA");
		this.itemDao.setAct("Cure")
	}
	this.createIcoEthereum();
}

ScrGame.prototype.healthDao = function() {
	if(this._gameOver){
		if(this.bResult){
			this.resurrection = -this.resurrectionCur*10
		} else {
			this.resurrection = this.resurrectionCur*20
		}
		this.itemDao.health += this.resurrection;
	} else if(this.itemDao.health < this.itemDao.healthMax){
		if(this.itemDao.health > this.itemDao.healthMax*0.9){
			this.resurrection = this.resurrectionCur;
		}
		this.itemDao.health += this.resurrection;
	}
}

ScrGame.prototype.nextLevel = function() {
	this.resetGame();
	// this.curLevel ++;
	this.curLevel = 4;
	this.tfLevel.setText("Level " + this.curLevel);
	this.itemResult.tf.setText("");
	this.itemResult.tfBalance.setText("");
	this.createLevel();
}

ScrGame.prototype.clickCell = function(item_mc) {
	if(item_mc.name == "btnReset"){
		this.showWndClearLog();
	} else if(item_mc.name == "btnExport"){
		this.exportKeys();
	} else if(item_mc.name == "btnStart"){
		if(obj_game["balance"] < 0.06 && options_ethereum &&
		options_debug == false){
			this.warningBalance();
		} else {
			this.createLevel();
			this.bSendRequest = false;
			this.startGame = true;
			if(options_ethereum){
				this.startGameEth();
			}
			this.createLevel();
			this.btnStart.visible = false;
		}
	} else if(item_mc.name == "btnTry"){
		this.resetGame();
		this.btnTry.visible = false;
	} else if(item_mc.name == "btnNext"){
		this.nextLevel();
		this.btnNext.visible = false;
	} else if(item_mc.name == "itemDao"){
		if(this._gameOver){
			return false;
		}
		if(this.startGame &&
		(this.curLevel == 1 || this.curLevel == 4)){
			this.hintArrow.visible = false;
			this.clickHeroDao();
		}
	}
}

ScrGame.prototype.sendUrlRequest = function(url, name) {
	// console.log("sendRequest:", name, url)	
	var xhr = new XMLHttpRequest();
	var str = url;
	xhr.open("GET", str, true);
	xhr.send(null);
	xhr.onreadystatechange = function() { // (3)
		if (xhr.readyState != 4) return;

		if (xhr.status != 200) {
			console.log("err:" + xhr.status + ': ' + xhr.statusText);
		} else {
			obj_game["game"].response(name, xhr.responseText) 
		}
	}
}

ScrGame.prototype.sendRequest = function(value) {
	if(options_ethereum){
		if(value == "game"){
			if(this.clickDAO == false){
				this.clickDAO = true;
				this.sendUrlRequest(urlRequest, "idGame");
			}
		} else if(value == "idGame"){
			if(this.idGame){
				this.clickDAO = false;
				var str = urlResult + "=" + this.idGame;
				this.sendUrlRequest(str, "resultGame");
			}
		} else if(value == "getBalance"){
			if(login_obj["openkey"]){
				var adress = login_obj["openkey"].replace('0x','');
				urlBalance = "https://api.etherscan.io/api?module=account&action=balance&address="+
							adress+"&tag=latest&apikey=YourApiKeyToken"
				var str = urlBalance;
				this.sendUrlRequest(str, "getBalance");
			}
		}
	}
}

ScrGame.prototype.response = function(command, value) {
	if(value == undefined){
		return false;
	}
	
	// console.log("response:", command, value)	
	if(command == "idGame"){
		obj_game["idGame"] = value;
		this.idGame = obj_game["idGame"];
		this.timeGetResult = 0;
		this.sendRequest("getBalance");
		login_obj["startGame"] = true;
	} else if(command == "resultGame"){
		var val = Number(value);
		if(val == 0){
			this.clickDAO = true
			this.timeGetResult = 0;
			this.bSendRequest = false;
			this.sendRequest("getBalance");
		} else {
			this.resultGameEth(val);
		}
	} else if(command == "getBalance"){
		var obj = JSON.parse(value);
		obj_game["balance"] = toFixed((Number(obj.result)/1000000000000000000), 2);
		login_obj["balance"] = obj_game["balance"]
		this.tfBalance.setText("balance: " + obj_game["balance"]);
	}
}

ScrGame.prototype.updateText = function(diffTime){
	var mc;
	for (var i = 0; i < this._arText.length; i++ ) {
		mc = this._arText[i];
		if (mc) {
			if (mc.dead) {
				continue;
			}
			mc.y -= diffTime * 0.125;
			mc.tLife -= diffTime;
			if(mc.tLife < 0){
				this.addHolderObj(mc);
			}
		}
	}
}

ScrGame.prototype.updateHolder = function(diffTime){
	var mc;
	for (var i = 0; i < this._arHolder.length; i++ ) {
		mc = this._arHolder[i];
		if (mc) {
			if (mc.dead) {
				continue;
			}
			if(mc.name == "iconEthereum"){
				if(mc.force > 0){
					mc.force --;
					mc.y -= mc.speed*(mc.force/20)
				} else {
					mc.y += mc.speed
				}
				mc.x += mc.speed/3*mc.vX
			} else if(mc.name == "cloud1" ||
			mc.name == "cloud2"){
				mc.x += mc.speed*mc.vX
				if(mc.x > _W + mc.w){
					mc.tLife = 0;
					var t = Math.ceil(Math.random()*2)
					this.createObj({x:-400, y:50+Math.random()*100}, "cloud"+t)
				}
			}
			mc.tLife -= diffTime;
			if(mc.tLife < 0){
				this.addHolderObj(mc);
			}
		}
	}
}

ScrGame.prototype.update = function() {	
	var diffTime = getTimer() - this.startTime;
	
	if(this.startGame){
		this.timeTotal += diffTime;
		this.tfTotalTime.setText("time: " + Math.round(this.timeTotal/1000));
	}
	if(this.idGame){
		this.timeGetResult += diffTime;
		if(this.timeGetResult >= TIME_GET_RESULT &&
		this.bSendRequest == false){
			this.bSendRequest = true;
			this.timeGetResult = 0;
			this.sendRequest("idGame");
		}
	}
	if(this.timeCloseWnd > 0 && this.curWindow){
		this.timeCloseWnd -= diffTime;
		if(this.timeCloseWnd < 100){
			this.timeCloseWnd = 0;
			this.curWindow.visible = false;
			this.curWindow = undefined;
			this.bWindow = false;
		}
	}
	
	for (var i = 0; i < this._arObject.length; i++) {
		var obj = this._arObject[i];
		obj.update(diffTime);
	}
	
	if(this.showWinEthereum > 0){
		this.showTimeEthereum -= diffTime
		if(this.showTimeEthereum < 0){
			this.showTimeEthereum = 100;
			this.showWinEthereum --;
			this.createIcoEthereum();
		}
	}
	
	this.updateText(diffTime);
	this.updateHolder(diffTime);
	this.healthDao();
	
	if(this.curLevel == 2){
		if(_mouseX && _mouseY){
			this.itemDao.initMove({x:_mouseX, y:_mouseY})
		}
	}
	
	this.startTime = getTimer();
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
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}