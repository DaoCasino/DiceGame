function CGame(oData){
    var _bUpdate = false;
    var _bWinAssigned;
    var _bDistributeFiches;
    var _iState;
    var _iTimeElaps;
    var _iNumberPoint;
    var _iContRolling;
    var _iMaxNumRolling;
    var _iCasinoCash;
    var _iHandCont;

    var _aDiceResultHistory;
    var _aDiceResult;
    var _aFichesToMove;
    var _aBetHistory;
    var _aBetsToRemove;
    var _oDiceRollingSfx;
        
    var _oMySeat;
    var _oDicesAnim;
    var _oPuck;
    var _oInterface;
    var _oTableController;
    var _oMsgBox;
    var _oGameOverPanel;
    var _oAreYouSurePanel;
    
    
    this._init = function(){
        s_oTweenController = new CTweenController();
        s_oGameSettings = new CGameSettings();
        
        _oTableController = new CTableController();
        _oTableController.addEventListener(ON_SHOW_ENLIGHT,this._onShowEnlight);
        _oTableController.addEventListener(ON_HIDE_ENLIGHT,this._onHideEnlight);
        _oTableController.addEventListener(ON_SHOW_BET_ON_TABLE,this._onShowBetOnTable);
        
        _bDistributeFiches = false;
        _iHandCont = 0;
        _iState=-1;

        _iNumberPoint = -1;

        _aBetHistory = new Object();

        _oMySeat = new CSeat();
        _oPuck = new CPuck(325,108,s_oStage);
        
        _oInterface = new CInterface();
        
        _oDicesAnim = new CDicesAnim(240,159);
        
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oGameOverPanel = new CGameOver();
        _oMsgBox = new CMsgBox();
	
        _aDiceResultHistory=new Array();

        _iTimeElaps=0;
        this._onSitDown();
	
        _bUpdate = true;
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.stop();
        }

        _oInterface.unload();
        _oTableController.unload();
        _oMsgBox.unload();
        _oGameOverPanel.unload();

        s_oStage.removeAllChildren();
    };

    this._setState = function(iState){
        _iState=iState;

        switch(iState){
            case STATE_GAME_WAITING_FOR_BET:{
                if (_oMySeat.getCredit() < s_oGameSettings.getFicheValues(0)) {
                    _iState = -1;
                    setTimeout(function(){_oInterface.hideBlock();
                                            _oGameOverPanel.show();
                                        },2000);
                    return;
                }
                _iNumberPoint = -1;
                _iContRolling = 0;
                _iMaxNumRolling = Math.floor(Math.random() * (6 - 3) + 3);
                _oInterface.enableClearButton();

                if(_oMySeat.getCurBet() === 0){
                    _oInterface.enableRoll(false);
                }
                
                _iHandCont++;
                if(_iHandCont > NUM_HAND_FOR_ADS){
                    _iHandCont = 0;
                    $(s_oMain).trigger("show_interlevel_ad");
                }
                
                _oInterface.hideBlock();
                break;
            }
        }
        
        _oTableController.setState(iState);
    };
    
    
    
    this._prepareForRolling = function(){
        _oInterface.disableBetFiches();
        _oInterface.disableClearButton();
        
        _iContRolling++;
        _aDiceResult = new Array();
        this._generateWinLoss();
        _aDiceResultHistory.push(_aDiceResult);

        _iTimeElaps = 0;
    };
    
    this._generateWinLoss = function(){
        
        var iWinOccurence;
        if(_iCasinoCash < _oMySeat.getCurBet()*2){
            iWinOccurence = 0;
        }else{
            iWinOccurence = WIN_OCCURRENCE;
        }
        
        
        var aDiceForLose;
        var aDiceForWin;
        
        for(var szBet in _aBetHistory){
            //BET STRING EXCEPTION
            if(szBet.indexOf("any11_") !== -1){
                szBet = "any11";
            }else if(szBet.indexOf("any_craps") !== -1){
                szBet = "any_craps";
            }
            
            var oRet = s_oGameSettings.getBetWinLoss(_iState,_iNumberPoint,szBet);
            aDiceForLose = oRet.lose;
            aDiceForWin = oRet.win;
        }

        var iRand = Math.floor(Math.random() * (100));

        if (iRand >= iWinOccurence) {
            //LOSE
            _bWinAssigned = false;
            if(_iContRolling > _iMaxNumRolling){
                //FORCE LOSING
                do{
                    var aDices = this._generateRandomDices();

                    var iSumDices = aDices[0] + aDices[1];
                }while(aDiceForLose[iSumDices-1] === 0);
            }else{
                do{
                    var aDices = this._generateRandomDices();

                    var iSumDices = aDices[0] + aDices[1];
                    var bRet = aDiceForWin[iSumDices-1] === 0?true:false;
                }while(!bRet);
            }   
            
        }else {
            //WIN
            _bWinAssigned = true;
            
            if(_iContRolling > _iMaxNumRolling){
                //FORCE WINNING
                if(szBet.indexOf("hardway") !== -1){
                    var aDices = this._checkHardwayWin(szBet);
                }else{
                    do{
                        var aDices = this._generateRandomDices();
                        var iSumDices = aDices[0] + aDices[1];
                    }while(aDiceForWin[iSumDices-1] === 0);
                }
                
            }else{
                if(szBet.indexOf("hardway") !== -1){
                    var aDices = this._checkHardwayWin(szBet);
                }else{
                    do{
                        var aDices = this._generateRandomDices();
                        var iSumDices = aDices[0] + aDices[1];
                        var bRet = aDiceForLose[iSumDices-1] === 0?false:true;

                    }while(bRet);
                }
            }
        }

        _aDiceResult[0] = aDices[0];
        _aDiceResult[1] = aDices[1];
    };
    
    this._generateRandomDices = function(){
        var aRandDices = new Array();
        var iRand = Math.floor(Math.random()*6) + 1;
        aRandDices.push(iRand);
        var iRand = Math.floor(Math.random()*6) + 1;
        aRandDices.push(iRand);
        
        return aRandDices;
    };
    
    this._checkHardwayWin = function(szBet){
        var iDice1 = 6;
        var iDice2 = 6;
        switch(szBet){
            case "hardway6":{
                iDice1 = 3;
                iDice2 = 3;    
                break;
            }
            case "hardway10":{
                iDice1 = 5;
                iDice2 = 5;
                break;
            }
            case "hardway8":{
                iDice1 = 4;
                iDice2 = 4;
                break;
            }
            case "hardway4":{
                iDice1 = 2;
                iDice2 = 2;
                break;
            }
        }

        do{
            var aDices = this._generateRandomDices();
        }while(aDices[0] !== iDice1 || aDices[1] !== iDice2);
        
        return aDices;
    };
    
    this._checkIfLosingResult = function(aDices,aLoseResult){
        var iSumDices = aDices[0] + aDices[1];
        if(aLoseResult[iSumDices-1] === 0){
            return false;
        }else{
            return true;
        }
    };
    
    this._startRollingAnim = function(){
        _oDicesAnim.startRolling(_aDiceResult);
    };
    
    this.dicesAnimEnded = function(){
        var iSumDices = _aDiceResult[0] + _aDiceResult[1];

        if(_iState === STATE_GAME_COME_OUT){

            //FIRST SHOOT
            if(iSumDices !== 2 && iSumDices !== 3 && iSumDices !== 12 && iSumDices !== 7 && iSumDices !== 11){
                //ASSIGN NUMBER
                this._assignNumber(iSumDices);
            }
            
            this._checkWinForBet();
            
            if(_aFichesToMove.length > 0){
                _bDistributeFiches = true;
                
                for(var j=0;j<_aBetsToRemove.length;j++){
                    _oMySeat.removeBet(_aBetsToRemove[j]);
                    delete _aBetHistory[_aBetsToRemove[j]];
                }
                
                
                _oInterface.setCurBet(_oMySeat.getCurBet());
                
            }
            
            if(_iNumberPoint !== -1){
                this._setState(STATE_GAME_COME_POINT);
            }
        }else{
            this._checkWinForBet();
            
            if(_aFichesToMove.length > 0){
                _bDistributeFiches = true;
                
                for(var j=0;j<_aBetsToRemove.length;j++){
                    _oMySeat.removeBet(_aBetsToRemove[j]);
                    delete _aBetHistory[_aBetsToRemove[j]];
                }
                
                _oInterface.setCurBet(_oMySeat.getCurBet());
            }
            
            if(_iNumberPoint === iSumDices){
                //PASS LINE WINS
                _oPuck.switchOff();
                this._setState(STATE_GAME_WAITING_FOR_BET);
                
            }else if(iSumDices === 7){
                //END TURN
                _oPuck.switchOff();
                this._setState(STATE_GAME_WAITING_FOR_BET);
            }
        }
        
        
        _oInterface.setMoney(_oMySeat.getCredit());
        if(Object.keys(_aBetHistory).length > 0){
            _oInterface.enableRoll(true);
            _oInterface.enableClearButton();
        }
        
        _oInterface.hideBlock();
        _oInterface.enableBetFiches();
        $(s_oMain).trigger("save_score",[_oMySeat.getCredit()]);
    };
    
    this._assignNumber = function(iNumber){
        _iNumberPoint = iNumber;
        
        //PLACE 'ON' PLACEHOLDER
        var iNewX = s_oGameSettings.getPuckXByNumber(_iNumberPoint);
        _oPuck.switchOn(iNewX);
        
        //ENABLE GUI
        _oInterface.hideBlock();
    };
    
    this._checkWinForBet = function(){
        var iSumDices = _aDiceResult[0] + _aDiceResult[1];
        
        var iTotWin = 0;
        _aFichesToMove = new Array();
        _aBetsToRemove = new Array();
        for(var szBet in _aBetHistory){
            var szOrigBetName = szBet;
            //BET STRING EXCEPTION
            if(szBet.indexOf("any11_") !== -1){
                szBet = "any11_7";
            }else if(szBet.indexOf("any_craps") !== -1){
                szBet = "any_craps_7";
            }
            
            var iAmountForBet = _oMySeat.getBetAmountInPos(szOrigBetName);
            var iWin = s_oGameSettings.checkBetWin(iSumDices,_iState,iAmountForBet,_iNumberPoint,szBet,_aDiceResult);

            //END SWITCH
            if(iWin !== -1){
                iTotWin += iWin;

                var aFicheMc = _oMySeat.getFicheMc(szBet);
                _aBetsToRemove.push(szOrigBetName);

                for(var k=0;k<aFicheMc.length;k++){
                    _aFichesToMove.push(aFicheMc[k]);
                    if(iWin > 0){
                        var oEndPos = s_oGameSettings.getAttachOffset("oReceiveWin");
                        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                            createjs.Sound.play("win",{volume:0.2});
                        }
                    }else{
                        var oEndPos = s_oGameSettings.getAttachOffset("oDealerWin");
                        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                            createjs.Sound.play("lose",{volume:0.2});
                        }
                    }
                    
                    aFicheMc[k].setEndPoint(oEndPos.x,oEndPos.y);
                    
                    _oMySeat.decreaseBet(s_oGameSettings.getFicheValues(_aFichesToMove[k].getValue()));
                }
                
                if(iWin > 0){
                    //INCREASE MONEY
                    _oMySeat.showWin(_oMySeat.getBetAmountInPos(szOrigBetName) +iWin);
                    _iCasinoCash -= iWin;
                    
                    var pPosFiche = aFicheMc[0].getStartingPos();
                    new CScoreText(iWin+TEXT_CURRENCY,pPosFiche.x,pPosFiche.y);
                }
                
            }
        }
        
        if(iTotWin > 0){
            _oInterface.refreshMsgHelp(TEXT_YOU_WIN + ": "+iTotWin);
            setTimeout(function(){_oInterface.clearMsgHelp();},3000);
        }
    };
    
    this.assignBetFromCome = function(iNumberAssigned,szOrigBet){
        var aFicheMc = _oMySeat.getFicheMc(szOrigBet);
        
        //MOVE FICHES
        for(var k=0;k<aFicheMc.length;k++){
            _aFichesToMove.push(aFicheMc[k]);
            var oEndPos = s_oGameSettings.getAttachOffset("number"+iNumberAssigned);

            aFicheMc[k].setEndPoint(oEndPos.x,oEndPos.y);
        }
        
        
        _aBetHistory["number"+iNumberAssigned] = _aBetHistory[szOrigBet];
        delete _aBetHistory[szOrigBet];
        
        _oMySeat.swapBet(szOrigBet,"number"+iNumberAssigned);
    };
    
    this.assignBetFromDontCome = function(iNumberAssigned,szOrigBet){
        var aFicheMc = _oMySeat.getFicheMc(szOrigBet);
        
        //MOVE FICHES
        for(var k=0;k<aFicheMc.length;k++){
            _aFichesToMove.push(aFicheMc[k]);
            var oEndPos = s_oGameSettings.getAttachOffset("lay_bet"+iNumberAssigned);

            aFicheMc[k].setEndPoint(oEndPos.x,oEndPos.y);
        }
        
        
        _aBetHistory["lay_bet"+iNumberAssigned] = _aBetHistory[szOrigBet];
        delete _aBetHistory[szOrigBet];
        
        _oMySeat.swapBet(szOrigBet,"lay_bet"+iNumberAssigned);
    };
    
    this.onRecharge = function() {
        _oMySeat.recharge(TOTAL_MONEY);
        _oInterface.setMoney(_oMySeat.getCredit());

        this._setState(STATE_GAME_WAITING_FOR_BET);
        
        _oGameOverPanel.hide();
        
        $(s_oMain).trigger("recharge");
    };
    
    this.onRoll = function(){
        if (_oMySeat.getCurBet() === 0) {
                return;
        }

        if(_oMySeat.getCurBet() < MIN_BET){
            _oMsgBox.show(TEXT_ERROR_MIN_BET);
            _oInterface.enableBetFiches();
            _oInterface.enableRoll(true);
            return;
        }

        if(_oInterface.isBlockVisible()){
                return;
        }

        _oInterface.showBlock();
        
        if(_iState === STATE_GAME_WAITING_FOR_BET){
            this._setState(STATE_GAME_COME_OUT);
        }
        
        
        this._prepareForRolling();
        this._startRollingAnim();    
    };
    
    this._onSitDown = function(){
        this._setState(STATE_GAME_WAITING_FOR_BET);
        _oMySeat.setInfo(TOTAL_MONEY, _oTableController.getContainer());
        _oInterface.setMoney(TOTAL_MONEY);
        _oInterface.setCurBet(0);
    };
    
    this._onShowBetOnTable = function(oParams){
        var szBut = oParams.button;

        var  iIndexFicheSelected = _oInterface.getCurFicheSelected();
        var iFicheValue=s_oGameSettings.getFicheValues(iIndexFicheSelected);
        
        var iCurBet=_oMySeat.getCurBet();
        if( (_oMySeat.getCredit() - iFicheValue) < 0){
            //SHOW MSG BOX
            _oMsgBox.show(TEXT_ERROR_NO_MONEY_MSG);
            return;
        }
        
        if( (iCurBet + iFicheValue) > MAX_BET ){
            _oMsgBox.show(TEXT_ERROR_MAX_BET_REACHED);
            return;
        }

        if(_aBetHistory[oParams.button] === undefined){
            _aBetHistory[oParams.button] = iFicheValue;
        }else{
            _aBetHistory[oParams.button] += iFicheValue;
        }
        
        _oMySeat.addFicheOnTable(iFicheValue,iIndexFicheSelected,szBut);
        
        _oInterface.setMoney(_oMySeat.getCredit());
        _oInterface.setCurBet(_oMySeat.getCurBet());
        _oInterface.enableRoll(true);
        _oInterface.refreshMsgHelp(TEXT_READY_TO_ROLL,true);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("chip");
        }
    };
    
    
    
    this._onShowEnlight = function(oParams){
        var szEnlight=oParams.enlight;
        if(szEnlight){
            _oTableController.enlight(szEnlight);
            
            _oInterface.refreshMsgHelp(TEXT_HELP_MSG[szEnlight],false);
        }
    };
    
    this._onHideEnlight = function(oParams){
        var szEnlight=oParams.enlight;
        if(szEnlight){
            _oTableController.enlightOff(szEnlight);
            _oInterface.clearMsgHelp();
        }
    };
    
    this.onClearAllBets = function(){
        if(_iState === STATE_GAME_COME_POINT){
            _oMySeat.clearAllBetsInComePoint();
            for(var i in _aBetHistory){
                if( i !== "pass_line" && i!== "dont_pass1" && i!== "dont_pass2"){
                    delete _aBetHistory[i];
                }
            }
        }else{
            _oMySeat.clearAllBets();
            _aBetHistory = new Object();
            _oInterface.enableRoll(false);
        }
        
        _oInterface.setMoney(_oMySeat.getCredit());
        _oInterface.setCurBet(_oMySeat.getCurBet());
        
    };
   
    this.onExit = function(bForceExit){
        if(bForceExit){
            this.unload();
            s_oMain.gotoMenu();
        }else{
            _oAreYouSurePanel.show();  
        }
        
    };
    
    this.onConfirmExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event",_oMySeat.getCredit());
    };
    
    this._updateDistributeFiches = function(){
        _iTimeElaps += s_iTimeElaps;
        if(_iTimeElaps > TIME_FICHES_MOV){
            _iTimeElaps = 0;
            _bDistributeFiches = false;
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("fiche_collect");
            }
        }else{
            var fLerp = s_oTweenController.easeInOutCubic( _iTimeElaps, 0, 1, TIME_FICHES_MOV);
            for(var i=0;i<_aFichesToMove.length;i++){
                _aFichesToMove[i].updatePos(fLerp);
            }
        }
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
        if(_bDistributeFiches){
            this._updateDistributeFiches();
        }
        
        if(_oDicesAnim.isVisible()){
            _oDicesAnim.update();
        }
        
    };
    
    s_oGame = this;
    
    TOTAL_MONEY = oData.money;
    MIN_BET = oData.min_bet;
    MAX_BET = oData.max_bet;
    WIN_OCCURRENCE = oData.win_occurrence;
    TIME_SHOW_DICES_RESULT = oData.time_show_dice_result;
    NUM_HAND_FOR_ADS = oData.num_hand_before_ads;
    _iCasinoCash = oData.casino_cash;
    
    this._init();
}

var s_oGame;
var s_oTweenController;
var s_oGameSettings;