var gasAmount = 4000000;

var accounts;
var account;

var canvas;
var ctx;

var background;

var gameInited = false;

var style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 28,
    fill: "#ffffff",
    fontWeight: 'bold',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440
});

var balanceText = new PIXI.Text('Balance: ??? ETH', style);
var houseBalanceText = new PIXI.Text('Balance: ??? ETH', style);
var resultText = new PIXI.Text();

var play_btn;
var hit_btn;
var stand_btn;

var gameIsGoingOn;

var suit = {0: 'Hearts', 1: 'Diamonds', 2: 'Spades', 3: 'Clubs'};
var cardType = {0: 'King', 1: 'Ace', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
                11: 'Jacket', 12: 'Queen'};

var gameState = {
  0: "Your turn",
  1: "You won!",
  2: "House won!",
  3: "Tie!"
}

var lastPlayerCard = 0;
var lastHouseCard = 0;

var renderer = PIXI.autoDetectRenderer(800, 800);
renderer.backgroundColor = 0x061639;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

var stage = new PIXI.Container();
var oldState = false;

var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

var dealedCards = new Array();

function checkGameState() {
  console.log("Checking game state");

  return BlackJack.deployed().then(function(game) {
    return game.getGameState.call({from: account}).then(function(state) {
      oldState = gameIsGoingOn;
      state = parseInt(state)
      console.log(gameState[state])
      switch(state) {
        case 0:
          gameIsGoingOn = true;
          break;
        case 1:
          gameIsGoingOn = false;
          break;
        case 2:
          gameIsGoingOn = false;
          break;
        case 3:
          gameIsGoingOn = false;
          break;
      }
      if (oldState != gameIsGoingOn && gameIsGoingOn == false) {
        console.log("Show the result of the game");
        resultText.setText(gameState[state]);
        updateBlockchainData();
        renderer.render(stage);
      }
      updateScene();
    });
  }).catch(function(err) {
    // the game doesn't exist at all
    console.log("Exception", err);
    if (err.name !== 'TypeError') {
      oldState = gameIsGoingOn;
      gameIsGoingOn = false;
      lastPlayerCard = 0;
      lastHouseCard = 0;
      return updateScene();
    }
  });
}

window.onload = function() {

  loader.add("images/bg.jpg")
  .add("images/play_btn.gif")
  .add("images/hit.png")
  .add("images/stand.png")
  .add("images/1.A.png")
  .add("images/1.2.png")
  .add("images/1.3.png")
  .add("images/1.4.png")
  .add("images/1.5.png")
  .add("images/1.6.png")
  .add("images/1.7.png")
  .add("images/1.8.png")
  .add("images/1.9.png")
  .add("images/1.10.png")
  .add("images/1.J.png")
  .add("images/1.Q.png")
  .add("images/1.K.png")
  .add("images/2.A.png")
  .add("images/2.2.png")
  .add("images/2.3.png")
  .add("images/2.4.png")
  .add("images/2.5.png")
  .add("images/2.6.png")
  .add("images/2.7.png")
  .add("images/2.8.png")
  .add("images/2.9.png")
  .add("images/2.10.png")
  .add("images/2.J.png")
  .add("images/2.Q.png")
  .add("images/2.K.png")
  .add("images/3.A.png")
  .add("images/3.2.png")
  .add("images/3.3.png")
  .add("images/3.4.png")
  .add("images/3.5.png")
  .add("images/3.6.png")
  .add("images/3.7.png")
  .add("images/3.8.png")
  .add("images/3.9.png")
  .add("images/3.10.png")
  .add("images/3.J.png")
  .add("images/3.Q.png")
  .add("images/3.K.png")
  .add("images/4.A.png")
  .add("images/4.2.png")
  .add("images/4.3.png")
  .add("images/4.4.png")
  .add("images/4.5.png")
  .add("images/4.6.png")
  .add("images/4.7.png")
  .add("images/4.8.png")
  .add("images/4.9.png")
  .add("images/4.10.png")
  .add("images/4.J.png")
  .add("images/4.Q.png")
  .add("images/4.K.png")
  .load(setupScene);

  document.body.appendChild(renderer.view);

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    checkGameState();
  });
}

function updateScene()  {
  showGameButtons();
}

function showGameButtons() {
  if (!gameInited) return;
  //console.log("showGameButtons:", gameIsGoingOn);
  if (gameIsGoingOn) {
    hit_btn.interactive = true;
    hit_btn.buttonMode = true;
    stand_btn.interactive = true;
    stand_btn.buttonMode = true;

    hit_btn.x = renderer.width / 2 - hit_btn.width - 10;
    hit_btn.y = renderer.height - hit_btn.height - 20;

    stand_btn.x = renderer.width / 2 + 10;
    stand_btn.y = renderer.height - stand_btn.height - 20;

    play_btn.visible = false;
    hit_btn.visible = true;
    stand_btn.visible = true;
  } else {
    play_btn.x = (renderer.width - play_btn.width) / 2;
    play_btn.y = renderer.height - play_btn.height - 20;
    play_btn.interactive = true;
    play_btn.buttonMode = true;

    play_btn.visible = true;
    hit_btn.visible = false;
    stand_btn.visible = false;
  }

  renderer.render(stage);
}

function showPlayerCard(card) {
  if (!oldState && !gameIsGoingOn) return;
  stage.addChild(card);
  card.width = renderer.width / 10;
  card.height = card.width * 1.5;
  card.x = renderer.width / 14 + (lastPlayerCard * (card.width + 5)) ;
  card.y = (renderer.height - card.height) / 2;
  lastPlayerCard++;
  dealedCards.push(card);
  renderer.render(stage);
}

