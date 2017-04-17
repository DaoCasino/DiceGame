function ItemTicket(_prnt) {
	PIXI.Container.call( this );
	this.init(_prnt);
}

ItemTicket.prototype = Object.create(PIXI.Container.prototype);
ItemTicket.prototype.constructor = ItemTicket;

var MAX_WHITE = 5;
var MAX_RED = 1;
// 435352, 100
ItemTicket.prototype.init = function(_prnt) {
	this._prnt = _prnt;
	this._arButtons = [];
	this._arWhite = [];
	this._arRed = [];
	this.countWhite = 0;
	this.countRed = 0;
	
	this.initArt();

	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ItemTicket.prototype.initArt = function() {
	var bgTicket = addObj("bgTicket");
	this.addChild(bgTicket);
	
	var i = 0;
	var _x = 0;
	var _y = 0;
	var posX = 0;
	var posY = 0;
	for(i=0; i < 69; i++){
		_x = posX*30 - 75;
		_y = posY*30 - 240;
		this.addBtn("btnNW", i+1, _x, _y, this._arWhite);
		
		posX ++;
		if(posX%6==0){
			posX = 0;
			posY++;
		}
	}
	posX = 0;
	posY = 0;
	for(i=0; i < 26; i++){
		_x = posX*30 - 75;
		_y = posY*30 + 125;
		this.addBtn("btnNR", i+1, _x, _y, this._arRed);
		
		posX ++;
		if(posX%6==0){
			posX = 0;
			posY++;
		}
	}
}

ItemTicket.prototype.addBtn = function(_name, id, _x, _y, array) {
	var btn = new PIXI.Container();
	btn.main = addObj(_name+"_0001");
	btn.addChild(btn.main);
	btn.selected = addObj(_name+"_0003");
	btn.addChild(btn.selected);
	btn.over = addObj(_name+"_0002");
	btn.addChild(btn.over);
	btn.over.visible = btn.selected.visible = false;
	btn.name = _name;
	btn.id = id;
	btn.x = _x;
	btn.y = _y;
	this.addChild(btn);
	array.push(btn);
	this._arButtons.push(btn);
	btn.interactive = true;
	btn.buttonMode=true;
	
	var color = "#000000";
	if(_name=="btnNR"){
		// color = "#ffffff";
		color = "#724831";
	}
	
	var tfId = addText(String(id), 16, color)
	tfId.x = 0;
	tfId.y = -tfId.height/2;
	btn.addChild(tfId);
	
	btn._selected = false;
	btn.selectNumber = false;
	btn.w = btn.main.w;
	btn.h = btn.main.h;
}

ItemTicket.prototype.selectNumber = function(item_mc) {
	item_mc._selected = false;
	item_mc.over.visible = false;
	
	var bSel = false;
	if((item_mc.name  == "btnNR" && this.countRed < MAX_RED) ||
	(item_mc.name  == "btnNW" && this.countWhite < MAX_WHITE)){
		bSel = true;
	}
	
	if(bSel && !item_mc.selectNumber){
		item_mc.selectNumber = true;
		item_mc.main.visible = false;
		item_mc.selected.visible = true;
		if(item_mc.name == "btnNR"){
			this.countRed ++;
		} else {
			this.countWhite ++;
		}
	} else if(item_mc.selectNumber){
		item_mc.selectNumber = false;
		item_mc.main.visible = true;
		item_mc.selected.visible = false;
		if(item_mc.name == "btnNR"){
			this.countRed --;
		} else {
			this.countWhite --;
		}
	}
	
	this._prnt.checkBuy(this.countWhite, this.countRed);
}

ItemTicket.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x - this.x;
	var mouseY = evt.data.global.y - this.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY) &&
		item_mc.visible && item_mc.dead != true){
			if(item_mc._selected == false){
				item_mc._selected = true;
				if(item_mc.over && !item_mc.selectNumber){
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

ItemTicket.prototype.touchHandler = function(evt){
	var phase = evt.type;
	
	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	} else if (phase == 'mousedown' || phase == 'touchend') {
		for (var i = 0; i < this._arButtons.length; i++) {
			var item_mc = this._arButtons[i];
			if(item_mc._selected){
				this.selectNumber(item_mc);
				return;
			}
		}
	}
}

ItemTicket.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}