pragma solidity ^0.4.8;

contract Rng {
    function randomGen(address player, uint16 seed, uint b, uint timestamp, uint16 value) 
		external
		returns (uint16) 
	{
		return uint8(uint256(keccak256(block.blockhash(b), player, seed, timestamp)) % value);
	}
}
