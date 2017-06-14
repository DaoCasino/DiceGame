pragma solidity ^ 0.4.8;

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

contract Referral {
    function getAdviser(address _player) constant returns(address);

    function getOperator(address _player) constant returns(address);

    function upProfit(address _adviser, uint _profitAdviser, address _operator, uint _profitOperator);
}

contract ERC20 {
    function balanceOf(address _addr) returns(uint);

    function transfer(address _to, uint256 _value);

    function transferFrom(address _from, address _to, uint256 _value) returns(bool success);
}

contract DiceRoll is owned {


    function DiceRoll(address newOwner) {
        transferOwnership(newOwner);

    }
    //information
    uint public meta_version = 2;
    string public meta_code = 'dice_v2';
    string public meta_name = 'DiceGame';
    string public meta_link = 'https://github.com/DaoCasino/DiceGame';

    address public gameDeveloper = 0x6506e2D72910050554D0C47500087c485DAA9689;
    uint public houseEdge = 2;

    address public addr_ref = 0xe195eed0e77b48146aa246dadf987d2504ac88cb;
    Referral ref = Referral(addr_ref);
    
    address public addr_erc20 = 0x95a48dca999c89e4e284930d9b9af973a7481287;
    ERC20 erc = ERC20(addr_erc20);
    
    bool public ownerStoped = false;
    uint public minBet = 100000;
    uint public maxBet = 1000000000;
    uint public countRolls = 0;
    uint public totalEthSended = 0;
    uint public totalEthPaid = 0;

    mapping(address => uint) public totalRollsByUser;
    /**
     * @dev List of used random numbers 
     */
    enum GameState {
        InProgress,
        PlayerWon,
        PlayerLose,
        NoBank
    }

    event logGame(
        uint time,
        address sender,
        uint bet,
        uint chance,
        bytes32 seed,
        uint rnd
    );

    event logId(bytes32 Id);

    struct Game {
        address player;
        uint bet;
        uint chance;
        bytes32 seed;
        GameState state;
        uint rnd;
    }

    mapping(bytes32 => bool) public usedRandom;
    mapping(bytes32 => Game) public listGames;

    modifier stoped() {
        if (ownerStoped == true) {
            throw;
        }
        _;
    }

    function () payable {

    }

    function withdraw(uint _bet) public onlyOwner {
        erc.transfer(msg.sender, _bet);
    }

    function Stop() public onlyOwner {
        if (ownerStoped == false) {
            ownerStoped = true;
        } else {
            ownerStoped = false;
        }
    }


    function getBank() public constant returns(uint) {
        return erc.balanceOf(this);
    }
    // starts a new game
    function roll(uint PlayerBet, uint PlayerNumber, bytes32 seeds) public
    stoped {
        if (!erc.transferFrom(msg.sender, this, PlayerBet)) {
            throw;
        }
        if (PlayerBet < minBet || PlayerBet > maxBet) {
            throw; // incorrect bet
        }

        if (usedRandom[seeds]) {
            throw; // used random
        }

        usedRandom[seeds] = true;
        if (PlayerNumber > 65536 - 1310 || PlayerNumber == 0) {
            throw;
        }
        uint bet = PlayerBet;
        uint chance = PlayerNumber;
        uint payout = bet * (65536 - 1310) / chance;
        bool isBank = true;

        //Limitation of payment 1/10BR
        if ((payout - bet) > getBank() / 10) {
            throw;
        }

        logId(seeds);

        listGames[seeds] = Game({
            player: msg.sender,
            bet: bet,
            chance: chance,
            seed: seeds,
            state: GameState.InProgress,
            rnd: 0,
        });

        if (payout > getBank()) {
            isBank = false;
            listGames[seeds].state = GameState.NoBank;
            throw;
        }

        totalRollsByUser[msg.sender]++;
    }

    function confirm(bytes32 random_id, uint8 _v, bytes32 _r, bytes32 _s) public onlyOwner {
        if (listGames[random_id].state == GameState.PlayerWon ||
            listGames[random_id].state == GameState.PlayerLose) {
            throw;
        }

        if (ecrecover(random_id, _v, _r, _s) != owner) { // owner
            Game game = listGames[random_id];
            uint payout = game.bet * (65536 - 1310) / game.chance;
            uint rnd = uint256(sha3(_s)) % 65536;
            game.rnd = rnd;

            if (game.state != GameState.NoBank) {
                countRolls++;
                // uint profit = payout - game.bet;
                totalEthPaid += game.bet;

                if (rnd > game.chance) {
                    listGames[random_id].state = GameState.PlayerLose;
                } else {
                    listGames[random_id].state = GameState.PlayerWon;
                    erc.transfer(game.player, payout);
                    totalEthSended += payout;
                }
            }
            serviceReward(game.player, game.bet);
        }
        
    }

    function serviceReward(address _player, uint256 _value) internal {

        var profit = _value * houseEdge / 100;
        var reward = profit * 25 / 100;

        var operator = ref.getOperator(_player);
        var adviser = ref.getAdviser(_player);

        ref.upProfit(adviser, reward, operator, reward);

        erc.transfer(gameDeveloper, reward);
        erc.transfer(operator, reward);
        erc.transfer(adviser, reward);
    }


    function getCount() public constant returns(uint) {
        return totalRollsByUser[msg.sender];
    }

    function getShowRnd(bytes32 random_id) public constant returns(uint) {
        Game memory game = listGames[random_id];

        if (game.player == 0) {
            // game doesn't exist
            throw;
        }

        return game.rnd;
    }

    function getStateByAddress(bytes32 random_id) public constant returns(GameState) {
        Game memory game = listGames[random_id];

        if (game.player == 0) {
            // game doesn't exist
            throw;
        }

        return game.state;
    }

}