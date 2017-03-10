pragma solidity ^0.4.2;

library Deck {
	// returns random number from 0 to 51
	// let's say 'value' % 4 means suit (0 - Hearts, 1 - Spades, 2 - Diamonds, 3 - Clubs)
	//			 'value' / 4 means: 0 - King, 1 - Ace, 2 - 10 - pip values, 11 - Jacket, 12 - Queen

	function deal(address player, uint8 cardNumber) internal returns (uint8) {
		uint b = block.number;
		uint timestamp = block.timestamp;
		return uint8(uint256(keccak256(block.blockhash(b), player, cardNumber, timestamp)) % 52);
	}

	function valueOf(uint8 card, bool isBigAce) internal constant returns (uint8) {
		uint8 value = card / 4;
		if (value == 0 || value == 11 || value == 12) { // Face cards
			return 10;
		}
		if (value == 1 && isBigAce) { // Ace is worth 11
			return 11;
		}
		return value;
	}

	function equalDenomination(uint8 card1, uint8 card2) internal constant returns (bool) {
		return card1 / 4 == card2 / 4;
	}

	function isAce(uint8 card) internal constant returns (bool) {
		return card / 4 == 1;
	}

	function isTen(uint8 card) internal constant returns (bool) {
		return card / 4 == 10;
	}
}
