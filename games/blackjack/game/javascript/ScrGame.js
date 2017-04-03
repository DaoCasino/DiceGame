
function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

var TIME_GET_STATE = 10000;
var TIME_WAIT = 500;
var S_IN_PROGRESS = 0;	
var S_PLAYER_WON = 1;	
var S_HOUSE_WON = 2;	
var S_TIE = 3;	
var S_IN_PROGRESS_SPLIT = 4;
var S_BLACKJACK = 5;
var R_WIN = "WIN!";
var R_LOSE = "LOSE...";
var R_BUST = "BUST!";
var R_PUSH = "PUSH";
var R_BLACKJACK = "BLACKJACK";
var C_DEAL = "553df021";
var C_GAME_STATE = "b7d0628b";
var C_GAME_SPLIT_STATE = "4bf8d2d6";
var C_HOUSE_CARD = "7b61b201";
var C_HOUSE_CARDS = "7f601a50";
var C_GET_BET = "62d67aec";
var C_PLAYER_CARD = "d02d1382";
var C_SPLIT_CARD = "c90a80a7";
var C_PLAYER_CARDS = "d572fd99";
var C_SPLIT_CARDS = "b6d782c2";
var C_HIT = "2ae3594a";
var C_HIT_S = "9aa60e1d";
var C_SPLIT = "f7654176";
var C_STAND = "c2897b10";
var C_GET_INSURANCE = "267a8da0";
var C_INSURANCE_AVAILABLE = "0541ec91";
var C_INSURANCE = "7ce8154a";
var C_DOUBLE_AVAILABLE = "0062a7fa";
var C_DOUBLE = "8fdb7189";
var C_PLAYER_SCORE = "dc21d020";
var C_SPLIT_SCORE = "6dd6cd53";
var C_IS_GAME = "0da1491d";

var urlResult = "http://api.dao.casino/daohack/api.php?a=getreuslt&id";
var urlEtherscan = "https://api.etherscan.io/";
var urlBalance = "";
var betEth = 0; //ставка эфира
var betGame = 0;
var betSplitGame = 0;
var betGameOld = 0;
var betGameCur = 0;
var valInsurance = 0;
var minBet = 50000000000000000;
var obj_game = {};
var _callback;
var _mouseX;
var _mouseY;
var blockNumber;
var idOraclizeGame = undefined;
var resultTxid = undefined;
var gasAmount = 4000000;
var isGame = undefined;

var accounts;
var account;
var gameIsGoingOn;
var dealedCards = new Array();
var suit = {0: 'Hearts', 1: 'Diamonds', 2: 'Spades', 3: 'Cubs'};
var cardType = {0: 'King', 1: 'Ace', 2: '2', 3: '3', 4: '4', 5: '5', 
				6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
                11: 'Jacket', 12: 'Queen'};

var chipVale = [];
chipVale[1] = 0.05;
chipVale[2] = 0.1;
chipVale[3] = 0.5;
chipVale[4] = 1;
chipVale[5] = 2;
chipVale[6] = 5;
var lastPlayerCard = 0;
var lastPlayerSplitCard = 0;
var lastHouseCard = 0;
var loadPlayerCard = 0;
var loadPlayerSplitCard = 0;
var loadHouseCard = 0;
var stateNow = -1;
var stateOld = -1;
var stateSplit = -1;
var scaleCard = 0.9;
var scaleBack = 1;
var scaleChip = 0.45;
var _oStartingCardOffset;
var _oDealerCardOffset;
var _oReceiveWinOffset;
var _oFichesDealerOffset;
var _oRemoveCardsOffset;

