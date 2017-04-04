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
    uint priceTicket = 20 finney; // 0.02 ether
    uint pricePowerPlay = 10 finney;
    uint16 numSession = 0;
    uint16 gSeed = 0;
    uint8 redBall = 0;
    uint8[] arCasinoWhiteBalls;
    uint8[] arWhiteBalls;
    uint8[] dataPowerPlay; // multiplier
    mapping (address => uint) public totalRollsByUser;
    
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
	
    struct Ticket {
        address player;
        
        uint8[] whiteBalls;
        uint8 redBall;
        uint8 countPowerPlay;
        uint8 countWhite; //match
        uint8 countRed; //match
        string res;
    }
    
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
    
    // array.insexOf()
    function checkBalls(uint8[] ar) private {
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
        
        if(bMatch){
            gSeed ++;
            arWhiteBalls = new uint8[](0);
            getBalls(arWhiteBalls);
        }
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
    
    function startPowerBall() public onlyOwner {
        numSession ++;
        playGame();
    	logArr(arCasinoWhiteBalls);
    	logNum(redBall);
        
    }
}