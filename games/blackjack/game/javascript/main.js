var _W = 1920;
var _H = 1080;
var version = "v. 1.0.46"
var login_obj = {};
var dataAnima = [];
var dataMovie = [];
var openkey, privkey, mainet;
var currentScreen, scrContainer;
var ScreenMenu, ScreenGame, ScreenLevels, ScreenTest;
var LoadPercent = null;
var renderer, stage, preloader; // pixi;
var sprites_loaded = false;
var infura, soundManager, ks, passwordUser, sendingAddr;
var fontMain = "Arial";
var fontDigital = "Digital-7";
var stats; //для вывода статистики справа
var valToken = 100000000; // 1 token
var rndBg = String(Math.ceil(Math.random()*2));
var abi = [{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"requestInsurance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"}],"name":"setTokenAddress","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"hit","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amountInWei","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getBank","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"stand","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"deal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"split","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"double","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"deckAddress","type":"address"},{"name":"storageAddress","type":"address"},{"name":"tokenAddress","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_type","type":"uint8"},{"indexed":false,"name":"_card","type":"uint8"}],"name":"Deal","type":"event"}]
// main
var addressStorage = " ";
var addressContract = "0xa65d59708838581520511d98fb8b5d1f76a96cad";
// testrpc
var	addressRpcErc = "0x2a7f64d8379edadb4f24cf64edea0dbdee0bc3bb";
var	addressRpcStorage = "0xed76008c2c30b2e43a578de5009310334186e2e4";
var	addressRpcContract = "0x2e9c5a28a1946d66d0a558c1f9750d7e851bda03";
// testnet
var addressTestErc = "0x95a48dca999c89e4e284930d9b9af973a7481287"; // 0x95a48dca999c89e4e284930d9b9af973a7481287 !!!
var	addressTestStorage = "0x44bf6a32c345da54973041dbe29bdcc925b846b5";
var	addressTestContract = "0xf8ad91da73d34a74b347a5eb5f58727718534599";

var addressCurErc = "";

var options_debug = false;
var options_test = false;
var options_ethereum = true;
var options_mainet = false;
var options_testnet = false;
var options_rpc = false;
var options_music = true;
var options_sound = true;
var options_mobile = true;
var options_pause = false;
var options_txt_offset = 0;

var ERROR_KEYTHEREUM = 1;
var ERROR_BUF = 2;
var ERROR_KEY = 3;
var ERROR_BANK = 4;
var ERROR_CONTRACT = 5;
var ERROR_BALANCE = 6;
var ERROR_DEAL = 7;
var ERROR_MAX_BET = 8;

if(options_rpc){
	addressCurErc = addressRpcErc;
} else {
	addressCurErc = addressTestErc;
}

var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) { return window.setTimeout(callback, 1000 / 60); };
	
