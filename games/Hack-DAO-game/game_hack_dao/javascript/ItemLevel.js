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
	
	this.betslevel = [];
	this.betslevel[1] = {win:90, koef:1.09};
	this.betslevel[2] = {win:80, koef:1.20};
	this.betslevel[3] = {win:70, koef:1.50};
	this.betslevel[4] = {win:60, koef:1.80};
	this.betslevel[5] = {win:50, koef:2.00};
	this.betslevel[6] = {win:40, koef:2.00};
	this.betslevel[7] = {win:30, koef:2.50};
	this.betslevel[8] = {win:20, koef:3.30};
	this.betslevel[9] = {win:10, koef:5.00};
	
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
		
		var strW = "Win Odds: " + this.betslevel[id].win + "%"
		var wOdd = addText(strW, 20, "#FFFFFF", "#000000", "center", 180, 2)
		wOdd.y = -50;
		this.addChild(wOdd);
		var strX = "Multiplier: x" + this.betslevel[id].koef;
		var tfMult = addText(strX, 16, "#FFFFFF", "#000000", "center", 180, 2)
		tfMult.y = -25;
		this.addChild(tfMult);
		
	} else {
		var tfNum = addText("Coming soon", 22, "#FFFFFF", "#000000", "center", 180, 2)
		tfNum.y = -40;
		this.addChild(tfNum);
	}
}