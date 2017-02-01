pragma solidity ^0.4.8;

//в этом тестовом контракте мы реализуем простейший вариант казино
//здесь будет одна игра
//фронтенд будет полностью написан на js,html,css
//ide http://dapps.oraclize.it/browser-solidity/

import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.sol";

contract Casino2 is usingOraclize {
  mapping (address => uint256) public balanceOf;
  mapping (bytes32 => address) bets;
  mapping (bytes32 => bool) goup; 
  mapping (bytes32 => uint) betsvalue;
  
  uint public currentnumber;
  
  event Transfer(address indexed from, address indexed to, uint256 value);

  
  function Contract() {
    oraclize_setNetwork(networkID_consensys);
  }
  
  event LogB(bytes32 h);
	event LogS(string s);
	event LogI(uint s);
	  
	  function game (bool bet_goup) payable {
	  
  	   bytes32 myid = oraclize_query("WolframAlpha", "random number between 0 and 100");
  	   //LogI(price);
  	   bets[myid] = msg.sender;
  	   goup[myid] = bet_goup;
  	   betsvalue[myid] = msg.value-10000000000000000; //ставка за вычитом расходов на оракула ~0.01 eth
  	   
	  }
	 
	  
	  function __callback(bytes32 myid, string result) {
        LogS('callback');
        if (msg.sender != oraclize_cbAddress()) throw;
       
        //log0(result);
        if (goup[myid]==false && parseInt(result)<currentnumber) LogS("Ставка была ВНИЗ и результат вниз (win)");
        if (goup[myid]==true && parseInt(result)>currentnumber) LogS("Ставка была ВВЕРХ и результат ddth[ (win)");
        
        
        if ((goup[myid]==false && parseInt(result)<currentnumber) 
        || (goup[myid]==true && parseInt(result)>currentnumber)) {
          LogS("win");
          
          if (!bets[myid].send(betsvalue[myid]*2)) {LogS("bug! bet to winner was not sent!");} else {
            LogS("sent");
            LogI(betsvalue[myid]*2);
          }
          
        } else {
          LogS("lose");
        }
        
        currentnumber = parseInt(result);
        //rand();
      }
    
}