function initGame() {
	if(window.orientation == undefined){
		options_mobile = false;
	} else {
		options_mobile = true;
		options_orientation = window.orientation;
	}
	
    var ua = navigator.userAgent;
    if (ua.search(/Safari/) > -1) {
        options_browser = "safari";
    }
	
	if(typeof console === "undefined"){ console = {}; }
	
    //initialize the stage
    renderer = PIXI.autoDetectRenderer(_W, _H);
    stage = new PIXI.Container();
    document.body.appendChild(renderer.view);
    preloader = new PIXI.loaders.Loader();

    window.addEventListener("resize", onResize, false);
	
	startTime = getTimer();
    onResize();
    update();
	
	var font1 = addText("font1", 16, "#000000")
	font1.x = _W/2;
	font1.y = -100;
	stage.addChild(font1);
	var font2 = addText("font2", 16, "#000000", undefined, "center", 200, 2)
	font2.x = _W/2;
	font2.y = -120;
	stage.addChild(font2);
	
	// soundManager = new SoundManager();
	// soundManager.currentMusic = "none";
	
	LoadBack = new PIXI.Container();
	stage.addChild(LoadBack);
	scrContainer = new PIXI.Container();
	stage.addChild(scrContainer);
	
	var preload_image = document.createElement("img");
	preload_image.src = "images/bg/bgMenu.jpg";
	preload_image.onload = function() {
		var bgLoading = new PIXI.Sprite.fromImage(preload_image.src);
		bgLoading.texture.baseTexture.on('loaded', 
				function(){
					var scaleBack = _W/bgLoading.width;
					bgLoading.scale.x = scaleBack;
					bgLoading.scale.y = scaleBack;
					bgLoading.x = _W/2 - bgLoading.width/2;
					bgLoading.y = _H/2 - bgLoading.height/2;
				});
		LoadBack.addChild(bgLoading);
		var w = 400;
		LoadPercent = addText("Game loading", 30, "#FFFFFF", "#000000", "center", w, 2.5);
		LoadPercent.x = _W/2;
		LoadPercent.y = _H/2 + 120;
		LoadBack.addChild(LoadPercent);
		var tfVersion = addText(version, 16, "#000000", undefined, "right", 400)
		tfVersion.x = _W-20;
		tfVersion.y = _H-24;
		LoadBack.addChild(tfVersion);
	};
	
	loadManifest();
}

function loadManifest(){
	preloader = new PIXI.loaders.Loader();
	
	preloader.add("bgMenu", "images/bg/bgMenu.jpg");
	preloader.add("bgGame1", "images/bg/bgGame1.jpg");
	preloader.add("bgGame2", "images/bg/bgGame2.jpg");
	preloader.add("wndInfo", "images/bg/wndInfo.png");
	
	preloader.add("images/texture/ItemsTexure.json");
	
	//сохраняем счетчик кол-ва файлов для загрузки
	preloader.on("progress", handleProgress);
	preloader.load(handleComplete);
}

function spritesLoad() {
	if(sprites_loaded){
		return true;
	}
	sprites_loaded = true;
	
	var img, data;
	
	// var base = PIXI.utils.TextureCache["images/icons.png"];
	// var texture0 = new PIXI.Texture(base);
	// texture0.frame = new PIXI.Rectangle(0, 0, 100, 100);
	// var texture1 = new PIXI.Texture(base);
	// texture1.frame = new PIXI.Rectangle(100, 0, 100, 100);
	// var texture2 = new PIXI.Texture(base);
	// texture2.frame = new PIXI.Rectangle(200, 0, 100, 100);
	// data = [texture0, texture1, texture2];
	// dataMovie["icons"] = data;
}

function textureLoad() {
	if(!options_test){
		// iniSet("images/texture/AnimaTexture.json");
		iniSetArt("images/texture/ItemsTexure.json");
	}
}

function iniSet(set_name) {
	var json = preloader.resources[set_name]
	if(json){}else{
		console.log("ERROR: " + set_name + " is undefined");
		return;
	}
	json = json.data;
	
	var jFrames = json.frames;
	var data = preloader.resources[set_name].textures; 
	var dataTexture = [];
	var animOld = "";
	// console.log("set_name:", set_name);
	
	if(data && jFrames){
		for (var namePng in jFrames) {
			var index = namePng.indexOf(".png");
			var nameFrame = namePng;
			if (index > 1) {
				nameFrame = namePng.slice(0, index);
			}
			// console.log("nameFrame:", nameFrame, index2);
			
			var index2 = nameFrame.indexOf("/");
			if (index2 > 1) {
				var type = nameFrame.slice(0, index2); // тип анимации
				var anim = type; // имя сета
				if(anim != animOld){
					animOld = anim;
					dataTexture[anim] = [];
				}
				dataTexture[anim].push(PIXI.Texture.fromFrame(namePng));
				// console.log(nameFrame + ": ", anim, namePng);
			}
		}
		
		for (var name in dataTexture) {
			var arrayFrames = dataTexture[name]; // какие кадры используются в сети
			dataMovie[name] = arrayFrames;
			// console.log(name + ": ", arrayFrames);
			// console.log(name);
		}
	}
}

