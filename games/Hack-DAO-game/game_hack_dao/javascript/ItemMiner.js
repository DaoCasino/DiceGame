function ItemMiner(head, sign) {
	PIXI.Container.call( this );
	this.init(head, sign);
}

ItemMiner.prototype = Object.create(PIXI.Container.prototype);
ItemMiner.prototype.constructor = ItemMiner;

ItemMiner.prototype.init = function(head, sign) {
	if(head){}else{head="itemHeadProposal"}
	if(sign){}else{sign="P"}
	
	this.name = "ItemMiner";
	this.color = "Green";
	this.act = "Run";
	this.wS = 107;
	this.hS = 156;
	this.w = this.wS;
	this.h = this.hS;
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
	var headX = -16;
	var headY = -13;
	this.head = addObj(head, headX, headY);
	this.sprite.addChild(this.head);
	this.mark = addObj("iconCheckMark", 38, -55);
	this.mark.scale.x = -1;
	this.mark.visible = false;
	this.sprite.addChild(this.mark);
	this.sign = addText(sign, 30, "#FFFFFF", undefined, "center", 50, 1, fontTahoma)
	this.sign.x = -15;
	this.sign.y = -50;
	this.addChild(this.sign);
	
	if(head == "itemHeadMiner"){
		this.hand.visible = false;
		this.wS = 73;
		this.hS = this.legL.h+this.body.h+41;
		this.w = this.wS;
		this.h = this.hS;
	}
	
	this.zone = new PIXI.Graphics();
    this.zone.beginFill(0xCC0000).drawRect(-this.w/2, -this.h, this.w, this.h).endFill();
	this.zone.alpha = 0.5;
	this.zone.visible = false;
    this.addChild(this.zone);
	
	this.sprite.y = -this.h/2
}

ItemMiner.prototype.setBody = function(color) {
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

ItemMiner.prototype.setScaleX = function(scX) {
	this.sprite.scale.x = scX*Math.abs(this.sprite.scale.x);
	if(this.act == "Run"){
		if(scX == 1){
			this.sign.x = -15*this.sign.scale.x;
		} else {
			this.sign.x = 15*this.sign.scale.x;
		}
	}
}

ItemMiner.prototype.setScale = function(sc) {
	this.sprite.scale.x = sc;
	this.sprite.scale.y = sc;
	this.sign.scale.x = sc;
	this.sign.scale.y = sc;
	this.zone.scale.x = sc;
	this.zone.scale.y = sc;
	this.w = this.wS*sc;
	this.h = this.hS*sc;
	this.sprite.y = -this.h/2
}

ItemMiner.prototype.setAct = function(act) {
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