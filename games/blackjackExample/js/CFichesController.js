function CFichesController(pInsurance){
	
    var _bInsuranceActive;
    var _bSplitActive;
    var _bWinningHand;
    var _bFichesRemoving;
    var _iTimeElaps;
    var _iValue;
    var _iPrevValue;
    var _pFicheStartPos;
    var _pStartingPoint;
    var _pEndingPoint;
    var _pStartingPointInsurance;
    var _pEndingPointInsurance;
    var _oFichesAttach;
    var _oInsuranceFiches;
    
    var _aCbCompleted;
    var _aCbOwner;
    
    this._init= function(pInsurance){
        _oFichesAttach = new createjs.Container();
        _oFichesAttach.x = 834;
        _oFichesAttach.y = 566;
        s_oStage.addChild(_oFichesAttach);

	_oInsuranceFiches = new createjs.Container();
        _oInsuranceFiches.x = 400;
	_oInsuranceFiches.y = 230;
        s_oStage.addChild(_oInsuranceFiches);

	_pFicheStartPos=new CVector2();
        _pFicheStartPos.set(_oFichesAttach.x,_oFichesAttach.y);
	_pStartingPointInsurance = new CVector2();
        _pStartingPointInsurance.setV(pInsurance);

        _iTimeElaps=0;
        _iValue = _iPrevValue = 0;
        _bInsuranceActive=false;
        _bSplitActive=false;
        _bWinningHand=false;

        _aCbCompleted=new Array();
        _aCbOwner =new Array();
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.reset = function(){
        _bInsuranceActive=false;
        _bSplitActive=false;
        _bFichesRemoving=false;
        
        _iValue=0;

        _oFichesAttach.removeAllChildren();
        _oInsuranceFiches.removeAllChildren();

        _oFichesAttach.x=_pFicheStartPos.getX();
        _oFichesAttach.y=_pFicheStartPos.getY();

        _oInsuranceFiches.x=_pStartingPointInsurance.getX();
        _oInsuranceFiches.y=_pStartingPointInsurance.getY();
    };
		
    this.refreshFiches = function(aFiches,iXPos,iYPos,bInsurance){
        aFiches = aFiches.sortOn('value','index');

        var iXOffset=iXPos;
        var iYOffset=iYPos;

        if(bInsurance){
            _bInsuranceActive=true;
        }

        _iValue=0;
        var iCont=0;
        for(var i=0;i<aFiches.length;i++){
                var oNewFiche = createBitmap(s_oSpriteLibrary.getSprite("fiche_"+aFiches[i].index));
                oNewFiche.scaleX=0.7;
                oNewFiche.scaleY=0.7;
                if(bInsurance){
                    _oInsuranceFiches.addChild(oNewFiche);
                }else{
                    _oFichesAttach.addChild(oNewFiche);
                }

                oNewFiche.x = iXOffset;
                oNewFiche.y = iYOffset;
                iYOffset -= 5;
                iCont++;
                if(iCont>9 ){
                    iCont=0;
                    iXOffset+=FICHE_WIDTH;
                    iYOffset=iYPos;	
                }

                _iValue+=aFiches[i].value;
        }
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            playSound("chip", 1, 0);
        }
        
    };
		
    this.createFichesPile = function(iAmount,bInsurance){
        var aFichesValue = s_oGameSettings.getFichesValues();
        var aFichesPile = new Array();

        do{
            var iMinValue=aFichesValue[aFichesValue.length-1];
            var iCont=aFichesValue.length-1;
            while(iMinValue>iAmount){
                    iCont--;
                    iMinValue=aFichesValue[iCont];
            }

            var iNumFiches=Math.floor(iAmount/iMinValue);

            for(var i=0;i<iNumFiches;i++){
                    aFichesPile.push({value:iMinValue,index:s_oGameSettings.getIndexForFiches(iMinValue)});
            }
            var iRestAmount=iAmount%iMinValue;
            iAmount=iRestAmount;
        }while(iRestAmount>0);			

        this.refreshFiches(aFichesPile,0,0,bInsurance);
    };
    
    this.rebet = function(){
        this.createFichesPile(_iPrevValue,false);
    };
		
    this.initMovement = function(iXEnd,iYEnd,bWin){
        _iPrevValue = _iValue;
        _bWinningHand=bWin;
        _pStartingPoint=new CVector2(_oFichesAttach.x,_oFichesAttach.y);
        _pEndingPoint=new CVector2(iXEnd,iYEnd);
    };
		
    this.initInsuranceMov = function(iInsuranceXPos,iInsuranceYPos){
        _pEndingPointInsurance = new CVector2(iInsuranceXPos,iInsuranceYPos);
    };
		
    this.getValue = function(){
        return _iValue;
    };
    
    this.getPrevBet = function(){
        return _iPrevValue;
    };
		
    this._updateInsuranceFiches = function(){
        if(_bInsuranceActive){
            var fLerp = easeInOutCubic( _iTimeElaps, 0, 1, TIME_FICHES_MOV);
            var oPoint = tweenVectors(_pStartingPointInsurance, _pEndingPointInsurance, fLerp,new CVector2());
            _oInsuranceFiches.x=oPoint.getX();
            _oInsuranceFiches.y=oPoint.getY();
        }
    };
	
    this.update = function(iTime){
        if(_bFichesRemoving){
                return;
        }

        _iTimeElaps+=iTime;
        if(_iTimeElaps>TIME_FICHES_MOV){
                _iTimeElaps=0;
                _bFichesRemoving=true;
                if(_aCbCompleted[FICHES_END_MOV]){
                    _aCbCompleted[FICHES_END_MOV].call(_aCbOwner[FICHES_END_MOV],_bWinningHand,_iValue);
                }

        }else{
                var fLerp = easeInOutCubic( _iTimeElaps, 0, 1, TIME_FICHES_MOV);
                var oPoint = new CVector2();
                
                var oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, fLerp,oPoint);
                _oFichesAttach.x=oPoint.getX();
                _oFichesAttach.y=oPoint.getY();
                this._updateInsuranceFiches();
        }
    };
    
    this._init(pInsurance);
    
}