function CInterface(){
    var _iIndexFicheSelected;
    var _szLastMsgHelp;
    var _aFiches;
    var _pStartPosAudio;
    var _pStartPosExit;
    
    var _oButExit;
    var _oAudioToggle;
    var _oMoneyAmountText;
    var _oBetAmountText;
    var _oMsgTitle;
    var _oHelpText;
    var _oDisplayBg;
    var _oRollBut;
    var _oClearAllBet;
    var _oRollingText;
    
    var _oBlock;
    
    this._init = function(){
        
        var oMoneyBg = createBitmap(s_oSpriteLibrary.getSprite('but_bg'));
        oMoneyBg.x = 251;
        oMoneyBg.y = 603;
        s_oStage.addChild(oMoneyBg);
        
        var oMoneyText = new createjs.Text(TEXT_MONEY,"16px "+FONT1, "#fff");
        oMoneyText.textAlign = "center";
        oMoneyText.textBaseline = "alphabetic";
        oMoneyText.x = 332;
        oMoneyText.y = 629;
        s_oStage.addChild(oMoneyText);
        
        _oMoneyAmountText = new createjs.Text("","16px "+FONT1, "#fff");
        _oMoneyAmountText.textAlign = "center";
        _oMoneyAmountText.textBaseline = "alphabetic";
        _oMoneyAmountText.x = 332;
        _oMoneyAmountText.y = 649;
        s_oStage.addChild(_oMoneyAmountText);
        
        var oCurBetBg = createBitmap(s_oSpriteLibrary.getSprite('but_bg'));
        oCurBetBg.x = 410;
        oCurBetBg.y = 603;
        s_oStage.addChild(oCurBetBg);
        
        var oCurBetText = new createjs.Text(TEXT_CUR_BET,"16px "+FONT1, "#fff");
        oCurBetText.textAlign = "center";
        oCurBetText.textBaseline = "alphabetic";
        oCurBetText.x = 492;
        oCurBetText.y = 629;
        s_oStage.addChild(oCurBetText);
        
        _oBetAmountText = new createjs.Text("","16px "+FONT1, "#fff");
        _oBetAmountText.textAlign = "center";
        _oBetAmountText.textBaseline = "alphabetic";
        _oBetAmountText.x = 492;
        _oBetAmountText.y = 649;
        s_oStage.addChild(_oBetAmountText);
        
        _oDisplayBg = createBitmap(s_oSpriteLibrary.getSprite('but_bets'));
        _oDisplayBg.x = 575;
        _oDisplayBg.y = 610;
        s_oStage.addChild(_oDisplayBg);

        _oMsgTitle = new createjs.Text(TEXT_MIN_BET+": "+MIN_BET+"\n"+TEXT_MAX_BET+": "+MAX_BET,"16px "+FONT1, "#fff");
        _oMsgTitle.textAlign = "center";
        _oMsgTitle.textBaseline = "alphabetic";
        _oMsgTitle.lineHeight = 21;
        _oMsgTitle.x = _oDisplayBg.x + 75;
        _oMsgTitle.y = _oDisplayBg.y + 19;
        s_oStage.addChild(_oMsgTitle);
        
        var oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('display_bg'));
        oHelpBg.x = 880;
        oHelpBg.y = 210;
        s_oStage.addChild(oHelpBg);
        
        _oHelpText = new createjs.Text(TEXT_WAITING_BET,"20px "+FONT2, "#ffde00");
        _oHelpText.textAlign = "center";
        _oHelpText.lineWidth = 140;
        _oHelpText.lineHeight = 20;
        _oHelpText.x = oHelpBg.x + 175;
        _oHelpText.y = oHelpBg.y + 13;
        s_oStage.addChild(_oHelpText);
        
        _szLastMsgHelp = TEXT_WAITING_BET;

        _oRollBut = new CTextButton(1030,162,s_oSpriteLibrary.getSprite('roll_but'),"  "+TEXT_ROLL,FONT1,"#fff",22,s_oStage);
        _oRollBut.disable();
        _oRollBut.setAlign("left");
        _oRollBut.addEventListener(ON_MOUSE_UP, this._onRoll, this);
      
        _oClearAllBet = new CGfxButton(764,636,s_oSpriteLibrary.getSprite('but_clear_all'),s_oStage);
        _oClearAllBet.addEventListener(ON_MOUSE_UP, this._onClearAllBet, this);
       
        this._initFichesBut();

        _iIndexFicheSelected=0;
        _aFiches[_iIndexFicheSelected].select();
        
        var oGraphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oBlock = new createjs.Shape(oGraphics);
        _oBlock.on("click",function(){});
        _oBlock.visible= false;
        s_oStage.addChild(_oBlock);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) - 10,y:(oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - oSprite.width/2 - 10, y: (oSprite.height/2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.unload = function(){
        _oButExit.unload();
	if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        _oRollBut.unload();
        _oClearAllBet.unload();
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function (iNewX, iNewY) {
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,_pStartPosAudio.y + iNewY);
        }
        _oButExit.setPosition(_pStartPosExit.x - iNewX,_pStartPosExit.y + iNewY);
    };
    
    this.hideBlock = function(){
        _oBlock.visible = false;
    };
    
    this.showBlock = function(){
        _oBlock.visible = true;
    };
    
    this.enableBetFiches = function(){
        for(var i=0;i<NUM_FICHES;i++){
            _aFiches[i].enable();
        }
    };
    
    this.enableClearButton = function(){
        _oClearAllBet.enable();
    };
    
    this.disableBetFiches = function(){
        for(var i=0;i<NUM_FICHES;i++){
            _aFiches[i].disable();
        }
    };
    
    this.disableClearButton = function(){
        _oClearAllBet.disable();
    };

    this.deselectAllFiches = function(){
         for(var i=0;i<NUM_FICHES;i++){
             _aFiches[i].deselect();
         }
    };
    
    this.enableRoll = function(bEnable){
        if(bEnable){
            _oRollBut.enable();
        }else{
            _oRollBut.disable();
        }
        
    };
    
    this._initFichesBut = function(){
        var oFicheBg = createBitmap(s_oSpriteLibrary.getSprite('chip_box'));
        oFicheBg.x = 82;
        oFicheBg.y = 94;
        s_oStage.addChild(oFicheBg);
        
        //SET FICHES BUTTON
        var iCurX = 124;
        var iCurY = 144;
        _aFiches = new Array();
        for(var i=0;i<NUM_FICHES;i++){
            var oSprite = s_oSpriteLibrary.getSprite('fiche_'+i);
            _aFiches[i] = new CFicheBut(iCurX,iCurY,oSprite);
            _aFiches[i].addEventListenerWithParams(ON_MOUSE_UP, this._onFicheSelected, this,[i]);
            
            iCurY += oSprite.height + 25;
        }
    };
    
    this.setMoney = function(iMoney){
        _oMoneyAmountText.text = iMoney.toFixed(2)+TEXT_CURRENCY;
    };

    this.refreshMoney = function(iStartMoney, iMoney){
        _oRollingText = new CRollingTextController(_oMoneyAmountText, null, iStartMoney , parseFloat(iMoney), 4000, EASE_LINEAR,TEXT_CURRENCY);
    };
    
    this.setCurBet = function(iCurBet){
        _oBetAmountText.text = iCurBet.toFixed(2) + TEXT_CURRENCY;
    };
    
    this.refreshMsgHelp = function(szText,bLastState){
        _oHelpText.text = szText;
        if(bLastState){
            _szLastMsgHelp = szText;
        }
    };
    
    this.clearMsgHelp = function(){
        _oHelpText.text = _szLastMsgHelp;
    };
    
    this._onBetRelease = function(oParams){
        var aBets=oParams.numbers;

        if(aBets !== null){
            s_oGame._onShowBetOnTable({button:oParams.name},false);
        }
    };
    
    this._onFicheSelected = function(aParams){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("fiche_select");
        }
        
        this.deselectAllFiches();
        
        var iFicheIndex=aParams[0];
        for(var i=0;i<NUM_FICHES;i++){
            if(i === iFicheIndex){
               _iIndexFicheSelected = i;
            }
        }
    };
    
    this._onRoll = function(){
            this.disableBetFiches();
            this.enableRoll(false);
            s_oGame.onRoll();    
    };
    
    this._onClearAllBet = function(){
        s_oGame.onClearAllBets();
    };

    this._onExit = function(){
        s_oGame.onExit(false);  
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(!s_bAudioActive);
    };
    
    this.getCurFicheSelected = function(){
        return _iIndexFicheSelected;
    };
    
    this.isBlockVisible = function(){
        return _oBlock.visible;
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;;