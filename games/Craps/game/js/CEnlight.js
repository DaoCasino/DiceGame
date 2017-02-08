function CEnlight(iX,iY,oSprite,oContainer){
    
    var _oBmp;
    
    this._init = function(iX,iY,oSprite,oContainer){
        _oBmp = createBitmap(oSprite);
        _oBmp.x = iX;
        _oBmp.y = iY;
        _oBmp.visible = false;
        oContainer.addChild(_oBmp);
    };
    
    this.show = function(){
        _oBmp.visible = true;
    };
    
    this.hide = function(){
        _oBmp.visible = false;
    };
    
    this.getX = function(){
        return _oBmp.x;
    };
    
    this.getY = function(){
        return _oBmp.y;
    };
    
    this._init(iX,iY,oSprite,oContainer);
}