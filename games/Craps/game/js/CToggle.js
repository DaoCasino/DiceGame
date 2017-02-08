function CToggle(iXPos,iYPos,oSprite){
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    
    this._init = function(iXPos,iYPos,oSprite){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {on:[0,1],off:[1,2]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         
         if(s_bAudioActive){
            _oButton = createSprite(oSpriteSheet, "on",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
         }else{
             _oButton = createSprite(oSpriteSheet, "off",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
         }
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.stop();
        if (!s_bMobile){
            _oButton.cursor = "pointer";
	}
        s_oStage.addChild(_oButton);
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", this.buttonDown);
       _oButton.off("pressup" , this.buttonRelease);
	   
       s_oStage.removeChild(_oButton);
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("click");
        }
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
        
        s_bAudioActive = !s_bAudioActive;
        if(s_bAudioActive){
            _oButton.gotoAndStop("on");
        }else{
            _oButton.gotoAndStop("off");
        }

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function(){
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.setPosition = function (iX, iY) {
        _oButton.x = iX;
        _oButton.y = iY;
    };
    
    this._init(iXPos,iYPos,oSprite);
}