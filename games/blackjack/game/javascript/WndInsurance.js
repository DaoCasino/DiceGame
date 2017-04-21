function WndInsurance(_prnt) {
	PIXI.Container.call( this );
	this.init(_prnt);
}

WndInsurance.prototype = Object.create(PIXI.Container.prototype);
WndInsurance.prototype.constructor = WndInsurance;

WndInsurance.prototype.init = function(_prnt) {
	this._prnt = _prnt;
	this._callback = undefined;
	this._arButtons= [];
	
	var rect = new PIXI.Graphics();
	rect.beginFill(0x000000).drawRect(-_W/2, -_H/2, _W, _H).endFill();
	rect.alpha = 0.5;
	this.addChild(rect);
	
	var bg = addObj("wndInfo",0,0,0.3);
	this.addChild(bg);
	
	var btnClose = addButton2("btnClose", 230, -150, 0.5);
	this.addChild(btnClose);
	this._arButtons.push(btnClose);
	var btnOk = addButton2("btnGreen", 140, 100, 0.75);
	this.addChild(btnOk);
	this._arButtons.push(btnOk);
	var btnCancel = addButton2("btnRed", -140, 100, 0.75);
	this.addChild(btnCancel);
	this._arButtons.push(btnCancel);
	
	btnClose.interactive = true;
	btnClose.buttonMode=true;
	btnClose.overSc=true;
	btnOk.interactive = true;
	btnOk.buttonMode=true;
	btnOk.overSc=true;
	btnCancel.interactive = true;
	btnCancel.buttonMode=true;
	btnCancel.overSc=true;
	
	this.tf = addText("", 26, "#FFCC00", "#000000", "center", 500, 3)
	this.tf.y = -70;
	this.addChild(this.tf);
	var tfOk = addText("Yes", 26, "#FFFFFF", undefined, "center", 350)
	tfOk.y = - tfOk.height/2;
	btnOk.addChild(tfOk);
	var tfNo = addText("No", 26, "#FFFFFF", undefined, "center", 350)
	tfNo.y = - tfNo.height/2;
	btnCancel.addChild(tfNo);
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

WndInsurance.prototype.show = function(str, callback, addStr) {
	this._callback = callback;
	this.tf.setText(str);
}

WndInsurance.prototype.clickObj = function(item_mc) {
	// sound_play("button_click");
	var name = item_mc.name
	// console.log("clickObj:", name);
	item_mc._selected = false;
	if(item_mc.over){
		item_mc.over.visible = false;
	}
	if(item_mc.overSc){
		item_mc.scale.x = 1*item_mc.sc;
		item_mc.scale.y = 1*item_mc.sc;
	}
	this._prnt.closeWindow(this);
	
	if(name == "btnDefault"){
		if(this.btnGreen){
			this._callback();
		}
	}
}

WndInsurance.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x - this.x
	var mouseY = evt.data.global.y - this.y;
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY)){
			if(item_mc.visible && item_mc._selected == false){
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

WndInsurance.prototype.touchHandler = function(evt){	
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

WndInsurance.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}