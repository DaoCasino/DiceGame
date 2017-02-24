function CHandController(oAttachOffset,oFicheController){
    
    var _iHandValue;
    var _iNumAces;
    var _iCurBet;
    var _aCards;
    var _oAttachOffset;
    var _oFichesController;
                
    this._init = function(oAttachOffset,oFicheController){
        _iHandValue=0;
	_iNumAces=0;
	_iCurBet=0;
	_aCards=new Array();
	_oAttachOffset=oAttachOffset;
	_oFichesController=oFicheController;
    };
    
    this.addCard = function(oCard){
        _aCards.push(oCard);
        if(oCard.getValue() === 11){
                _iNumAces++;
        }
    };
    
    this.removeCard = function(iIndex){
        var oCard=_aCards[iIndex];
        _iHandValue -= oCard.getValue();
        if(oCard.getValue() === 11){
                _iNumAces--;
        }
        _aCards.splice(iIndex,1);
    };
		
    this.changeBet = function(iBet){
        _iCurBet = iBet;
    };
		
    this.removeAce = function(){
        _iHandValue -= 10;
        _iNumAces--;
    };
		
    this.setHandValue = function(iValue) {
        _iHandValue = iValue;
    };
		
    this.increaseHandValue = function(iAmount){
        _iHandValue+=iAmount;
    };
		
    this.getValue = function(){
        return _iHandValue;
    };
		
    this.getCurBet = function(){
        return _iCurBet;
    };
		
    this.getDoubleBet = function(){
        return _iCurBet;
    };
		
    this.getAces = function(){
        return _iNumAces;
    };
		
    this.getCard = function(iIndex){
        return _aCards[iIndex];
    };
		
    this.getNumCards = function(){
        return _aCards.length;
    };
		
    this.getAttachOffset = function(){
        return _oAttachOffset;
    };
		
    this.getFichesController = function(){
        return _oFichesController;
    };
    
    this._init(oAttachOffset,oFicheController);
}