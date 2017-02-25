var gasAmount = 4000000;

contract('BlackJack', function(accounts) {
	// Owner of the contract
    var owner = accounts[0];
    // player
    var player = accounts[1];

    var suit = {0: 'Hearts', 1: 'Spades', 2: 'Diamonds', 3: 'Clubs'};
    var cardType = {0: 'King', 1: 'Ace', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
                    11: 'Jacket', 12: 'Queen'};

    it("Should deal cards", function(done) {
        var game = BlackJack.deployed();

        var deals = game.Deal({fromBlock: "latest"});

		deals.watch(function(error, result) {
            var card = result.args['_card']['c'][0];
            if (result.args["isUser"]) {
			    if (error == null) console.log("Deal { Player new card:", cardType[Math.floor(card / 4)], "of", suit[card % 4], "}");
            } else {
                if (error == null) console.log("Deal { House new card:", cardType[Math.floor(card / 4)], "of", suit[card % 4], "}");
            }
		});

		var statuses = game.GameStatus({fromBlock: "latest"});

		statuses.watch(function(error, result) {
			if (error == null) console.log("GameState { houseScore:", 
                                           result.args['houseScore']['c'][0], "[", result.args['houseScoreBig']['c'][0],
                                            "], playerScore:",
                                           result.args['playerScore']['c'][0], "[", result.args['playerScoreBig']['c'][0], "] }");
		});

		return game.deal({
            from: player, 
            gas: gasAmount,
            value: web3.toWei(1, "Ether")
        }).then(function(tx_id) {
        	console.log("deal: " + tx_id);
        }).then(done).catch(done);
    });

    it("Should request two more cards for the player", function(done) {

        var game = BlackJack.deployed();

		return game.hit({
            from: player, 
            gas: gasAmount
        }).then(function(tx_id) {
        	console.log("hit 1: " + tx_id);
        	return game.hit({
	            from: player, 
	            gas: gasAmount
	        });
        }).then(function(tx_id) {
        	console.log("hit 2: " + tx_id);
        	return game.getGameState.call({
	            from: player
	        });
        }).then(function(state) {
        	console.log("game state: " + state);
        }).then(done).catch(done);
    });

    it("Should start new game", function(done) {
        var game = BlackJack.deployed();

        return game.deal({
            from: player, 
            gas: gasAmount,
            value: web3.toWei(1, "Ether")
        }).then(function(tx_id) {
            console.log("deal: " + tx_id);
        }).then(done).catch(done);
    });

});