function iniSetArt(set_name) {	
	var json = preloader.resources[set_name]
	if(json){}else{
		console.log("ERROR: " + set_name + " is undefined");
		return;
	}
	json = json.data;
	
	var frames = json.frames;
	var data = preloader.resources[set_name].textures; 
	// console.log("set_name:", set_name);
	
	if(data && frames){
		for (var namePng in frames) {
			var index = namePng.indexOf(".png");
			var nameFrame = namePng;
			if (index > 1) {
				nameFrame = namePng.slice(0, index);
			}
			dataAnima[nameFrame] = data[namePng];
			// console.log("nameFrame:", nameFrame);
		}
	}
}

function handleProgress(){
	var percent = Math.ceil(preloader.progress)
	if(LoadPercent){
		LoadPercent.setText("Game loading: " + percent + "%");
	}
}

function handleComplete(evt) {
	loadData();
	spritesLoad();
	textureLoad();
    onResize();
	
	if(document.location.hash == "#testnet"){
		options_testnet = true;
	}
	if(mainet){
		if(mainet == "on"){
			options_mainet = true;
		} else {
			options_mainet = false;
		}
	} else {
		options_mainet = false;
	}
	options_testnet = !options_mainet;
	if(options_testnet){
		version = version + " testnet"
	}
	
	infura = new Infura();
	
	start();
}

function getTimer(){
	var d = new Date();
	var n = d.getTime();
	return n;
}

function refreshTime(){
	startTime = getTimer();
	if(currentScreen){
		if(ScreenGame){
			ScreenGame.resetTimer();
		}
	}
}

function get_normal_time(ms){
	if (ms<0) {
		return "00:00";
	}
	var s = Math.round(ms/1000);
	var m = Math.floor(s / 60);
	s = s - m * 60;
	var tS = String(s);
	var tM = String(m);
	
	if (s<10 && s>=0) {
		tS = "0" + String(s);
	}
	if (m<10 && m>=0) {
		tM = "0" + String(m);
	}
	return tM + ":" + tS;
}

/*
* value - Дробное число.
* precision - Количество знаков после запятой.
*/
function toFixed(value, precision){
	precision = Math.pow(10, precision);
	return Math.round(value * precision) / precision;
}

function numToHex(num) {
	return num.toString(16);
}
function hexToNum(str) {
	return parseInt(str, 16);
}
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
function copyToClipboard(value) {
  window.prompt("Copy to clipboard: Ctrl+C", value);
}

function removeAllScreens() {
	if(ScreenGame){
		scrContainer.removeChild(ScreenGame);
		ScreenGame = null;
	}
	if(ScreenLevels){
		scrContainer.removeChild(ScreenLevels);
		ScreenLevels = null;
	}
	if(ScreenMenu){
		scrContainer.removeChild(ScreenMenu);
		ScreenMenu = null;
	}
	if(currentScreen){
		scrContainer.removeChild(currentScreen);
		currentScreen = null;
	}
}

function update() {
	if(ScreenGame){
		ScreenGame.update();
	}
	
	requestAnimationFrame(update);
	renderer.render(stage);
}

function saveData() {
	if(isLocalStorageAvailable()){
		var login_str = JSON.stringify(login_obj);
		localStorage.setItem('daocasino_blackjack', login_str);
		localStorage.setItem('options_music', options_music);
		localStorage.setItem('options_sound', options_sound);
		// console.log("Saving: ok!");
	}
}

