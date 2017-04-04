pragma solidity ^0.4.9;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract PowerBall is owned {
    
    struct Ticket {
        address player;
        uint8[] whiteBalls;
        uint8 redBall;
        uint8 countPowerPlay;
        uint8 countWhite; //match
        uint8 countRed; //match
        string res;
    }
    
    bool acceptTicket = true;
    uint priceTicket = 20 finney; // 0.02 ether
    uint pricePowerPlay = 10 finney;
    uint16 numSession = 0;
    uint16 gSeed = 0;
    uint8 redBall = 0;
    uint8[] arCasinoWhiteBalls;
    uint8[] arWhiteBalls;
    uint8[] dataPowerPlay; // multiplier
    Ticket[] dataTickets;
    
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
    event logNum2(
        string str,
        uint value,
        uint value2
    );
    event logStr(
        string value
    );
    event logArr(
        uint8[] value
    );
    
    function PowerBall() { // Constructor
        arCasinoWhiteBalls = new uint8[](0);
        dataPowerPlay = new uint8[](0);
        dataPowerPlay.push(1);
        dataPowerPlay.push(2);
        dataPowerPlay.push(3);
        dataPowerPlay.push(4);
        dataPowerPlay.push(5);
        dataPowerPlay.push(10);
    }
    
    function playGame() private {
        gSeed ++;
        arWhiteBalls = new uint8[](0);
        getBalls(arWhiteBalls);
        arCasinoWhiteBalls = arWhiteBalls;
        redBall = randomGen(msg.sender, gSeed, 26);
    }
    
	function randomGen(address player, uint16 seed, uint16 value) private returns (uint8) {
		uint b = block.number;
		uint timestamp = block.timestamp;
		return uint8(uint256(keccak256(block.blockhash(b), player, seed, timestamp)) % value);
	}
    
    function getBalls(uint8[] storage ar) private {
        uint8[] storage array = ar;
        uint8 count = 5;
        
	    while (count > 0) {
            uint8 rnd = randomGen(msg.sender, gSeed+count, 69)+1;//69
	        array.push(rnd);
	        count --;
        }
        
        checkBalls(array);
    }
    
    function checkCasinoBalls(uint8[] ar) private {
        bool bMatch = checkBalls(ar);
        
        if(bMatch){
            gSeed ++;
            arWhiteBalls = new uint8[](0);
            getBalls(arWhiteBalls);
        }
    }
    
    // array.insexOf()
    function checkBalls(uint8[] ar) private returns (bool){
        bool bMatch = false;
        uint8 i = 5;
        uint8 j = 5;
        
        while (i > 0) {
            i--;
            j = 5;
            uint8 num1 = ar[i];
            while (j > 0) {
                j--;
                uint8 num2 = ar[j];
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
    
    function getPrize(uint8 wb, uint8 rb) private returns (uint){
        uint value = 0;
        if(wb==5 && rb==1){
            value = priceTicket; //jackpot
        }else if(wb==5 && rb==0){
           value = 500000*priceTicket;
        }else if(wb==4 && rb==1){
           value = 25000*priceTicket;
        }else if((wb==4 && rb==0) || (wb==3 && rb==1)){
           value = 50*priceTicket;
        }else if((wb==3 && rb==0) || (wb==2 && rb==1)){
           value = 7*priceTicket/2;
        }else if((wb==1 && rb==1) || (wb==0 && rb==1)){
           value = 2*priceTicket;
        }
        
        return value;
    }
    
    function setTicket(uint8[] wb, uint8 rb, uint8 pp) 
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
		
        Ticket memory ticket = Ticket({
            player: msg.sender,
            whiteBalls:wb,
            redBall:rb,
            countPowerPlay:pp,
            countWhite:0,
            countRed:0,
            res:""
        });
        
        dataTickets.push(ticket);
	}
	
	function checkResult(Ticket ticket) private {
		if(arCasinoWhiteBalls.length == 5 && redBall > 0){
    		uint8 i = 5;
            uint8 j = 5;
            uint8 white = 0;
            
            while (i > 0) {
                i--;
                j = 5;
                uint8 value1 = arCasinoWhiteBalls[i];
                while (j > 0) {
                    j--;
                    uint8 value2 = ticket.whiteBalls[j];
                    if(value1 == value2 && i != j){
                        white++;
                    }
                }
            }
            
            ticket.countWhite = white;
            
            if(ticket.redBall == redBall){
    			ticket.countRed = 1;
    		}
    		
    		uint prize = getPrize(ticket.countWhite, ticket.countRed);
    		if(prize > 0){
    		    if(prize == priceTicket){
    		        ticket.res = "jackpoint";
    		    } else {
    		        ticket.res = "win";
    		    }
    		} else {
    		    ticket.res = "lose";
    		}
		} else {
		    throw;
		}
    }
    
    function startPowerBall() public onlyOwner {
        numSession ++;
        acceptTicket = false;
        playGame();
    	logArr(arCasinoWhiteBalls);
    	logNum(redBall);
        
    }
    
    function getWhiteBalls() public constant returns(uint8[]) {
        return arCasinoWhiteBalls;
    }
    
    function getRedBall() public constant returns(uint8) {
        return redBall;
    }
    
    function withdraw(uint amountInWei) onlyOwner {
        if (!msg.sender.send(amountInWei)) {
            throw;
        }
    }
}