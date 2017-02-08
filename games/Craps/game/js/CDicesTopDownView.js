function CDicesTopDownView(iX,iY,oParentContainer){
    var _oResultText;
    var _oDice1;
    var _oDice2;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        var oBgDice = createBitmap(s_oSpriteLibrary.getSprite("dices_box"));
        _oContainer.addChild(oBgDice);
        
        var oSpriteDice = s_oSpriteLibrary.getSprite("dice_topdown1");
        var oData = {   
                        images: [oSpriteDice], 
                        // width, height & registration point of each sprite
                        frames: {width: oSpriteDice.width/6, height: oSpriteDice.height, regX: (oSpriteDice.width/6)/2, regY: oSpriteDice.height/2}, 
                        animations: {dice_1:[0],dice_2:[1],dice_3:[2],dice_4:[3],dice_5:[4],dice_6:[5]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oDice1 = createSprite(oSpriteSheet, "dice_1",(oSpriteDice.width/6)/2,oSpriteDice.height/2,oSpriteDice.width/6,oSpriteDice.height);
        _oDice1.x = (oSpriteDice.width/6)/2 + 10;
        _oDice1.y = oSpriteDice.height/2;
        _oContainer.addChild(_oDice1);
        
        oSpriteDice = s_oSpriteLibrary.getSprite("dice_topdown2");
        var oData = {   
                        images: [oSpriteDice], 
                        // width, height & registration point of each sprite
                        frames: {width: oSpriteDice.width/6, height: oSpriteDice.height, regX: (oSpriteDice.width/6)/2, regY: oSpriteDice.height/2}, 
                        animations: {dice_1:[0],dice_2:[1],dice_3:[2],dice_4:[3],dice_5:[4],dice_6:[5]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oDice2 = createSprite(oSpriteSheet, "dice_1",(oSpriteDice.width/6)/2,oSpriteDice.height/2,oSpriteDice.width/6,oSpriteDice.height);
        _oDice2.x = (oSpriteDice.width/6)/2 + oSpriteDice.width/6 + 20;
        _oDice2.y = oSpriteDice.height/2;
        _oContainer.addChild(_oDice2);
        
       
        _oResultText = new createjs.Text(TEXT_COME_OUT + " ","20px "+FONT1, "#fff");
        _oResultText.textAlign = "center";
        _oResultText.x = oSpriteDice.width/6 + 15;
        _oResultText.y = oSpriteDice.height + 8;
        _oContainer.addChild(_oResultText);
    };
    
    this.setDiceResult = function(iDice1,iDice2){
        _oDice1.gotoAndStop("dice_"+iDice1);
        _oDice2.gotoAndStop("dice_"+iDice2);
        
        _oResultText.text = TEXT_COME_OUT + " " + (iDice1+iDice2);
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oContainer).to({alpha:1}, 400);  
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}