function loadData() {
	if(isLocalStorageAvailable()){
		if(options_rpc){
			// openkey = "0xeaab5b73c8092a4395ef4bb2c815a29de4dc6b3d";
			// privkey = "845d3cca6be851f4d4da2c1be30ce36bd3122817b6de80bc5c03d81ea0b59fb1";
			openkey = "0xf1f42f995046e67b79dd5ebafd224ce964740da3";
			privkey = "d3b6b98613ce7bd4636c5c98cc17afb0403d690f9c2b646726e08334583de101";
		} else {
			openkey = localStorage.getItem('openkey')
			privkey = localStorage.getItem('privkey')
		}
		mainet = localStorage.getItem('mainnet')
		sendingAddr = openkey.substr(2);
		var keystore = localStorage.getItem('keystore');
		if(keystore){
			ks = lightwallet.keystore.deserialize(keystore);
		}
		if (localStorage.getItem('daocasino_blackjack')){
			var login_str = localStorage.getItem('daocasino_blackjack')
			login_obj = JSON.parse(login_str);
			options_music = localStorage.getItem('options_music')=='true';
			options_sound = localStorage.getItem('options_sound')=='true';
			checkData();
			// console.log("Loading: ok!");
		} else {
			checkData();
			// console.log("Loading: fail!");
		}
	}
}

function checkData() {
	
}

function resetData() {
	login_obj = {};
	saveData();
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
		console.log("localStorage_failed:",e);
        return false;
    }
}

function getArTh(objData, thId) {
    var array = [];
	if(objData.result == undefined){
		return undefined;
	}
    var mainObj = objData.result;
    for (var i = 0; i < objData.result.length; i++){
        var obj = objData.result[i];
        if(thId == obj.transactionHash){
			console.log(i, obj)
            array.push(obj.transactionHash);
        }
    }
    
    return array;
}

function parseData(objData) {
    var arGame = [];
    var thId = ""
	var len = objData.result.length;
	var index = 0;
	if(len > 5){
		index = len-5;
	}
    for (var i = index; i < len; i++){
        var obj = objData.result[i];
        if(thId != obj.transactionHash){
            thId = obj.transactionHash;
            var ar = getArTh(objData, thId);
			if(ar){
				arGame[thId] = ar;
			}
        }
    }
}

function removeSelf(obj) {
	if (obj) {
		if (obj.parent.contains(obj)) {
			obj.parent.removeChild(obj);
		}
	}
}

function start() {
	if(LoadBack){
		stage.removeChild(LoadBack);
	}
	addScreen("menu");
}

function showMenu() {
	addScreen("menu");
}
function showGame() {
	addScreen("game");
}
function showLevels() {
	addScreen("levels");
}
function showTest() {
	addScreen("test");
}
function showHome() {
	var url = "/";
	window.open(url, "_self"); // "_blank",  "_self"
}

function addScreen(name) {
	removeAllScreens();
	
	if(name == "game"){
		ScreenGame = new ScrGame();
		scrContainer.addChild(ScreenGame);
		currentScreen = ScreenGame;
	} else if(name == "menu"){
		ScreenMenu = new ScrMenu();
		scrContainer.addChild(ScreenMenu);
		currentScreen = ScreenMenu;
	} else if(name == "levels"){
		ScreenLevels = new ScrLevels();
		scrContainer.addChild(ScreenLevels);
		currentScreen = ScreenLevels;
	} else if(name == "test"){
		ScreenTest = new ScrTest();
		scrContainer.addChild(ScreenTest);
		currentScreen = ScreenTest;
	}
	currentScreen.name = name;
}

function addButton(name, _x, _y, _scGr, _scaleX, _scaleY) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	var obj = new PIXI.Container();
	
	var objImg = null;
	obj.setImg = function(name){
		objImg = addObj(name);
		obj.addChild(objImg);
		obj.over = addObj(name + "Over");
		if(obj.over){
			obj.over.visible = false;
			obj.addChild(obj.over);
		} else {
			obj.over = null;
		}
		obj.lock = addObj(name + "Lock");
		if(obj.lock){
			obj.lock.visible = false;
			obj.addChild(obj.lock);
		} else {
			obj.lock = null;
		}
		
		obj.sc = _scGr;
		obj.scale.x = _scGr*_scaleX;
		obj.scale.y = _scGr*_scaleY;
		obj.vX = _scaleX;
		obj.vY = _scaleY;
		obj.x = _x;
		obj.y = _y;
		obj.w = objImg.width*_scGr;
		obj.h = objImg.height*_scGr;
		obj.r = obj.w/2;
		obj.rr = obj.r*obj.r;
		obj.name = name;
		obj._selected = false;
		if(obj.w < 50){
			obj.w = 50;
		}
		if(obj.h < 50){
			obj.h = 50;
		}
	}
	
	obj.setImg(name);
	
	return obj;
}

