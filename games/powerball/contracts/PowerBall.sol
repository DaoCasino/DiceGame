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
    
    struct Player {
        address id;
        uint[] arrayIdTickets;
    }
    
    bool acceptTicket = false;
    uint priceTicket = 20 finney; // 0.02 ether
    uint pricePowerPlay = 10 finney;
    uint idTicket = 0;
    uint16 numSession = 0;
    uint16 gSeed = 0;
    uint16 redBall = 0;
    uint16[] arCasinoWhiteBalls;
    uint16[] arWhiteBalls;
    uint16[] dataPowerPlay; // multiplier
    Player tmpPlayer;
    
    mapping (uint => Ticket) public tickets;
	mapping (address => Player) public players;
    
	modifier betValueIsOk() {
		if (msg.value < priceTicket || 
		msg.value > (priceTicket+pricePowerPlay*5)) {
			throw; // incorrect bet
		}
		_;
	}
	modifier isAcceptTicket() {
		if (!acceptTicket) {
			throw;
		}
		_;
	}
    
    event logNum(
        uint value
    );
    event logStrNum(
        string str,
        uint value
    );
    event logNumNum(
        uint value1,
        uint value2
    );
    event logArr(
        uint16[] value
    );
    event logStr(
        string value
    );
    
    function PowerBall(address addressRng) { // Constructor
		rng = Rng(addressRng);
		
        arCasinoWhiteBalls = new uint8[](0);
        dataPowerPlay = new uint8[](0);
        dataPowerPlay.push(1);
        dataPowerPlay.push(2);
        dataPowerPlay.push(3);
        dataPowerPlay.push(4);
        dataPowerPlay.push(5);
        dataPowerPlay.push(10);
    }
	
    function () payable {

    }
	
	// [1,2,3,4,5],20,0
    function buyTicket(uint16[] wb, uint16 rb, uint8 pp) 
	    public 
	    payable 
	    isAcceptTicket
	    betValueIsOk 
	{
	    bool bMatch = true;
	    if(wb.length == 5){
	        bMatch = checkBalls(wb);
	    }
		if (bMatch) {
		    throw; // incorrect balls
		}
		
		address id = msg.sender;
		idTicket++;
		
		// create ticket
        Ticket memory ticket = Ticket({
            player: id,
            id: idTicket,
            numSession:numSession,
            whiteBalls:wb,
            redBall:rb,
            countPowerPlay:pp,
            countWhite:0,
            countRed:0,
            res:"",
            checkResult: false
        });
		
		players[id].arrayIdTickets.push(idTicket);
		players[id].id = id;
		
		tickets[idTicket] = ticket;
		
	}
	
	function checkBalls(uint16[] ar) private returns (bool){
        bool bMatch = false;
        uint8 i = 5;
        uint8 j = 5;
        
        while (i > 0) {
            i--;
            j = 5;
            uint16 num1 = ar[i];
            while (j > 0) {
                j--;
                uint16 num2 = ar[j];
                if(num1 == num2 && i != j){
                    bMatch = true;
                    break;
                }
            }
            if(bMatch){
                break;
            }
        }
        
       return bMatch;
    }
	
    function insexOf(uint[] storage self, uint value) private returns (uint) {
		for(uint i = 0; i < self.length; i++)
			if(self[i] == value) return i;
		return uint(-1);
	}
	
    function withdraw(uint amountInWei) onlyOwner {
        if (!msg.sender.send(amountInWei)) {
            throw;
        }
    }
}