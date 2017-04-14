pragma solidity ^0.4.8;


contract Lottery {
    uint8 prizeNumber = 0;
    
    event logStrNum(
        string str,
        uint value
    );
    
    function start(uint seed, uint8 value) public {
        prizeNumber = randomGen(msg.sender, seed, value) + 1;
        logStrNum("prizeNumber", prizeNumber);
    }
    
    function randomGen(address player, uint seed, uint8 value) private returns (uint8) {
		uint b = block.number;
		uint timestamp = block.timestamp;
		return uint8(uint256(keccak256(block.blockhash(b), player, seed, timestamp)) % value);
	}
	
	function getPrizeNumber() public constant returns(uint8) {
        return prizeNumber;
    }
}
