var BlackJack = artifacts.require("BlackJack.sol");
var Deck = artifacts.require("Deck.sol");

module.exports = function(deployer, network) {
  deployer.deploy(Deck);
  deployer.link(Deck, BlackJack);

  if (network == "development") {
    deployer.deploy(BlackJack, "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a").then(function() {
    	web3.eth.sendTransaction({
    		from: "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a",
    		to: BlackJack.address,
    		value: web3.toWei(100, "ether"),
        gas: 400000,
    	});
    });
  } else if (network == "testnet") {
    console.log(web3.eth.accounts[0]);
    deployer.deploy(BlackJack).then(function() {
      console.log("BlackJack address ", BlackJack.address);
    	web3.eth.sendTransaction({
        from: web3.eth.accounts[0],
    		to: BlackJack.address,
    		value: web3.toWei(1, "ether"),
        gas: 400000,
    	});
    });
  }
};
