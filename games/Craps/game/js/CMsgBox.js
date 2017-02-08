function CMsgBox(){
    
    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;
    var _oGroup;
    
    this._init = function(){
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oBg.on("click",function(){});

        _oMsgTextBack = new createjs.Text("","24px "+FONT1, "#000");
        _oMsgTextBack.x = CANVAS_WIDTH/2 +2;
        _oMsgTextBack.y = (CANVAS_HEIGHT/2)-28;
        _oMsgTextBack.textAlign = "center";
        _oMsgTextBack.lineWidth = 300;

        _oMsgText = new createjs.Text("","24px "+FONT1, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-30;
        _oMsgText.textAlign = "center";
        _oMsgText.lineWidth = 300;
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg,_oMsgTextBack,_oMsgText);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oBg.off("click",function(){});
    };

    this.show = function(szMsg){
        _oMsgTextBack.text = szMsg;
        _oMsgText.text = szMsg;
        
        _oGroup.alpha = 0;
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500);
        setTimeout(function(){oParent._onExit();},2000);
    };
    
    this._onExit = function(){
        if(_oGroup.visible){
            _oGroup.visible = false;
        }
        
    };
    
    this._init();
    
    return this;
}