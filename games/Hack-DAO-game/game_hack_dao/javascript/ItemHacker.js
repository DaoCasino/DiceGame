function ItemHacker() {
	PIXI.Container.call( this );
	this.init();
}

ItemHacker.prototype = Object.create(PIXI.Container.prototype);
ItemHacker.prototype.constructor = ItemHacker;

ItemHacker.prototype.init = function() {
	this.name = "itemHacker";
	this.color = "Black";
	this.act = "Run";
	this.w = 120*1.5;
	this.h = 170*1.5;
	this.healthMax = 80;
	this.health = this.healthMax;
	this.dead = false;
	
	this.sprite = new PIXI.Container();
	this.addChild(this.sprite);
	this.item = new PIXI.Container();
	this.sprite.addChild(this.item);
	
	var bag = addObj("bagMoney", 26, 30);
	this.sprite.addChild(bag);
	this.legL = addObj("legRun", -37, 104, 0.6, 1.5);
	this.sprite.addChild(this.legL);
	this.legL.img.play();
	this.legL.img.animationSpeed = 0.5;
	this.legR = addObj("legRun", 16, 104, 0.6, -1.5);
	this.sprite.addChild(this.legR);
	this.legR.img.gotoAndPlay(8);
	this.legR.img.animationSpeed = 0.5;
	var bodyX = 0;
	var bodyY = 14;
	this.body = addObj("itemBodyBlack", bodyX, bodyY);
	this.item.addChild(this.body);
	var headX = 0;
	var headY = -13;
	this.head = addObj("itemHeadMiner", headX, headY);
	this.sprite.addChild(this.head);
	this.sign = addText("H", 30, "#FFFFFF", undefined, "center", 50, 1, fontTahoma)
	this.sign.x = 8;
	this.sign.y = -8;
	this.addChild(this.sign);
	
	var w = 100
	var h = 10
	this.barDao = new PIXI.Container();
	this.barDao.x = - w/2
	this.barDao.y = - 50
    this.addChild(this.barDao);
	var bg = new PIXI.Graphics();
    bg.beginFill(0x0000000).drawRect(-2, -2, w+4, h+4).endFill();
    this.barDao.addChild(bg);
	var life = new PIXI.Graphics();
    life.beginFill(0xff00000).drawRect(0, 0, w, h).endFill();
    this.barDao.addChild(life);
	this.barDao.life = life;
	this.barDao.w = w;
	this.barDao.h = h;
	
	
	this.zone = new PIXI.Graphics();
    this.zone.beginFill(0xCC0000).drawRect(-this.w/2, -this.h/2, this.w, this.h).endFill();
	this.zone.alpha = 0.5;
	this.zone.visible = false;
    this.addChild(this.zone);
}

ItemHacker.prototype.setScaleX = function(scX) {
	this.sprite.scale.x = scX*Math.abs(this.sprite.scale.x);
	if(this.act == "Run"){
		if(scX == 1){
			this.sign.x = -8*this.sign.scale.x;
			this.barDao.x = 50*this.barDao.scale.x;
		} else {
			this.sign.x = 8*this.sign.scale.x;
			this.barDao.x = -50*this.barDao.scale.x;
		}
	}
}

ItemHacker.prototype.setScale = function(sc) {
	this.sprite.scale.x = sc;
	this.sprite.scale.y = sc;
	this.sign.scale.x = sc;
	this.sign.scale.y = sc;
	this.barDao.scale.x = sc;
	this.barDao.scale.y = sc;
	this.zone.scale.x = sc;
	this.zone.scale.y = sc;
	this.w = this.w*sc;
	this.h = this.h*sc;
}

ItemHacker.prototype.setAct = function(act) {
	if(this.act == act){
		return false;
	}
	this.act = act
}

ItemHacker.prototype.refreshHealth = function() {
	var curSc = this.health/this.healthMax;
	curSc = Math.max(curSc, 0.01);
	this.barDao.life.scale.x = Math.min(curSc, 1);
}