var BlackJack = artifacts.require("./BlackJack.sol");
var gasAmount = 4000000;


var suit = {0: 'Hearts', 1: 'Spades', 2: 'Diamonds', 3: 'Clubs'};
var cardType = {0: 'King', 1: 'Ace', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
                11: 'Jacket', 12: 'Queen'};

var gameState;

function logCard(event) {
  var card = event.args['_card']['c'][0];
  if (event.args["isUser"]) {
    console.log("New card for Player:", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
  } else {
    console.log("New card for House:", cardType[Math.floor(card / 4)], "of", suit[card % 4]);
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
    return game.getSplitCardsNumber.call({ from: player }).then();
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
  return BlackJack.deployed().then(function(instance) {
    game = instance;
    return game.deal({
      from: player,
      gas: gasAmount,
      value: web3.toWei(bet, "Ether")
    });
  }).then(function(tx) {
    console.log("Deal: " + tx.tx);
    logCards(tx);
    return game.getGameState.call({
        from: player
    });
  }).then(function(state) {
    gameState = state;
    console.log("Game state: " + state);
  });
}

function stand(player) {
  var game;
  return BlackJack.deployed().then(function (instance) {
      game = instance;
      return game.stand({
         from: player,
         gas: gasAmount
     });
  }).then(function(tx) {
    console.log("Stand: " + tx.tx);
    logCards(tx);
    return game.getGameState.call({
        from: player
    });
  }).then(function(state) {
    gameState = state;
    console.log("Game state: " + state);
  });
}

function hit(player) {
  var game;
  return BlackJack.deployed().then(function (instance) {
      game = instance;
      return game.hit({
        from: player,
        gas: gasAmount
      });
  }).then(function(tx) {
    console.log("Hit: " + tx.tx);
    logCards(tx);
    return game.getGameState.call({
        from: player
    });
  }).then(function(state) {
    gameState = state;
    console.log("Game state: " + state);
  });
}

function split(player, bet) {
  var game;
  return BlackJack.deployed().then(function (instance) {
      game = instance;
      return game.split({
        from: player,
        gas: gasAmount,
        value: web3.toWei(bet, "Ether")
      });
  }).then(function(tx) {
    console.log("Split: " + tx.tx);
    logCards(tx);
    return game.getGameState.call({
        from: player
    });
  }).then(function(state) {
    gameState = state;
    console.log("Game state: " + state);
  });
}

function double(player, bet) {
  var game;
  return BlackJack.deployed().then(function (instance) {
      game = instance;
      return game.double({
        from: player,
        gas: gasAmount,
        value: web3.toWei(bet, "Ether")
      });
  }).then(function(tx) {
    console.log("Double: " + tx.tx);
    logCards(tx);
    return game.getGameState.call({
        from: player
    });
  }).then(function(state) {
    gameState = state;
    console.log("Game state: " + state);
  });
}

function isSplitAvailable(player) {
  var game;
  return BlackJack.deployed().then(function (instance) {
      game = instance;
      return game.isSplitAvailable.call({
          from: player
      });
  }).then(function(flag) {
    return flag;
  });
}

function isDoubleAvailable(player) {
  var game;
  return BlackJack.deployed().then(function (instance) {
      game = instance;
      return game.isDoubleAvailable.call({
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
  return BlackJack.deployed().then(function(instance) {
      game = instance;
      return split(player, 0.1);
    }).then(function() {
      return game.getPlayerCardsNumber.call({ from: player });
    }).then(function(n) {
      assert.equal(n.toNumber(), 2, "player is supposed to have 2 cards");
      return game.getHouseCardsNumber.call({
        from: player
      });
    }).then(function(n) {
      assert.equal(n.toNumber(), 1, "house is supposed to have 1 card");
      return game.getSplitCardsNumber.call({
        from: player
      });
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

function testSplitDouble(player, done) {
  var game;
  return BlackJack.deployed().then(function(instance) {
      game = instance;
      return double(player, 0.1);
    }).then(function() {
      return game.getSplitGameState.call({ from: player });
    }).then(function(state) {
      console.log("split game state: " + state);
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
      return stand(player);
    });

    it("Should start new game", function() {
      return deal(player, 0.1);
    });

    it("Should request one more card", function() {
      return hit(player);
    });

    it("Should stand", function() {
      if (gameState != 0) {
        console.log("the game is already finished, state: " + gameState);
        return;
      }
      return stand(player);
    });

    it("Should check split logic", function(done) {
      playUntilSplit(player, done);
    });
});
