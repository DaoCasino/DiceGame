var PowerBall = artifacts.require("PowerBall.sol");
var Rng = artifacts.require("Rng.sol");

module.exports = function(deployer, network) {
	deployer.deploy(Rng);
	deployer.link(Rng, PowerBall);

	if (network == "development") {
        deployer.deploy(Rng, "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a").then(function() {
            return deployer.deploy(PowerBall, Rng.address);
        }).then(function() {
            web3.eth.sendTransaction({
                from: "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a",
                to: PowerBall.address,
                value: web3.toWei(15, "ether"),
                gas: 400000,
            });
        });
    }
};