function showHouseCard(card) {
  if (!oldState && !gameIsGoingOn) return;
  stage.addChild(card);
  card.width = renderer.width / 10;
  card.height = card.width * 1.5;
  card.x = renderer.width - (renderer.width / 14 + (lastHouseCard * (card.width + 5))) - card.width;
  card.y = (renderer.height - card.height) / 2;
  lastHouseCard++;
  dealedCards.push(card);
  renderer.render(stage);
}

function setupScene(resetCallbacks=true) {
  console.log("setting up scene");

  // load bg
  var background_image = resources["images/bg.jpg"];
  background = new PIXI.TilingSprite(background_image.texture, renderer.width, renderer.height);
  background.zIndex = -5;
  stage.addChild(background);

  // load start game btn
  var start_btn_image = resources["images/play_btn.gif"];
  play_btn = new PIXI.Sprite(start_btn_image.texture);
  stage.addChild(play_btn);

  lastPlayerCard = 0;
  lastHouseCard = 0;

  play_btn.on('pointerdown', function() {
    setupScene(false);
    BlackJack.deployed().then(function(game) {
      return game.deal({
        from: account,
        gas: gasAmount,
        value: web3.toWei(0.05, "Ether")
      }).then(function(tx_id) {
        console.log("Deal cards", tx_id);
        oldState = gameIsGoingOn;
        gameIsGoingOn = true;
        updateScene();
      });
    });
  });

  // load hit and stand buttons
  var hit_image = resources["images/hit.png"];
  var stand_image = resources["images/stand.png"];
  hit_btn = new PIXI.Sprite(hit_image.texture);
  stand_btn = new PIXI.Sprite(stand_image.texture);

  var oldHitWidth = hit_btn.width;
  hit_btn.width = renderer.width / 12;
  hit_btn.height = hit_btn.width;

  var oldStandWidth = stand_btn.width;
  stand_btn.width = hit_btn.width;
  stand_btn.height = stand_btn.width;

  stage.addChild(hit_btn);
  stage.addChild(stand_btn);

  stand_btn.on('pointerdown', function() {
    BlackJack.deployed().then(function(game) {
      return game.stand({
        from: account,
        gas: gasAmount
      }).then(function(tx_id) {
        console.log("Finish the game", tx_id);
        return checkGameState();
      });
    });
  });

  hit_btn.on('pointerdown', function() {
    BlackJack.deployed().then(function(game) {
      return game.hit({
        from: account,
        gas: gasAmount
      }).then(function(tx_id) {
        console.log("Request new card", tx_id);
        return checkGameState();
      });
    });
  });

  gameInited = true;
  // show required buttons
  showGameButtons();

  balanceText.x = 50;
  balanceText.y = 20;
  stage.addChild(balanceText);

  houseBalanceText.x = renderer.width - balanceText.width - 50;
  houseBalanceText.y = 20;
  stage.addChild(houseBalanceText);

  var blueText = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 28,
      fill: "#ffff00",
      fontWeight: 'bold',
      strokeThickness: 5,
      wordWrap: true,
      wordWrapWidth: 440
  });

  resultText = new PIXI.Text('It is your turn', blueText);
  resultText.x = (renderer.width - resultText.width) / 2;
  resultText.y = 60;
  stage.addChild(resultText);

  renderer.render(stage);

  if (resetCallbacks) {
    BlackJack.deployed().then(function(game) {
      return game.Deal({fromBlock: "latest"});
    }).then(function(deals) {
      deals.watch(function(error, result) {
        var card = result.args['_card']['c'][0];
        if (result.args["isUser"]) {
          console.log("Deal { Player new card:", cardType[Math.floor(card / 4)], "of", suit[card % 4], "}");
          showPlayerCard(getCard(card));
        } else {
          console.log("Deal { House new card:", cardType[Math.floor(card / 4)], "of", suit[card % 4], "}");
          showHouseCard(getCard(card));
        }
        checkGameState();
      });
    });

    BlackJack.deployed().then(function(game) {
      return game.GameStatus({fromBlock: "latest"});
    }).then(function(statuses) {
      statuses.watch(function(error, result) {
        console.log("GameState { houseScore:",
                    result.args['houseScore']['c'][0], "[", result.args['houseScoreBig']['c'][0],
                    "], playerScore:", result.args['playerScore']['c'][0], "[", result.args['playerScoreBig']['c'][0], "] }");
      });
    });

    updateBlockchainData();
  }
}

function updateBlockchainData() {
  updateHouseBalance();
  updatePlayerBalance();
}

function updatePlayerBalance() {
  console.log("Account:", account);
  var balance = web3.fromWei(web3.eth.getBalance(account), "Ether");
  console.log(balance.toString());
  balanceText.setText('Your balance: ' + balance.toFixed(5).toString() + ' ETH');
  renderer.render(stage);
}

function updateHouseBalance() {
  BlackJack.deployed().then(function(game) {
    var houseBalance = web3.fromWei(web3.eth.getBalance(game.address), "Ether");
    houseBalanceText.setText('House balance: ' + houseBalance.toFixed(5).toString() + ' ETH');
    houseBalanceText.x = renderer.width - houseBalanceText.width - 50;
    renderer.render(stage);
  });
}

function getCard(cardIndex) {
  var cardType = Math.floor(cardIndex / 4);
  var cardSymbol = String(cardType);
  switch (cardType) {
    case 0:
      cardSymbol = "K";
      break;
    case 1:
      cardSymbol = "A";
      break;
    case 11:
      cardSymbol = "J";
      break;
    case 12:
      cardSymbol = "Q";
      break;
  }
  var suit = String(cardIndex % 4 + 1);
  var spriteName = "images/" + suit + "." + cardSymbol + ".png";
  var newCard = new PIXI.Sprite(resources[spriteName].texture);
  newCard.zIndex = 10;
  return newCard;
}
