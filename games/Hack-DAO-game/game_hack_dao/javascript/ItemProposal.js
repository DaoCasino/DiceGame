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
	this.idMark = 1;
	this.w = 107;
	this.h = 156;
	this.showMark = false;
	
	this.sprite = new PIXI.Container();
	this.addChild(this.sprite);
	
	this.hand = addObj("itemHandProposal", -33, 0);
	this.sprite.addChild(this.hand);
	this.mark = addObj("itemBlank1", -57, -30);
	this.mark.scale.x = -1;
	this.sprite.addChild(this.mark);
	this.body = addObj("proposalGreenRun");
	this.body.img.play();
	this.body.img.animationSpeed = 0.5;
	this.sprite.addChild(this.body);
	// this.sign = addText("P", 30, "#FFFFFF", "#000000", "center", 50, 2, fontTahoma)
	// this.sign.x = -5;
	// this.sign.y = -8;
	// this.addChild(this.sign);
}

ItemProposal.prototype.setScaleX = function(scX) {
	this.sprite.scale.x = scX*Math.abs(this.sprite.scale.x);
	if(this.act == "Run"){
		if(scX == 1){
			// this.sign.x = -5*this.sign.scale.x;
		} else {
			// this.sign.x = 5*this.sign.scale.x;
		}
	}
}

ItemProposal.prototype.setMark = function(value) {
	if(this.idMark == value){
		return false;
	}
	this.idMark = value;
	this.sprite.removeChild(this.mark);
	this.mark = addObj("itemBlank"+value, -57, -30);
	this.mark.scale.x = -1;
	this.sprite.addChild(this.mark);
}

ItemProposal.prototype.setScale = function(sc) {
	this.sprite.scale.x = sc;
	this.sprite.scale.y = sc;
	// this.sign.scale.x = sc;
	// this.sign.scale.y = sc;
	this.w = this.w*sc;
	this.h = this.h*sc;
}

ItemProposal.prototype.setAct = function(act) {
	if(this.act == act){
		return false;
	}
	this.act = act
	
	this.sprite.removeChild(this.body);
	this.body = addObj(act);
	this.body.img.play();
	this.body.img.animationSpeed = 0.5;
	this.sprite.addChild(this.body);
}