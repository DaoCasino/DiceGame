function ItemMixing(_prnt) {
	PIXI.Container.call( this );
	this.init(_prnt);
}

ItemMixing.prototype = Object.create(PIXI.Container.prototype);
ItemMixing.prototype.constructor = ItemMixing;

ItemMixing.prototype.init = function(_prnt) {
	var scaleCard = 0.9;
	var _x1 = 70;
	var _x2 = -70;
	var time = 750;
	this.cardSuit1 = addObj("suit", 0, 0, scaleCard);
	this.cardSuit1.x = _x1;
	this.addChild(this.cardSuit1);
	this.cardSuit2 = addObj("suit", 0, 0, scaleCard);
	this.cardSuit2.x = _x2;
	this.addChild(this.cardSuit2);
	
	createjs.Tween.get(this.cardSuit1,{loop:true}).to({x:_x2},time);
	createjs.Tween.get(this.cardSuit2,{loop:true}).to({x:_x1},time);
}