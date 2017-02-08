function CFiche(iXPos,iYPos,iIndexFicheSelected,oContainer,iScale){
    var _iValue;
    var _pStartingPoint;
    var _pEndingPoint;
    var _oSprite;
    var _oContainer;
    
    this._init = function(iXPos,iYPos,iIndexFicheSelected,oContainer,iScale){
        _oContainer = oContainer;
        
        var oSprite = s_oSpriteLibrary.getSprite("fiche_"+iIndexFicheSelected)
        _oSprite = createBitmap(oSprite);
        _oSprite.x = iXPos;
        _oSprite.y = iYPos;
        _oSprite.regX = oSprite.width/2;
        _oSprite.regY = oSprite.height/2;
        if(iScale){
            _oSprite.scaleX = iScale;
            _oSprite.scaleY = iScale;
        }else{
            _oSprite.scaleX = 0.6;
            _oSprite.scaleY = 0.6;
        }
        
        _iValue = iIndexFicheSelected;
        
        _oContainer.addChild(_oSprite);
    };

    this.setEndPoint =  function(pEndX,pEndY){
        _pStartingPoint=new createjs.Point(_oSprite.x,_oSprite.y);
        _pEndingPoint=new createjs.Point(pEndX,pEndY);
    };
		
    this.updatePos = function(fLerp){
        var oPoint = new createjs.Point();
        
        oPoint = s_oTweenController.tweenVectors(_pStartingPoint, _pEndingPoint, fLerp,oPoint );
        _oSprite.x = oPoint.x;
        _oSprite.y = oPoint.y;
    };
    
    this.getSprite = function(){
        return _oSprite;
    };
    
    this.getValue = function(){
        return _iValue;
    };
    
    this.getStartingPos = function(){
        return _pStartingPoint;
    };

    this._init(iXPos,iYPos,iIndexFicheSelected,oContainer,iScale);
}