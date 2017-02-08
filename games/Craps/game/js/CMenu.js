function CMenu(){
    var _pStartPosAudio;
    var _pStartPosInfo;
    var _pStartPosPlay;
    
    var _oBg;
    var _oButPlay;
    var _oButInfo;
    var _oAudioToggle;
    var _oFade;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _pStartPosPlay = {x:(CANVAS_WIDTH/2),y:CANVAS_HEIGHT -110};
        _oButPlay = new CGfxButton(_pStartPosPlay.x,_pStartPosPlay.y,oSprite,s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosInfo = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10}; 
        _oButInfo = new CGfxButton(_pStartPosInfo.x,_pStartPosInfo.y,oSprite,s_oStage);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onCredits, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosInfo.x - (oSprite.width / 2) - 10, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        
     

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 400).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
        _oButInfo.setPosition(_pStartPosInfo.x - iNewX,iNewY + _pStartPosInfo.y);
        _oButPlay.setPosition(_pStartPosPlay.x,_pStartPosPlay.y - iNewY);
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        _oButInfo.unload();
        _oButInfo = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oStage.removeChild(_oBg);
        _oBg = null;
        
        s_oStage.removeChild(_oFade);
        _oFade = null;
        s_oMenu = null;
    };
    
    this._onButPlayRelease = function(){
        this.unload();
        s_oMain.gotoGame();
        
        $(s_oMain).trigger("start_session");
    };

    this._onAudioToggle = function(){
        createjs.Sound.setMute(!s_bAudioActive);
    };
    
    this._onCredits = function(){
        new CCreditsPanel();
    };
    
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;