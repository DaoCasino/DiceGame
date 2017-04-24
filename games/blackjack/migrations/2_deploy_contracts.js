var BlackJack = artifacts.require("BlackJack.sol");
var BlackJackStorage = artifacts.require("BlackJackStorage.sol");
var Deck = artifacts.require("Deck.sol");

module.exports = function(deployer, network) {
    deployer.deploy(Deck);
    deployer.link(Deck, BlackJack);

    if (network == "development") {
        deployer.deploy(Deck, "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a").then(function() {
            return deployer.deploy(BlackJackStorage, Deck.address);
        }).then(function() {
            return deployer.deploy(BlackJack, Deck.address, BlackJackStorage.address);
        }).then(function() {
            web3.eth.sendTransaction({
                from: "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a",
                to: BlackJack.address,
                value: web3.toWei(15, "ether"),
                gas: 400000,
            });
        });
    }

    if (network == "testnet") {
        deployer.deploy(Deck).then(function() {
            return deployer.deploy(BlackJackStorage, Deck.address);
        }).then(function() {
            return deployer.deploy(BlackJack, Deck.address, BlackJackStorage.address);
        }).then(function() {
            web3.eth.sendTransaction({
                from: "0x7e1952131872feee40061360d7ccaf0a72964f9c",
                to: BlackJack.address,
                value: web3.toWei(1, "ether"),
                gas: 400000,
            });
        });
    }
};
