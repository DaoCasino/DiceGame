pragma solidity ^0.4.10;

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

contract Rng {
    function randomGen(address player, uint16 seed, uint b, uint timestamp, uint16 value) returns (uint16);
}

contract PowerBall is owned {
    
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
        mapping (uint => bool) arrayTickets;
    }
    
    struct Session {
        uint16 id;
        mapping (address => Player) arrayPlayers;
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
    Session tmpSession;
    address addrRng = 0xcdd09E673379d89447F054C203D5bD47ABA078d0;
    Rng rng = Rng(addrRng);
    
    mapping (uint16 => Session) public sessions;
    mapping (uint => Ticket) public tickets;
    
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
        arWhiteBalls = new uint16[](0);
        getBalls(arWhiteBalls);
        arCasinoWhiteBalls = arWhiteBalls;
        redBall = randomGen(msg.sender, gSeed, 26)+1;
    }
    
	function randomGen(address player, uint16 seed, uint16 value) private returns (uint16) {
		uint b = block.number;
		uint timestamp = block.timestamp;
		//return rng.randomGen(player, seed, b, timestamp, value); // web3
		return uint8(uint256(keccak256(block.blockhash(b), player, seed, timestamp)) % value); //js
	}
    
    function getBalls(uint16[] storage ar) private {
        uint16[] storage array = ar;
        uint8 count = 5;
        
	    while (count > 0) {
            uint16 rnd = randomGen(msg.sender, gSeed+count, 69)+1;//69
	        array.push(rnd);
	        count --;
        }
        
        checkCasinoBalls(array);
    }
    
    function checkCasinoBalls(uint16[] ar) private {
        bool bMatch = checkBalls(ar);
        
        if(bMatch){
            gSeed ++;
            arWhiteBalls = new uint8[](0);
            getBalls(arWhiteBalls);
        }
    }
    
    // array.insexOf()
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
        
        //Session storage session = sessions[numSession]; //not memory!
        //delete tmpPlayer;
        
        //TODO: Always create new session (session.id == 0)
        
        // create session
        //if(session.id < 1){
            tmpPlayer.id = id;
            tmpPlayer.arrayIdTickets.push(idTicket);
            tmpPlayer.arrayTickets[idTicket] = true;
            tmpSession.id = numSession;
            tmpSession.arrayPlayers[id] = tmpPlayer;
            sessions[numSession] = tmpSession;
            //logNum(1);
       /* } else {
            Player storage player = session.arrayPlayers[id];
            // create player
            if(player.id == 0){
                tmpPlayer.id = id;
                player = tmpPlayer;
                logNum(2);
            } else {
                logNum(3);
            }
            
            player.arrayIdTickets.push(idTicket);
            player.arrayTickets[idTicket] = true;
        }*/
        
        tickets[idTicket] = ticket;
	}
	
	function checkResult(uint id) public {
        tmpSession = sessions[numSession];
        tmpPlayer = tmpSession.arrayPlayers[msg.sender];
        if (tmpPlayer.id == 0) {
            throw;
        }
        Ticket ticket = tickets[id];
        if(tmpPlayer.arrayTickets[id] && !ticket.checkResult){
            checkTicket(msg.sender, ticket);
        }
	}
	
	function checkTicket(address player, Ticket ticket) private {
	    ticket.checkResult = true;
		if(arCasinoWhiteBalls.length == 5 && redBall > 0){
            uint8 i = 5;
            uint8 j = 5;
            uint8 white = 0;
            
            while (i > 0) {
                i--;
                j = 5;
                uint16 value1 = arCasinoWhiteBalls[i];
                while (j > 0) {
                    j--;
                    uint16 value2 = ticket.whiteBalls[j];
                    if(value1 == value2){
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
    		    // TODO sent prize to player
    		    if(prize == priceTicket){
    		        ticket.res = "jackpoint";
    		    } else {
    		        ticket.res = "win";
    		    }
    		} else {
    		    ticket.res = "lose";
    		}
    		logStrNum(ticket.res, prize);
		} else {
		    throw;
		}
    }
    
    function startNewSession() public onlyOwner {
        numSession ++;
        acceptTicket = true;
    }
    
    function startPowerBall() public onlyOwner {
        acceptTicket = false;
        playGame();
        logArr(arCasinoWhiteBalls);
        logNum(redBall);
    }
    
    function getWhiteBalls() public constant returns(uint16[]) {
        return arCasinoWhiteBalls;
    }
    
    function getRedBall() public constant returns(uint16) {
        return redBall;
    }
    
    function getPlayerTicket() public constant returns(uint[]) {
        tmpSession = sessions[numSession];
        tmpPlayer = tmpSession.arrayPlayers[msg.sender];
        return tmpPlayer.arrayIdTickets;
    }
    
    function withdraw(uint amountInWei) onlyOwner {
        if (!msg.sender.send(amountInWei)) {
            throw;
        }
    }
}