var BlackJack = artifacts.require("BlackJack.sol");
var BlackJackStorage = artifacts.require("BlackJackStorage.sol");
var Deck = artifacts.require("Deck.sol");
var ERC20 = artifacts.require("ERC20.sol");

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
function numToHex(num) {
	return num.toString(16);
}

module.exports = function(deployer, network) {
    if (network == "development") {
        var owner = "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a";
        var player = "0xf1f42f995046e67b79dd5ebafd224ce964740da3";
        var tokenContract;
		deployer.deploy(ERC20, owner).then(function() { // deploy token contract
            return deployer.deploy(Deck, owner); // deploy deck
        }).then(function() {
			return deployer.deploy(BlackJackStorage, Deck.address);  // deploy main BJ contract
		}).then(function() {
			return deployer.deploy(BlackJack, Deck.address, BlackJackStorage.address, ERC20.address); // deploy storage contract
		}).then(function() {
            return ERC20.deployed(); // get deplyed instance of the token contract
        }).then(function(instance) {
            tokenContract = instance;
            console.log(" - Send 1000 tokens to the player");
			return tokenContract.issueTokens(player, 1000, { from: owner }); // issue 1000 tokens to the player
		}).then(function(tx) {
            console.log(" - Send 1000 tokens to the BJ contract");
            return tokenContract.issueTokens(BlackJack.address, 1000, { from: owner }); // issue 1000 tokens to the BJ contract
        }).then(function(tx) {
            return tokenContract.balanceOf.call(BlackJack.address, { from: owner });
        }).then(function(balance) {
            console.log(" - BlackJack contract has " + (balance.toNumber() / 100000000) + " tokens");
            return tokenContract.balanceOf.call(player, { from: owner });
        }).then(function(balance) {
            console.log(" - Player has " + (balance.toNumber() / 100000000) + " tokens");
        });
    }

    /*if (network == "testnet") {
        deployer.deploy(Deck).then(function() {
            return deployer.deploy(BlackJackStorage, Deck.address);
        }).then(function() {
            return deployer.deploy(BlackJack, Deck.address, BlackJackStorage.address, 0x95a48dca999c89e4e284930d9b9af973a7481287);
        }).then(function() {
            web3.eth.sendTransaction({
                from: "0x7e1952131872feee40061360d7ccaf0a72964f9c",
                to: BlackJack.address,
                value: web3.toWei(1, "ether"),
                gas: 400000,
            });
        });
    }*/
};
