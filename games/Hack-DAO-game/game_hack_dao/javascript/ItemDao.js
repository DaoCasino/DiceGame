function ItemDao() {
	PIXI.Container.call( this );
	this.init();
}

ItemDao.prototype = Object.create(PIXI.Container.prototype);
ItemDao.prototype.constructor = ItemDao;

var TIME_JIGGLE = 1500;

ItemDao.prototype.init = function() {
	this.name = "itemDao";
	this.item = addObj(this.name);
	this.addChild(this.item);
	this.w = this.item.w;
	this.h = this.item.h;
	this._selected = false;
	this.dead = false;
	this.init = false;
	this.countLifeMax = 1000;
	this.countLife = this.countLifeMax;
}

ItemDao.prototype.initjiggle = function() {
	this.init = true
	initjiggle(this.item, 1.1, 1, 0.4, 0.7)
}

ItemDao.prototype.update = function(diffTime) {
	if(this.dead){
		return false;
	}
	
	if (this.init) {
		jiggle(this.item)
	}
}