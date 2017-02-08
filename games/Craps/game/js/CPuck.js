function CPuck(iX,iY,oParentContainer){
    var _iStartX;
    var _oItem;
    var _oParentContainer;
    
    this._init = function(){
        _iStartX = iX;
        
        var oSprite = s_oSpriteLibrary.getSprite('puck');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {on:[0],off:[1]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _oItem = createSprite(oSpriteSheet,"off",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oItem.x = iX;
        _oItem.y = iY;
        _oParentContainer.addChild(_oItem);
    };
    
    this.switchOn = function(iNewX){
        createjs.Tween.get(_oItem).to({x:iNewX}, 1000,createjs.Ease.cubicOut).call(function(){_oItem.gotoAndStop("on");});  
    };
    
    this.switchOff = function(){
        createjs.Tween.get(_oItem).to({x:_iStartX}, 1000,createjs.Ease.cubicOut).call(function(){_oItem.gotoAndStop("off");});  
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}