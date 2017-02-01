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
	this.dispaly_mc = new PIXI.Container();
	
	this.startTime = getTimer();
	this._arButtons = [];
	this.timeGetResult = 0;
	this.timeTotal = 0;
	this.idGame = undefined;
	this.clickDAO = false;
	this.startGame = false;
	this.bSendRequest = false;
	this.bWindow = false;
	
	obj_game["game"] = this;
	
	this.addChild(this.game_mc);
	this.addChild(this.dispaly_mc);
	this.addChild(this.face_mc);
	
	var bgGame = addObj("bgGame", _W/2, _H/2);
	this.game_mc.addChild(bgGame);
	
	var itemDOA = addButton("itemDOA", 800, 500);
	this.game_mc.addChild(itemDOA);
	this._arButtons.push(itemDOA);
	
	var hero = addObj("itemHero", 400, 500, 1, -1);
	this.game_mc.addChild(hero);
	
	this.createGUI();
	// this.createDisplay();
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.createGUI = function() {
	this.itemResult = new PIXI.Container();
	this.itemResult.x = 800 + 150;
	this.itemResult.y = 500 - 130;
	this.itemResult.visible = false;
	this.game_mc.addChild(this.itemResult);
	var oblachko = addObj("Oblachko1", 0, 0, 0.7, -1);
	this.itemResult.addChild(oblachko);
	
	var style = {
		font : 24 + "px " + "Tahoma",
		fill : "#000000",
		align : "center",
		wordWrap : true,
		wordWrapWidth : 300
	};
	
	var tfResult = new PIXI.Text("", style);
	tfResult.x = - tfResult.width/2;
	tfResult.y = - 20;
	this.itemResult.addChild(tfResult);
	this.itemResult.tf = tfResult;
	
	this.tfTime = new PIXI.Text("", style);
	this.tfTime.x = _W/2 + 300 - this.tfTime.width/2;
	this.tfTime.y = _H/2 - 20;
	this.face_mc.addChild(this.tfTime);
	this.tfTotalTime = addText("time:", 20, "#000000", undefined, "left", 400)
	this.tfTotalTime.x = 20;
	this.tfTotalTime.y = 55;
	this.face_mc.addChild(this.tfTotalTime);
	
	this.tfBalance = addText("balance:", 20, "#000000", undefined, "left", 400)
	this.tfBalance.x = 20;
	this.tfBalance.y = 30;
	this.face_mc.addChild(this.tfBalance);
	this.sendRequest("getBalance");
}

ScrGame.prototype.clickCell = function(item_mc) {
	if(item_mc.name == "itemDOA"){
		this.itemResult.visible = false;
		this.bSendRequest = false;
		this.startGame = true;
		this.sendRequest("game");
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
			console.log(xhr.status + ': ' + xhr.statusText);
		} else {
			console.log(xhr.responseText);
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
			// if(this.idGame){
				var adress = "0x96eE4CC8FEB236D6fbdbf8821f4D2873564B9D8f"
				urlBalance = "https://api.etherscan.io/api?module=account&action=balance&address="+
							adress+"&tag=latest&apikey=YourApiKeyToken"
				var str = urlBalance;
				this.sendUrlRequest(str, "getBalance");
			// }
		}
	}
}

ScrGame.prototype.response = function(command, value) {
	if(value == undefined){
		return false;
	}
	if(command == "idGame"){
		obj_game["idGame"] = value;
		console.log("idGame:", obj_game["idGame"]);
		this.idGame = obj_game["idGame"];
		this.timeGetResult = 0;
		this.sendRequest("getBalance");
	} else if(command == "resultGame"){
		var tf = this.itemResult.tf;
		var val = Number(value);
		if(val == 1){
			tf.text = "win";
			this.sendRequest("getBalance");
		} else if(val == 0){
			tf.text = "";
			this.clickDAO = true
			this.timeGetResult = 0;
			this.bSendRequest = false;
		} else {
			tf.text = "lose";
			this.sendRequest("getBalance");
		}
		tf.x = - this.itemResult.tf.width/2;
		if(val != 0){
			this.itemResult.visible = true;
			this.startGame = false;
			this.timeTotal = 0;
		}
	} else if(command == "getBalance"){
		var obj = JSON.parse(value);
		obj_game["balance"] = toFixed((Number(obj.result)/1000000000000000000), 2);
		this.tfBalance.setText("balance: " + obj_game["balance"]);
	}
}

ScrGame.prototype.update = function() {
	if(this._gameOver){
		return;
	}
	
	var diffTime = getTimer() - this.startTime;
	
	if(this.startGame){
		this.timeTotal += diffTime;
		// this.tfTotalTime.setTet("Time:" + Math.round(this.timeTotal/1000));
		// this.tfTotalTime.x = _W/2 + 300 - this.tfTotalTime.width/2;
	}
	if(this.clickDAO && this.idGame){
		this.timeGetResult += diffTime;
		var timeLast = Math.ceil((TIME_GET_RESULT - this.timeGetResult)/1000);
		this.tfTime.text = timeLast
		this.tfTime.x = _W/2 + 300 - this.tfTime.width/2;
		if(this.timeGetResult >= TIME_GET_RESULT &&
		this.bSendRequest == false){
			this.bSendRequest = true;
			this.timeGetResult = 0;
			this.tfTime.text = "";
			this.sendRequest("idGame");
		}
	}
	
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
	var phase = evt.type;
	
	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	} else if (phase == 'mousedown' || phase == 'touchend') {
		for (var i = 0; i < this._arButtons.length; i++) {
			var item_mc = this._arButtons[i];
			if(item_mc._selected){
				item_mc._selected = false;
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