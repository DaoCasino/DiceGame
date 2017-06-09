pragma solidity ^ 0.4.8;

import 'DiceRoll.sol';

contract FactoryDice {

    mapping(address => bool) public validGames;
    event Game(address);

    function createDiceRoll() returns(DiceRoll diceAddress) {

        var dice = new DiceRoll(msg.sender);
        validGames[dice] = true;
        Game(dice);
        return dice;

    }

}