function addButton2(name, _x, _y, _scGr, _scaleX, _scaleY) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	var obj = new PIXI.Container();
	
	var data = preloader.resources[name];
	var objImg = null;
	if(data){
		objImg = new PIXI.Sprite(data.texture);
		objImg.anchor.x = 0.5;
		objImg.anchor.y = 0.5;
		obj.addChild(objImg);
	} else {
		return null;
	}
	
	data = preloader.resources[name + "Over"];
	if(data){
		obj.over = new PIXI.Sprite(data.texture);
		obj.over.anchor.x = 0.5;
		obj.over.anchor.y = 0.5;
		obj.over.visible = false;
		obj.addChild(obj.over);
	} else {
		obj.over = null;
	}
	
	data = preloader.resources[name + "Lock"];
	if(data){
		obj.lock = new PIXI.Sprite(data.texture);
		obj.lock.anchor.x = 0.5;
		obj.lock.anchor.y = 0.5;
		obj.lock.visible = false;
		obj.addChild(obj.lock);
	} else {
		obj.lock = null;
	}
	obj.sc = _scGr;
	obj.scale.x = _scGr*_scaleX;
	obj.scale.y = _scGr*_scaleY;
	obj.vX = _scaleX;
	obj.vY = _scaleY;
	obj.x = _x;
	obj.y = _y;
	obj.w = objImg.width*_scGr;
	obj.h = objImg.height*_scGr;
	obj.r = obj.w/2;
	obj.rr = obj.r*obj.r;
	obj.name = name;
	obj._selected = false;
	if(obj.w < 50){
		obj.w = 50;
	}
	if(obj.h < 50){
		obj.h = 50;
	}
	
	return obj;
}

function addObj(name, _x, _y, _scGr, _scaleX, _scaleY, _anchor) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	if(_anchor){}else{_anchor = 0.5};
	var obj = new PIXI.Container();
	obj.scale.x = _scGr*_scaleX;
	obj.scale.y = _scGr*_scaleY;
	
	var objImg = null;
	if(dataAnima[name]){
		objImg = new PIXI.Sprite(dataAnima[name]);
	} else if(dataMovie[name]){
		objImg = new PIXI.extras.MovieClip(dataMovie[name]);
		objImg.stop();
	}else{
		var data = preloader.resources[name];
		if(data){
			objImg = new PIXI.Sprite(data.texture);
		} else {
			return null;
		}
	}
	obj.sc = _scGr;
	objImg.anchor.x = _anchor;
	objImg.anchor.y = _anchor;
	obj.w = objImg.width*obj.scale.x;
	obj.h = objImg.height*obj.scale.y;
	obj.addChild(objImg);
	obj.x = _x;
	obj.y = _y;
	obj.name = name;
	obj.img = objImg;
	obj.r = obj.w/2;
	obj.rr = obj.r*obj.r;
    //установим точку регистрации в 0 0
    obj.setReg0 = function () {
        objImg.anchor.x = 0;
        objImg.anchor.y = 0;
    }
    obj.setRegX = function (procx) {
        objImg.anchor.x = procx;
    }
    obj.setRegY = function (procy) {
        objImg.anchor.y = procy;
    }
	
	return obj;
}

