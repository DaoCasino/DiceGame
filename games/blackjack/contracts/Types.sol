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
        uint bet;  // 32 bytes
        uint insurance;  // 32 bytes

        address player;  // 20 bytes
        
        uint8 playerScore;
        uint8 playerBigScore;
        uint8 houseScore;
        uint8 houseBigScore;

        GameState state;

        uint32 id;

        uint8 seed;

        bool insuranceAvailable;

        uint8[] houseCards;
        uint8[] playerCards;
    }
}