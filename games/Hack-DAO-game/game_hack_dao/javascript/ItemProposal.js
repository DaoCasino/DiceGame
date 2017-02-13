function ItemProposal(head, sign) {
	PIXI.Container.call( this );
	this.init(head, sign);
}

ItemProposal.prototype = Object.create(PIXI.Container.prototype);
ItemProposal.prototype.constructor = ItemProposal;

ItemProposal.prototype.init = function(head, sign) {
	if(head){}else{head="itemHeadProposal"}
	if(sign){}else{sign="P"}
	
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
	var headX = 8;
	var headY = -42;
	if(head == "itemHeadMiner"){
		headX = -16;
		headY = -13;
	}
	this.head = addObj(head, headX, headY);
	this.sprite.addChild(this.head);
	this.mark = addObj("iconCheckMark", 38, -55);
	this.mark.scale.x = -1;
	this.mark.visible = false;
	this.sprite.addChild(this.mark);
	this.sign = addText(sign, 30, "#FFFFFF", undefined, "center", 50, 1, fontTahoma)
	this.sign.x = -15;
	this.sign.y = -8;
	this.addChild(this.sign);
	
	if(head == "itemHeadMiner"){
		this.hand.visible = false;
		this.w = 73;
		this.h = this.legL.h+this.body.h+41;
	}
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
	this.sprite.scale.x = scX*Math.abs(this.sprite.scale.x);
	if(this.act == "Run"){
		if(scX == 1){
			this.sign.x = -15*this.sign.scale.x;
		} else {
			this.sign.x = 15*this.sign.scale.x;
		}
	}
}

ItemProposal.prototype.setScale = function(sc) {
	this.sprite.scale.x = sc;
	this.sprite.scale.y = sc;
	this.sign.scale.x = sc;
	this.sign.scale.y = sc;
	this.w = this.w*sc;
	this.h = this.h*sc;
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