function ScrLevels() {
	PIXI.Container.call( this );
	this.init();
}

ScrLevels.prototype = Object.create(PIXI.Container.prototype);
ScrLevels.prototype.constructor = ScrLevels;


ScrLevels.prototype.init = function() {
	this._arButtons = [];
	
	this.bg = addObj("bgLevels", _W/2, _H/2);
	this.addChild(this.bg);
	
	var tfTitle = addText("Select Level", 50, "#FFEF0B", "#000000", "center", 400, 4)
	tfTitle.x = _W/2;
	tfTitle.y = 50;
	this.addChild(tfTitle);
	var tfVersion = addText(version, 16, "#000000", undefined, "right", 400)
	tfVersion.x = _W-20;
	tfVersion.y = _H-24;
	this.addChild(tfVersion);
	if(options_debug){
		var tfDebug = addText("Debug", 20, "#FF0000", "#000000", "right", 400)
		tfDebug.x = _W-20;
		tfDebug.y = 10;
		this.addChild(tfDebug);
	}
	
	this.createLevels();
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrLevels.prototype.createLevels = function() {
	var startX = 400;
	var startY = 250;
	var posX = 0;
	var posY = 0;
	var w = 800;
	var offsetX = 240;
	var offsetY = 160;
	var levels = getLevels();
	
	for (var i = 0; i < 9; i++) {
		var level = new ItemLevel(i+1);
		level.x = startX + posX*offsetX;
		level.y = startY + posY*offsetY;
		this.addChild(level);
		var lock = true;
		if(i == 0 || levels[i] || options_debug){
			lock = false;
		}
		
		level.setId(i+1, lock);
		this._arButtons.push(level);
		
		posX ++;
		if(posX%3 == 0){
			posX = 0;
			posY ++;
		}
	}
}

ScrLevels.prototype.clickCell = function(item_mc) {
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	
	if(item_mc.name == "itemLevel"){
		login_obj["level"] = item_mc.id;
		this.removeAllListener();
		showGame();
	}
}

ScrLevels.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x;
	var mouseY = evt.data.global.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY) &&
		item_mc.visible && item_mc.lock != true){
			if(item_mc._selected == false){
				item_mc._selected = true;
				if(item_mc.over){
					item_mc.over.visible = true;
				} else {
					item_mc.scale.x = 1.1;
					item_mc.scale.y = item_mc.scale.x;
				}
			}
		} else {
			if(item_mc._selected){
				item_mc._selected = false;
				if(item_mc.over){
					item_mc.over.visible = false;
				} else {
					item_mc.scale.x = 1;
					item_mc.scale.y = item_mc.scale.x;
				}
			}
		}
	}
}

ScrLevels.prototype.touchHandler = function(evt){
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

ScrLevels.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}