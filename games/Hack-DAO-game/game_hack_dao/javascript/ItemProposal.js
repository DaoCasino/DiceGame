function ItemProposal() {
	PIXI.Container.call( this );
	this.init();
}

ItemProposal.prototype = Object.create(PIXI.Container.prototype);
ItemProposal.prototype.constructor = ItemProposal;

ItemProposal.prototype.init = function() {
	this.name = "itemProposal";
	this.color = "Green";
	this.act = "Run";
	this.w = 107;
	this.h = 156;
	this.showMark = false;
	
	this.sprite = new PIXI.Container();
	this.addChild(this.sprite);
	this.item = new PIXI.Container();
	this.sprite.addChild(this.item);
	
	this.legL = addObj("legRun", -53, 101, 0.6, 1.5);
	this.sprite.addChild(this.legL);
	this.legL.img.play();
	this.legL.img.animationSpeed = 0.5;
	this.legR = addObj("legRun", 0, 101, 0.6, -1.5);
	this.sprite.addChild(this.legR);
	this.legR.img.gotoAndPlay(8);
	this.legR.img.animationSpeed = 0.5;
	this.hand = addObj("handClimb", -47, 7);
	this.sprite.addChild(this.hand);
	this.hand.img.animationSpeed = 0.5;
	var bodyX = -16;
	var bodyY = 14;
	this.body = addObj("itemBodyGreen", bodyX, bodyY);
	this.item.addChild(this.body);
	this.head = addObj("itemHeadProposal", 8, -42);
	this.sprite.addChild(this.head);
	this.mark = addObj("iconCheckMark", 38, -55);
	this.mark.scale.x = -1;
	this.mark.visible = false;
	this.sprite.addChild(this.mark);
	this.sign = addText("P", 30, "#FFFFFF", undefined, "center", 50, 1, fontTahoma)
	this.sign.x = -15;
	this.sign.y = -8;
	this.addChild(this.sign);
}

ItemProposal.prototype.setBody = function(color) {
	if(this.color == color){
		return false;
	}
	
	var bodyX = -16;
	var bodyY = 14;
	this.color = color;
	this.item.removeChild(this.body);
	this.body = addObj("itemBody"+color, bodyX, bodyY);
	this.item.addChild(this.body);
}

ItemProposal.prototype.setScaleX = function(scX) {
	this.sprite.scale.x = scX;
	if(this.act == "Run"){
		if(scX == 1){
			this.sign.x = -15;
		} else {
			this.sign.x = 15;
		}
	}
}

ItemProposal.prototype.setAct = function(act) {
	if(this.act == act){
		return false;
	}
	this.act = act
	
	if(act == "Run"){
		this.legL.img.gotoAndPlay(1);
		this.legR.img.gotoAndPlay(8);
		this.hand.img.gotoAndStop(15);
	} else {
		this.legL.img.gotoAndStop(1);
		this.legR.img.gotoAndStop(1);
		this.hand.img.gotoAndPlay(2);
	}
}