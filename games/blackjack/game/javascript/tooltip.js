function tooltip(_prnt) {
	PIXI.Container.call( this );
	this.init(_prnt);
}

tooltip.prototype = Object.create(PIXI.Container.prototype);
tooltip.prototype.constructor = tooltip;

tooltip.prototype.init = function(_prnt) {
	this._prnt = _prnt;
	
	var bg = addObj("wndInfo",0,0,1, 0.15, 0.1);
	this.addChild(bg);
	
	var tf = addText("", 24, "#FFFFFF", undefined, "center", 250)
	tf.x = 0;
	tf.y = -tf.height/2;
	this.addChild(tf);
	this.tf = tf;
}

tooltip.prototype.show = function(str) {
	this.tf.setText(str);
	this.tf.y = -this.tf.height/2;
}