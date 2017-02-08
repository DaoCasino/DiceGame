var TEXT_MONEY     = "MONEY";
var TEXT_CUR_BET   = "CUR BET";
var TEXT_MIN_BET   = "MIN BET";
var TEXT_MAX_BET   = "MAX BET";
var TEXT_ROLL      = "ROLL";
var TEXT_EXIT      = "EXIT";
var TEXT_RECHARGE  = "RECHARGE";
var TEXT_YOU_WIN   = "GREAT!! YOU WIN";
var TEXT_CURRENCY  = "$";
var TEXT_ARE_SURE  = "ARE YOU SURE?";
var TEXT_COME_OUT  = "COME OUT";

var TEXT_ERROR_NO_MONEY_MSG="NOT ENOUGH MONEY FOR THIS BET!!";
var TEXT_ERROR_MAX_BET_REACHED="MAX BET REACHED!!";
var TEXT_ERROR_MIN_BET = "YOU BET IS LOWER THAN MINIMUM BET!!";
var TEXT_NO_MONEY = "YOU DON'T HAVE ENOUGH MONEY!!!";
var TEXT_RECHARGE_MSG = "PLEASE CLICK RECHARGE BUTTON TO PLAY AGAIN";
var TEXT_WAITING_BET = "WAITING FOR YOUR BET...";
var TEXT_READY_TO_ROLL = "ROLL WHEN YOU'RE READY!";

var TEXT_HELP_MSG = new Array();
TEXT_HELP_MSG["pass_line"] = "PLACE YOUR BET ON PASS LINE";
TEXT_HELP_MSG["dont_pass1"] = "PLACE YOUR BET ON DON'T PASS";
TEXT_HELP_MSG["dont_pass2"] = "PLACE YOUR BET ON DON'T PASS";
TEXT_HELP_MSG["dont_come"] = "PLACE YOUR BET ON DON'T COME";
TEXT_HELP_MSG["come"] = "PLACE YOUR BET ON COME";
TEXT_HELP_MSG["field"] = "PLACE YOUR BET ON FIELD";
TEXT_HELP_MSG["big_6"] = "PLACE YOUR BET ON BIG 6";
TEXT_HELP_MSG["big_8"] = "PLACE YOUR BET ON BIG 8";

var aValues = [4,5,6,8,9,10];
var aInfosLay = ["1:2 ON 7 BEFORE POINT LESS 5% OF WIN",
                 "2:3 ON 7 BEFORE POINT LESS 5% OF WIN",
                 "5:6 ON 7 BEFORE POINT LESS 5% OF WIN",
                 "5:6 ON 7 BEFORE POINT LESS 5% OF WIN",
                 "2:3 ON 7 BEFORE POINT LESS 5% OF WIN",
                 "1:2 ON 7 BEFORE POINT LESS 5% OF WIN"];
var aInfosLose = ["5:11 ON 7 BEFORE POINT",
                  "5:8 ON 7 BEFORE POINT",
                  "4:5 ON 7 BEFORE POINT",
                  "4:5 ON 7 BEFORE POINT",
                  "5:8 ON 7 BEFORE POINT",
                  "5:11 ON 7 BEFORE POINT"];
var aInfosBuy = ["2:1 ON MAKING POINT LESS 5% OF BET",
                 "3:2 ON MAKING POINT LESS 5% OF BET",
                 "6:5 ON MAKING POINT LESS 5% OF BET",
                 "6:5 ON MAKING POINT LESS 5% OF BET",
                 "3:2 ON MAKING POINT LESS 5% OF BET",
                 "2:1 ON MAKING POINT LESS 5% OF BET"];
var aInfosWin = ["9:5 ON MAKING POINT",
                 "7:5 ON MAKING POINT",
                 "7:6 ON MAKING POINT",
                 "7:6 ON MAKING POINT",
                 "7:5 ON MAKING POINT",
                 "9:5 ON MAKING POINT"];
for(var i=0;i<aValues.length;i++){
    TEXT_HELP_MSG["lay_bet"+aValues[i]] = "PLACE YOUR BET ON LAY "+aValues[i] + " - " + aInfosLay[i];
    TEXT_HELP_MSG["lose_bet"+aValues[i]] = "PLACE YOUR BET ON LOSE "+aValues[i]+ " - " + aInfosLose[i];
    TEXT_HELP_MSG["number"+aValues[i]] = "PLACE YOUR BET ON BUY "+aValues[i]+ " - " + aInfosBuy[i];
    TEXT_HELP_MSG["win_bet"+aValues[i]] = "PLACE YOUR BET ON WIN "+aValues[i]+ " - " + aInfosWin[i];
}

for(var j=0;j<8;j++){
    TEXT_HELP_MSG["any11_"+j] = "PLACE YOUR BET ON HORN 11";
    TEXT_HELP_MSG["any_craps_"+j] = "PLACE YOUR BET ON ANY CRAPS";
}

TEXT_HELP_MSG["seven_bet"] = "PLACE YOUR BET ON ANY 7";
TEXT_HELP_MSG["hardway6"] = "PLACE YOUR BET ON HARDWAY 6";
TEXT_HELP_MSG["hardway10"] = "PLACE YOUR BET ON HARDWAY 10"; 
TEXT_HELP_MSG["hardway8"] = "PLACE YOUR BET ON HARDWAY 8";
TEXT_HELP_MSG["hardway4"] = "PLACE YOUR BET ON HARDWAY 4";
TEXT_HELP_MSG["horn3"] = "PLACE YOUR BET ON HORN 3";
TEXT_HELP_MSG["horn2"] = "PLACE YOUR BET ON HORN 2";
TEXT_HELP_MSG["horn12"] = "PLACE YOUR BET ON HORN 12";

var TEXT_CREDITS_DEVELOPED = "DEVELOPED BY";
var TEXT_LINK = "WWW.CODETHISLAB.COM";

var TEXT_CONGRATULATIONS = "Congratulations!";
var TEXT_SHARE_1 = "You collected <strong>";
var TEXT_SHARE_2 = " points</strong>!<br><br>Share your score with your friends!";
var TEXT_SHARE_3 = "My score is ";
var TEXT_SHARE_4 = " points! Can you do better?";				