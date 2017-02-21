pragma solidity ^0.4.9;

contract Dice{
    event gameLog(string gameStatus, uint rand);
    
    function rollDice(uint chance)payable returns (int win){
        if(chance < 1||chance > 99){
            throw; // return false
        }
        
        uint bet = msg.value; // количество эфира (ставка)
        uint payout = bet*100/chance; //коэф выгрыша
        uint rnd = randomGen(5252); // от 0 до 10000
        uint valueMax = chance*100; // меньше какого значения должноы быть число для победы
        gameLog("payout:", payout); 
        if(rnd < valueMax){
            gameLog("win:", rnd); 
            if(msg.sender.send(msg.value*payout)){
            }
            return 1; // мы победили
           
        } else {
            gameLog("lose:", rnd); 
            return 0; // мы выграли
        }
        
    }
    
    /* Generates a random number from 0 to 100 based on the last block hash */
    function randomGen(uint seed) constant returns (uint randomNumber) {
        return(uint(sha3(block.blockhash(block.number-1), seed ))%10000);
    }
}