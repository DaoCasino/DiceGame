function CCard(iX,iY,oContainer){
    var _bDealerCard;
    var _bRemoving;
    var _iState = -1;
    var _szFotogram;
    var _iValue;
    var _iCountCard;
    var _iTimeElaps;
    var _pStartingPoint;
    var _pEndingPoint;
    
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oCardSprite;
    var _oContainer;
                
    this._init = function(iX,iY,oContainer){
        _oContainer = oContainer;
        var oSprite = s_oSpriteLibrary.getSprite('card_spritesheet');
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: CARD_WIDTH, height: CARD_HEIGHT, regX: CARD_WIDTH/2, regY: CARD_HEIGHT/2}, 
                        animations: {  card_1_1: [0],card_1_2:[1],card_1_3:[2],card_1_4:[3],card_1_5:[4],card_1_6:[5],card_1_7:[6],card_1_8:[7],
                                       card_1_9:[8],card_1_10:[9],card_1_J:[10],card_1_Q:[11],card_1_K:[12],
                                       card_2_1: [13],card_2_2:[14],card_2_3:[15],card_2_4:[16],card_2_5:[17],card_2_6:[18],card_2_7:[19],
                                       card_2_8:[20], card_2_9:[21],card_2_10:[22],card_2_J:[23],card_2_Q:[24],card_2_K:[25],
                                       card_3_1: [26],card_3_2:[27],card_3_3:[28],card_3_4:[29],card_3_5:[30],card_3_6:[31],card_3_7:[32],
                                       card_3_8:[33], card_3_9:[34],card_3_10:[35],card_3_J:[36],card_3_Q:[37],card_3_K:[38],
                                       card_4_1: [39],card_4_2:[40],card_4_3:[41],card_4_4:[42],card_4_5:[43],card_4_6:[44],card_4_7:[45],
                                       card_4_8:[46], card_4_9:[47],card_4_10:[48],card_4_J:[49],card_4_Q:[50],card_4_K:[51],back:[52]}
                        
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCardSprite = createSprite(oSpriteSheet,"back",CARD_WIDTH/2,CARD_HEIGHT/2,CARD_WIDTH, CARD_HEIGHT);
        _oCardSprite.x = iX;
        _oCardSprite.y = iY;
        _oCardSprite.stop();
        _oContainer.addChild(_oCardSprite);

        _aCbCompleted=new Array();
        _aCbOwner =new Array();
    };
    
    this.unload = function(){
        _pStartingPoint=null;
        _pEndingPoint=null;
        _oContainer.removeChild(_oCardSprite);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
		
    this.setInfo = function(pStartingPoint,pEndingPoint,szFotogram,iValue,bDealerCard,iCountCard){
        _bRemoving=false;
        _iTimeElaps=0;
        _szFotogram = szFotogram;
        _iValue=iValue;

        _pStartingPoint = pStartingPoint;
        _pEndingPoint = pEndingPoint;

        _iCountCard=iCountCard;
        _bDealerCard=bDealerCard;

        _iState=STATE_CARD_DEALING;
    };
		
    this.removeFromTable = function(){
        if(_aCbCompleted[ON_CARD_TO_REMOVE]){
            _aCbCompleted[ON_CARD_TO_REMOVE].call(_aCbOwner[ON_CARD_TO_REMOVE],this);
        }
    };
		
    this.initSplit = function(pEndingPoint){
        _pStartingPoint=new CVector2(_oCardSprite.x,_oCardSprite.y);
        _pEndingPoint=pEndingPoint;

        _iTimeElaps=0;
        _iState=STATE_CARD_SPLIT;
    };
		
    this.initRemoving = function(pEndingPoint){
        _pStartingPoint=new CVector2(_oCardSprite.x,_oCardSprite.y);
        _pEndingPoint=pEndingPoint;
        _iTimeElaps=0;
        _iState=STATE_CARD_REMOVING;
    };
    
    this.setValue = function(){
        _oCardSprite.gotoAndStop(_szFotogram);
        var oParent = this;
        createjs.Tween.get(_oCardSprite).to({scaleX:1}, 100).call(function(){oParent.cardShown()});
    };
		
    this.showCard = function(){
        var oParent = this;
        createjs.Tween.get(_oCardSprite).to({scaleX:0.1}, 100).call(function(){oParent.setValue()});
    };
		
    this.hideCard = function(){
        var oParent = this;
        createjs.Tween.get(_oCardSprite).to({scaleX:0.1}, 100).call(function(){oParent.setBack()});
    };
    
    this.setBack = function(){
        _oCardSprite.gotoAndStop("back");
        var oParent = this;
        createjs.Tween.get(_oCardSprite).to({scaleX:1}, 100).call(function(){oParent.cardHidden()});
    };
		
    this.cardShown = function(){
        if(_aCbCompleted[ON_CARD_SHOWN]){
            _aCbCompleted[ON_CARD_SHOWN].call(_aCbOwner[ON_CARD_SHOWN]);
        }
    };
		
    this.cardHidden = function(){
        _bRemoving=true;
    };
		
    this.getValue = function(){
        return _iValue;
    };

    this.getFotogram = function(){
        return _szFotogram;
    };

    this._updateDealing = function(){
        _iTimeElaps+=s_iTimeElaps;
        
        if (_iTimeElaps >TIME_CARD_DEALING) {

                _iState=-1;
                _iTimeElaps = 0;

                _oCardSprite.x=_pEndingPoint.getX();
                _oCardSprite.y=_pEndingPoint.getY();
                _oCardSprite.rotation=360;

                if(_aCbCompleted[ON_CARD_ANIMATION_ENDING]){
                    _aCbCompleted[ON_CARD_ANIMATION_ENDING].call(_aCbOwner[ON_CARD_ANIMATION_ENDING],
                                                            this,_bDealerCard,_iCountCard);
                }

                if((_bDealerCard && _iCountCard === 2) === false){
                    this.showCard();
                }
        }else{
                this.visible=true;
                var fLerp = easeInOutCubic( _iTimeElaps, 0, 1, TIME_CARD_DEALING);
                var oPoint = new CVector2();

                oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, fLerp,oPoint);

                _oCardSprite.x=oPoint.getX();
                _oCardSprite.y=oPoint.getY();
                var iCurPerc = fLerp*100;

                if(_bDealerCard === false){
                    _oCardSprite.rotation = (iCurPerc*360) / 100;
                }
        }
    };

    this._updateSplit = function(){
        _iTimeElaps+=s_iTimeElaps;
        if (_iTimeElaps > TIME_CARD_DEALING) {
            _iTimeElaps = 0;
            if(_aCbCompleted[SPLIT_CARD_END_ANIM]){
                _aCbCompleted[SPLIT_CARD_END_ANIM].call(_aCbOwner[SPLIT_CARD_END_ANIM]);
            }
            _iState=-1;
        }else{
            var fLerp = easeInOutCubic( _iTimeElaps, 0, 1, TIME_CARD_DEALING);
            var oPoint = new CVector2();

            oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, fLerp,oPoint);
            _oCardSprite.x=oPoint.getX();
            _oCardSprite.y=oPoint.getY();
        }
    };

    this._updateRemoving = function(){
        _iTimeElaps += s_iTimeElaps;
        
        if (_iTimeElaps >TIME_CARD_REMOVE) {
            _iTimeElaps = 0;
            _oCardSprite.visible=false;
            _bRemoving=false;
            _iState=-1;
            //REMOVE CARD 
            if(_aCbCompleted[ON_CARD_TO_REMOVE]){
                _aCbCompleted[ON_CARD_TO_REMOVE].call(_aCbOwner[ON_CARD_TO_REMOVE],this);
            }
        }else{
            var fLerp = easeInOutCubic( _iTimeElaps, 0, 1, TIME_CARD_REMOVE);
            var oPoint = new CVector2();
            oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, fLerp,oPoint);
            _oCardSprite.x = oPoint.getX();
            _oCardSprite.y = oPoint.getY();
            var iCurPerc = fLerp*100;

            _oCardSprite.rotation = (iCurPerc*45) / 100;
            
        }
    };

    this.update = function(){
        switch(_iState){
            case STATE_CARD_DEALING:{
                this._updateDealing();
                break;
            }

            case STATE_CARD_SPLIT:{
                this._updateSplit();
                break;
            }

            case STATE_CARD_REMOVING:{
                if(_bRemoving === true){
                    this._updateRemoving();
                }
                break;
            }
        }
        
        
    };
    
    s_oCard = this;
    
    this._init(iX,iY,oContainer);
                
}

var s_oCard;