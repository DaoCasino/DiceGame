function CCreditsPanel(){
    
    var _oBg;
    var _oButExit;
    var _oMsgText;

    var _oHitArea;
    
    var _oLink;
    var _oContainer;
    
    var _pStartPosExit;
    
    this._init = function(){
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBgMenu = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oContainer.addChild(oBgMenu);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSprite);
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oBg.regX = oSprite.width/2;
        _oBg.regY = oSprite.height/2;
        _oContainer.addChild(_oBg);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);
                
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH/2 +234, y: 254};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED,"26px Arial", "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = 300;
        _oMsgText.textAlign = "center";
        _oContainer.addChild(_oMsgText);
		
        oSprite = s_oSpriteLibrary.getSprite('logo_credits');
        var oLogo = createBitmap(oSprite);
        oLogo.regX = oSprite.width/2;
        oLogo.regY = oSprite.height/2;
        oLogo.x = CANVAS_WIDTH/2;
        oLogo.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(oLogo);
        
        _oLink = new createjs.Text(TEXT_LINK,"30px Arial", "#ffffff");
        _oLink.x = CANVAS_WIDTH/2;
        _oLink.y = 444;
        _oLink.textAlign = "center";
        _oContainer.addChild(_oLink);
    };
    
    this.unload = function(){
        _oHitArea.off("click", this._onLogoButRelease);
        
        _oButExit.unload(); 
        _oButExit = null;

        s_oStage.removeChild(_oContainer);
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._init();
    
    
};


