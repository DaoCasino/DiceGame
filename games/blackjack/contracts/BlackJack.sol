pragma solidity ^0.4.2;
import "./Deck.sol";
import "./BlackJackStorage.sol";
// import "./ERC20.sol";
import "./Types.sol";
import "./owned.sol";

contract BlackJack is owned {
    using Types for *;

    /*
        Contracts
    */

    // Stores tokens
    // ERC20 token;

    Deck deck;

    // Stores all data
    BlackJackStorage storageContract;

    /*
        CONSTANTS
    */

    uint public minBet = 50 finney;
    uint public maxBet = 5 ether;

    uint32 lastGameId;

    uint8 BLACKJACK = 21;

    /*
        EVENTS
    */

    event Deal(
        uint8 _type, // 0 - player, 1 - house, 2 - split player
        uint8 _card
    );

    /*
        MODIFIERS
    */

    modifier gameFinished() {
        if (storageContract.isMainGameInProgress(msg.sender) || storageContract.isSplitGameInProgress(msg.sender)) {
            throw;
        }
        _;
    }

    modifier gameIsGoingOn() {
        if (!storageContract.isMainGameInProgress(msg.sender) && !storageContract.isSplitGameInProgress(msg.sender)) {
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
        if (!storageContract.isInsuranceAvailable(msg.sender)) {
            throw;
        }
        _;
    }

    modifier doubleAvailable() {
        if (!storageContract.isDoubleAvailable(msg.sender)) {
            throw;
        }
        _;
    }

    modifier splitAvailable() {
        if (!storageContract.isSplitAvailable(msg.sender)) {
            throw;
        }
        _;
    }

    modifier betIsDoubled() {
        if (storageContract.getBet(true, msg.sender) != msg.value) {
            throw;
        }
        _;
    }
	
    modifier betIsInsurance() {
        if (storageContract.getBet(true, msg.sender) != msg.value*2) {
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

    modifier payInsuranceIfNecessary(bool isMain) {
        if (storageContract.isInsurancePaymentRequired(isMain, msg.sender)) {
            if (!msg.sender.send(storageContract.getInsurance(isMain, msg.sender) * 2)) throw; // send insurance to the player
        }
        _;
    }

    /*
        CONSTRUCTOR
    */

    function BlackJack(address deckAddress, address storageAddress/*, address tokenAddress*/) {
        deck = Deck(deckAddress);
        storageContract = BlackJackStorage(storageAddress);
        // token = ERC20(tokenAddress);
    }

    function () payable {

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
        storageContract.createNewGame(lastGameId, msg.sender, msg.value);
        storageContract.deleteSplitGame(msg.sender);


        // deal the cards
        dealCard(true, true);
        dealCard(false, true);
        dealCard(true, true);

        if (deck.isAce(storageContract.getHouseCard(0, msg.sender))) {
            storageContract.setInsuranceAvailable(true, true, msg.sender);
        }

        checkGameResult(true, false);
    }

    function hit()
        public
        gameIsGoingOn
    {
        bool isMain = storageContract.isMainGameInProgress(msg.sender);

        dealCard(true, isMain);
        storageContract.setInsuranceAvailable(false, isMain, msg.sender);

        checkGameResult(isMain, false);
    }

    function requestInsurance()
        public
        payable
        betIsInsurance
        insuranceAvailable
    {
        bool isMain = storageContract.isMainGameInProgress(msg.sender);
        storageContract.updateInsurance(msg.value, isMain, msg.sender);
        storageContract.setInsuranceAvailable(false, isMain, msg.sender);
    }
	
    function stand()
        public
        gameIsGoingOn
    {
         bool isMain = storageContract.isMainGameInProgress(msg.sender);

         if (!isMain) {
             //switch focus to the main game
             storageContract.updateState(Types.GameState.InProgressSplit, isMain, msg.sender);
             checkGameResult(true, false);
             return;
         }

		if(storageContract.getPlayerScore(true, msg.sender) >= BLACKJACK &&
		storageContract.getSplitCardsNumber(msg.sender) == 0){
			dealCard(false, true);
		} else {
			while (storageContract.getHouseBigScore(msg.sender) < 17) {
				dealCard(false, true);
			}
		}

         checkGameResult(true, true); // finish the main game
		
         if (storageContract.getState(false, msg.sender) == Types.GameState.InProgressSplit) { // split game exists

             storageContract.syncSplitDealerCards(msg.sender);
             checkGameResult(false, true); // finish the split game
         }
    }

    function split()
        public
        payable
        betIsDoubled
        splitAvailable
    {
        storageContract.updateState(Types.GameState.InProgressSplit, true, msg.sender); // switch to the split game
        storageContract.createNewSplitGame(msg.sender, msg.value);

        // Deal extra cards in each game.
        dealCard(true, true);
        dealCard(true, false);

        checkGameResult(false, false);

        if (deck.isAce(storageContract.getHouseCard(0, msg.sender))) {
            storageContract.setInsuranceAvailable(true, false, msg.sender);
        }
    }

    function double()
        public
        payable
        betIsDoubled
        doubleAvailable
    {
        bool isMain = storageContract.isMainGameInProgress(msg.sender);

        storageContract.doubleBet(isMain, msg.sender);
        dealCard(true, isMain);
        stand();
    }

    /*
        SUPPORT FUNCTIONS
    */

    function dealCard(bool player, bool isMain)
        private
    {
        uint8 newCard;
        if (isMain && player) {
            newCard = storageContract.dealMainCard(msg.sender);
            Deal(0, newCard);
        }

        if (!isMain && player) {
            newCard = storageContract.dealSplitCard(msg.sender);
            Deal(2, newCard);
        }

        if (!player) {
            newCard = storageContract.dealHouseCard(msg.sender);
            Deal(1, newCard);
        }

        if (player) {
            uint8 playerScore = recalculateScore(newCard, storageContract.getPlayerSmallScore(isMain, msg.sender), false);
            uint8 playerBigScore = recalculateScore(newCard, storageContract.getPlayerBigScore(isMain, msg.sender), true);
            if (isMain) {
                storageContract.updatePlayerScore(playerScore, playerBigScore, msg.sender);
            } else {
                storageContract.updatePlayerSplitScore(playerScore, playerBigScore, msg.sender);
            }
        } else {
            uint8 houseScore = recalculateScore(newCard, storageContract.getHouseSmallScore(msg.sender), false);
            uint8 houseBigScore = recalculateScore(newCard, storageContract.getHouseBigScore(msg.sender), true);
            storageContract.updateHouseScore(houseScore, houseBigScore, msg.sender);
        }
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

    function checkGameResult(bool isMain, bool finishGame)
        private
    {
        if (storageContract.getHouseScore(msg.sender) == BLACKJACK && storageContract.getPlayerScore(isMain, msg.sender) == BLACKJACK) {
            onTie(isMain, finishGame);
            return;
        }

        if (storageContract.getHouseScore(msg.sender) == BLACKJACK && storageContract.getPlayerScore(isMain, msg.sender) != BLACKJACK) {
            onHouseWon(isMain, finishGame);
            return;
        }

        if (storageContract.getPlayerScore(isMain, msg.sender) == BLACKJACK) {
            onPlayerWon(isMain, finishGame);
            return;
        }

        if (storageContract.getPlayerScore(isMain, msg.sender) > BLACKJACK) {
            onHouseWon(isMain, finishGame);
            return;
        }

        if (!finishGame) return;

        uint8 playerShortage = BLACKJACK - storageContract.getPlayerScore(isMain, msg.sender);
        uint8 houseShortage = BLACKJACK - storageContract.getHouseScore(msg.sender);

        if (playerShortage == houseShortage) {
            onTie(isMain, finishGame);
            return;
        }

        if (playerShortage > houseShortage) {
            onHouseWon(isMain, finishGame);
            return;
        }

        onPlayerWon(isMain, finishGame);
    }

    /*
        FUNCTIONS THAT FINISH THE GAME
    */

    function onTie(bool isMain, bool finishGame)
        private
        standIfNecessary(finishGame)
    {
        // return bet to the player
        if (!msg.sender.send(storageContract.getBet(isMain, msg.sender))) throw;

        // set final state
        storageContract.updateState(Types.GameState.Tie, isMain, msg.sender);
    }

    function onHouseWon(bool isMain, bool finishGame)
        private
        standIfNecessary(finishGame)
        payInsuranceIfNecessary(isMain)
    {
        // set final state
        storageContract.updateState(Types.GameState.HouseWon, isMain, msg.sender);
    }

    function onPlayerWon(bool isMain, bool finishGame)
        private
        standIfNecessary(finishGame)
    {
        if (storageContract.getPlayerScore(isMain, msg.sender) != BLACKJACK) {
            if (!msg.sender.send(storageContract.getBet(isMain, msg.sender) * 2)) throw;
            // set final state
            storageContract.updateState(Types.GameState.PlayerWon, isMain, msg.sender);
            return;
        }

        if (storageContract.isNaturalBlackJack(isMain, msg.sender)) {
            if (!msg.sender.send((storageContract.getBet(isMain, msg.sender) * 5) / 2)) throw;
        } else {
            if (!msg.sender.send(storageContract.getBet(isMain, msg.sender) * 2)) throw;
        }

        // set final state
        storageContract.updateState(Types.GameState.PlayerBlackJack, isMain, msg.sender);
        return;
    }

    /*
        OWNER FUNCTIONS
    */

    function withdraw(uint amountInWei)
        onlyOwner
    {
        if (!msg.sender.send(amountInWei)) throw;
    }

}
