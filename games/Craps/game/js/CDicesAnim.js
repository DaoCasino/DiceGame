function CDicesAnim(iX,iY){
    var _bUpdate;
    var _iCurDiceIndex;
    var _iFrameCont;
    var _iCurBallIndex;
    var _aDiceResult;
    var _aDicesAnimSprites;
    var _oDiceASprite;
    var _oDiceBSprite;
    var _oCurLaunchDiceSprite;
    var _oDiceTopDownView;
    var _oContainer;
    var _oThis;
    
    this._init= function(iX,iY){
        _iCurDiceIndex= 0;
        _iFrameCont = 0;
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = iX;
        _oContainer.y = iY;
        s_oStage.addChild(_oContainer);
        
        var oGraphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.6)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        var oFade = new createjs.Shape(oGraphics);
        oFade.x = -iX;
        oFade.y = -iY;
        _oContainer.addChild(oFade);
        
        var oBgDiceLaunch = createBitmap(s_oSpriteLibrary.getSprite("dices_screen_bg"));
        _oContainer.addChild(oBgDiceLaunch);
        
        _aDicesAnimSprites = new Array();
        for(var i=0;i<NUM_DICE_ROLLING_FRAMES;i++){
            var oImage = createBitmap(s_oSpriteLibrary.getSprite('launch_dices_'+i)); 
            oImage.x = 162;
            oImage.y = 150;
            oImage.visible = false;
            _oContainer.addChild(oImage);
            _aDicesAnimSprites.push(oImage);
        }
        
        _oCurLaunchDiceSprite = _aDicesAnimSprites[0];
        _oCurLaunchDiceSprite.visible = true;

        var oData = {   
                        images: [s_oSpriteLibrary.getSprite("dice_a")], 
                        // width, height & registration point of each sprite
                        frames: {width: 80, height: 34}, 
                        animations: {anim_1:[0,9,"stop_anim_1"],anim_2:[10,19,"stop_anim_2"],anim_3:[20,29,"stop_anim_3"],
                                     anim_4:[30,39,"stop_anim_4"],anim_5:[40,49,"stop_anim_5"],anim_6:[50,59,"stop_anim_6"],
                                     stop_anim_1:9,stop_anim_2:19,stop_anim_3:29,stop_anim_4:39,stop_anim_5:49,stop_anim_6:59}
                    };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oDiceASprite = createSprite(oSpriteSheet,"anim_1",80,34);
        _oDiceASprite.stop();
        _oDiceASprite.visible = false;
        _oDiceASprite.x = 332;
        _oDiceASprite.y = 206;
        _oContainer.addChild(_oDiceASprite);
        
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite("dice_b")], 
                        // width, height & registration point of each sprite
                        frames: {width: 102, height: 65}, 
                        animations: {anim_1:[0,14,"stop_anim_1"],anim_2:[15,29,"stop_anim_2"],anim_3:[30,44,"stop_anim_3"],
                                     anim_4:[45,59,"stop_anim_4"],anim_5:[60,74,"stop_anim_5"],anim_6:[75,89,"stop_anim_6"],
                                     stop_anim_1:14,stop_anim_2:29,stop_anim_3:44,stop_anim_4:59,stop_anim_5:74,stop_anim_6:89}
                    };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oDiceBSprite = createSprite(oSpriteSheet,"anim_1",102,65);
        _oDiceBSprite.stop();
        _oDiceBSprite.visible = false;
        _oDiceBSprite.x = 239;
        _oDiceBSprite.y = 240;
        _oContainer.addChild(_oDiceBSprite);
        _oDiceBSprite.addEventListener("animationend", _oThis._onDiceBAnimEnded);
        
        _oDiceTopDownView = new CDicesTopDownView(584,20,_oContainer);
    };

    this.hide = function(){
        _oDiceTopDownView.hide();
        _oContainer.visible = false;
        _iCurBallIndex = 0;
        
        _oDiceASprite.visible = false;
        _oDiceBSprite.visible = false;
        
        for(var i=0;i<_aDicesAnimSprites.length;i++){
            _aDicesAnimSprites[i].visible = false;
        }
        
        s_oGame.dicesAnimEnded();
    };
    
    this.startRolling = function(aDicesResult){
        _aDiceResult = aDicesResult;
        this.playToFrame(0);

        _oContainer.visible = true;

        _bUpdate = true;
        
        _oContainer.visible = true;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("dice_rolling");
        }
    };
    
    this.setShowNumberInfo = function(){
        _oDiceTopDownView.setDiceResult(_aDiceResult[0],_aDiceResult[1]);
    };
    
    this.playToFrame = function(iFrame){
        _oCurLaunchDiceSprite.visible = false;
        _iCurDiceIndex = iFrame;
        _aDicesAnimSprites[_iCurDiceIndex].visible= true;
        _oCurLaunchDiceSprite = _aDicesAnimSprites[_iCurDiceIndex];
    };
    
    this.nextFrame = function(){
        _oCurLaunchDiceSprite.visible = false;
        _iCurDiceIndex++;
        _aDicesAnimSprites[_iCurDiceIndex].visible= true;
        _oCurLaunchDiceSprite = _aDicesAnimSprites[_iCurDiceIndex];
    };
    
    this._setAnimForDiceResult = function(){
        _aDicesAnimSprites[_iCurDiceIndex].visible = false;
        
        _oDiceASprite.visible = true;
        _oDiceBSprite.visible = true;
        _oDiceASprite.gotoAndPlay("anim_"+_aDiceResult[0]);
        _oDiceBSprite.gotoAndPlay("anim_"+_aDiceResult[1]);
    };
    
    this._onDiceBAnimEnded = function(evt){
        if(evt.currentTarget.currentAnimation.indexOf("stop_anim") !== -1){
            _oThis.setShowNumberInfo();
            setTimeout(function(){_oThis.hide();},TIME_SHOW_DICES_RESULT);
        }
        
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
        _iFrameCont++;
        
        if(_iFrameCont === 1){
            _iFrameCont = 0;
            if (  _iCurDiceIndex === (NUM_DICE_ROLLING_FRAMES-1)) {
                //PLACE DICE A AND DICE B FOR RESULT
                _bUpdate = false;
                this._setAnimForDiceResult();
            }else{
                this.nextFrame();
            }
            
        }
        
    };
    
    _oThis = this;
    this._init(iX,iY);
}