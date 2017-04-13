pragma solidity ^0.4.2;
import "./Deck.sol";
import "./ERC20.sol";
import "./Types.sol";
import "./owned.sol";

contract BlackJack is owned {
    using Types for *;

    /*
        Contracts
    */

    // Implements logic of the deck
    Deck deck;

    // Stores tokens
    ERC20 token;

    /*
        CONSTANTS
    */

    uint public minBet = 50 finney;
    uint public maxBet = 5 ether;

    uint32 lastGameId;

    uint8 BLACKJACK = 21;

    /*
        STORAGE
    */

    mapping (address => Types.Game) games;
    mapping (address => Types.Game) splitGames;

    /*
        EVENTS
    */

    event Deal(
        bool isUser,
        uint8 _card
    );

    /*
        MODIFIERS
    */

    modifier gameFinished() {
        if (mainGameInProgress(msg.sender) || splitGameInProgress(msg.sender)) {
            throw;
        }
        _;
    }

    modifier betIsSuitable() {
        if (msg.value < minBet || msg.value > maxBet) {
            throw; // incorrect bet
        }
        if (msg.value * 5 > this.balance * 2) {
            // Not enough money on the contract to pay the player.
            throw;
        }
        _;
    }

    modifier insuranceAvailable() {
        if (!isInsuranceAvailable()) {
            throw;
        }
        _;
    }

    modifier doubleAvailable() {
        if (!isDoubleAvailable()) {
            throw;
        }
        _;
    }

    modifier splitAvailable() {
        if (!isSplitAvailable()) {
            throw;
        }
        _;
    }

    modifier betIsDoubled() {
        if (games[msg.sender].bet != msg.value) {
            throw;
        }
        _;
    }

    modifier standIfNecessary(bool finishGame) {
        if (!finishGame) {
            stand();
        } else {
            _;
        }
    }

    modifier payInsuranceIfNecessary(Types.Game game) {
        if (getPlayerScore(game) != BLACKJACK &&
            game.houseCards.length == 2 &&
            (deck.valueOf(game.houseCards[0], false) == 10 || deck.valueOf(game.playerCards[1], false) == 10) &&
            game.insurance > 0) {
            if (!msg.sender.send(game.insurance * 2)) throw; // send insurance to the player
        }
        _;
    }

    /*
        CONSTRUCTOR
    */

    function BlackJack(address deckAddress, address tokenAddress) {
        deck = Deck(deckAddress);
        token = ERC20(tokenAddress);
    }

    function () payable {
        deal();
    }

    /*
        MAIN FUNCTIONS
    */

    function deal()
        public
        payable
        gameFinished
        betIsSuitable
    {

        lastGameId = lastGameId + 1;

        games[msg.sender] = Types.Game({
            player: msg.sender,
            bet: msg.value,
            houseCards: new uint8[](0),
            playerCards: new uint8[](0),
            playerScore: 0,
            playerBigScore: 0,
            houseScore: 0,
            houseBigScore: 0,
            state: Types.GameState.InProgress,
            seed: 3,
            insurance: 0,
            insuranceAvailable: false,
            id: lastGameId
        });

        delete splitGames[msg.sender];
                
        // deal the cards
        dealCard(true, games[msg.sender]);
        dealCard(false, games[msg.sender]);
        dealCard(true, games[msg.sender]);

        if (deck.isAce(games[msg.sender].houseCards[0])) {
            games[msg.sender].insuranceAvailable = true;
        }
    }

    function hit()
        public
    {   
        Types.Game storage game = getActiveGame();

        dealCard(true, game);
        game.insuranceAvailable = false;

        checkGameResult(game, false);
    }

    function requestInsurance()
        public
        payable
        betIsDoubled
        insuranceAvailable
    {   
        Types.Game storage game = getActiveGame();
        game.insurance = msg.value;
    }

    function stand()
        public
    {   
        Types.Game storage game = getActiveGame();

        if (!mainGameInProgress(msg.sender)) {
            // switch focus to the main game
            game.state = Types.GameState.InProgressSplit;
            return;
        }

        while (game.houseBigScore < 17) {
            dealCard(false, game);
        }

        checkGameResult(game, true);

        Types.Game storage splitGame = splitGames[msg.sender];

        if (splitGame.player == msg.sender) { // split game exists
            splitGame.houseCards = game.houseCards;
            splitGame.houseScore = game.houseScore;
            splitGame.houseBigScore = game.houseBigScore;

            checkGameResult(splitGame, true);
        }
    }

    function split()
        public
        payable
        betIsDoubled
        splitAvailable
    {
        Types.Game storage game = getMainGame();

        game.state = Types.GameState.InProgressSplit;

        splitGames[msg.sender] = Types.Game({
            player: msg.sender,
            bet: msg.value,
            houseCards: game.houseCards,
            playerCards: new uint8[](0),
            playerScore: deck.valueOf(game.playerCards[1], false),
            playerBigScore: deck.valueOf(game.playerCards[1], true),
            houseScore: game.houseScore,
            houseBigScore: game.houseBigScore,
            state: Types.GameState.InProgress,
            seed: 128,
            insurance: 0,
            insuranceAvailable: false,
            id: 0
        });


        splitGames[msg.sender].playerCards.push(game.playerCards[1]);

        game.playerCards = [game.playerCards[0]];
        game.playerScore = deck.valueOf(game.playerCards[0], false);
        game.playerBigScore = deck.valueOf(game.playerCards[0], true);

        // Deal extra cards in each game.
        dealCard(true, game);
        dealCard(true, splitGames[msg.sender]);

        checkGameResult(splitGames[msg.sender], false);

        if (deck.isAce(games[msg.sender].houseCards[0])) {
            splitGames[msg.sender].insuranceAvailable = true;
        }
    }

    function double()
        public
        payable
        betIsDoubled
        doubleAvailable
    {   
        Types.Game storage game = getActiveGame();
        game.bet = game.bet * 2;
        dealCard(true, game);
        stand();
    }

    /*
        FUNCTIONS THAT FINISH THE GAME
    */

    function onTie(Types.Game storage game, bool finishGame)
        private
        standIfNecessary(finishGame)
    {
        // return bet to the player
        if (!msg.sender.send(game.bet)) throw;

        // set final state
        game.state = Types.GameState.Tie;
    }

    function onHouseWon(Types.Game storage game, bool stand)
        private
        standIfNecessary(stand)
        payInsuranceIfNecessary(game)
    {
        // set final state
        game.state = Types.GameState.HouseWon;
    }

    function onPlayerWon(Types.Game storage game, bool stand)
        private
        standIfNecessary(stand)
    {   
        if (getPlayerScore(game) != BLACKJACK) {
            if (!msg.sender.send(game.bet * 2)) throw;
            // set final state
            game.state = Types.GameState.PlayerWon;
            return;
        }

        if (isNaturalBlackJack(game)) {
            if (!msg.sender.send((game.bet * 5) / 2)) throw;
        } else {
            if (!msg.sender.send(game.bet * 2)) throw;
        }

        // set final state
        game.state = Types.GameState.PlayerBlackJack;
        return;
    }

    /*
        SUPPORT FUNCTIONS
    */

    function dealCard(bool player, Types.Game storage game)
        private
    {
        uint8[] cards = game.houseCards;
        if (player) {
            cards = game.playerCards;
        }

        cards.push(deck.deal(msg.sender, game.seed));
    
        if (player) {
            game.playerScore = recalculateScore(cards[cards.length - 1], game.playerScore, false);
            game.playerBigScore = recalculateScore(cards[cards.length - 1], game.playerBigScore, true);
        } else {
            game.houseScore = recalculateScore(cards[cards.length - 1], game.houseScore, false);
            game.houseBigScore = recalculateScore(cards[cards.length - 1], game.houseBigScore, true);
        }

        Deal(player, cards[cards.length - 1]);
        game.seed = game.seed + 1;
    }

    function gameInProgress(Types.Game game)
        constant
        private
        returns (bool)
    {
        return game.player != 0 && game.state == Types.GameState.InProgress;
    }

    function mainGameInProgress(address player)
        constant
        private
        returns (bool)
    {
        return gameInProgress(games[player]);
    }

    function splitGameInProgress(address player)
        constant
        private
        returns (bool)
    {
        return gameInProgress(splitGames[player]);
    }

    function recalculateScore(uint8 newCard, uint8 score, bool big)
        private
        constant
        returns (uint8)
    {
        uint8 value = deck.valueOf(newCard, big);
        if (big && deck.isAce(newCard)) {
            if (score + value > BLACKJACK) {
                return score + deck.valueOf(newCard, false);
            }
        }
        return score + value;
    }

    function checkGameResult(Types.Game storage game, bool finishGame)
        private
    {   
        if (getHouseScore(game) == BLACKJACK && getPlayerScore(game) == BLACKJACK) {
            onTie(game, finishGame);
            return;
        }

        if (getHouseScore(game) == BLACKJACK && getPlayerScore(game) != BLACKJACK) {
            onHouseWon(game, finishGame);
            return;
        }

        if (getPlayerScore(game) == BLACKJACK) {
            onPlayerWon(game, finishGame);
            return;
        }

        if (getPlayerScore(game) > BLACKJACK) {
            onHouseWon(game, finishGame);
            return;
        }

        if (!finishGame) return;

        uint8 playerShortage = BLACKJACK - getPlayerScore(game);
        uint8 houseShortage = BLACKJACK - getHouseScore(game);

        if (playerShortage == houseShortage) {
            onTie(game, finishGame);
            return;
        }

        if (playerShortage > houseShortage) {
            onHouseWon(game, finishGame);
            return;
        }

        onPlayerWon(game, finishGame);
    }

    /*
        OWNER FUNCTIONS
    */

    function withdraw(uint amountInWei)
        onlyOwner
    {
        if (!msg.sender.send(amountInWei)) throw;
    }

    /*
        PRIVATE GETTERS
    */

    function getPlayerScore(Types.Game game)
        constant
        private
        returns (uint8)
    {
        if (game.playerBigScore > BLACKJACK) {
            return game.playerScore;
        }
        return game.playerBigScore;
    }

    function getHouseScore(Types.Game game)
        constant
        private
        returns (uint8)
    {
        if (game.houseBigScore > BLACKJACK) {
            return game.houseScore;
        }
        return game.houseBigScore;
    }

    function getActiveGame() 
        constant
        private
        returns (Types.Game storage)
    {
        if (mainGameInProgress(msg.sender)) {
            return games[msg.sender];
        }
        if (splitGameInProgress(msg.sender)) {
            return splitGames[msg.sender];
        }
        throw;
    }

    function getMainGame()
        constant
        private
        returns (Types.Game storage)
    {
        if (!mainGameInProgress(msg.sender)) {
            throw;
        }
        return games[msg.sender];
    }

    function getSplitGame()
        constant
        private
        returns (Types.Game storage)
    {
        if (!splitGameInProgress(msg.sender)) {
            throw;
        }
        return splitGames[msg.sender];
    }

    function isNaturalBlackJack(Types.Game game)
        private
        returns (bool)
    {
        return getPlayerScore(game) == BLACKJACK && game.playerCards.length == 2 &&
               (deck.isTen(game.playerCards[0]) || deck.isTen(game.playerCards[1]));
    }

    /*
        PUBLIC GETTERS
    */

    function getPlayerCard(uint8 id)
        public
        constant
        returns(uint8)
    {
        if (id < 0 || id > getPlayerCardsNumber()) {
            throw;
        }
        return games[msg.sender].playerCards[id];
    }

    function getSplitCard(uint8 id)
        public
        constant
        returns(uint8)
    {
        if (id < 0 || id > getSplitCardsNumber()) {
            throw;
        }
        return splitGames[msg.sender].playerCards[id];
    }

    function getHouseCard(uint8 id)
        public
        constant
        returns(uint8)
    {
        if (id < 0 || id > getHouseCardsNumber()) {
            throw;
        }
        return games[msg.sender].houseCards[id];
    }

    function getPlayerCardsNumber()
        public
        constant
        returns(uint)
    {
        Types.Game memory game = games[msg.sender];
        return game.playerCards.length;
    }

    function getSplitCardsNumber()
        public
        constant
        returns(uint)
    {   
        Types.Game memory game = games[msg.sender];
        return game.playerCards.length;
    }

    function getHouseCardsNumber()
        public
        constant
        returns(uint)
    {
        Types.Game memory game = games[msg.sender];
        return game.houseCards.length;
    }

    function getMainGameParams()
        public
        constant
        returns(uint256 bet, uint8 playerScore, uint8 houseScore, Types.GameState state, uint32 id)
    {
        Types.Game memory game = getMainGame();
        return (game.bet, getPlayerScore(game), getHouseScore(game), game.state, game.id);
    }

    function getSplitGameParams()
        public
        constant
        returns(uint256 bet, uint8 playerScore, uint8 houseScore, Types.GameState state, uint32 id)
    {
        Types.Game memory game = getSplitGame();
        return (game.bet, getPlayerScore(game), getHouseScore(game), game.state, game.id);
    }

    function isInsuranceAvailable()
        constant
        public
        returns (bool)
    {   
        Types.Game memory game = getActiveGame();
        return game.insuranceAvailable;
    }

    function isDoubleAvailable()
        constant
        public
        returns (bool)
    {
        Types.Game memory game = getActiveGame();
        return game.state == Types.GameState.InProgress && game.playerScore > 8 && game.playerScore < 12 && game.playerCards.length == 2;
    }

    function isSplitAvailable()
        constant
        public
        returns (bool)
    {   
        Types.Game memory game = games[msg.sender];
        return gameInProgress(game) && game.playerCards.length == 2 && deck.valueOf(game.playerCards[0], false) == deck.valueOf(game.playerCards[1], false);
    }

}