ScrGame.prototype.init = function() {
	this.face_mc = new PIXI.Container();
	this.back_mc = new PIXI.Container();
	this.game_mc = new PIXI.Container();
	this.cards_mc = new PIXI.Container();
	this.gfx_mc = new PIXI.Container();
	
	this.startTime = getTimer();
	this.gameTime = getTimer();
	this._arButtons = [];
	this._arBtnChips = [];
	this._arChips = [];
	this._arSplitChips = [];
	this._arMyPoints = [];
	this._arMySplitPoints = [];
	this._arHousePoints = [];
	this._arMyCards = [];
	this._arMySplitCards = [];
	this._arHouseCards = [];
	this._arNewCards = [];
	this._arHolder = [];
	this.timeGetState = 0;
	this.timeGetCards = 0;
	this.timeTotal = 0;
	this.timeWait = 0;
	this.timeCloseWnd = 0;
	this.timeNewCard = 0;
	this.countPlayerCard = 0;
	this.countPlayerSplitCard = 0;
	this.countHouseCard = 0;
	this.countWait = 0;
	this.myPoints = 0;
	this.mySplitPoints = 0;
	this.housePoints = 0;
	this.oldBalance = -1;
	this.cardSuit = undefined;
	this.wndInfo;
	this.curWindow;
	this.startGame = false;
	this._gameOver = false;
	this.bWindow = false;
	this.bBetLoad = false;
	this.bWait = false;
	this.bWaitSplit = false;
	this.bStand = false;
	this.bClear = false;
	this.bSplit = false;
	this.bStandSplit = false;
	this.bEndTurnSplit = false;
	this.bClickStart = false;
	this.bInsurance = -1;
	
	obj_game = {};
	this.clearBet();
	this.clearGame();
	
	this.bg = addObj("bgGame"+rndBg, _W/2, _H/2);
	scaleBack = _W/this.bg.w;
	this.bg.scale.x = scaleBack;
	this.bg.scale.y = scaleBack;
	this.addChild(this.bg);
	
	if(options_debug){
		var tfDebug = addText("Debug", 20, "#FF0000", "#000000", "right", 400)
		tfDebug.x = _W-20;
		tfDebug.y = _H-30;
		this.face_mc.addChild(tfDebug);
	}
	
	// console.log("numToHex:", numToHex(1000000));
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
	
	if(options_debug){
		obj_game["balance"] = 3;
		obj_game["balanceBank"] = 5;
	}
	
	this.game_mc.addChild(this.cards_mc);
	this.addChild(this.back_mc);
	this.addChild(this.game_mc);
	this.addChild(this.gfx_mc);
	this.addChild(this.face_mc);
	
	this.createGUI();
	this.createAccount();
	this.getIsGame();
	infura.sendRequest("getBalance", openkey, _callback);
	infura.sendRequest("getBalanceBank", addressContract, _callback);
	infura.sendRequest("getBlockNumber", undefined, _callback);
	this.checkGameState();
	
	if(openkey){} else {
		this.showError(ERROR_KEY, showHome);
	}
	
	// for(var i=1; i<53; i++){
		// this.getCard(i);
	// }

	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.clearGame = function(){
	idOraclizeGame = undefined;
	resultTxid = undefined;
	lastPlayerCard = 0;
	lastPlayerSplitCard = 0;
	lastHouseCard = 0;
	loadPlayerCard = 0;
	loadPlayerSplitCard = 0;
	loadHouseCard = 0;
	stateNow = -1;
	stateSplit = -1;
	isGame = false;
	this.timeTotal = 0;
	this.timeCloseWnd = 0;
	this.timeNewCard = 0;
	this.countWait = 0;
	this.countPlayerSplitCard = 0;
	this.myPoints = 0;
	this.mySplitPoints = 0;
	this.bStand = false;
	this.bSplit = false;
	this.bStandSplit = false;
	this.bEndTurnSplit = false;
	this.bWaitSplit = false;
	this.bClickStart = false;
	this.bInsurance = -1;
	var i = 0;
	
	for (i = 0; i < dealedCards.length; i++) {
		var card = dealedCards[i];
		this.cards_mc.removeChild(card);
	}
	for (i = 0; i < this._arHolder.length; i++) {
		var mc = this._arHolder[i];
		this.addHolderObj(mc);
	}
	
	dealedCards = [];
	if(this.cardSuit){
		this.cardSuit.width = this.cardSuit.w;
		this.cardSuit.visible = false;
	}
}

ScrGame.prototype.clearBet = function(){
	betEth = 0;
	betGame = 0;
	betSplitGame = 0;
	betGameOld = 0;
	valInsurance = 0;
	this.clearChips();
	this.clearSplitChips();
	if(this.btnClear){
		this.btnClear.alpha = 0.5;
		this.btnStart.alpha = 0.5;
		this.arrow.visible = true;
		this.tfStatus.setText("Select bet");
		this.tfYourBet.setText("Your bet: 0");
		this.tfMyBet.setText("");
		this.tfSplitBet.setText("");
		this.tfStatus.x = _W/2;
	}
}

ScrGame.prototype.clearChips = function(){
	while (this._arChips.length > 0) {
		var chip = this._arChips[0];
		this.game_mc.removeChild(chip);
		this._arChips.shift();
	}
	this._arChips = [];
}

ScrGame.prototype.clearSplitChips = function(){	
	for (i = 0; i < this._arSplitChips.length; i++) {
		var chip = this._arSplitChips[i];
		this.game_mc.removeChild(chip);
	}
	this._arSplitChips = [];
}

ScrGame.prototype.createAccount = function() {
	if(privkey || options_debug){
		if(openkey){}else{openkey=1, privkey=1};
		this.tfIdUser.setText(openkey);
	}else{
		var tfCreateKey = addText("Now you generate address", 40, "#FF8611", "#000000", "center", 800)
		tfCreateKey.x = _W/2;
		tfCreateKey.y = 120;
		this.face_mc.addChild(tfCreateKey);
		createjs.Tween.get(tfCreateKey).wait(2000).to({alpha:0},500)
		
		if(keyethereum){
			var dk = keyethereum.create();
			var privateKey = dk.privateKey;
			var address = ethUtil.privateToAddress(privateKey);
			address = ethUtil.toChecksumAddress(address.toString('hex'));
			privateKey = privateKey.toString('hex');
			privkey = privateKey;
			openkey = address;
			this.tfIdUser.setText(address);
			if(options_testnet){
				this.showButtons(false);
				var str = "https://platform.dao.casino/api/?a=faucet&to="+openkey;
				this.sendUrlRequest(str, "getEthereum");
			}
			this.showTestEther();
			saveData();
		} else {
			this.showError(ERROR_KEYTHEREUM);
		}
	}
}

ScrGame.prototype.createGUI = function() {
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
	
	_oStartingCardOffset = new vector(1487,298);
	_oDealerCardOffset = new vector(_W/2-80,_H/2-200);
	_oReceiveWinOffset = new vector(418,820);
	_oFichesDealerOffset = new vector(_W/2-80,_H/2+70);
	_oRemoveCardsOffset = new vector(388,138);
	
	this.tfGetEth = addText("", 40, "#FFFFFF", "#000000", "center", 400)
	this.tfGetEth.x = _W/2;
	this.tfGetEth.y = 100;
	this.face_mc.addChild(this.tfGetEth);
	
	var offsetY = 50;
	this.seat = addObj("seat", _W/2+7, _H/2+220);
	this.seat.visible = false;
	this.back_mc.addChild(this.seat);
	var metal = addObj("metal", 566, 40, scaleBack);
	this.back_mc.addChild(metal);
	var descBet = addObj("descBet", 500, 170, scaleBack);
	this.back_mc.addChild(descBet);
	var cardsLeft = addObj("cardsLeft", 280, 340, scaleBack);
	this.back_mc.addChild(cardsLeft);
	var cardsRight = addObj("cardsRight", 1650, 205, scaleBack);
	this.back_mc.addChild(cardsRight);
	this.arrow = addObj("hintArrow", _W/2-570, _H/2+150);
	this.arrow.rotation = rad(0);
	this.arrow.visible = false;
	this.game_mc.addChild(this.arrow);
	
	var strUser = 'id'
	var fontSize = 24;
	this.tfIdUser = addText(strUser, fontSize, "#ffffff", "#000000", "left", 1000, 4)
	this.tfIdUser.x = icoKey.x + 30;
	this.tfIdUser.y = icoKey.y - 12;
	this.face_mc.addChild(this.tfIdUser);
	this.tfBalance = addText(String(obj_game["balance"]), fontSize, "#ffffff", "#000000", "left", 400, 4)
	this.tfBalance.x = icoEthereum.x + 30;
	this.tfBalance.y = icoEthereum.y - 12;
	this.face_mc.addChild(this.tfBalance);
	this.tfTotalTime = addText("0", fontSize, "#ffffff", "#000000", "left", 400, 4)
	this.tfTotalTime.x = icoTime.x + 30;
	this.tfTotalTime.y = icoTime.y - 12;
	this.face_mc.addChild(this.tfTotalTime);
	this.tfVers= addText(version, fontSize, "#ffffff", "#000000", "left", 400, 4)
	this.tfVers.x = icoTime.x - 10;
	this.tfVers.y = this.tfTotalTime.y + 40;
	this.face_mc.addChild(this.tfVers);
	this.tfYourBet = addText("Your bet: 0", 40, "#ffde00", undefined, "left", 300, 4, fontDigital)
	this.tfYourBet.x = -70;
	this.tfYourBet.y = 0;
	descBet.addChild(this.tfYourBet);
	this.tfStatus = addText("Select bet", 40, "#ffde00", "#000000", "center", 400, 4, fontDigital)
	this.tfStatus.x = _W/2;
	this.tfStatus.y = _H/2+290;
	this.face_mc.addChild(this.tfStatus);
	this.tfMyBet = addText("", 30, "#ffde00", "#000000", "right", 400, 4, fontDigital)
	this.tfMyBet.x = _W/2-50;
	this.tfMyBet.y = _H/2+200;
	this.face_mc.addChild(this.tfMyBet);
	this.tfSplitBet = addText("", 30, "#ffde00", "#000000", "right", 400, 4, fontDigital)
	this.tfSplitBet.x = this.tfMyBet.x+200;
	this.tfSplitBet.y = this.tfMyBet.y;
	this.face_mc.addChild(this.tfSplitBet);
	var tfMinBet = addText("MIN BET: 0.05", 40, "#ffde00", undefined, "left", 300, 4, fontDigital)
	tfMinBet.x = -100;
	tfMinBet.y = -100;
	descBet.addChild(tfMinBet);
	var tfMaxBet = addText("MAX BET: 5", 40, "#ffde00", undefined, "left", 300, 4, fontDigital)
	tfMaxBet.x = -90;
	tfMaxBet.y = -60;
	descBet.addChild(tfMaxBet);
	this.tfMyPoints = addText("", fontSize, "#ffffff", "#000000", "right", 200, 4)
	this.tfMyPoints.x = _W/2-150;
	this.tfMyPoints.y = _H/2-15;
	this.face_mc.addChild(this.tfMyPoints);
	this.tfMySplitPoints = addText("", fontSize, "#ffffff", "#000000", "right", 200, 4)
	this.tfMySplitPoints.x = this.tfMyPoints.x+280;
	this.tfMySplitPoints.y = this.tfMyPoints.y;
	this.face_mc.addChild(this.tfMySplitPoints);
	this.tfHousePoints = addText("", fontSize, "#ffffff", "#000000", "right", 200, 4)
	this.tfHousePoints.x = this.tfMyPoints.x;
	this.tfHousePoints.y = _H/2-285;
	this.face_mc.addChild(this.tfHousePoints);
	
	this.mixingCard = new ItemMixing(this);
	this.mixingCard.x = _W/2 + 400;
	this.mixingCard.y = _H/2 - 150;
	this.mixingCard.visible = false;
	this.addChild(this.mixingCard);
	
	var btnDeal = this.createButton2("btnDeal", "Deal", _W/2+90, 950, scGui);
	this.btnStart = btnDeal;
	var btnClear = this.createButton2("btnClearBets", "Clear Bets", _W/2-90, 950, scGui);
	this.btnClear = btnClear;
	var btnHit = this.createButton2("btnHit", "Hit", _W/2+90, 950, scGui);
	this.btnHit = btnHit;
	var btnStand = this.createButton2("btnStand", "Stand", _W/2-90, 950, scGui);
	this.btnStand = btnStand;
	var btnSplit = this.createButton2("btnSplit", "Split", 1650, 800, scGui);
	this.btnSplit = btnSplit;
	var btnDouble = this.createButton2("btnDouble", "Double", 1500, 890, scGui);
	this.btnDouble = btnDouble;
	
	btnDeal.alpha = 0.5;
	btnClear.alpha = 0.5;
	btnHit.alpha = 0.5;
	btnHit.alpha = 0.5;
	btnStand.alpha = 0.5;
	btnSplit.alpha = 0.5;
	btnDouble.alpha = 0.5;
	btnHit.visible = false;
	btnStand.visible = false;
	
	this.createButton("btnSmart", 120, _H-60, "Contract", 0.7, 40);
	this.createButton("btnDao", _W-120, _H-60, "DAO.CASINO", 0.7, 34);
	
	this.btnShare = addButton2("btnFacebookShare", _W - 120, 50, 0.75);
	this.btnShare.name = "btnShare";
	this.btnShare.interactive = true;
	this.btnShare.buttonMode=true;
	this.btnShare.overSc = true;
	this.addChild(this.btnShare);
	this._arButtons.push(this.btnShare);
	var tfFb = addText("Share", 40, "#FFFFFF", undefined, "center", 200)
	tfFb.x = 20;
	tfFb.y = -tfFb.height/2;
	this.btnShare.addChild(tfFb);
	this.btnTweetShare = addButton2("btnTweetShare", _W - 120, 140, 0.75);
	this.btnTweetShare.name = "btnTweet";
	this.btnTweetShare.interactive = true;
	this.btnTweetShare.buttonMode=true;
	this.btnTweetShare.overSc = true;
	var tfTw = addText("Tweet", 40, "#FFFFFF", undefined, "center", 200)
	tfTw.x = 20;
	tfTw.y = -tfTw.height/2;
	this.btnTweetShare.addChild(tfTw);
	this.addChild(this.btnTweetShare);
	this._arButtons.push(this.btnTweetShare);
	
	var posX = _W/2-680;
	var posY = _H/2+180+offsetY;
	var stepX = 90;
	var stepY = 50;
	var indexX = 1;
	
	for (var i = 1; i < 7; i++) {
		this.addBtnChip("chip_"+i, posX+stepX*(indexX-1), posY+stepY*(i-1));
		
		indexX++;
		if(i%3==0){
			indexX = 0;
			posX = _W/2-640;
			posY = _H/2+100+offsetY;
		}
	}
	this.showChips(false);
	
	if(openkey){
		this.tfIdUser.setText(openkey);
		if(options_debug || options_rpc){
			this.bWait = false;
			this.showButtons(true);
			this.showChips(true);
		} else {
			this.bWait = true;
		}
	}
	if(options_debug){
		this.showChips(true);
	}
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
	if(false){
		wnd.visible = false;
		obj_game["game"].curWindow = undefined;
	} else {
		obj_game["game"].curWindow = wnd;
		obj_game["game"].timeCloseWnd = 200;
	}
}

ScrGame.prototype.addChip = function(name, x, y, type) {
	var array = this._arChips;
	if(type == "split"){
		array = this._arSplitChips;
	}
	var chip = addObj(name, x, y, scaleChip);
	this.game_mc.addChild(chip);
	array.push(chip);
}

ScrGame.prototype.addBtnChip = function(name, x, y) {	
	var chip = addButton2(name, x, y, scaleChip);
	chip.interactive = true;
	chip.buttonMode=true;
	chip.overSc=true;
	this.face_mc.addChild(chip);
	this._arButtons.push(chip);
	this._arBtnChips.push(chip);
}

ScrGame.prototype.createButton = function(name, x, y, label, sc, size) {
	if(sc){}else{sc=1}
	if(size){}else{size=22}
	
	var skin = "btnDefault";
	
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

ScrGame.prototype.createButton2 = function(name, title, x, y, sc) {
	if(sc){}else{sc=1}
	
	var btn = addButton2(name, x, y, sc);
	btn.interactive = true;
	btn.buttonMode=true;
	btn.overSc=true;
	btn.disabled=false;
	this.face_mc.addChild(btn);
	this._arButtons.push(btn);
	
	var tf = addText(title, 46, "#FFFFFF", "#000000", "center", 200, 6)
	tf.x = 0;
	tf.y = 120;
	btn.addChild(tf);
	
	return btn;
}

ScrGame.prototype.showChips = function(value) {
	var a = 0.5;
	var alpha = a;
	if(value){
		alpha = 1;
	}
	if(this.startGame){
		alpha = a;
	}
	if(betEth != 0 && value && this.bWait){
		alpha = a;
	}
	
	for (var i = 0; i < this._arBtnChips.length; i++) {
		var obj = this._arBtnChips[i];
		obj.alpha = alpha;
	}
	if(value && betEth == 0){
		// this.tfMyBet.setText("");
		// this.tfSplitBet.setText("");
		this.bClear = false;
		this.bWait = false;
		this.arrow.visible = true;
		this.tfStatus.setText("Select bet");
	}
}

ScrGame.prototype.showButtons = function(value) {
	var a = 0.5;
	var alpha = a;
	if(value){
		alpha = 1;
	}
	
	if(this.startGame){
		this.btnHit.visible = true;
		this.btnStand.visible = true;
		this.btnStart.visible = false;
		this.btnClear.visible = false;
	} else {
		this.btnHit.visible = false;
		this.btnStand.visible = false;
		this.btnStart.visible = true;
		this.btnClear.visible = true;
		alpha = a;
	}
    this.btnHit.alpha = alpha;
    this.btnStand.alpha = alpha;
	if(value && this.isSplitAvailable()){
		this.btnSplit.alpha = 1;
	} else {
		this.btnSplit.alpha = a;
	}
	if(value && this.isDoubleAvailable()){
		this.btnDouble.alpha = 1;
	} else {
		this.btnDouble.alpha = a;
	}
}

ScrGame.prototype.showPlayerCard = function(card){
	if(card){
		// IN_PROGRESS_SPLIT
		if(this.mySplitPoints > 0){
			card.x = _W/2 - 200 + lastPlayerCard*30;
			this.tfMyPoints.x = _W/2-270;
			if(this.bSplit && !this.bStandSplit){
				card.img.tint = 0x999999;
			}
		} else {
			card.x = _W/2 - 80 + lastPlayerCard*30;
			this.tfMyPoints.x = _W/2-150;
		}
		card.y = _H/2 + 70;
		this.cards_mc.addChild(card);
		lastPlayerCard++;
		dealedCards.push(card);
		this._arMyCards.push(card);
		this._arMyPoints.push(card.point);
		
		this.showMyPoints();
	}
}

ScrGame.prototype.showPlayerSplitCard = function(card){
	if(card){
		var offsetY = 50;
		card.x = _W/2 + 200 + lastPlayerSplitCard*30;
		card.y = _H/2 + 70;
		if(!this.bSplit && this.bStandSplit){
			card.img.tint = 0x999999;
		}
		this.cards_mc.addChild(card);
		lastPlayerSplitCard++;
		dealedCards.push(card);
		this._arMySplitCards.push(card);
		this._arMySplitPoints.push(card.point);
		this.showMySplitPoints();
	}
}

ScrGame.prototype.offsetCards = function(type, value) {
	var prnt = obj_game["game"];
	var array = prnt._arMyCards;
	if(type == "split"){
		array = prnt._arMySplitCards;
	} else if(type == "house"){
		array = prnt._arHouseCards;
	}
	for (var i = 0; i < array.length; i++) {
		var card = array[i];
		card.x = value + i*30;
	}
}

ScrGame.prototype.darkCards = function(array, value) {
	for (var i = 0; i < array.length; i++) {
		var card = array[i];
		if(value){
			card.img.tint = 0x999999;
		} else {
			card.img.tint = 0xffffff;
		}
	}
}

ScrGame.prototype.showMyPoints = function(){
	this.myPoints = this.getMyPoints();
	if(this.myPoints > 0){
		this.tfMyPoints.setText(this.myPoints);
	} else {
		this.tfMyPoints.setText("");
	}
}

ScrGame.prototype.autoSplitStand = function(){
	this.bEndTurnSplit = true;
	if(this.bSplit && !this.bStandSplit){
		this.bStandSplit = true;
		this.bSplit = false;
	}
	
	this.bStand = true;
	this.showButtons(false);
	this.darkCards(this._arMyCards, false);
	this.darkCards(this._arMySplitCards, true);
}

ScrGame.prototype.showMySplitPoints = function(){
	this.mySplitPoints = this.getMySplitPoints();
	if(this.mySplitPoints > 0){
		this.tfMySplitPoints.setText(this.mySplitPoints);
		if(!this.bEndTurnSplit){
			if(this.mySplitPoints > 21){
				this.autoSplitStand();
			} else if(this.mySplitPoints == 21){
				this.autoSplitStand();
			}
		}
	} else {
		this.tfMySplitPoints.setText("");
	}
}

ScrGame.prototype.showHouseCard = function(card){
	if(card){
		card.x = _W/2 - 80 + lastHouseCard*30;
		card.y = _H/2 - 200;
		this.cards_mc.addChild(card);
		lastHouseCard++;
		dealedCards.push(card);
		this._arHouseCards.push(card);
		this._arHousePoints.push(card.point);
		
		this.showHousePoints();
	}
}

ScrGame.prototype.showHousePoints = function(){
	this.housePoints = this.getHousePoints();
	if(this.housePoints > 0){
		this.tfHousePoints.setText(this.housePoints);
	} else {
		this.tfHousePoints.setText("");
	}
}

ScrGame.prototype.getMyPoints = function(){
	var myPoints = 0;
	var countAce = 0;
	for (var i = 0; i < this._arMyPoints.length; i++) {
		var curPoint = this._arMyPoints[i];
		myPoints += curPoint;
		if(curPoint == 11){
			countAce ++;
		}
	}
	
	while(myPoints > 21 && countAce > 0){
		countAce --;
		myPoints -= 10;
	}
	
	return myPoints;
}

ScrGame.prototype.getMySplitPoints = function(){
	var mySplitPoints = 0;
	var countAce = 0;
	for (var i = 0; i < this._arMySplitPoints.length; i++) {
		var curPoint = this._arMySplitPoints[i];
		mySplitPoints += curPoint;
		if(curPoint == 11){
			countAce ++;
		}
	}
	
	while(mySplitPoints > 21 && countAce > 0){
		countAce --;
		mySplitPoints -= 10;
	}
	
	return mySplitPoints;
}

ScrGame.prototype.getHousePoints = function(){
	var housePoints = 0;
	var countAce = 0;
	for (var i = 0; i < this._arHousePoints.length; i++) {
		var curPoint = this._arHousePoints[i];
		housePoints += curPoint;
		if(curPoint == 11){
			countAce ++;
		}
	}
	
	while(housePoints > 21 && countAce > 0){
		countAce --;
		housePoints -= 10;
	}
	
	return housePoints;
}

ScrGame.prototype.showSuitCard = function(){
	if(this.cardSuit){} else {
		this.cardSuit = addObj("suit", 0, 0, scaleCard);
		this.gfx_mc.addChild(this.cardSuit);
	}
	this.cardSuit.width = this.cardSuit.w;
	this.cardSuit.x = _W/2 - 80 + lastHouseCard*30;
	this.cardSuit.y = _H/2 - 200;
	if(this.bStand){
		this.cardSuit.visible = false;
	} else {
		this.cardSuit.visible = true;
	}
}

ScrGame.prototype.getCard = function(cardIndex){
	var cardType = Math.floor(cardIndex / 4);
	var cardSymbol = String(cardType);
	var point = cardType;
	switch (cardType) {
		case 0:
			cardSymbol = "K";
			point = 10;
			break;
		case 1:
			cardSymbol = "A";
			point = 11;
			break;
		case 11:
			cardSymbol = "J";
			point = 10;
			break;
		case 12:
			cardSymbol = "Q";
			point = 10;
			break;
	}
	var suit = String(cardIndex % 4 + 1);
	var spriteName = suit + "_" + cardSymbol;
	var newCard = addObj(spriteName, 0, 0, scaleCard);
	if(newCard){
		newCard.point = point;
	}else{
		console.log("UNDEFINED spriteName:", cardIndex, spriteName);
	}
	return newCard;
}

ScrGame.prototype.getPlayerCardsNumber = function() {
	var data = "0x"+C_PLAYER_CARDS;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getPlayerCardsNumber", params, _callback);
}

ScrGame.prototype.getSplitCardsNumber = function() {
	var data = "0x"+C_SPLIT_CARDS;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getSplitCardsNumber", params, _callback);
}

ScrGame.prototype.getInsurance = function() {
	var data = "0x"+C_GET_INSURANCE;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getInsurance", params, _callback);
}

ScrGame.prototype.isInsuranceAvailable = function() {
	var data = "0x"+C_INSURANCE_AVAILABLE;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("isInsuranceAvailable", params, _callback);
}

ScrGame.prototype.isDoubleAvailable = function() {
	if(stateNow == S_IN_PROGRESS || 
	stateNow == S_IN_PROGRESS_SPLIT){
		if((stateNow == S_IN_PROGRESS && this._arMyCards.length == 2 && 
		this.myPoints > 8 && this.myPoints < 12) ||
		(stateNow == S_IN_PROGRESS_SPLIT && this._arMySplitCards.length == 2 &&
		this.mySplitPoints > 8 && this.mySplitPoints < 12)){
			return true;
		}
	}
	
	return false;
}

ScrGame.prototype.getPlayerBet = function() {
	var data = "0x"+C_GET_BET;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getPlayerBet", params, _callback);
}

ScrGame.prototype.getIsGame = function() {
	var data = "0x"+C_IS_GAME;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getIsGame", params, _callback);
}

ScrGame.prototype.getHouseCardsNumber = function() {
	var data = "0x"+C_HOUSE_CARDS;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getHouseCardsNumber", params, _callback);
}

ScrGame.prototype.isSplitAvailable = function() {
	var value = false;
	
	
	if(stateNow == S_IN_PROGRESS && 
	this._arMyCards.length == 2 &&
	Math.floor(obj_game["balance"]*100) > betGame &&
	this.bSplit == false &&
	betGame > 0 &&
	this._arMySplitCards.length == 0 &&
	this._arMyPoints[0] == this._arMyPoints[1]){
		value = true;
	}
	
	return value;
}

ScrGame.prototype.checkGameState = function() {
	if(openkey == undefined){
		return false;
	}
	// 0 Run
	// 1 Player
	// 2 House
	// 3 Tie
	var data = "0x"+C_GAME_STATE;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getGameState", params, _callback);
}

ScrGame.prototype.checkGameSplitState = function() {
	if(openkey == undefined){
		return false;
	}
	var data = "0x"+C_GAME_SPLIT_STATE;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getSplitGameState", params, _callback);
}

ScrGame.prototype.getPlayerScore = function() {
	if(openkey == undefined){
		return false;
	}
	var data = "0x"+C_PLAYER_SCORE;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getPlayerScore", params, _callback);
}

ScrGame.prototype.getSplitScore = function() {
	if(openkey == undefined){
		return false;
	}
	var data = "0x"+C_SPLIT_SCORE;
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getSplitScore", params, _callback);
}

ScrGame.prototype.addPlayerCard = function(){
	for (var i = loadPlayerCard; i < this.countPlayerCard; i++) {
		if(options_debug){
			loadPlayerCard++;
			var cardIndex = Math.round(Math.random()*52);
			this._arNewCards.push({type:"player", id:cardIndex});
			this.showButtons(true);
			this.bWait = false;
			if(this.startGame){
				this.tfStatus.setText("");
			}
		} else {
			this.getPlayerCard(i);
		}
	}
	for (var j = loadPlayerSplitCard; j < this.countPlayerSplitCard; j++) {
		if(options_debug){
			loadPlayerSplitCard++;
			var cardIndex = Math.round(Math.random()*52);
			this._arNewCards.push({type:"player", id:cardIndex});
		} else {
			this.getSplitCard(j);
		}
	}
}

ScrGame.prototype.addHouseCard = function(){
	for (var i = loadHouseCard; i < this.countHouseCard; i++) {
		if(options_debug){
			loadHouseCard ++;
			var cardIndex = Math.round(Math.random()*52);
			this._arNewCards.push({type:"house", id:cardIndex});
		} else {
			this.getHouseCard(i);
		}
	}
}

ScrGame.prototype.getPlayerCard = function(value){
    var callData = "0x"+C_PLAYER_CARD;
    callData = callData.substr(0, 10);
	var data = callData + pad(numToHex(value), 64);
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getPlayerCard", params, _callback);
}

ScrGame.prototype.getSplitCard = function(value){
    var callData = "0x"+C_SPLIT_CARD;
    callData = callData.substr(0, 10);
	var data = callData + pad(numToHex(value), 64);
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getSplitCard", params, _callback);
}

ScrGame.prototype.getHouseCard = function(value){
    var callData = "0x"+C_HOUSE_CARD;
    callData = callData.substr(0, 10);
	var data = callData + pad(numToHex(value), 64);
	var params = {"from":openkey,
				"to":addressContract,
				"data":data};
	infura.sendRequest("getHouseCard", params, _callback);
}

ScrGame.prototype.clickHit = function(){
	this.showButtons(false);
	if(options_debug){
		this.countPlayerCard ++;
		if(this.bSplit){
			this.countPlayerSplitCard ++;
		}
		this.addPlayerCard();
	} else {
		this.bWait = true;
		if(this.bSplit){
			infura.sendRequest("hitS", openkey, _callback);
		} else {
			infura.sendRequest("hit", openkey, _callback);
		}
	}
}

ScrGame.prototype.clickStand = function(){
	if(options_debug){
		this.showButtons(false);
		this.countHouseCard ++;
		this.addHouseCard();
	} else {
		this.bWait = true;
		if(this.bSplit && !this.bStandSplit){
			this.bStandSplit = true;
			this.bSplit = false;
		}
		
		this.bStand = true;
		this.showButtons(false);
		infura.sendRequest("stand", openkey, _callback);
	}
}

ScrGame.prototype.clickDouble = function(){
	if(options_debug){
	} else {
		this.bWait = true;
		this.bStand = true;
		this.showButtons(false);
		infura.sendRequest("double", openkey, _callback);
	}
}

ScrGame.prototype.clickSplit = function(){
	if(obj_game["balance"] < betGame/100){
		obj_game["game"].showError(ERROR_BALANCE);
		return false;
	}
	
	this.showButtons(false);
	this.bSplit = true;
	this.fillChips(betGame);
	this.fillChips(betGame, "split");
	var str = String(betGame/100);
	this.tfMyBet.setText(str);
	this.tfMyBet.x = _W/2 - 250;
	this.tfSplitBet.setText(str);
	
	if(options_debug){
		this._arMySplitCards = [this._arMyCards[1]];
		this._arMyCards = [this._arMyCards[0]];
		this._arMyPoints = [this._arMyCards[0].point];
		this.countPlayerCard --;
		this.countPlayerSplitCard ++;
		lastPlayerCard = 1;
		loadPlayerCard = 1;
		lastPlayerSplitCard = 0;
		loadPlayerSplitCard = 0;
		this._arMyCards[0].x = _W/2 - 200;
		this._arMySplitCards[0].x = _W/2 + 200 + lastPlayerSplitCard*30;
		this.showMyPoints();
		this.showMySplitPoints();
		this.tfMyPoints.x = _W/2-270;
		this.tfMySplitPoints.setText(this._arMyCards[0].point);
		this.showButtons(true);
		var curBet = betEth/1000000000000000000;
		obj_game["balance"] -= curBet;
		this.tfBalance.setText(obj_game["balance"]);
	} else {
		this.bWait = true;
		this.bWaitSplit = true;
		infura.sendRequest("split", openkey, _callback);
		this._arMySplitCards = [this._arMyCards[1]];
		this._arMyCards = [this._arMyCards[0]];
		lastPlayerCard = 1;
		loadPlayerCard = 1;
		lastPlayerSplitCard = 1;
		loadPlayerSplitCard = 1;
		this.countPlayerCard = 1;
		this._arMyCards[0].x = _W/2 - 200;
		this._arMySplitCards[0].x = _W/2 + 200;
		this.tfMyPoints.x = _W/2-270;
		this._arMyPoints = [this._arMyCards[0].point];
		this._arMySplitPoints = [this._arMySplitCards[0].point];
		this.showMyPoints();
		this.showMySplitPoints();
		this.darkCards(this._arMyCards, true);
		this.darkCards(this._arMySplitCards, false);
	}
}

ScrGame.prototype.clickInsurance = function(){
	var prnt = obj_game["game"];
	prnt.bInsurance = 1;
	infura.sendRequest("insurance", openkey, _callback);
	prnt.bWait = true;
	prnt.showButtons(false);
}

ScrGame.prototype.fillChips = function(value, type){
	var setBet = value;
	var countChip = 0;
	var posX = this.seat.x;
	
	if(type == "split"){
		this.clearSplitChips();
		posX += 200;
	} else if(this.bSplit || 
	stateNow == S_IN_PROGRESS_SPLIT || 
	type == "main"){
		this.clearChips();
		posX -= 200;
	} else {
		this.clearChips();
	}
	while(setBet > 0){
		var posY = this.seat.y-countChip*6;
		if(setBet >= 500){
			setBet -= 500;
			this.addChip("chip_6", posX, posY, type);
			countChip ++;
		} else if(setBet >= 200){
			setBet -= 200;
			this.addChip("chip_5", posX, posY, type);
			countChip ++;
		} else if(setBet >= 100){
			setBet -= 100;
			this.addChip("chip_4", posX, posY, type);
			countChip ++;
		} else if(setBet >= 50){
			setBet -= 50;
			this.addChip("chip_3", posX, posY, type);
			countChip ++;
		} else if(setBet >= 10){
			setBet -= 10;
			this.addChip("chip_2", posX, posY, type);
			countChip ++;
		} else if(setBet >= 5){
			setBet -= 5;
			this.addChip("chip_1", posX, posY, type);
			countChip ++;
		} else if(setBet > 0){
			setBet = 0;
		}
	}
}

ScrGame.prototype.sendChip = function(item_mc, betGame, type){
	var prnt = obj_game["game"];
	var chip = prnt.createObj(item_mc, item_mc.name, scaleChip);
	if(chip == undefined){
		prnt.fillChips(betGame);
		return false;
	}
	var _x = prnt.seat.x;
	var _y = prnt.seat.y;
	if(type == "split"){
		_x += 200;
	} else if(prnt.bSplit){
		_x -= 200;
	}
	createjs.Tween.get(chip).to({x:_x, y:_y},500)
							.call(function(){
								prnt.addHolderObj(chip);
								prnt.fillChips(betGame);
							});
}

ScrGame.prototype.sendCard = function(obj){
	var type = obj.type;
	var cardIndex = obj.id;
	var prnt = obj_game["game"];
	var card = undefined;
	var suit = prnt.createObj({x:1487, y:298}, "suit", scaleCard);
	var _x = 0;
	var _y = 0;
	
	if(type != "suit"){
		card = prnt.getCard(cardIndex);
	}
	
	if(type == "player"){
		// IN_PROGRESS_SPLIT
		if(prnt.mySplitPoints > 0){
			_x = _W/2 - 200 + lastPlayerCard*30;
		} else {
			_x = _W/2 - 80 + lastPlayerCard*30;
		}
		_y = _H/2 + 70;
		prnt.showPlayerCard(card);
		if(betGame > 0){
			prnt.showButtons(true);
		}
	} else if(type == "split"){
		_x = _W/2 + 200 + lastPlayerSplitCard*30;
		_y = _H/2 + 70;
		prnt.showPlayerSplitCard(card);
		if(betGame > 0){
			prnt.showButtons(true);
		}
	} else if(type == "house"){
		_x = _W/2 - 80 + lastHouseCard*30;
		_y = _H/2 - 200;
		prnt.showHouseCard(card);
		
		if(loadHouseCard==1){
			prnt._arNewCards.push({type:"suit", id:0});
			if(valInsurance == 0 && card.point == 11){
				prnt.showInsurance();
			}
		}
	} else if(type == "suit"){
		_x = _W/2 - 80 + lastHouseCard*30;
		_y = _H/2 - 200;
		prnt.showSuitCard();
		card = prnt.cardSuit;
	}
	
	if(card){
		card.visible = false;
		if(type == "suit"){
			createjs.Tween.get(suit).to({x:_x, y:_y},400)
								.call(function(){
									prnt.addHolderObj(suit);
									card.visible = true;
								});
		} else {
			var bSuit = false;
			if(prnt.cardSuit){
				if(loadHouseCard > 1 && prnt.cardSuit.width == prnt.cardSuit.w){
					bSuit = true;
				}
			}
			
			if(bSuit){
				prnt.addHolderObj(suit);
				createjs.Tween.get(prnt.cardSuit).to({width:10},150)
								.call(function(){
									prnt.cardSuit.visible = false;
									card.visible = true;
									if(options_debug && type == "house"){
										if(lastHouseCard == 2){
											prnt._arNewCards.push({type:"house", id:28});
										} else if(lastHouseCard == 3){
											prnt.clearBet();
											prnt.bWait = false;
											prnt.startGame = false;
											prnt.showChips(true);
											prnt.showButtons(true);
										}
									}
								});
			} else {
				createjs.Tween.get(suit).to({x:_x, y:_y},400).to({width:10},150)
								.call(function(){
									prnt.addHolderObj(suit);
									card.visible = true;
									if(options_debug && type == "house"){
										if(lastHouseCard == 2){
											prnt._arNewCards.push({type:"house", id:28});
										} else if(lastHouseCard == 3){
											prnt.clearBet();
											prnt.bWait = false;
											prnt.startGame = false;
											prnt.showChips(true);
											prnt.showButtons(true);
										}
									}
								});
			}
		}
	}
}

ScrGame.prototype.loadBet = function(value){
	if(!this.bBetLoad){
		var c = 100;
		this.bBetLoad = true;
		this.bWait = false;
		betEth = Number(hexToNum(value));
		betGame = toFixed((betEth/1000000000000000000), 4)*c;
		betSplitGame = betGame;
		betGameCur = betGame;
		var str = String(betGame/c);
		this.tfMyBet.setText(str);
		this.isSplitAvailable();
		this.showButtons(true);
		this.fillChips(betGame);
		if(stateNow == S_IN_PROGRESS_SPLIT){
			this.fillChips(betSplitGame, "split");
			this.tfSplitBet.setText(str);
			this.tfMyBet.x = _W/2 - 250;
		}
	}
}

ScrGame.prototype.clickChip = function(item_mc){
	var name = item_mc.name;
	var c = 100;
	var value = chipVale[Number(name.substr(5))]*c;
	var oldBet = betGame;
	betGame += value;
	betGame = toFixed(betGame, 2);
	
	if(betGame > obj_game["balance"]*c){
		obj_game["game"].showError(ERROR_BALANCE);
		betGame = oldBet;
	} else if(betGame > 5*c){
		obj_game["game"].showError(ERROR_MAX_BET);
		betGame = oldBet;
	} else {
		var str = "Your bet: " + String(betGame/c);
		this.tfYourBet.setText(str);
		this.tfSplitBet.setText("");
		this.tfMyBet.setText(betGame/c);
		this.tfMyBet.x = _W/2-50;
	}
	
	if(betGame > 0){
		this.btnStart.alpha = 1;
		this.btnClear.alpha = 1;
		this.arrow.visible = false;
		if(!this.bClear){
			this.tfStatus.setText("");
			this.tfMyPoints.setText("");
			this.tfMySplitPoints.setText("");
			this.tfHousePoints.setText("");
			this._arMyPoints = [];
			this._arMySplitPoints = [];
			this._arHousePoints = [];
			this._arMyCards = [];
			this._arMySplitCards = [];
			this._arHouseCards = [];
			this.bClear = true;
			this.clearGame();
		}
	}
	
	if(betGameOld == betGame){
		return false;
	}
	betGameOld = betGame;
	this.sendChip(item_mc, betGame);
	betEth = betGame*1000000000000000000/c;
}

ScrGame.prototype.showSmartContract = function() {
	var url = urlEtherscan + "address/" + addressContract;
	if(options_mainet){
		url = "https://etherscan.io/" + "address/" + addressContract;
	}
	window.open(url, "_blank"); 
}

ScrGame.prototype.showError = function(value, callback) {
	var str = "ERR"
	switch(value){
		case ERROR_KEYTHEREUM:
			str = "OOOPS! \n The key is not created. Try a different browser."
			break;
		case ERROR_BUF:
			str = "OOOPS! \n Transaction failed."
			this.resetGame();
			break;
		case ERROR_KEY:
			str = "OOOPS! \n The key is not valid."
			break;
		case ERROR_BANK:
			str = "OOOPS! \n No money in the bank. \n Please contact to administrator."
			break;
		case ERROR_TRANSACTION:
			str = "OOOPS! \n The transaction is not sent. \n Try another bet."
			break;
		case ERROR_BALANCE:
			str = "OOOPS! \n You do not have enough money."
			break;
		case ERROR_DEAL:
			str = "OOOPS! \n The transaction did not pass. \n Try later."
			break;
		case ERROR_MAX_BET:
			str = "OOOPS! \n The maximum bet is 5."
			break;
		default:
			str = "ERR: " + value;
			break;
	}
	this.createWndInfo(str, callback);
}

ScrGame.prototype.showTestEther = function() {
	var str = "Your 1 test ether will be available shortly (about minute)";
	this.createWndInfo(str);
}

ScrGame.prototype.showInsurance = function() {
	var str = "Do you want Insurance?";
	this.createWndInfo(str, this.clickInsurance);
	this.bInsurance = 0;
}

ScrGame.prototype.showResult = function(_name, _x, _y) {
	var prnt = obj_game["game"];
	var tf = prnt.createObj({x:_x, y:_y}, _name);
	tf.alpha = 0;
	
	createjs.Tween.get(tf).wait(5000).to({y:_y, alpha:1},300).to({y:_y-50},500);
}

ScrGame.prototype.shareTwitter = function() {
	// @daocasino @ethereumproject @edcon #blockchain #ethereum
	if(twttr){
		var urlGame = 'http://platform.dao.casino/';
		var url="https://twitter.com/intent/tweet";
		var str='Play blackjack for ether '+ " " + urlGame;
		var hashtags="blockchain,ethereum,blackjack";
		var via="daocasino";
		window.open(url+"?text="+str+";hashtags="+hashtags+";via="+via,"","width=500,height=300");
	}
}

ScrGame.prototype.shareFB = function() {
	if (typeof(FB) != 'undefined' && FB != null ) {
		var urlGame = 'http://platform.dao.casino/';
		var urlImg = "http://platform.dao.casino/games/blackjack/game/images/share/bgGame.jpg";
		
		FB.ui({
		  method: 'feed',
		  picture: urlImg,
		  link: urlGame,
		  caption: 'PLAY',
		  description: 'Play blackjack for ether',
		}, function(response){});
	} else {
		console.log("FB is not defined");
	}
}

ScrGame.prototype.createObj = function(point, name, sc) {	
	if(sc){}else{sc = 1};
	var mc = undefined;
	var newObj = true;
	var prnt = obj_game["game"];
	
	for (var i = 0; i < prnt._arHolder.length; i++ ) {
		mc = prnt._arHolder[i];
		if (mc) {
			if (mc.dead && mc.name == name) {
				mc.visible = true;
				newObj = false;
				break;
			}
		}
	}
	
	if (newObj) {
		if(name == "tfBlackjack"){
			mc = addText(R_BLACKJACK, 50, "#FCB70F", "#4F3904", "left", 300, 4);
			mc.name = "tfBlackjack";
			mc.w = mc.width;
		} else if(name == "tfWin"){
			mc = addText(R_WIN, 50, "#FCB70F", "#4F3904", "left", 300, 4);
			mc.name = "tfWin";
			mc.w = mc.width;
		} else if(name == "tfBust"){
			mc = addText(R_BUST, 50, "#EC8018", "#3F2307", "left", 300, 4);
			mc.name = "tfBust";
			mc.w = mc.width;
		} else if(name == "tfLose"){
			mc = addText(R_LOSE, 50, "#D72319", "#64100B", "left", 300, 4);
			mc.name = "tfLose";
			mc.w = mc.width;
		} else if(name == "tfPush"){
			mc = addText(R_PUSH, 50, "#999999", "#333333", "left", 300, 4);
			mc.name = "tfPush";
			mc.w = mc.width;
		} else {
			mc = addObj(name, 0, 0, sc);
		}
		prnt.gfx_mc.addChild(mc);
		prnt._arHolder.push(mc);
	}
	
	mc.x = point.x;
	mc.y = point.y;
	mc.width = mc.w;
	mc.dead = false;
	
	return mc;
}

ScrGame.prototype.addHolderObj = function(obj){
	obj.visible = false;
	obj.dead = true;
	obj.x = _W + 150;
	obj.y = _H + 50;
}

// START
ScrGame.prototype.startGameEth = function(){
	if(openkey == undefined){
		obj_game["game"].showError(ERROR_KEY, showHome);
		return false;
	}
	
	this.bClickStart = true;
	infura.sendRequest("deal", openkey, _callback);
}

ScrGame.prototype.sendUrlRequest = function(url, name) {
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

ScrGame.prototype.responseTransaction = function(name, value) {
	console.log("get nonce action: ", name);
	var prnt = obj_game["game"];
	var data = "";
	var price = 0;
	var nameRequest = "sendRaw";
	var gasPrice="0x737be7600";//web3.toHex('31000000000');
	var gasLimit=0x927c0; //web3.toHex('600000');
	if(name == "deal"){
		data = "0x"+C_DEAL;
		price = betEth;
		betGameCur = toFixed((betEth/1000000000000000000), 4)*100;
		nameRequest = "gameTxHash";
	} else if(name == "hit"){
		data = "0x"+C_HIT;
	} else if(name == "hitS"){
		data = "0x"+C_HIT_S;
		betGameCur = toFixed((betEth/1000000000000000000), 4)*100;
	} else if(name == "stand"){
		data = "0x"+C_STAND;
	} else if(name == "split"){
		data = "0x"+C_SPLIT;
		price = betEth;
		gasLimit=0xf4240; //1000000
		prnt.offsetCards("player", _W/2 - 200);
		prnt.darkCards(prnt._arMyCards, true);
	} else if(name == "insurance"){
		data = "0x"+C_INSURANCE;
		price = betEth/2;
	} else if(name == "double"){
		data = "0x"+C_DOUBLE;
		price = betEth;
		if(stateNow == S_IN_PROGRESS_SPLIT){
			betSplitGame = toFixed((price*2/1000000000000000000), 4)*100;
			prnt.fillChips(betSplitGame, "split");
			prnt.tfSplitBet.setText(betSplitGame/100);
		} else {
			betGame = toFixed((price*2/1000000000000000000), 4)*100;
			betGameCur = betGame;
			prnt.fillChips(betGame, "main");
			prnt.tfMyBet.setText(betGame/100);
		}
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
			obj_game["game"].clearBet();
			obj_game["game"].tfStatus.setText("");
			obj_game["game"].bWait = false;
			obj_game["game"].showChips(true);
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
			prnt.clearBet();
			prnt.tfStatus.setText("");
			prnt.bWait = false;
			prnt.showChips(true);
		}
		return false;
	}
	
	// console.log("response:", command, value);
	if(command == "gameTxHash"){
		prnt.startGame = true;
		prnt.getIsGame();
		infura.sendRequest("getBalance", openkey, _callback);
	} else if(command == "getEthereum"){
		var obj = JSON.parse(value);
		if(prnt.tfGetEth){
			prnt.tfGetEth.setText("Your 1 test ether will be available shortly (about minute)");
		}
		infura.sendRequest("getBalance", openkey, _callback);
	} else if(command == "getBalance"){
		obj_game["balance"] = toFixed((Number(hexToNum(value))/1000000000000000000), 4);
		login_obj["balance"] = obj_game["balance"];
		prnt.tfBalance.setText(obj_game["balance"]);
		if(obj_game["balance"] > 0){
			prnt.tfGetEth.setText("");
			if(prnt.oldBalance == -1){
				prnt.oldBalance = Number(obj_game["balance"]);
				prnt.showButtons(true);
			}
		}
	} else if(command == "getBalanceBank"){
		obj_game["balanceBank"] = toFixed((Number(hexToNum(value))/1000000000000000000), 4);
	} else if(command == "getBlockNumber"){
		blockNumber = Number(hexToNum(value));
	} else if(command == "getPlayerCard"){
		if(value != "0x" && loadPlayerCard < prnt.countPlayerCard){
			var cardIndex = hexToNum(value);
			loadPlayerCard++;
			prnt.timeNewCard = 1000;
			prnt._arNewCards.push({type:"player", id:cardIndex});
			prnt.bWait = false;
		}
	} else if(command == "getSplitCard"){
		if(value != "0x" && loadPlayerSplitCard < prnt.countPlayerSplitCard){
			var cardIndex = hexToNum(value);
			loadPlayerSplitCard++;
			prnt.timeNewCard = 1000;
			prnt._arNewCards.push({type:"split", id:cardIndex});
			prnt.bWait = false;
		}
	} else if(command == "getHouseCard"){
		if(value != "0x" && loadHouseCard < prnt.countHouseCard){
			var cardIndex = hexToNum(value);
			loadHouseCard++
			prnt.timeNewCard = 1000;
			prnt._arNewCards.push({type:"house", id:cardIndex});
			prnt.bWait = false;
		}
	} else if(command == "getPlayerCardsNumber"){
		if(!prnt.bWaitSplit){
			prnt.countPlayerCard = hexToNum(value);
			prnt.addPlayerCard();
		}
	} else if(command == "getSplitCardsNumber"){
		prnt.countPlayerSplitCard = hexToNum(value);
		prnt.addPlayerCard();
		if(prnt.countPlayerSplitCard > 0){
			prnt.bWaitSplit = false;
		}
	} else if(command == "getHouseCardsNumber"){
		prnt.countHouseCard = hexToNum(value);
		prnt.addHouseCard();
	} else if(command == "getIsGame"){
		if(hexToNum(value)){
			isGame = true;
		} else {
			isGame = false;
		}
	} else if(command == "getPlayerBet"){
		if((stateNow == S_IN_PROGRESS ||
		stateNow == S_IN_PROGRESS_SPLIT)
		&& stateOld > -1 && prnt.tfStatus){
			prnt.loadBet(value);
		}
	} else if(command == "isInsuranceAvailable"){
		if((stateNow == S_IN_PROGRESS ||
		stateNow == S_IN_PROGRESS_SPLIT) && 
		prnt.bInsurance == -1 && prnt._arMyCards.length == 2 &&
		hexToNum(value) && valInsurance == 0){
			prnt.showInsurance();
		}
	} else if(command == "getPlayerScore"){
		var point = Number(hexToNum(value));
		var bet = betGameCur/100;
		var strResult = "";
		switch (stateNow){
			case S_PLAYER_WON:
				if(point == 21 && prnt._arMyCards.length == 2){
					bet = bet * 2.5;
				} else if(point == 21){
					bet = bet * 2;
				}
				strResult = "+"+String(bet);
				break;
			case S_HOUSE_WON:
				strResult = "-"+String(bet);
				break;
			case S_TIE:
				break;
		}
		
		prnt.tfMyBet.setText(strResult);
		prnt.showChips(true);
	} else if(command == "getSplitScore"){
		var point = Number(hexToNum(value));
		var bet = betGameCur/100;
		var strResult = "";
		switch (stateSplit){
			case S_BLACKJACK:
				bet = bet * 2.5;
				strResult = "+"+String(bet);
				break;
			case S_PLAYER_WON:
				if(point == 21){
					bet = bet * 2;
				}
				strResult = "+"+String(bet);
				break;
			case S_HOUSE_WON:
				strResult = "-"+String(bet);
				break;
			case S_TIE:
				break;
		}
		
		prnt.tfSplitBet.setText(strResult);
	} else if(command == "getSplitGameState"){
		if(value != "0x"){
			stateSplit = hexToNum(value);
			console.log("stateSplit:", stateSplit);
			var _x = _W/2 + 200-75;
			var _y = _H/2 - 35;
			switch (stateSplit){
				case S_PLAYER_WON:
						prnt.showResult("tfWin", _x, _y);
					break;
				case S_BLACKJACK:
						prnt.showResult("tfBlackjack", _x, _y);
					break;
				case S_HOUSE_WON:
					if(prnt.mySplitPoints > 21){
						prnt.showResult("tfBust", _x, _y);
					} else {
						prnt.showResult("tfLose", _x, _y);
					}
					break;
				case S_TIE:
					prnt.showResult("tfPush", _x, _y);
					break;
			}
		}
	} else if(command == "getGameState"){
		if(!isGame){
			prnt.getIsGame();
		}
		
		if(value != "0x"){
			stateNow = hexToNum(value);
			console.log("state:", stateNow);
		}
		
		if(value != "0x" && isGame){
			if(stateNow == S_IN_PROGRESS ||
			stateNow == S_IN_PROGRESS_SPLIT){
				if(stateNow == S_IN_PROGRESS_SPLIT && !prnt.bStandSplit){
					prnt.bSplit = true;
				}
				if(stateNow == S_IN_PROGRESS && stateOld == S_IN_PROGRESS_SPLIT){
					prnt.bWait = false;
					prnt.showButtons(true);	
					prnt.darkCards(prnt._arMyCards, false);
					prnt.darkCards(prnt._arMySplitCards, true);
				}
				if(stateOld == -1){
					prnt.showButtons(true);	
					
					if(prnt.bSplit){
						prnt.darkCards(prnt._arMyCards, true);
						prnt.darkCards(prnt._arMySplitCards, false);
					}
				}
				prnt.startGame = true;
				prnt.btnStart.alpha = 0.5;
				prnt.btnClear.alpha = 0.5;
				prnt.showChips(false);
				prnt.getSplitCardsNumber();
				prnt.getPlayerCardsNumber();
				prnt.getHouseCardsNumber();
				prnt.getPlayerBet();
				prnt.getInsurance();
				prnt.isInsuranceAvailable();
				prnt.tfStatus.setText("");	
				
				if(!prnt.bBetLoad && betGame == 0){
					prnt.showButtons(false);
					prnt.bWait = true;
				}
			} else if(prnt.startGame){
				prnt.showMyPoints();
				prnt.showMySplitPoints();
				var _x = _W/2 - 80-75;
				var _y = _H/2 - 35;
				if(prnt.mySplitPoints > 0){
					_x = _W/2 - 200-75;
				}
				prnt.clearBet();
				prnt.getPlayerScore();
				if(prnt._arMySplitCards.length > 0){
					prnt.checkGameSplitState();			
					prnt.getSplitScore();	
				}				
				
				switch (stateNow){
					case S_BLACKJACK:
						prnt.showResult("tfBlackjack", _x, _y);
						isGame = false;
						break;
					case S_PLAYER_WON:
						prnt.showResult("tfWin", _x, _y);
						break;
					case S_HOUSE_WON:
						if((_x > _W/2 && prnt.mySplitPoints > 21) ||
						(_x < _W/2 && prnt.myPoints > 21)){
							prnt.showResult("tfBust", _x, _y);
						} else {
							prnt.showResult("tfLose", _x, _y);
						}
						break;
					case S_TIE:
						prnt.showResult("tfPush", _x, _y);
						break;
				}
				
				if(isGame){
					prnt.getIsGame();
				}
				prnt.getSplitCardsNumber();
				prnt.getPlayerCardsNumber();
				prnt.getHouseCardsNumber();
				
				prnt.bClickStart = false;
				prnt.bWait = false;
				prnt.startGame = false;
				prnt.showChips(true);
				infura.sendRequest("getBalance", openkey, _callback);
				infura.sendRequest("getBalanceBank", addressContract, _callback);
				prnt.showButtons(false);
			}
			
			stateOld = stateNow;
		} else if(stateNow == S_BLACKJACK && prnt.startGame) {
			var _x = _W/2 - 80-75;
			var _y = _H/2 - 35;
			prnt.showResult("tfBlackjack", _x, _y);
			isGame = false;
			prnt.getSplitCardsNumber();
			prnt.getPlayerCardsNumber();
			prnt.getHouseCardsNumber();
			
			prnt.bClickStart = false;
			prnt.bWait = false;
			prnt.startGame = false;
			prnt.showChips(true);
			infura.sendRequest("getBalance", openkey, _callback);
			infura.sendRequest("getBalanceBank", addressContract, _callback);
			prnt.showButtons(false);
		} else {
			if(!prnt.bClickStart){
				prnt.bWait = false;
				prnt.startGame = false;
				prnt.showChips(true);
			}
		}
	} else if(command == "deal" ||
			command == "hit" ||
			command == "hitS" ||
			command == "stand" ||
			command == "split" ||
			command == "double" ||
			command == "insurance"){
		prnt.responseTransaction(command, value);
	} else if(command == "getInsurance"){
		if(valInsurance == 0){
			valInsurance = hexToNum(value);
			if(valInsurance > 0){
				prnt.bWait = false;
				prnt.showButtons(true);
			}
		}
	} else if(command == "sendRaw"){
		infura.sendRequest("getBalance", openkey, _callback);
	}
}

ScrGame.prototype.resetTimer  = function(){
	
}

ScrGame.prototype.update = function(){
	var diffTime = getTimer() - this.startTime;
	
	if(this.startGame || 
	this.bClickStart || 
	stateNow == S_IN_PROGRESS || 
	stateNow == S_IN_PROGRESS_SPLIT){
		this.timeTotal += diffTime;
		this.tfTotalTime.setText(Math.round(this.timeTotal/1000));
	}
	
	this.timeGetState += diffTime;
	if(this.timeGetState >= TIME_GET_STATE){
		this.timeGetState = 0;
		this.checkGameState();
		if(obj_game["balance"]==0){
			infura.sendRequest("getBalance", openkey, _callback);
		}
	}
	
	this.timeNewCard -= diffTime;
	if(this._arNewCards.length > 0 && this.timeNewCard < 1){
		this.timeNewCard = 1000;
		this.sendCard(this._arNewCards[0]);
		this._arNewCards.shift();
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
	
	if(stateNow > -1){
		this.mixingCard.visible = this.bWait;
	}
	
	if(this.bWait){
		this.timeWait += diffTime;
		if(this.timeWait >= TIME_WAIT){
			this.timeWait = 0;
			var str = "";
			for (var i = 0; i < this.countWait; i++) {
				str += ".";
			}
			this.tfStatus.setText("Wait"+str);
			this.countWait ++;
			if(this.countWait > 3){
				this.countWait = 0;
			}
		}
	}
	
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
	
	if(item_mc.name == "btnDeal"){
		var curBet = betEth/1000000000000000000;
		if(betEth >= minBet && obj_game["balanceBank"] >= curBet*5){
			item_mc.alpha = 0.5;
			this.btnClear.alpha = 0.5;
			this.bWait = true;
			this.showChips(false);
			if(options_debug){
				stateNow = S_IN_PROGRESS;
				obj_game["balance"] -= curBet;
				this.tfBalance.setText(obj_game["balance"]);
				this.startGame = true;
				this.countPlayerCard = 2;
				this.countHouseCard = 1;
				this.countPlayerSplitCard = 0;
				this.addPlayerCard();
				this.addHouseCard();
				this.showButtons(true);
			} else {
				this.startGameEth();
			}
		} else {
			var curBet = betEth/1000000000000000000;			
			if(obj_game["balanceBank"] < curBet*2.5){
				console.log("balanceBank:", obj_game["balanceBank"]);
				obj_game["game"].showError(ERROR_BANK);
				obj_game["game"].clearBet();
				obj_game["game"].bWait = false;
				obj_game["game"].showChips(true);
			}
		}
	} else if(item_mc.name == "btnSmart"){
		this.showSmartContract();
	} else if(item_mc.name == "btnDao"){
		this.removeAllListener();
		var url = "https://platform.dao.casino/";
		window.open(url, "_self");
	} else if(item_mc.name == "btnHit"){
		this.clickHit();
	} else if(item_mc.name == "btnStand"){
		this.clickStand();
	} else if(item_mc.name == "btnSplit"){
		this.clickSplit();
	} else if(item_mc.name == "btnDouble"){
		this.clickDouble();
	} else if(item_mc.name.search("chip") != -1){
		this.clickChip(item_mc);
	} else if(item_mc.name == "btnShare"){
		this.shareFB();
	} else if(item_mc.name == "btnTweet"){
		this.shareTwitter();
	} else if(item_mc.name == "btnClearBets"){
		this.clearBet();
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
		item_mc.visible && item_mc.dead != true && item_mc.disabled != true &&
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