function addText(text, size, color, glow, _align, width, px, font){
	if(size){}else{size = 24};
	if(color){}else{color = "#FFFFFF"};
	if(glow){}else{glow = undefined};
	if(_align){}else{_align = "center"};
	if(width){}else{width = 600};
	if(px){}else{px = 2};
	if(font){}else{font = fontMain};
	
	var style;
	
	if(glow){
		style = {
			font : size + "px " + font,
			fill : color,
			align : _align,
			stroke : glow,
			strokeThickness : px,
			wordWrap : true,
			wordWrapWidth : width
		};
	} else {
		style = {
			font : size + "px " + font,
			fill : color,
			align : _align,
			wordWrap : true,
			wordWrapWidth : width
		};
	}
	
	var obj = new PIXI.Container();
	
	var tfMain = new PIXI.Text(text, style);
	tfMain.y = options_txt_offset;
	obj.addChild(tfMain);
	if(_align == "left"){
		tfMain.x = 0;
	} else if(_align == "right"){
		tfMain.x = -tfMain.width;
	} else {
		tfMain.x = - tfMain.width/2;
	}
	
	obj.width = Math.ceil(tfMain.width);
	obj.height = Math.ceil(tfMain.height);
	
	obj.setText = function(value){
		tfMain.text = value;
		if(_align == "left"){
			tfMain.x = 0;
		} else if(_align == "right"){
			tfMain.x = -tfMain.width;
		} else {
			tfMain.x = - tfMain.width/2;
		}
	}
	
	obj.getText = function(){
		return tfMain.text;
	}
	
	return obj;
}

function addWinLevel(id){
	var levels = getLevels();
	levels[id] = true;
}

function resetLevels(){
	login_obj["levels"] = {};
}

function getLevels(){
	if(login_obj["levels"]){}else{
		login_obj["levels"] = {};
	}
	
	return login_obj["levels"];
}

function initjiggle(t, startvalue, finishvalue, div, step){
	if(startvalue){}else{startvalue = 2};
	if(finishvalue){}else{finishvalue = 1};
	if(div){}else{div =  0.7};
	if(step){}else{step =  0.5};
	
	t.scale.x = startvalue
	t.scale.y = t.scale.x
	t.jska = finishvalue
	t.jdx = 0
	t.jdv = div
	t.jdvstep = step
}

function jiggle(t){
	t.jdx = t.jdx * t.jdvstep + (t.jska - t.scale.x) * t.jdv
	t.scale.x = Math.max(0.1, t.scale.x + t.jdx)
	t.scale.y = t.scale.x
}


function convertToken(value){
	var val = value/valToken;
	return val;
}
function rad(qdeg){
	return qdeg * (Math.PI / 180);
}
function deg(qrad){
	return qrad * (180 / Math.PI);
}
function get_dd(p1, p2) {
	var dx=p2.x-p1.x;
	var dy=p2.y-p1.y;
	return dx*dx+dy*dy;
}
function getDD(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	return dx*dx+dy*dy;
}
function hit_test(mc,rr,tx,ty) {
	var dx = mc.x - tx;
	var dy = mc.y - ty;
	var dd = dx*dx+dy*dy;
	if(dd<rr){
		return true
	}
	return false
}
function hit_test_rec(mc, w, h, tx, ty) {
	if(tx>mc.x-w/2 && tx<mc.x+w/2){
		if(ty>mc.y-h/2 && ty<mc.y+h/2){
			return true;
		}
	}
	return false;
}
function hitTestObject(mc1, mc2) {
	if (mc1.x < mc2.x + mc2.w &&
	   mc1.x + mc1.w > mc2.x &&
	   mc1.y < mc2.y + mc2.h &&
	   mc1.h + mc1.y > mc2.y) {
		return true;
	}
	return false;
}
function intersects(a, b) {
  return ( a.y1 < b.y2 || a.y2 > b.y1 || a.x2 < b.x1 || a.x1 > b.x2 );
}


function visGame() {
	//play
	options_pause = false;
	refreshTime();
}

function hideGame() {
	//pause
	options_pause = true;
	// music_stop();
	refreshTime();
}

visibly.onVisible(visGame)
visibly.onHidden(hideGame)
