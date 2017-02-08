function CGfxButton(iXPos,iYPos,oSprite,oParentContainer){
    var _bDisable;
    var _iWidth;
    var _iHeight;
    var _aCbCompleted;
    var _aCbOwner;
    var _oParams;
    var _oButton;
    var _oParentContainer;
    
    this._init =function(iXPos,iYPos,oSprite){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton =createBitmap( oSprite);
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
                                   
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        if (!s_bMobile){
            _oButton.cursor = "pointer";
	}

        _oParentContainer.addChild(_oButton);
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", this.buttonDown);
       _oButton.off("pressup" , this.buttonRelease); 
       
       if(s_bMobile === false){
           _oButton.off("rollover",this.mouseOver);
           _oButton.off("rollout",this.mouseOut);
       }
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.enable = function(){
        _bDisable = false;
		
	_oButton.filters = [];

        _oButton.cache(0,0,_iWidth,_iHeight);
    };
    
    this.disable = function(){
        _bDisable = true;
		
	var matrix = new createjs.ColorMatrix().adjustSaturation(-100).adjustBrightness(40);
        _oButton.filters = [
                                new createjs.ColorMatrixFilter(matrix)
                             ];
        _oButton.cache(0,0,_iWidth,_iHeight);
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);   
       
       if(s_bMobile === false){
           _oButton.on("rollover",this.mouseOver);
           _oButton.on("rollout",this.mouseOut);
       }
       
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,oParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _oParams = oParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("click");
        }
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_oParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_oParams);
       }
    };
    
    this.mouseOver = function(){
        if(_aCbCompleted[ON_MOUSE_OVER]){
             _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER],_oParams);
       }
    };
    
    this.mouseOut = function(){
        if(_aCbCompleted[ON_MOUSE_OUT]){
            _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT],_oParams);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    _oParentContainer = oParentContainer;
    
    this._init(iXPos,iYPos,oSprite);
    
    return this;
}