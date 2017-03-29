pragma solidity ^0.4.2;
import "./Deck.sol";
import "./owned.sol";

contract BlackJack is owned {
  using Deck for *;

  uint public minBet = 50 finney;
  uint public maxBet = 5 ether;

  uint8 BLACKJACK = 21;

  enum GameState {
    InProgress,
    PlayerWon,
    HouseWon,
    Tie,
    InProgressSplit
  }

  struct Game {
    address player;
    uint bet;

    uint8[] houseCards;
    uint8[] playerCards;

    uint8 playerScore;
    uint8 playerBigScore;
    uint8 houseScore;
    uint8 houseBigScore;

    GameState state;
    uint8 seed;

    uint insurance;
    bool insuranceAvailable;
    bool isGame;
  }

  mapping (address => Game) public games;
  mapping (address => Game) public splitGames;

  modifier gameIsInProgress() {
    if (!gameInProgress(games[msg.sender], false)) {
      throw;
    }
    _;
  }

  event Deal(
        bool isUser,
        uint8 _card
    );

    event GameStatus(
      uint8 houseScore,
      uint8 houseBigScore,
      uint8 playerScore,
      uint8 playerBigScore
    );

    event Log(
      uint8 value
    );

  function () payable {

  }

  function gameInProgress(Game game, bool split)
    constant
    private
    returns (bool)
  {
    if (game.player == 0) {
      return false;
    }
    if (split && game.state == GameState.InProgressSplit) {
      return true;
    }
    if (game.state == GameState.InProgress) {
      return true;
    } else {
      return false;
    }
  }

  // starts a new game
  function deal() public payable {
    if (gameInProgress(games[msg.sender], true)) {
      throw;
    }

    if (msg.value < minBet || msg.value > maxBet) {
      throw; // incorrect bet
    }
    if (msg.value * 5 > this.balance * 2) {
      // Not enough money on the contract to pay the player.
      throw;
    }

    Game memory game = Game({
      player: msg.sender,
      bet: msg.value,
      houseCards: new uint8[](0),
      playerCards: new uint8[](0),
      playerScore: 0,
      playerBigScore: 0,
      houseScore: 0,
      houseBigScore: 0,
      state: GameState.InProgress,
      seed: 3,
      insurance: 0,
      insuranceAvailable: false,
      isGame: true
    });

    games[msg.sender] = game;
    delete splitGames[msg.sender];
    
    games[msg.sender].isGame = true;

    // deal the cards
    dealCard(true, games[msg.sender]);
    dealCard(false, games[msg.sender]);
    dealCard(true, games[msg.sender]);

    if (Deck.isAce(games[msg.sender].houseCards[0])) {
      games[msg.sender].insuranceAvailable = true;
    }

    checkGameResult(games[msg.sender], false, false);
  }

  function dealCard(bool player, Game storage storageGame)
    private
  {
    Game memory game = storageGame;
    uint8[] storage cards = storageGame.houseCards;
    if (player) {
      cards = storageGame.playerCards;
    }
    cards.push(Deck.deal(msg.sender, game.seed));
    if (player) {
      // cards[cards.length - 1] might be further optimized by accessing local game copy.
      storageGame.playerScore = recalculateScore(cards[cards.length - 1], game.playerScore, false);
      storageGame.playerBigScore = recalculateScore(cards[cards.length - 1], game.playerBigScore, true);
    } else {
      storageGame.houseScore = recalculateScore(cards[cards.length - 1], game.houseScore, false);
      storageGame.houseBigScore = recalculateScore(cards[cards.length - 1], game.houseBigScore, true);
    }
    Deal(player, cards[cards.length - 1]);
    storageGame.seed = game.seed + 1;
  }

  // Deals one more card to the player
  function hit() public  {
    if (games[msg.sender].player == 0) {
      throw;
    }
    if (games[msg.sender].state != GameState.InProgress) {
      throw;
    }
    dealCard(true, games[msg.sender]);
    games[msg.sender].insuranceAvailable = false;
    checkGameResult(games[msg.sender], false, false);

    if (games[msg.sender].state != GameState.InProgress) { // the game finished
      if (splitGames[msg.sender].state == GameState.InProgressSplit) { // there was a split game
        // check result for the split game as well
        while (games[msg.sender].houseBigScore < 17) {
          dealCard(false, games[msg.sender]);
        }
        splitGames[msg.sender].houseCards = games[msg.sender].houseCards;
        checkGameResult(splitGames[msg.sender], true, true);
      }
    }
  }

  // Deals one more card to the split
  function hit_split() public {
    if (splitGames[msg.sender].player == 0) {
      throw;
    }
    if (splitGames[msg.sender].state != GameState.InProgress) {
      throw;
    }
    dealCard(true, splitGames[msg.sender]);
    checkGameResult(splitGames[msg.sender], false, true);
    if (splitGames[msg.sender].state != GameState.InProgress) {
      games[msg.sender].state = GameState.InProgress;
    }
  }

  function requestInsurance()
    payable
    public
    gameIsInProgress
  {
    Game storage game = games[msg.sender];

    if (game.insuranceAvailable == false) {
      throw;
    }

    if (msg.value == 0 || msg.value > game.bet / 2) {
      throw;
    }

    games[msg.sender].insurance = msg.value;
  }

  // Makes a "stand" move
  function stand()
    public
  {
    if (!gameInProgress(games[msg.sender], true)) {
      throw;
    }
    Game storage game = games[msg.sender];

    if (game.state == GameState.InProgressSplit) {
      // If there is a split
      Game storage splitGame = splitGames[msg.sender];
      if (splitGame.state != GameState.InProgressSplit) {
        // Stand in split game and wait for the stand / bust in the main game.
        splitGame.state = GameState.InProgressSplit;
        // Move focus to the main game.
        game.state = GameState.InProgress;
        return;
      }

    }
    while (game.houseBigScore < 17) {
      dealCard(false, game);
    }
    splitGames[msg.sender].houseCards = games[msg.sender].houseCards;
    checkGameResult(games[msg.sender], true, false);
    checkGameResult(splitGames[msg.sender], true, true);
  }

  function BlackJack() {
    // do nothing
  }


  function split()
    public
    payable
    gameIsInProgress
  {
    Game storage game = games[msg.sender];
    if (msg.value != game.bet) {
      // Should double the bet
      throw;
    }

    if (!isSplitAvailable(game)) {
      throw;
    }

    game.state = GameState.InProgressSplit;

    Game memory splitGame = Game({
      player: msg.sender,
      bet: msg.value,
      houseCards: game.houseCards,
      playerCards: new uint8[](0),
      playerScore: Deck.valueOf(game.playerCards[1], false),
      playerBigScore: Deck.valueOf(game.playerCards[1], true),
      houseScore: game.houseScore,
      houseBigScore: game.houseBigScore,
      state: GameState.InProgress,
      seed: 128,
      insurance: 0,
      insuranceAvailable: false,
      isGame: false
    });

    splitGames[msg.sender] = splitGame;
    splitGames[msg.sender].playerCards.push(game.playerCards[1]);

    game.playerCards = [game.playerCards[0]];
    game.playerScore = Deck.valueOf(game.playerCards[0], false);
    game.playerBigScore = Deck.valueOf(game.playerCards[0], true);

    // Deal extra cards in each game.
    dealCard(true, games[msg.sender]);
    dealCard(true, splitGames[msg.sender]);
  }

    function double()
    public
    payable
    gameIsInProgress
  {
    Game storage game = games[msg.sender];
    if(game.state == GameState.InProgressSplit){
        game = splitGames[msg.sender];
    }

    if (msg.value != game.bet) {
      // Should double the bet
      throw;
    }

    if (!isDoubleAvailable()) {
      throw;
    }

      game.bet = game.bet * 2;

      dealCard(true, game);
      if (game.state == GameState.InProgress) {
        stand();
    }
  }

  // @param finishGame - whether to finish the game or not (in case of Blackjack the game finishes anyway)
  function checkGameResult(Game storage game, bool finishGame, bool split) private {
    if (!gameInProgress(game, split)) {
      return;
    }
    // TODO: rewrite this function it is scary.
    GameStatus(game.houseScore, game.houseBigScore, game.playerScore, game.playerBigScore);

    if (game.houseBigScore == BLACKJACK || game.houseScore == BLACKJACK) {
      game.isGame = false;
      if (game.playerScore == BLACKJACK || game.playerBigScore == BLACKJACK) {
        // TIE
        if (!msg.sender.send(game.bet)) throw; // return bet to the player
        game.state = GameState.Tie; // finish the game
        return;
      } else {
        // HOUSE WON
        game.state = GameState.HouseWon; // simply finish the game
        if (game.houseCards.length == 2 && (Deck.valueOf(game.houseCards[0], false) == 10 || Deck.valueOf(game.playerCards[1], false) == 10) && game.insurance > 0) {
          if (!msg.sender.send(game.insurance * 2)) throw; // send insurance to the player
        }
        return;
      }
    } else {
      if (game.playerScore == BLACKJACK || game.playerBigScore == BLACKJACK) {
          game.isGame = false;
        // PLAYER WON
        if (game.playerCards.length == 2 && (Deck.isTen(game.playerCards[0]) || Deck.isTen(game.playerCards[1]))) {
          // Natural blackjack => return x2.5
          if (!msg.sender.send((game.bet * 5) / 2)) throw; // send prize to the player
        } else {
          // Usual blackjack => return x2
          if (!msg.sender.send(game.bet * 2)) throw; // send prize to the player
        }
        game.state = GameState.PlayerWon; // finish the game
        return;
      } else {
        if (game.playerScore > BLACKJACK) {
          // BUST, HOUSE WON
          if (game.houseCards.length == 1) {
            dealCard(false, game);
          }
          game.isGame = false;
          game.state = GameState.HouseWon; // finish the game
          if (game.houseCards.length == 2 && (Deck.valueOf(game.houseCards[0], false) == 10 || Deck.valueOf(game.playerCards[1], false) == 10) && game.insurance > 0) {
            if (!msg.sender.send(game.insurance * 2)) throw; // send insurance to the player
          }
          return;
        }

        if (!finishGame) {
          return; // continue the game
        }

        uint8 playerShortage = 0;
        uint8 houseShortage = 0;

        // player decided to finish the game
        if (game.playerBigScore > BLACKJACK) {
          if (game.playerScore > BLACKJACK) {
            // HOUSE WON
            game.isGame = false;
            game.state = GameState.HouseWon; // simply finish the game
            return;
          } else {
            playerShortage = BLACKJACK - game.playerScore;
          }
        } else {
          playerShortage = BLACKJACK - game.playerBigScore;
        }

        if (game.houseBigScore > BLACKJACK) {
          if (game.houseScore > BLACKJACK) {
            // PLAYER WON
            if (!msg.sender.send(game.bet * 2)) throw; // send prize to the player
            game.state = GameState.PlayerWon;
            game.isGame = false;
            return;
          } else {
            houseShortage = BLACKJACK - game.houseScore;
          }
        } else {
          houseShortage = BLACKJACK - game.houseBigScore;
        }

        if (houseShortage == playerShortage) {
          // TIE
          if (!msg.sender.send(game.bet)) throw; // return bet to the player
          game.state = GameState.Tie;
          game.isGame = false;
        } else if (houseShortage > playerShortage) {
          // PLAYER WON
          if (!msg.sender.send(game.bet * 2)) throw; // send prize to the player
          game.state = GameState.PlayerWon;
          game.isGame = false;
        } else {
          game.state = GameState.HouseWon;
          game.isGame = false;
        }
      }
    }
  }

  function recalculateScore(uint8 newCard, uint8 score, bool big)
    private
    constant
    returns (uint8)
  {
    uint8 value = Deck.valueOf(newCard, big);
    if (big && Deck.isAce(newCard)) {
      if (score + value > BLACKJACK) {
        return score + Deck.valueOf(newCard, false);
      }
    }
    return score + value;
  }

  function isSplitAvailable() public constant returns (bool) {
    return isSplitAvailable(games[msg.sender]);
  }

  function isSplitAvailable(Game game) private constant returns (bool) {
    return game.state == GameState.InProgress && game.playerCards.length == 2 && Deck.valueOf(game.playerCards[0], false) == Deck.valueOf(game.playerCards[1], false);
  }

  function isDoubleAvailable() public constant returns (bool) {
      Game memory game = games[msg.sender];
    if(game.state == GameState.InProgressSplit){
        game = splitGames[msg.sender];
    }

    return game.state == GameState.InProgress && game.playerScore > 8 && game.playerScore < 12 && game.playerCards.length == 2;
  }

  function getPlayerCard(uint8 id) public constant returns(uint8) {
    if (id < 0 || id > games[msg.sender].playerCards.length) {
      throw;
    }
    return games[msg.sender].playerCards[id];
  }

  function getHouseCard(uint8 id) public constant returns(uint8) {
    if (id < 0 || id > games[msg.sender].houseCards.length) {
      throw;
    }
    return games[msg.sender].houseCards[id];
  }

  function getSplitCard(uint8 id) public constant returns(uint8) {
    if (id < 0 || id > splitGames[msg.sender].playerCards.length) {
      throw;
    }
    return splitGames[msg.sender].playerCards[id];
  }

  function getPlayerCardsNumber() public constant returns(uint) {
    return games[msg.sender].playerCards.length;
  }

  function getHouseCardsNumber() public constant returns(uint) {
    return games[msg.sender].houseCards.length;
  }

  function getSplitCardsNumber() public constant returns(uint) {
    return splitGames[msg.sender].playerCards.length;
  }
  
  function getIsGame() public constant returns(bool) {
    return games[msg.sender].isGame;
  }
  
  function getPlayerScore() public constant returns(uint) {
    return games[msg.sender].playerScore;
  }
  
  function getSplitScore() public constant returns(uint) {
    return splitGames[msg.sender].playerScore;
  }

  function getInsurance() public constant returns(uint) {
    return games[msg.sender].insurance;
  }

  function isInsuranceAvailable() public constant returns(bool) {
    return games[msg.sender].insuranceAvailable;
  }

  function getGameState() public constant returns (GameState) {
    Game memory game = games[msg.sender];

    if (game.player == 0) {
      // game doesn't exist
      throw;
    }

    return game.state;
  }

  function getSplitGameState() public constant returns (GameState) {
    Game memory game = splitGames[msg.sender];

    if (game.player == 0) {
      // game doesn't exist
      throw;
    }

    return game.state;
  }

  function getPlayerBet() public constant returns(uint) {
    Game memory game = games[msg.sender];

    if (game.player == 0) {
      // game doesn't exist
      throw;
    }

    return game.bet;
  }

  function withdraw(uint amountInWei) onlyOwner {
    if (!msg.sender.send(amountInWei)) {
      throw;
    }
  }
}
