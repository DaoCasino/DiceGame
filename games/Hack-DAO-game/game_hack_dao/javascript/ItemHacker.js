function ItemHacker() {
	PIXI.Container.call( this );
	this.init();
}

ItemHacker.prototype = Object.create(PIXI.Container.prototype);
ItemHacker.prototype.constructor = ItemHacker;

ItemHacker.prototype.init = function() {
	this.name = "itemHacker";
	this.act = "Run";
	this.idMark = 1;
	this.wMax = 107;
	this.hMax = 156;
	this.w = this.wMax;
	this.h = this.hMax;
	this.healthMax = 80;
	this.health = this.healthMax;
	this.dead = false;
	
	this.sprite = new PIXI.Container();
	this.addChild(this.sprite);
	
	this.body = addObj("hackerRun");
	this.body.x = -10;
	this.body.img.play();
	this.body.img.animationSpeed = 0.5;
	this.sprite.addChild(this.body);
	
	var w = 100
	var h = 10
	this.barDao = new PIXI.Container();
	this.barDao.x = - w/2+20
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
}

ItemHacker.prototype.setScale = function(sc) {
	this.sprite.scale.x = sc;
	this.sprite.scale.y = sc;
	this.barDao.scale.x = sc;
	this.barDao.scale.y = sc;
	this.zone.scale.x = sc;
	this.zone.scale.y = sc;
	this.w = this.wMax*sc;
	this.h = this.hMax*sc;
}

ItemHacker.prototype.setAct = function(act) {
	if(this.act == act){
		return false;
	}
	this.act = act
	if(this.body){
		this.sprite.removeChild(this.body);
	}
	this.body = addObj(act);
	if(this.body){
		this.body.x = -10;
		this.body.img.play();
		this.body.img.animationSpeed = 0.5;
		this.sprite.addChild(this.body);
	}
}

ItemHacker.prototype.refreshHealth = function() {
	var curSc = this.health/this.healthMax;
	curSc = Math.max(curSc, 0.01);
	this.barDao.life.scale.x = Math.min(curSc, 1);
}