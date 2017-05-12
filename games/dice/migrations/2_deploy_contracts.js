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
        
    } else if (network == "testnet") {
		deployer.deploy(DiceRoll).then(function() {
			console.log(" - Contract DiceRoll deployed: " + DiceRoll.address);
		}));
        
    }
};
