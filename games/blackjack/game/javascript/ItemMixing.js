function ItemMixing(_prnt) {
	PIXI.Container.call( this );
	this.init(_prnt);
}

ItemMixing.prototype = Object.create(PIXI.Container.prototype);
ItemMixing.prototype.constructor = ItemMixing;

var _x1 = 70;
var _x2 = -70;
var speed = 0.25;

ItemMixing.prototype.init = function(_prnt) {
	var scaleCard = 0.9;
	var time = 750;
	this.cardSuit1 = addObj("suit", 0, 0, scaleCard);
	this.cardSuit1.vX = -1;
	this.cardSuit1.x = _x1;
	this.addChild(this.cardSuit1);
	this.cardSuit2 = addObj("suit", 0, 0, scaleCard);
	this.cardSuit2.vX = 1;
	this.cardSuit2.x = _x2;
	this.addChild(this.cardSuit2);
}

ItemMixing.prototype.update = function(diffTime) {
	this.cardSuit1.x += this.cardSuit1.vX*speed*diffTime;
	this.cardSuit2.x += this.cardSuit2.vX*speed*diffTime;
	
	if(this.cardSuit1.x <= _x2){
		this.cardSuit1.x = _x1;
		this.cardSuit2.x = _x2;
	}
}