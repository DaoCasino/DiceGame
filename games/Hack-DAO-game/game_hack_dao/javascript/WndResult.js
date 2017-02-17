function WndResult(_prnt) {
	PIXI.Container.call( this );
	this.init(_prnt);
}

WndResult.prototype = Object.create(PIXI.Container.prototype);
WndResult.prototype.constructor = WndResult;

var obj = {};

WndResult.prototype.init = function(_prnt) {
	this._prnt = _prnt;
	this._callback = undefined;
	this._arButtons= [];
	obj["prnt"] = _prnt;
	obj["main"] = this;
	
	var rect = new PIXI.Graphics();
	rect.beginFill(0x000000).drawRect(-_W/2, -_H/2, _W, _H).endFill();
	rect.alpha = 0.5;
	this.addChild(rect);
	this.rect = rect;
	this.wnd = new PIXI.Container();
	this.addChild(this.wnd);
	
	this.bgWin = addObj("wndWin");
	this.wnd.addChild(this.bgWin);
	this.bgLose = addObj("wndLose");
	this.wnd.addChild(this.bgLose);
	
	this.btnOk = addButton2("btnOrange", 0, 220);
	this.wnd.addChild(this.btnOk);
	this._arButtons.push(this.btnOk);
	this.btnNext = addButton2("btnGreen", 150, 220);
	this.wnd.addChild(this.btnNext);
	this._arButtons.push(this.btnNext);
	
	this.btnShare = addButton2("btnFacebookShare", 0, 0, 0.3);
	this.btnShare.name = "btnShare";
	this.btnShare.interactive = true;
	this.btnShare.buttonMode=true;
	this.btnShare.x = 500;
	this.btnShare.y = -280;
	this.addChild(this.btnShare);
	this._arButtons.push(this.btnShare);
	this.btnShare.visible = false;
	this.btnTweetShare = addButton2("btnTweetShare", 500, -200, 0.9);
	this.btnTweetShare.name = "btnTweet";
	this.btnTweetShare.interactive = true;
	this.btnTweetShare.buttonMode=true;
	this.addChild(this.btnTweetShare);
	this._arButtons.push(this.btnTweetShare);
	this.btnTweetShare.visible = false;
	
	this.btnOk.interactive = true;
	this.btnOk.buttonMode=true;
	this.btnNext.interactive = true;
	this.btnNext.buttonMode=true;
	
	this.tfDesc = addText("", 30, "#FFFFFF", "#000000", "center", 560, 4, fontTahoma)
	this.tfDesc.y = -70;
	this.wnd.addChild(this.tfDesc);
	var tfTitleTime = addText("Your time:", 30, "#FFFFFF", "#000000", "right", 300, 4, fontTahoma)
	tfTitleTime.x = 0;
	tfTitleTime.y = 45;
	this.wnd.addChild(tfTitleTime);
	this.tfTime = addText("0", 30, "#00CCFF", "#000000", "left", 300, 4, fontTahoma)
	this.tfTime.x = 0;
	this.tfTime.y = tfTitleTime.y;
	this.wnd.addChild(this.tfTime);
	this.tfTitleEth = addText("You won:", 30, "#FFFFFF", "#000000", "right", 300, 4, fontTahoma)
	this.tfTitleEth.x = 0;
	this.tfTitleEth.y = 90;
	this.wnd.addChild(this.tfTitleEth);
	this.tfEth = addText("0", 30, "#FF70D6", "#000000", "left", 300, 4, fontTahoma)
	this.tfEth.x = 40;
	this.tfEth.y = this.tfTitleEth.y;
	this.wnd.addChild(this.tfEth);
	this.icoEthereum = addObj("icoEthereum");
	this.icoEthereum.x = 20;
	this.icoEthereum.y = this.tfTitleEth.y+20;
	this.wnd.addChild(this.icoEthereum);
	this.tfBtn = addText("Menu", 36, "#FFFFFF", "#000000", "center", 350)
	this.tfBtn.y = - 24;
	this.btnOk.addChild(this.tfBtn);
	this.tfBtnNext = addText("Next", 36, "#FFFFFF", "#000000", "center", 350)
	this.tfBtnNext.y = - 24;
	this.btnNext.addChild(this.tfBtnNext);
	
	if(Number(login_obj["level"]) == 9){
		this.btnNext.visible = false;
	}
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

WndResult.prototype.show = function(val, str, callback, obj_game) {
	if(callback){
		this._callback = callback
	}else{
		this._callback = undefined;
	};
	
	this.wnd.y = -_H;
	this.rect.alpha = 0;
	createjs.Tween.get(this.rect).wait(2000).to({alpha: 0.5}, 700)
	createjs.Tween.get(this.wnd).wait(2000).to({y: 0}, 700)
	var seconds = obj_game["time"];
	var valTime = get_normal_time(seconds);
	this.tfTime.setText(valTime);
	// var valBalance = toFixed(obj_game["balance"]-obj_game["oldBalance"], 4);
	var valBalance = toFixed(betslevel[obj["prnt"].curLevel].prize, 4)
	this.tfEth.setText("+"+valBalance);
	
	if(val == 1 && obj_game["gameOver"] == false){
		this.btnShare.visible = true;
		this.btnTweetShare.visible = true;
		this.bgLose.visible = false;
		this.btnOk.x = -150;
	} else if(val == 1 && obj_game["gameOver"] == true){
		this.bgWin.visible = false;
		this.btnNext.visible = false;
	} else {
		this.bgWin.visible = false;
		this.tfTitleEth.visible = false;
		this.tfEth.visible = false;
		this.icoEthereum.visible = false;
		this.btnNext.visible = false;
	}
	
	this.tfDesc.setText(str);
}

WndResult.prototype.shareTwitter = function() {	
	// @daocasino @ethereumproject @edcon #blockchain #ethereum
	if(twttr){
		var url="https://twitter.com/intent/tweet";
		var str='Hack the DAO Level ' + obj["prnt"].curLevel;
		var hashtags="blockchain,ethereum";
		var via="daocasino";
		window.open(url+"?text="+str+";hashtags="+hashtags+";via="+via,"","width=500,height=300");
	}
}

WndResult.prototype.shareFB = function() {	
	if (typeof(FB) != 'undefined' && FB != null ) {
		var urlGame = 'http://platform.dao.casino/';
		var urlImg = "http://platform.dao.casino/games/Hack-DAO-game/game_hack_dao/images/share/bgLevel_"+ obj["prnt"].curLevel+".jpg";
		/*FB.ui({
			method: 'share',
			href: urlGame,
		}, function(response){});*/
		
		
		FB.ui({
		  method: 'feed',
		  picture: urlImg,
		  link: urlGame,
		  caption: 'PLAY',
		  description: 'Hack the DAO Level ' + obj["prnt"].curLevel,
		}, function(response){});
	} else {
		console.log("FB is not defined");
	}
}

WndResult.prototype.clickObj = function(item_mc) {
	// sound_play("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	
	if(name == "btnOrange"){
		this._prnt.closeWindow(this);
		if(this._callback){
			this._callback();
		}
	} else if(name == "btnGreen"){
		this._prnt.closeWindow(this);
		// if(options_testnet){
			// this._prnt.clickMenu();
		// } else {
			this._prnt.nextLevel();
		// }
	} else if(name == "btnShare"){
		this.shareFB();
	} else if(name == "btnTweet"){
		this.shareTwitter();
	}
}

WndResult.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x - this.x
	var mouseY = evt.data.global.y - this.y;
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY)){
			if(item_mc.visible && item_mc._selected == false){
				item_mc._selected = true;
				if(item_mc.over){
					item_mc.over.visible = true;
				} else {
					if(item_mc.name == "btnShare"){
						item_mc.scale.x = 0.33;
						item_mc.scale.y = item_mc.scale.x;
					} else if(item_mc.name == "btnTweet"){
						item_mc.scale.x = 1;
						item_mc.scale.y = item_mc.scale.x;
					}
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				} else {
					if(item_mc.name == "btnShare"){
						item_mc.scale.x = 0.3;
						item_mc.scale.y = item_mc.scale.x;
					} else if(item_mc.name == "btnTweet"){
						item_mc.scale.x = 0.9;
						item_mc.scale.y = item_mc.scale.x;
					}
				}
			}
		}
	}
}

WndResult.prototype.touchHandler = function(evt){	
	if(!this.visible){
		return false;
	}
	// mousedown , mousemove
	// touchstart, touchmove, touchend
	var phase = evt.type; 
	var item_mc; //MovieClip
	var i = 0;
	
	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	} else if (phase == 'mousedown' || phase == 'touchend') {
		for (i = 0; i < this._arButtons.length; i ++) {
			item_mc = this._arButtons[i];
			if(item_mc.visible && item_mc._selected){
				this.clickObj(item_mc);
				return;
			}
		}
	}
}

WndResult.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}