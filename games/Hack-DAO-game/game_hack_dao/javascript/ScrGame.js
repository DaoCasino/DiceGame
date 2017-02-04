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
	
ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
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
	this.curLevel = login_obj["level"] || 1;
	this.wndInfo;
	this.curWindow;
	
	obj_game["game"] = this;
	obj_game["balance"] = 0;
	
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	var bgGame = addObj("bgLevel"+this.curLevel, _W/2, _H/2);
	this.game_mc.addChild(bgGame);
	
	this.itemDao = new ItemDao();
	this.itemDao.x = 800;
	this.itemDao.y = 500;
	this.game_mc.addChild(this.itemDao);
	this._arButtons.push(this.itemDao);
	this._arObject.push(this.itemDao);
	
	this.hero = addObj("itemHero", 400, 500, 1, -1);
	this.game_mc.addChild(this.hero);
	
	this.createObj({x:700, y:150}, "cloud1")
	this.createObj({x:150, y:200}, "cloud2")
	this.createObj({x:-400, y:100}, "cloud1")
	
	this.btnReset = addButton2("btnDefault",90, 120);
	this.btnReset.name = "btnReset";
	this.addChild(this.btnReset);
	this._arButtons.push(this.btnReset);
	var tfReset = addText("CLEAR LOG", 26, "#FFFFFF", "#000000", "center", 350)
	tfReset.x = this.btnReset.x;
	tfReset.y = this.btnReset.y - 17;
	this.addChild(tfReset);
	
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

ScrGame.prototype.createAccount = function() {	
	if(login_obj["privkey"]){
		this.tfIdUser.setText("you: " + login_obj["openkey"]);
	}else{
		var tfCreateKey = addText("Now you generate address", 40, "#FF8611", "#000000", "center", 800)
		tfCreateKey.x = _W/2;
		tfCreateKey.y = 150;
		this.face_mc.addChild(tfCreateKey);
		createjs.Tween.get(tfCreateKey).wait(2000).to({alpha:0},500)
		console.log("keyethereum:", keyethereum);
		if(keyethereum){
			var dk = keyethereum.create();
			var privateKey = dk.privateKey;
			var address = ethUtil.privateToAddress(privateKey);
			address = ethUtil.toChecksumAddress(address.toString('hex'));
			privateKey = privateKey.toString('hex');
			login_obj["privkey"] = privateKey;
			login_obj["openkey"] = address;
			this.tfIdUser.setText("you: " + address);
			console.log( {openkey: address, privkey: privateKey});
			saveData();
		} else {
			this.showError(ERROR_KEYTHEREUM);
		}
	}
	console.log("openkey:", login_obj["openkey"])
}

ScrGame.prototype.createGUI = function() {
	this.itemResult = new PIXI.Container();
	this.itemResult.x = _W/2;
	this.itemResult.y = 130;
	this.itemResult.visible = false;
	this.game_mc.addChild(this.itemResult);
	
	var tfResult = addText("time:", 50, "#000000", undefined, "center", 400)
	this.itemResult.addChild(tfResult);
	this.itemResult.tf = tfResult;
	var tfBalance = addText("+0", 30, "#000000", undefined, "center", 400)
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
	this.tfIdUser = addText("you: " + strUser, 20, "#ffffff", "#000000", "left", 1000)
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
	
	var w = 100
	var h = 10
	this.barDao = new PIXI.Container();
	this.barDao.x = this.itemDao.x - w/2
	this.barDao.y = this.itemDao.y - 150
    this.game_mc.addChild(this.barDao);
	var bg = new PIXI.Graphics();
    bg.beginFill(0x0000000).drawRect(-2, -2, w+4, h+4).endFill();
    this.barDao.addChild(bg);
	var life = new PIXI.Graphics();
    life.beginFill(0xff00000).drawRect(0, 0, w, h).endFill();
    this.barDao.addChild(life);
	this.barDao.life = life;
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

ScrGame.prototype.showError = function(value) {
	var str = "ERR"
	switch(value){
		case ERROR_KEYTHEREUM:
			str = "OOOPS! \n The key is not created. Try a different browser."
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

ScrGame.prototype.startGameEth = function(){	
	$.post("https://rpc.myetherwallet.com/api.mew",{txdata:'96eE4CC8FEB236D6fbdbf8821f4D2873564B9D8f'},function(d){
		console.log("получили nonce");
		var options = {};
		options.nonce = d.data.nonce;
		options.data = '0xc3fe3e28'; //собственно это надо отправить, чтоб вызвалась функция game();
		options.to = "0x130951893c010916b34773293e05404cee93d5c5"; //адрес нашего смарт контракта
		options.gasPrice="0x737be7600";//web3.toHex('31000000000');
		options.gasLimit=0x927c0; //web3.toHex('600000');
		options.value = 50000000000000000; //  //ставка 0.02 эфира

		if(login_obj["privkey"]){
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
	}, "json");
}

ScrGame.prototype.resultGameEth = function(val){
	this._gameOver = true;
	var str = "";
	var strB = "";
	if(val == 1){
		str = "WIN!";
		strB = "+0.08";
		this.bResult = true;
		this.showWinEthereum = 10;
	} else {
		str = "LOSE";
		strB = "-0.05";
		this.hero.rotation = 270*(Math.PI/180)
		this.hero.y += this.hero.h/2
	}
	var tf = this.itemResult.tf;
	tf.setText(str);
	var tfB = this.itemResult.tfBalance;
	tfB.setText(strB);
	this.sendRequest("getBalance");
	this.itemDao.dead = true;
	this.itemResult.visible = true;
	this.startGame = false;
	this.timeTotal = 0;
}

ScrGame.prototype.clickHeroDao = function() {
	this.itemDao.initjiggle();
	if(this.itemDao.countLife > this.itemDao.countLifeMax*0.1 + this.damage){
		this.itemDao.countLife -=this.damage;
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
		this.itemDao.countLife += this.resurrection;
	} else if(this.itemDao.countLife < this.itemDao.countLifeMax){
		if(this.itemDao.countLife > this.itemDao.countLifeMax*0.9){
			this.resurrection = this.resurrectionCur;
		}
		this.itemDao.countLife += this.resurrection;
	}
	var curSc = this.itemDao.countLife/this.itemDao.countLifeMax;
	curSc = Math.max(curSc, 0.01);
	this.barDao.life.scale.x = Math.min(curSc, 1);
}

ScrGame.prototype.clickCell = function(item_mc) {
	if(item_mc.name == "btnReset"){
		resetData();
		this.createAccount();
	} else if(item_mc.name == "itemDao"){
		if(this._gameOver){
			return false;
		}
		if(this.startGame){
			this.clickHeroDao();
		} else {
			if(obj_game["balance"] < 0.06 && options_ethereum){
				this.warningBalance();
			} else {
				this.clickHeroDao();
				this.itemResult.visible = false;
				this.hintArrow.visible = false;
				this.bSendRequest = false;
				this.startGame = true;
				if(options_ethereum){
					this.startGameEth();
				}
			}
		}
	}
}

ScrGame.prototype.sendUrlRequest = function(url, name) {
	console.log("sendRequest:", name, url)	
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
	
	console.log("response:", command, value)	
	if(command == "idGame"){
		obj_game["idGame"] = value;
		this.idGame = obj_game["idGame"];
		this.timeGetResult = 0;
		this.sendRequest("getBalance");
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
	
	this.startTime = getTimer();
}

ScrGame.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x;
	var mouseY = evt.data.global.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY)){
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

ScrGame.prototype.result = function(value){
	this._gameOver = true;
	this.removeAllListener();
	
}

ScrGame.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}