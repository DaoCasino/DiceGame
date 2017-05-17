pragma solidity ^0.4.8;
import "./Rng.sol";
import "./owned.sol";

contract PowerBall is owned {
    Rng rng;
	
    struct Ticket {
        address player;
        uint id;
        uint16 numSession;
        uint16[] whiteBalls;
        uint16 redBall;
        uint8 countPowerPlay;
        uint8 countWhite; //match
        uint8 countRed; //match
        string res;
        bool checkResult;
    }
	
	uint16 private countClick = 0;
	uint16[] private arBalls;
    
    function PowerBall(address addressRng) { // Constructor
		rng = Rng(addressRng);
    }
	
    function () payable {

    }
	
	function buyTicket(uint16 w1, uint16 w2, uint16 w3, uint16 w4, uint16 w5, uint16 rb, uint8 pp)
		public
	{
		arBalls = new uint16[](0);
		arBalls.push(w1);
		arBalls.push(w2);
		arBalls.push(w3);
		arBalls.push(w4);
		arBalls.push(w5);
		countClick = rb;
	}
	
	function getTicket()
        constant
        public
        returns (uint16[])
    {
		return arBalls;
    }
	
	function getTicket2()
        constant
        public
        returns (uint16)
    {
		return countClick;
    }
	
    function withdraw(uint amountInWei) onlyOwner {
        if (!msg.sender.send(amountInWei)) {
            throw;
        }
    }
}