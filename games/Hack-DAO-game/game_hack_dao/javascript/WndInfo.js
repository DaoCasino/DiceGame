function WndInfo(_prnt) {
	PIXI.Container.call( this );
	this.init(_prnt);
}

WndInfo.prototype = Object.create(PIXI.Container.prototype);
WndInfo.prototype.constructor = WndInfo;

WndInfo.prototype.init = function(_prnt) {
	this._prnt = _prnt;
	this._callback = undefined;
	this._arButtons= [];
	
	var rect = new PIXI.Graphics();
	rect.beginFill(0x000000).drawRect(-_W/2, -_H/2, _W, _H).endFill();
	rect.alpha = 0.5;
	this.addChild(rect);
	
	var bg = addObj("wndInfo");
	this.addChild(bg);
	
	var btnClose = addButton2("btnClose", 170, -90);
	this.addChild(btnClose);
	this._arButtons.push(btnClose);
	this.btnOk = addButton2("btnDefault", 0, 85);
	this.addChild(this.btnOk);
	this._arButtons.push(this.btnOk);
	
	this.tf = addText("", 26, "#FF7C2A", "#000000", "center", 350, 4, fontImpact)
	this.tf.y = -70;
	this.addChild(this.tf);
	this.tfBtn = addText("", 26, "#FFFFFF", "#000000", "center", 350)
	this.tfBtn.y = this.btnOk.y - 17;
	this.addChild(this.tfBtn);
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

WndInfo.prototype.show = function(str, callback, addStr) {
	if(addStr){}else{addStr=""};
	if(callback){
		this._callback = callback
	}else{
		this._callback = undefined;
	};
	
	if(callback){
		this.btnOk.visible = true;
	} else {
		this.btnOk.visible = false;
	}
	
	this.tf.setText(str);
	this.tfBtn.setText(addStr);
}

WndInfo.prototype.clickObj = function(item_mc) {
	// sound_play("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	this._prnt.closeWindow(this);
	
	if(name == "btnDefault"){
		if(this._callback){
			this._callback();
		}
	}
}

WndInfo.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x - this.x
	var mouseY = evt.data.global.y - this.y;
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY)){
			if(item_mc.visible && item_mc._selected == false){
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

WndInfo.prototype.touchHandler = function(evt){	
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

WndInfo.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}