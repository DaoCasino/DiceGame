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
		deployer.deploy(ERC20, "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a").then(function() {				
			deployer.deploy(Deck, "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a").then(function() {
				return deployer.deploy(BlackJackStorage, Deck.address);
			}).then(function() {
				return deployer.deploy(BlackJack, Deck.address, BlackJackStorage.address, ERC20.address);
			}).then(function() {
				web3.eth.sendTransaction({
					from: "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a",
					to: BlackJack.address,
					value: 0,
					data: "0xa9059cbb"+pad(BlackJack.address.substr(2), 64) + pad(numToHex(1000000000), 64),
					// data: "0xa9059cbb000000000000000000000000f1f42f995046e67b79dd5ebafd224ce964740da30000000000000000000000000000000000000000000000000000000000024fdb",
					gas: 400000,
				});;
			});
		});
    }

    if (network == "testnet") {
        deployer.deploy(Deck).then(function() {
            return deployer.deploy(BlackJackStorage, Deck.address);
        }).then(function() {
            return deployer.deploy(BlackJack, Deck.address, BlackJackStorage.address, 0x95a48dca999c89e4e284930d9b9af973a7481287);
        })/*.then(function() {
            web3.eth.sendTransaction({
                from: "0x7e1952131872feee40061360d7ccaf0a72964f9c",
                to: BlackJack.address,
                value: web3.toWei(1, "ether"),
                gas: 400000,
            });
        });*/
    }
};
