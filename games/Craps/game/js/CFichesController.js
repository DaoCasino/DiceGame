function CFichesController(oContainer){
    
    var _aValueFichesInPos;
    var _aMcFichesInPos;
    var _aFichesOnTable;
		
    var _oContainer;
    
    this._init = function(oContainer){
        _oContainer=oContainer;
        this.reset();
    };
    
    this.reset = function(){
        this._removeAllFichesOnTable();

        _aValueFichesInPos=new Array();
        _aMcFichesInPos=new Array();
        _aFichesOnTable=new Array();
    };
    
    this.setFicheOnTable = function(iIndexFicheSelected,szNameAttach,aMcFiches){
        if(szNameAttach.indexOf("any_craps_")!== -1){
            szNameAttach = "any_craps_7";
        }else if(szNameAttach.indexOf("any11_") !== -1){
            szNameAttach = "any11_7";
        }
        this.addFicheOnTable(iIndexFicheSelected,szNameAttach,aMcFiches);
    };
		
    this.addFicheOnTable = function(iIndexFicheSelected,szNameAttach,aMcFiches){
        if(_aValueFichesInPos[szNameAttach] === undefined){
            _aValueFichesInPos[szNameAttach] = 0;
        }

        var iFicheValue = s_oGameSettings.getFicheValues(iIndexFicheSelected);
        _aValueFichesInPos[szNameAttach] += iFicheValue;
        _aValueFichesInPos[szNameAttach] = roundDecimal(_aValueFichesInPos[szNameAttach],1);

        var aFiches = s_oGameSettings.generateFichesPileByIndex(_aValueFichesInPos[szNameAttach]);
        aFiches.sort(function(a, b){return a-b});

        this._removeFichesPile(_aMcFichesInPos[szNameAttach]);
        _aMcFichesInPos[szNameAttach] = new Array();

        var oPos = s_oGameSettings.getAttachOffset(szNameAttach);
        var iXPos =oPos.x;
        var iYPos =oPos.y;
        for(var k=0;k<aFiches.length;k++){
                aMcFiches.push(this._attachFichesPile(aFiches[k],szNameAttach,iXPos,iYPos));
                iYPos-=5;
        }
    };
		
    this._attachFichesPile = function(iIndexFicheSelected,szNameAttach,iXPos,iYPos){
        var oFicheMc = new CFiche(iXPos,iYPos,iIndexFicheSelected,_oContainer);
        _aMcFichesInPos[szNameAttach].push(oFicheMc);
        _aFichesOnTable.push(oFicheMc);

        return oFicheMc;
    };
		
    this._removeAllFichesOnTable = function(){
        if(_aFichesOnTable){
            for(var i=0;i<_aFichesOnTable.length;i++){
                if(_oContainer.contains(_aFichesOnTable[i].getSprite())){
                    _oContainer.removeChild(_aFichesOnTable[i].getSprite());
                }
            }
        }
    };
		
    this._removeFichesPile = function(aFiches){
        for(var i in aFiches){
            _oContainer.removeChild(aFiches[i].getSprite());
        }
    };
    
    this.removeBet = function(szName){
        _aMcFichesInPos[szName] = new Array();
        _aValueFichesInPos[szName] = 0;
    };
    
    this.swapBet = function(szPrevBet,szNewBet){
        _aMcFichesInPos[szNewBet] = _aMcFichesInPos[szPrevBet];
        _aValueFichesInPos[szNewBet] = _aValueFichesInPos[szPrevBet];
        this.removeBet(szPrevBet);
    };
		
    this.clearAllBets = function(){
        this._removeAllFichesOnTable();
        _aValueFichesInPos = new Array();
        _aMcFichesInPos = new Array();
        _aFichesOnTable = new Array();
    };
    
    this.clearAllBetsInComePoint = function(){
        //REMOVE ATTACHED CHILDREN
        if(_aMcFichesInPos){
            var iBetToSubtract = 0;
            for(var i in _aMcFichesInPos){
                if( i !== "pass_line" && i!== "dont_pass1" && i!== "dont_pass2"){
                    iBetToSubtract += _aValueFichesInPos[i];
                    for(var j=0;j<_aMcFichesInPos[i].length;j++){
                        _oContainer.removeChild(_aMcFichesInPos[i][j].getSprite());
                    }
                    
                    delete _aValueFichesInPos[i];
                    delete _aMcFichesInPos[i];
                    delete _aFichesOnTable[i];
                }
            }
        }
        
        return iBetToSubtract;
    };
    
    this.getFicheMc = function(szName){
        return _aMcFichesInPos[szName];
    };
    
    this.getBetAmountInPos = function(szName){
        return _aValueFichesInPos[szName];
    };
    
    this._init(oContainer);
}