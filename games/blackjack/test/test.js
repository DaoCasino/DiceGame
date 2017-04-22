var BlackJack = artifacts.require("./BlackJack.sol");
var BlackJackStorage = artifacts.require("./BlackJackStorage.sol");
var gasAmount = 4000000;


var suit = {0: 'Hearts', 1: 'Spades', 2: 'Diamonds', 3: 'Clubs'};
var cardType = {0: 'King', 1: 'Ace', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
                11: 'Jacket', 12: 'Queen'};
var states = {0: 'In Progress', 1: 'Player Won', 2: 'House Won', 3: 'Tie', 4: 'Split Game is in Progress', 5: 'Player BlackJack'};

var gameState;
var splitGameState;

function logCard(event) {
    var card = event.args['_card']['c'][0];
    if (event.args["_type"]['c'] == 0) {
        console.log("New card for Player:", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
    } else if (event.args["_type"]['c'] == 1) {
        console.log("New card for House:", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
    } else if (event.args["_type"]['c'] == 2) {
         console.log("New card for Split:", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
    }
}

function logCards(tx) {
    for (var i = 0; i < tx.logs.length; i++) {
        var log = tx.logs[i];
        if (log.event == "Deal") {
            logCard(log);
        }
    }
}

function printLogs(tx) {
    for (var i = 0; i < tx.logs.length; i++) {
        var log = tx.logs[i];
        if (log.event == "Log") {
            console.log("log: " + log.args['_id']['c']);
        }
    }
}

function logPlayerCards(player) {
    var game;
    console.log("Player cards:")
    return BlackJack.deployed().then(function(instance) {
        game = instance;
        return game.getPlayerCardsNumber.call({ from: player }).then();
    }).then(function(n) {
        for (var i = 0; i < n; ++i) {
            game.getPlayerCard.call(i, { from: player }).then(function(card) {
                console.log("\t-", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
            });
        }
    })
}

function logHouseCards(player) {
    var game;
    console.log("House cards:")
    return BlackJack.deployed().then(function(instance) {
        game = instance;
        return game.getHouseCardsNumber.call({ from: player }).then();
    }).then(function(n) {
        for (var i = 0; i < n; ++i) {
            game.getHouseCard.call(i, { from: player }).then(function(card) {
                console.log("\t-", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
            });
        }
    })
}

function logSplitCards(player) {
    var game;
    console.log("Split cards:")
    return BlackJack.deployed().then(function(instance) {
        game = instance;
        return game.getSplitCardsNumber.call({ from: player });
    }).then(function(n) {
        for (var i = 0; i < n; ++i) {
            game.getSplitCard.call(i, { from: player }).then(function(card) {
                console.log("\t-", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
            });
        }
    })
}


function deal(player, bet) {
    var game;
    var storage;
    return BlackJack.deployed().then(function(instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return game.deal({
            from: player,
            gas: gasAmount,
            value: web3.toWei(bet, "Ether")
        });
    }).then(function(tx) {
        console.log("Deal: " + tx.tx);
        logCards(tx);
        return storage.getState.call(true, player, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
    });
}

function stand(player) {
    var game;
    var storage;
    return BlackJack.deployed().then(function (instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return game.stand({
            from: player,
            gas: gasAmount
        });
    }).then(function(tx) {
        console.log("Stand: " + tx.tx);
        logCards(tx);
        printLogs(tx);
        return storage.getState.call(true, player, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
        return storage.getState.call(false, player, {
            from: player
        });
    }).then(function(state) {
        splitGameState = state;
        console.log("Split State: " + states[state]);
    });
}

function hit(player) {
    var game;
    var storage;
    return BlackJack.deployed().then(function (instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return game.hit({
            from: player,
            gas: gasAmount
        });
    }).then(function(tx) {
        console.log("Hit: " + tx.tx);
        logCards(tx);
        return storage.getState.call(true, player, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
    });
}

function split(player, bet) {
    var game;
    var storage;
    return BlackJack.deployed().then(function (instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return game.split({
            from: player,
            gas: gasAmount,
            value: web3.toWei(bet, "Ether")
        });
    }).then(function(tx) {
        console.log("Split: " + tx.tx);
        logCards(tx);
        return storage.getState.call(true, player, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
        return storage.getState.call(false, player, {
            from: player
        });
    }).then(function(state) {
        splitGameState = state;
        console.log("Split State: " + states[state]);
    });
}

function requestInsurance(player, bet) {
    var game;
    var storage;
    return BlackJack.deployed().then(function (instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return game.requestInsurance({
            from: player,
            gas: gasAmount,
            value: web3.toWei(bet, "Ether")
        });
    }).then(function(tx) {
        console.log("Request Insurance: " + tx.tx);
        logCards(tx);
        return storage.getState.call(true, player, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
    });
}

function double(player, bet) {
    var game;
    var storage;
    return BlackJack.deployed().then(function (instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return game.double({
            from: player,
            gas: gasAmount,
            value: web3.toWei(bet, "Ether")
        });
    }).then(function(tx) {
        console.log("Double: " + tx.tx);
        logCards(tx);
        return storage.getState.call(true, player, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
    });
}

function isSplitAvailable(player) {
    var storage;
    return BlackJackStorage.deployed().then(function (instance) {
        storage = instance;
        return storage.isSplitAvailable.call(player, {
            from: player
        });
    }).then(function(flag) {
        return flag;
    });
}

function isInsuranceAvailable(player) {
    var storage;
    return BlackJackStorage.deployed().then(function (instance) {
        storage = instance;
        return storage.isInsuranceAvailable.call(player, {
            from: player
        });
    }).then(function(flag) {
        return flag;
    });
}

function isDoubleAvailable(player) {
    var storage;
    return BlackJackStorage.deployed().then(function (instance) {
        storage = instance;
        return storage.isDoubleAvailable.call(player, {
            from: player
        });
    }).then(function(flag) {
        return flag;
    });
}

function playUntilSplit(player, done) {
    var chain;
    if (gameState == 0) {
        chain = stand(player).then(function() {
            return deal(player, 0.1);
        });
    } else {
        chain = deal(player, 0.1);
    }
        chain.then(function() {
        return isSplitAvailable(player);
    }).then(function(flag) {
        if (flag) {
            console.log("Split is available!");
            return testSplit(player, done);
        } else {
            return playUntilSplit(player, done);
        }
    });
    return chain;
}

function testSplit(player, done) {
    var game;
    var storage;
    return BlackJack.deployed().then(function(instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return split(player, 0.1);
    }).then(function() {
        return storage.getPlayerCardsNumber.call(player, { from: player });
    }).then(function(n) {
        assert.equal(n.toNumber(), 2, "player is supposed to have 2 cards");
        return storage.getHouseCardsNumber.call(player, { from: player });
    }).then(function(n) {
        assert.equal(n.toNumber(), 1, "house is supposed to have 1 card");
        return storage.getSplitCardsNumber.call(player, { from: player });
    }).then(function(n) {
        assert.equal(n.toNumber(), 2, "there are supposed to be 2 cards in split");
        return isDoubleAvailable(player);
    }).then(function(flag) {
        console.log("isDoubleAvailable: " + flag);
        if (flag) {
            return testSplitDouble(player, done);
        } else {
            done();
        }
    });
}

function playUntilInsurance(player, done) {
    var chain;

    if (gameState != 0) {
        chain = deal(player, 5);
    } else {
        chain = stand(player).then(function() {
            return deal(player, 5);
        })
    }

    chain.then(function() {
        if (gameState == 5) {
            console.log("Player BlackJack");
            done();
        } else {
            return isInsuranceAvailable(player);
        }
    }).then(function(flag) {
        if (flag) {
            console.log("Insurance is available!");
            return testInsurance(player, done);
        } else {
            return playUntilInsurance(player, done);
        }
    });
    return chain;
}

function testInsurance(player, done) {
    var game;
    var storage;
    var playerBalance
    return BlackJack.deployed().then(function(instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return requestInsurance(player, 2.5);
    }).then(function() {
        return storage.getInsurance.call(true, player, { from: player });
    }).then(function(insurance) {
        assert.equal(web3.fromWei(insurance.toNumber(), "ether"), 2.5, "insurance must be equal to 0.05 eth");
        playerBalance = web3.fromWei(web3.eth.getBalance(player), "Ether")
        return stand(player);
    }).then(function() {
        var newBalance = web3.fromWei(web3.eth.getBalance(player), "Ether")
        if (gameState == 2) {
            if (newBalance > playerBalance) {
                console.log("House won. Insurance was payed: " + (newBalance - playerBalance));
            } else {
                console.log("House won. Insurance wasn't payed: " + (newBalance - playerBalance));
            }
        } else {
            console.log("House didn't win");
        }
    }).then(done);
}

function testSplitDouble(player, done) {
    var game;
    var storage;
    return BlackJack.deployed().then(function(instance) {
        game = instance;
        return BlackJackStorage.deployed();
    }).then(function(instance) {
        storage = instance;
        return double(player, 0.1);
    }).then(function() {
        return storage.getState.call(true, player, {
            from: player
        });
    }).then(function(state) {
        gameState = state;
        console.log("State: " + states[state]);
        return storage.getState.call(false, player, {
            from: player
        });
    }).then(function(state) {
        splitGameState = state;
        console.log("Split State: " + states[state]);
    }).then(done);
}

contract('BlackJack', function(accounts) {
    // Owner of the contract
    var owner = accounts[0];
    // player
    var player = accounts[1];

    it("Should deal cards", function() {
        return deal(player, 0.1);
    });

    it("Should stand", function() {
        if (gameState != 0) {
            console.log("The game is already finished, state: " + states[gameState]);
            return;
        }
        return stand(player);
    });

    it("Should start new game", function() {
        return deal(player, 0.1);
    });

    it("Should request one more card", function() {
        if (gameState != 0) {
            console.log("The game is already finished, state: " + states[gameState]);
            return;
        }
        return hit(player);
    });

    it("Should stand", function() {
        if (gameState != 0) {
            console.log("The game is already finished, state: " + states[gameState]);
            return;
        }
        return stand(player);
    });

    it("Should check split logic", function(done) {
        playUntilSplit(player, done);
    });

    it("Should stand in the split game", function() {
        if (splitGameState != 0) {
            console.log("The split game is already finished, state: " + states[splitGameState]);
            return;
        }
        return stand(player);
    });

    it("Should stand in the main game", function() {
        if (gameState != 0) {
            console.log("The split game is already finished, state: " + states[gameState]);
            return;
        }
        return stand(player);
    });

    // it("Should check insurance payment", function(done) {
    //     // Doesn't work in case of natural blackjack
    //     playUntilInsurance(player, done);
    // });
});
