function CBetTableButton(iXPos,iYPos,oSprite,szName,oContainer){
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    
    var _szName;
    var _oContainer;

    
    this._init =function(iXPos,iYPos,oSprite,szName,oContainer){
        _szName =szName;

        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        _oContainer = oContainer;
        
        _oButton = new createjs.Bitmap(oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
                                   
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        
	if (!s_bMobile){
            _oButton.cursor = "pointer";
	}
        
        this._initListener();
        _oContainer.addChild(_oButton);
    };
    
    this.unload = function(){
       _oButton.off("mousedown", this.buttonDown);
       _oButton.off("pressup" , this.buttonRelease); 
       _oButton.off("rollover",this.mouseOver);
       _oButton.off("rollout",this.mouseOut);
       
       _oContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);  
       _oButton.on("rollover",this.mouseOver);
       _oButton.on("rollout",this.mouseOut);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("click");
        }

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],
                                   {button:_szName},false);
        }
    };
    
    this.buttonDown = function(){
       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],
                                               {button:_szName},false);
       }
    };
    
    this.mouseOver = function(){
        if(_aCbCompleted[ON_MOUSE_OVER]){
            _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER],{enlight:_szName});
           
       }
    };
    
    this.mouseOut = function(){
        if(_aCbCompleted[ON_MOUSE_OUT]){
            _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT],{enlight:_szName});
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

    this._init(iXPos,iYPos,oSprite,szName,oContainer);
}