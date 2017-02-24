function CMsgBox(){
    
    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;
    var _oGroup;
    
    this._init = function(){
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));

        _oMsgTextBack = new createjs.Text("","34px "+FONT_GAME_1, "#000");
        _oMsgTextBack.x = CANVAS_WIDTH/2 +2;
        _oMsgTextBack.y = (CANVAS_HEIGHT/2)-28;
        _oMsgTextBack.textAlign = "center";
        _oMsgTextBack.lineWidth = 400;
        _oMsgTextBack.textBaseline = "middle";

        _oMsgText = new createjs.Text("","34px "+FONT_GAME_1, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-30;
        _oMsgText.textAlign = "center";
        _oMsgText.lineWidth = 400;
        _oMsgText.textBaseline = "middle";
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg,_oMsgTextBack,_oMsgText);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(szMsg){
        _oMsgTextBack.text = szMsg;
        _oMsgText.text = szMsg;

        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        setTimeout(function(){oParent._onExit();},3000);
    };
    
    this._onExit = function(){
        if(_oGroup.visible){
            _oGroup.off("mousedown");
            _oGroup.visible = false;
        }
        
    };
    
    this._init();
    
    return this;
}