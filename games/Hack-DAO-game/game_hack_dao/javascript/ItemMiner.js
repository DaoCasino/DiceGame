function ItemMiner() {
	PIXI.Container.call( this );
	this.init();
}

ItemMiner.prototype = Object.create(PIXI.Container.prototype);
ItemMiner.prototype.constructor = ItemMiner;

ItemMiner.prototype.init = function() {
	this.name = "itemMiner";
	this.act = "Run";
	this.idMark = 1;
	this.wMax = 103;
	this.hMax = 125;
	this.w = this.wMax;
	this.h = this.hMax;
	this.dead = false;
	
	this.sprite = new PIXI.Container();
	this.addChild(this.sprite);
	
	this.body = addObj("minerRun");
	this.body.x = 0;
	this.body.img.play();
	this.body.img.animationSpeed = 0.5;
	this.sprite.addChild(this.body);
	
	this.zone = new PIXI.Graphics();
    this.zone.beginFill(0xCC0000).drawRect(-this.w/2, -this.h, this.w, this.h).endFill();
	this.zone.alpha = 0.5;
	this.zone.visible = false;
    this.addChild(this.zone);
	
	this.sprite.y = -this.h/2
}

ItemMiner.prototype.setScaleX = function(scX) {
	this.sprite.scale.x = scX*Math.abs(this.sprite.scale.x);
}

ItemMiner.prototype.setScale = function(sc) {
	this.sprite.scale.x = sc;
	this.sprite.scale.y = sc;
	this.zone.scale.x = sc;
	this.zone.scale.y = sc;
	this.w = this.wMax*sc;
	this.h = this.hMax*sc;
	this.sprite.y = -this.h/2
}

ItemMiner.prototype.setAct = function(act) {
	if(this.act == act){
		return false;
	}
	this.act = act;
}