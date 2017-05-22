var DiceRoll = artifacts.require("DiceRoll.sol");

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
		// var erc20 = "0x45c7eab211aa0d2ebd07a2ec8fe73bb337792d30";
        // var tokenContract = ERC20.at(erc20);
		deployer.deploy(DiceRoll).then(function() {
			
		});
    } else if (network == "testnet") {
		deployer.deploy(DiceRoll).then(function() {
			
		});
        
    }
};
