function ItemLevel() {
	PIXI.Container.call( this );
	this.init();
}

ItemLevel.prototype = Object.create(PIXI.Container.prototype);
ItemLevel.prototype.constructor = ItemLevel;


ItemLevel.prototype.init = function() {
	this._arButtons = [];
	this.id = 0;
	this.lock = true;
	
	this.bg = addObj("itemLevel");
	this.addChild(this.bg);
	this.preview = new PIXI.Container();
	this.addChild(this.preview);
	this.rect = new PIXI.Graphics();
	this.rect.beginFill(0x000000, 0.5).drawRect(-90, -58, 180, 117).endFill();
	this.addChild(this.rect);
	this.icoLock = addObj("itemLock", 0, 20);
	this.addChild(this.icoLock);
	
	this.tfNum = addText("", 30, "#FFFFFF", "#000000", "center", 120, 4)
	this.tfNum.y = 0;
	this.addChild(this.tfNum);
	
	this.w = this.bg.w;
	this.h = this.bg.h;
	this.name = this.bg.name;
	this._selected = false;
}

ItemLevel.prototype.setId = function(id, value) {
	this.id = id;
	this.lock = value;
	this.icoLock.visible = value;
	this.rect.visible = value;
	this.tfNum.visible = !value;
	this.tfNum.setText(id);
	
	var img = addObj("bgLevel"+id);
	if(img){
		img.width = 174;
		img.height = 110;
		img.x = -3;
		img.y = -2;
		this.preview.addChild(img);
		
		var strW = "Win Odds: " + toFixed(betslevel[id].win, 4) + "%"
		var wOdd = addText(strW, 16, "#FFFFFF", "#000000", "center", 180, 2)
		wOdd.y = -50;
		this.addChild(wOdd);
		var strX = "Multiplier: x" + betslevel[id].koef;
		var tfMult = addText(strX, 16, "#FFFFFF", "#000000", "center", 180, 2)
		tfMult.y = -25;
		this.addChild(tfMult);
		
	} else {
		var tfNum = addText("Coming soon", 22, "#FFFFFF", "#000000", "center", 180, 2)
		tfNum.y = -40;
		this.addChild(tfNum);
	}
}