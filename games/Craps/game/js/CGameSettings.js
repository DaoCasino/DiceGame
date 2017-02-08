function CGameSettings(){
    
    var _aFicheValues;
    var _aBetMultiplier;
    var _aPuckPos;
    var _aHelpMsg;
    var _aAttachFiches;
    
    this._init = function(){
        this._initAttachFiches();
        this._initBetMultiplier();
        
        this._setPuckPos();
        _aFicheValues = [1,5,10,25,50,100];
        NUM_FICHES = _aFicheValues.length;
    };
    
    this._initAttachFiches = function(){
        _aAttachFiches = new Array();

        _aAttachFiches["pass_line"] = {x:360,y:555};
        _aAttachFiches["dont_pass1"] = {x:730,y:503};
        _aAttachFiches["dont_pass2"] = {x:254,y:320};
        _aAttachFiches["dont_come"] = {x:322,y:238};
        _aAttachFiches["come"] = {x:740,y:330};
        _aAttachFiches["field"] = {x:570,y:420};
        _aAttachFiches["big_6"] = {x:260,y:440};
        _aAttachFiches["big_8"] = {x:316,y:490};
        
        var aData = [{value:4,x:408,y:142},{value:5,x:494,y:142},{value:6,x:580,y:142},{value:8,x:666,y:142},{value:9,x:752,y:142},{value:10,x:838,y:142}];
        for(var i=0;i<aData.length;i++){
            _aAttachFiches["lay_bet"+aData[i].value] = {x:aData[i].x+20,y:aData[i].y};
            _aAttachFiches["lose_bet"+aData[i].value] = {x:aData[i].x-20,y:aData[i].y+20};
            _aAttachFiches["number"+aData[i].value] = {x:aData[i].x,y:aData[i].y+69};
            _aAttachFiches["win_bet"+aData[i].value] = {x:aData[i].x,y:aData[i].y+116};
        }

        _aAttachFiches["any11_7"] = {x:1032,y:582};
        _aAttachFiches["any_craps_7"] = {x:1032,y:631};
            
        _aAttachFiches["seven_bet"] = {x:1032,y:356};
        _aAttachFiches["hardway6"] = {x:955,y:400};
        _aAttachFiches["hardway10"] = {x:1112,y:400};
        _aAttachFiches["hardway8"] = {x:955,y:460};
        _aAttachFiches["hardway4"] = {x:1112,y:460};
        _aAttachFiches["horn3"] = {x:930,y:520};
        _aAttachFiches["horn2"] = {x:1032,y:520};
        _aAttachFiches["horn12"] = {x:1134,y:520};
        
        
        _aAttachFiches["oDealerWin"] = {x:CANVAS_WIDTH/2,y:-232};
        _aAttachFiches["oReceiveWin"] = {x:CANVAS_WIDTH/2,y:CANVAS_HEIGHT + 100};
    };
    
    this._initBetMultiplier = function(){
        _aBetMultiplier = new Array();
        
        _aBetMultiplier["pass_line"] = 1;
        _aBetMultiplier["dont_pass1"] = 1;
        _aBetMultiplier["dont_pass2"] = 1;
        _aBetMultiplier["dont_come"] = 1;
        _aBetMultiplier["come"] = 1;
        _aBetMultiplier["field"] = 1;
        _aBetMultiplier["big_6"] = 1;
        _aBetMultiplier["big_8"] = 1;
        
        var aData = [4,5,6,8,9,10];
        var aBetLay = [0.5,0.66,0.83,0.83,0.66,0.5];
        var aLoseBet = [0.45,0.62,0.8,0.8,0.62,0.45];
        var aNumberBet = [2,1.5,1.2,1.2,1.5,2];
        var aWinBet = [1.8,1.4,1.17,1.17,1.4,1.8];
        for(var i=0;i<aData.length;i++){
            _aBetMultiplier["lay_bet"+aData[i]] = aBetLay[i];
            _aBetMultiplier["lose_bet"+aData[i]] = aLoseBet[i];
            _aBetMultiplier["number"+aData[i]] = aNumberBet[i];
            _aBetMultiplier["win_bet"+aData[i]] = aWinBet[i];
        }
            
        _aBetMultiplier["any11_7"] = 15;
        _aBetMultiplier["any_craps_7"] = 7;
        
        _aBetMultiplier["seven_bet"] = 4;
        _aBetMultiplier["hardway6"] = 9;
        _aBetMultiplier["hardway10"] = 7;
        _aBetMultiplier["hardway8"] = 9;
        _aBetMultiplier["hardway4"] = 7;
        _aBetMultiplier["horn3"] = 15;
        _aBetMultiplier["horn2"] = 30;
        _aBetMultiplier["horn12"] = 30;
    };

    this.generateFichesPileByIndex = function(iFichesValue){
        
            var aFichesPile=new Array();
            var iValueRest;
            var iCont=_aFicheValues.length-1;
            var iCurMaxFicheStake=_aFicheValues[iCont];
            
            do{     
                    iValueRest=iFichesValue%iCurMaxFicheStake;
                    iValueRest=roundDecimal(iValueRest,1);
                    
                    var iDivisionWithPrecision=roundDecimal(iFichesValue/iCurMaxFicheStake,1);
                    var iDivision=Math.floor(iDivisionWithPrecision);
                    for(var i=0;i<iDivision;i++){
                            aFichesPile.push(this.getFicheIndexByValue(iCurMaxFicheStake));
                    }

                    iCont--;
                    iCurMaxFicheStake=_aFicheValues[iCont];
                    
                    iFichesValue=iValueRest;
            }while(iValueRest>0 && iCont>-1);

            return aFichesPile;
    };
    
    this._setPuckPos = function(){
        _aPuckPos = new Array();
        _aPuckPos[4] = 410;
        _aPuckPos[5] = 495;
        _aPuckPos[6] = 580;
        _aPuckPos[8] = 666;
        _aPuckPos[9] = 752;
        _aPuckPos[10] = 836;
    };
    
    this.getBetWinLoss = function(iState,iNumberPoint,szBet){
        var aDiceForWin = [0,0,0,0,0,0,0,0,0,0,0,0];
        var aDiceForLose = [0,0,0,0,0,0,0,0,0,0,0,0];

        switch(szBet){
                case "pass_line":{
                    if(iState === STATE_GAME_COME_OUT){
                        //SET NATURAL (7 or 11) AS WINNING RESULT
                        aDiceForWin[6] = 1;
                        aDiceForWin[10] = 1;

                        aDiceForLose[1] = 1;
                        aDiceForLose[2] = 1;
                        aDiceForLose[11] = 1;
                    }else{
                        aDiceForWin[iNumberPoint-1] = 1;
                        
                        aDiceForLose[6] = 1;
                    }
                    
                    break;
                }
                case "come":{
                    aDiceForWin[6] = 1;
                    aDiceForWin[10] = 1;

                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[11] = 1;   
                    break;
                }
                case "dont_pass1":
                case "dont_pass2": {
                    if(iState === STATE_GAME_COME_OUT){
                        aDiceForWin[1] = 1;
                        aDiceForWin[2] = 1; 
                        aDiceForWin[11] = 1; 

                        aDiceForLose[6] = 1;
                        aDiceForLose[10] = 1;
                    }else{
                        aDiceForWin[6] = 1;
                        
                        aDiceForLose[iNumberPoint-1] = 1;
                    }
                    break;
                }
                case "dont_come":{
                    aDiceForWin[1] = 1;
                    aDiceForWin[2] = 1; 
                    aDiceForWin[11] = 1; 
                    
                    aDiceForLose[6] = 1;
                    aDiceForLose[10] = 1;
                    break;
                }
                case "field":{
                    aDiceForWin[1] = 1;
                    aDiceForWin[2] = 1;
                    aDiceForWin[3] = 1;
                    aDiceForWin[8] = 1;
                    aDiceForWin[9] = 1;
                    aDiceForWin[10] = 1;
                    aDiceForWin[11] = 1;
                    
                    aDiceForLose[0] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    break;
                }
                case "big_6":{
                    aDiceForWin[5] = 1;
                    break;
                }
                case "big_8":{
                    aDiceForWin[7] = 1;
                    break;
                }
                case "lay_bet4":
                case "lose_bet4":{
                    aDiceForWin[6] = 1;
                    
                    aDiceForLose[3] = 1;
                    break;
                }
                case "lay_bet5":
                case "lose_bet5":{
                    aDiceForWin[6] = 1;
                    
                    aDiceForLose[4] = 1;
                    break;
                }
                case "lay_bet6":
                case "lose_bet6":{
                    aDiceForWin[6] = 1;
                    
                    aDiceForLose[5] = 1;
                    break;
                }
                case "lay_bet8":
                case "lose_bet8":{
                    aDiceForWin[6] = 1;
                    
                    aDiceForLose[7] = 1;
                    break;
                }
                case "lay_bet9":
                case "lose_bet9":{
                    aDiceForWin[6] = 1;
                    
                    aDiceForLose[8] = 1;
                    break;
                }
                case "lay_bet10":
                case "lose_bet10":{
                    aDiceForWin[6] = 1;
                    
                    aDiceForLose[9] = 1;
                    break;
                }
                case "number4":
                case "win_bet4":{
                    aDiceForWin[3] = 1;
                    
                    aDiceForLose[6] = 1;
                    break;
                }
                case "number5":
                case "win_bet5":{
                    aDiceForWin[4] = 1;
                    
                    aDiceForLose[6] = 1;
                    break;
                }
                case "number6":
                case "win_bet6":{
                    aDiceForWin[5] = 1;
                    
                    aDiceForLose[6] = 1;
                    break;
                }
                case "number8":
                case "win_bet8":{
                    aDiceForWin[7] = 1;
                    
                    aDiceForLose[6] = 1;
                    break;
                }
                case "number9":
                case "win_bet9":{
                    aDiceForWin[8] = 1;
                    
                    aDiceForLose[6] = 1;
                    break;
                }
                case "number10":
                case "win_bet10":{
                    aDiceForWin[9] = 1;
                    
                    aDiceForLose[6] = 1;
                    break;
                }
                case "any11":{
                    aDiceForWin[10] = 1;
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                
                case "any_craps":{
                    aDiceForWin[1] = 1;
                    aDiceForWin[2] = 1;
                    aDiceForWin[11] = 1;
                    
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    break;
                }
                case "seven_bet":{
                    aDiceForWin[6] = 1;
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                case "hardway6":{
                    aDiceForWin[5] = 1; 
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                case "hardway10":{
                    aDiceForWin[9] = 1;    
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[10] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                case "hardway8":{
                    aDiceForWin[7] = 1;    
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                case "hardway4":{
                    aDiceForWin[3] = 1;    
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                case "horn3":{
                    aDiceForWin[2] = 1;     
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                case "horn2":{
                    aDiceForWin[1] = 1;        
                    
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    aDiceForLose[11] = 1;
                    break;
                }
                case "horn12":{
                    aDiceForWin[11] = 1;        
                    
                    aDiceForLose[1] = 1;
                    aDiceForLose[2] = 1;
                    aDiceForLose[3] = 1;
                    aDiceForLose[4] = 1;
                    aDiceForLose[5] = 1;
                    aDiceForLose[6] = 1;
                    aDiceForLose[7] = 1;
                    aDiceForLose[8] = 1;
                    aDiceForLose[9] = 1;
                    aDiceForLose[10] = 1;
                    
                    break;
                }
            }
            
            return {win:aDiceForWin,lose:aDiceForLose};
    };
    
    this.checkBetWin = function(iSumDices,iState,iAmountForBet,iNumberPoint,szBet,aDiceResult){
        var iWin = -1;
        switch(szBet){
                case "pass_line":{
                    if(iState === STATE_GAME_COME_OUT){
                        if(iSumDices === 2 || iSumDices === 3 || iSumDices === 12){
                            //PASS LINE LOSES
                            iWin = 0;
                        }else if(iSumDices === 7 || iSumDices === 11){
                            //PASS LINE WINS
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        }
                    }else{
                        if(iSumDices === 7){
                            //LOSE
                            iWin = 0;
                        }else if(iSumDices === iNumberPoint){
                            //WIN
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        }
                    }
                    
                    break;
                }
                case "come":{
                    if(iSumDices === 7 || iSumDices === 11){
                        //WINS
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else if(iSumDices === 2 || iSumDices === 3 || iSumDices === 12){
                        //LOSE
                        iWin = 0;
                    }else{
                        //BET ON NUMBER EXTRACTED
                        s_oGame.assignBetFromCome(iSumDices,szBet);
                    }
                    break;
                }
                case "dont_pass1":
                case "dont_pass2":{
                    if(iState === STATE_GAME_COME_OUT){
                        if(iSumDices === 2 || iSumDices === 3){
                            //DONT PASS WINS
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        }else if(iSumDices === 7 || iSumDices === 11){
                            //DONT PASS LOSES
                            iWin = 0;
                        }else if(iSumDices === 12){
                            iWin = iAmountForBet;
                        }
                    }else{
                        if(iSumDices === 7){
                            //WINS
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        }else if(iSumDices === iNumberPoint){
                            //LOSES
                            iWin = 0;
                        }
                    }    
                    
                    break;
                }
                case "dont_come":{
                    if(iSumDices === 2 || iSumDices === 7){
                        //WINS
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else if(iSumDices === 7 || iSumDices === 11){
                        //LOSE
                        iWin = 0;
                    }else{
                        s_oGame.assignBetFromDontCome(iSumDices,szBet);
                    }
                    break;
                }
                
                case "field":{
                    if(iSumDices === 5 || iSumDices === 6 || iSumDices === 7 || iSumDices === 8){
                        //LOSE
                        trace("field lose");
                        iWin = 0;
                    }else{
                        //WIN
                        trace("field win");
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        if(iSumDices === 2 || iSumDices === 12){
                            iWin *= 2;
                        }
                    }
                    break;
                }
                case "big_6":{
                    if(iSumDices === 6){
                        //WIN
                        trace("big6 win")
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else if(iSumDices === 7){
                        iWin = 0;
                    }
                    break;
                }
                case "big_8":{
                    if(iSumDices === 8){
                        //WIN
                        trace("big8 win")
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else if(iSumDices === 7){
                        iWin = 0;
                    }
                    break;
                }
                case "lay_bet4":
                case "lose_bet4":{
                    if(iSumDices === 7){
                        //WIN
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        if(szBet === "lay_bet4"){
                            //LESS 5% OF WIN
                            iWin = roundDecimal((iWin * 0.05),2);
                        }
                    }else if(iSumDices ===4){
                        //LOSE
                        iWin = 0;
                    }  
                    break;
                }
                case "lay_bet5":
                case "lose_bet5":{
                    if(iSumDices === 7){
                        //WIN
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        if(szBet === "lay_bet5"){
                            //LESS 5% OF WIN
                            iWin = roundDecimal((iWin * 0.05),2);
                        }
                    }else if(iSumDices ===5){
                        //LOSE
                        iWin = 0;
                    } 
                    break;
                }
                case "lay_bet6":
                case "lose_bet6":{
                    if(iSumDices === 7){
                        //WIN
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        if(szBet === "lay_bet6"){
                            //LESS 5% OF WIN
                            iWin = roundDecimal((iWin * 0.05),2);
                        }
                    }else if(iSumDices ===6){
                        //LOSE
                        iWin = 0;
                    }
                    break;
                }
                case "lay_bet8":
                case "lose_bet8":{
                    if(iSumDices === 7){
                        //WIN
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        if(szBet === "lay_bet8"){
                            //LESS 5% OF WIN
                            iWin = roundDecimal((iWin * 0.05),2);
                        }
                    }else if(iSumDices === 8){
                        //LOSE
                        iWin = 0;
                    }
                    break;
                }
                case "lay_bet9":
                case "lose_bet9":{
                    if(iSumDices === 7){
                        //WIN
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        if(szBet === "lay_bet9"){
                            //LESS 5% OF WIN
                            iWin = roundDecimal((iWin * 0.05),2);
                        }
                    }else if(iSumDices === 9){
                        //LOSE
                        iWin = 0;
                    }
                    break;
                }
                case "lay_bet10":
                case "lose_bet10":{
                    if(iSumDices === 7){
                        //WIN
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                        if(szBet === "lay_bet10"){
                            //LESS 5% OF WIN
                            iWin = roundDecimal((iWin * 0.05),2);
                        }

                    }else if(iSumDices === 10){
                        //LOSE
                        iWin = 0;
                    }
                    break;
                }
                case "number4":
                case "win_bet4":{
                    if(iState === STATE_GAME_COME_POINT){
                        if(iSumDices === 4){
                            //WIN
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                            if(szBet === "number4"){
                                iWin = roundDecimal((iAmountForBet * 0.05),2);
                            }
                        }else if(iSumDices === 7){
                            //LOSE
                            iWin = 0;
                        }
                    }
                    break;
                }
                case "number5":
                case "win_bet5":{
                    if(iState === STATE_GAME_COME_POINT){
                        if(iSumDices === 5){
                            //WIN
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                            if(szBet === "number5"){
                                iWin = roundDecimal((iAmountForBet * 0.05),2);
                            }

                        }else if(iSumDices === 7){
                            //LOSE
                            iWin = 0;
                        }
                    }
                    break;
                }
                case "number6":
                case "win_bet6":{
                    if(iState === STATE_GAME_COME_POINT){
                        if(iSumDices === 6){
                            //WIN
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                            if(szBet === "number6"){
                                iWin = roundDecimal((iAmountForBet * 0.05),2);
                            } 

                        }else if(iSumDices === 7){
                            //LOSE
                            iWin = 0;
                        }
                    }
                    break;
                }
                case "number8":
                case "win_bet8":{
                    if(iState === STATE_GAME_COME_POINT){
                        if(iSumDices === 8){
                            //WIN
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                            if(szBet === "number8"){
                                iWin = roundDecimal((iAmountForBet * 0.05),2);
                            } 

                        }else if(iSumDices === 7){
                            //LOSE
                            iWin = 0;
                        }
                    }
                    break;
                }
                case "number9":
                case "win_bet9":{
                    if(iState === STATE_GAME_COME_POINT){
                        if(iSumDices === 9){
                            //WIN
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                            if(szBet === "number9"){
                                iWin = roundDecimal((iAmountForBet * 0.05),2);
                            }

                        }else if(iSumDices === 7){
                            //LOSE
                            iWin = 0;
                        }
                    }
                    break;
                }
                case "number10":
                case "win_bet10":{
                    if(iState === STATE_GAME_COME_POINT){
                        if(iSumDices === 10){
                            iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                            if(szBet === "number10"){
                                iWin = roundDecimal((iAmountForBet * 0.05),2);
                            }   
                        }else if(iSumDices === 7){
                            //LOSE
                            iWin = 0;
                        }
                    }
                    break;
                }
                case "any11_7":{
                    if(iSumDices === 11){
                        //WINS 15:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                
                case "any_craps_7":{
                    if(iSumDices === 2 || iSumDices === 3 || iSumDices === 12){
                        //WINS 7:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "seven_bet":{
                    if(iSumDices === 7){
                        //WINS 4:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "hardway6":{
                    if(aDiceResult[0] === 3 && aDiceResult[1] === 3){
                        //WINS 9:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "hardway10":{
                    if(aDiceResult[0] === 5 && aDiceResult[1] === 5){
                        //WINS 7:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "hardway8":{
                    if(aDiceResult[0] === 4 && aDiceResult[1] === 4){
                        //WINS 9:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "hardway4":{
                    if(aDiceResult[0] === 2 && aDiceResult[1] === 2){
                        //WINS 7:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "horn3":{
                    if(iSumDices === 3){
                        //WINS 30:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "horn2":{
                    if(iSumDices === 2){
                        //WINS 15:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
                case "horn12":{
                    if(iSumDices === 12){
                        //WINS 30:1
                        iWin = ( iAmountForBet * s_oGameSettings.getBetMultiplier(szBet));
                    }else{
                        iWin = 0;
                    }
                    break;
                }
            }
            
            return iWin;
    };
	
    this.getFicheValues = function(iIndex){
            return _aFicheValues[iIndex];
    };
		
    this.getFicheIndexByValue = function(iValue){
            var iIndex=0;
            for(var i=0;i<_aFicheValues.length;i++){
                    if(iValue === _aFicheValues[i]){
                            iIndex=i;
                            break;
                    }
            }
            return iIndex;
    };
    
    this.getBetMultiplier = function(szName){
        return _aBetMultiplier[szName];
    };
    
    this.getAttachOffset = function(szAttach){
        return _aAttachFiches[szAttach];
    };
    
    this.getHelpMsgByBet = function(szBet){
        return _aHelpMsg[szBet];
    };
    
    this.getPuckXByNumber = function(iNumber){
        return _aPuckPos[iNumber];
    };
    
    this._init();
}