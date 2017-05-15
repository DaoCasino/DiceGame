var DiceRoll = artifacts.require("./DiceRoll.sol");
var gasAmount = 4000000;

var states = {0: 'In Progress', 1: 'Player Won', 2: 'Player Lose', 3: 'No Bank'};

var gameState;

function roll(player, bet, number, seed) {
    var game;
    return DiceRoll.deployed().then(function(instance) {
        game = DiceRoll;
		return game.roll({
            from: player,
            gas: gasAmount,
            value: web3.toWei(bet, "Ether")
        });
    }).then(function(tx) {
        console.log("roll: " + tx.tx);
        logCards(tx);
        return game.getStateByAddress.call(seed, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
    });
}