pragma solidity ^0.4.9;

contract Dice{
    event log(string value);
    event logU(uint value);
    event logUint(string gameStatus, uint value);
    event logByte(string gameStatus, address value);
    
    function Dice()payable {
        
    }
    
    function rollDice(uint chance)payable returns (int win){
        uint bet = msg.value; // количество эфира (ставка)
        if(chance < 1||chance > 99){
            throw; // return false
        }
        
        uint payout = bet*100/chance; //выгрыш
        uint profit = payout - bet;
        uint rnd = randomGen(now); // от 0 до 10000
        uint valueMax = chance*100; // меньше какого значения должно быть число для победы
        logU(now);
        logU(payout);
        logU(profit);
        logU(bet);
        logU(chance);
        if(rnd < valueMax){
            if(msg.sender.send(payout)){
            }
            logU(1);
            return 1; // мы победили
           
        } else {
            logU(0);
            return 0; // мы выграли
        }
    }
    
    /* Generates a random number from 0 to 100 based on the last block hash */
    function randomGen(uint seed) constant returns (uint randomNumber) {
        return(uint(sha3(block.blockhash(block.number-1), seed ))%10000);
    }
    
    function sha3test(uint seed) constant returns (bytes32 hash) {
        return sha3(block.blockhash(5000), seed );
    }
}