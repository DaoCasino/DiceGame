pragma solidity ^0.4.2;

library Types {

    enum GameState {
        InProgress,
        PlayerWon,
        HouseWon,
        Tie,
        InProgressSplit,
        PlayerBlackJack
    }


    struct Game {
        uint bet;
        uint insurance;

        address player;
        
        uint8 playerScore;
        uint8 playerBigScore;
        uint8 houseScore;
        uint8 houseBigScore;

        uint8 seed;

        GameState state;

        bool insuranceAvailable;

        uint32 id;

        uint8[] houseCards;
        uint8[] playerCards;
    }
}