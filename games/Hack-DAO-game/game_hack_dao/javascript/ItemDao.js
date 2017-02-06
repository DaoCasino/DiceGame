function ItemDao() {
	PIXI.Container.call( this );
	this.init();
}

ItemDao.prototype = Object.create(PIXI.Container.prototype);
ItemDao.prototype.constructor = ItemDao;

var TIME_JIGGLE = 1500;

ItemDao.prototype.init = function() {
	this.name = "itemDao";
	this.skin = "";
	this.act = "";
	this.item = new PIXI.Container();
	this.addChild(this.item);
	this._selected = false;
	this.dead = false;
	this.init = false;
	this.healthMax = 1000;
	this.health = this.healthMax;
}

ItemDao.prototype.setSkin = function(skin) {
	this.skin = skin;
}

ItemDao.prototype.setAct = function(act) {
	if(this.skin+this.act == this.skin+act){
		return false;
	}
	this.act = act;
	if(this.sprite){
		this.item.removeChild(this.sprite);
	}
	
	if(this.skin == "egg"){
		this.sprite = addObj("itemEgg");
		this.item.addChild(this.sprite);
		this.w = this.sprite.w;
		this.h = this.sprite.h;
	} else {
		var _x = 0;
		var _y = 0;
		if(act == "Cure"){
			_x = -19;
		} else if(act == "Win"){
			_x = -12;
		}
		this.sprite = addObj(this.skin+this.act, _x, _y);
		this.item.addChild(this.sprite);
		this.w = this.sprite.w;
		this.h = this.sprite.h;
		
		if(this.act == "Stay" || this.act == "Lose"){
		} else {
			this.sprite.img.play();
			this.sprite.img.animationSpeed = 0.5;
		}
	}
}

ItemDao.prototype.initjiggle = function() {
	this.init = true
	if(this.act == "Stay" && this.skin != "egg"){
		if(Math.random() > 0.75){
			this.setAct("Damage")
		}
	}
	if(this.act != "Cure"){
		initjiggle(this.item, 1.1, 1, 0.4, 0.7)
	}
}

ItemDao.prototype.update = function(diffTime) {	
	if(this.act == "Cure" || this.act == "Damage"){
		if(this.sprite.img.currentFrame >= this.sprite.img.totalFrames - 1){
			this.setAct("Stay")
		}
	} else if(this.act == "Win"){
		if(this.sprite.img.currentFrame >= this.sprite.img.totalFrames - 1){
			this.sprite.img.stop();
		}
	}
	
	if(this.dead){
		return false;
	}
	
	if (this.init) {
		jiggle(this.item)
	}
}