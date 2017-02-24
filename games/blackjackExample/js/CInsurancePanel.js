function CInsurancePanel(){
    var _oButNo;
    var _oButYes;
    var _oMsgText;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        _oContainer.visible = false;
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oContainer.addChild(oBg);
        
        _oMsgText = new createjs.Text("","bold 50px "+FONT_GAME_1, "#fff");
        _oMsgText.x = (CANVAS_WIDTH/2);
        _oMsgText.y = 300;
	_oMsgText.lineWidth = 300;
        _oMsgText.textAlign = "center";
        _oContainer.addChild(_oMsgText);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_game_small_bg');
        _oButNo = new CTextButton((CANVAS_WIDTH/2) - 100,CANVAS_HEIGHT -300,oSprite,TEXT_NO,FONT_GAME_1,"#ffffff",20,_oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNoRelease, this);

        _oButYes = new CTextButton((CANVAS_WIDTH/2) + 100,CANVAS_HEIGHT -300,oSprite,TEXT_YES,FONT_GAME_1,"#ffffff",20,_oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYesRelease, this);
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oContainer);
    };
    
    this.show = function(szMsg){
        _oMsgText.text = szMsg;
        _oContainer.visible = true;
    };
    
    this._onButNoRelease = function(){
        _oContainer.visible = false;
    };
    
    this._onButYesRelease = function(){
        _oContainer.visible = false;
        s_oGame.onBuyInsurance();
    };
    
    this._init();
}