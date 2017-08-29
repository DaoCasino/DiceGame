pragma solidity ^ 0.4.13;

contract ERC20 {
    function transfer(address _to, uint256 _value);

    function transferFrom(address _from, address _to, uint256 _value) returns(bool success);
}

contract OwnedStore {
    function getAdviser(address _player) returns(address);

    function getOperator(address _player) returns(address);
}

contract gameChannel {

    ERC20 token = ERC20(0x95a48dca999c89e4e284930d9b9af973a7481287);
    OwnedStore store = OwnedStore(0xe195eed0e77b48146aa246dadf987d2504ac88cb);
    address public gameDeveloper = 0x6506e2D72910050554D0C47500087c485DAA9689;
    uint public totalChannels = 0;
    uint public totalMoneySend = 0;
    uint public totalMoneyPaids = 0;

    struct Channel {
        address player;
        address bankroller;
        uint playerBalance;
        uint playerDeposit;
        uint bankrollBalance;
        uint nonce;
        uint endBlock;
    }

    struct Dispute {
        bytes32 seed;
        uint chance;
        uint bet;
    }

    mapping(bytes32 => Channel) public channels;
    mapping(bytes32 => Dispute) public disputes;


    modifier active(Channel c) {
        /*
            only player or bankroller can call contract function.

        */
        require(msg.sender == c.player || msg.sender == c.bankroller);
        require(c.endBlock > block.number);
        require(c.endBlock != 0);
        _;
    }

    function open(bytes32 id, address player, uint playerDeposit, uint bankrollDeposit, uint nonce, uint time, bytes sig) {
        /*
            for opening channel player send data on the opening and signed data.
            bankroller send tx with data to contract for opening channel
        */
        assert(channels[id].endBlock == 0);
        assert(recoverSigner(sha3(id, player, playerDeposit, bankrollDeposit, nonce, time), sig) == player);
        assert(token.transferFrom(player, this, playerDeposit));
        assert(token.transferFrom(msg.sender, this, bankrollDeposit));
        channels[id] = Channel(player, msg.sender, playerDeposit, playerDeposit, bankrollDeposit, nonce, block.number + time);
        totalChannels++;
        totalMoneySend += playerDeposit;
    }

    function update(bytes32 id, uint playerBalance, uint bankrollBalance, uint nonce, bytes sig) active(channels[id]) {
        /*
            for update channel state player or bankroller send data on the update
            with signature of this data from other partycipant.
        */
        var partner = recoverSigner(sha3(id, playerBalance, bankrollBalance, nonce), sig);
        assert(playerBalance + bankrollBalance <= channels[id].playerBalance + channels[id].bankrollBalance);
        assert(nonce > channels[id].nonce);
        assert(partner != msg.sender && partner == channels[id].player || partner == channels[id].bankroller);

        if (block.number < channels[id].endBlock - 10) {
            channels[id].endBlock += 10;
        }
        channels[id].playerBalance = playerBalance;
        channels[id].bankrollBalance = bankrollBalance;
        channels[id].nonce = nonce;
        ifZero(id);
    }

    function openDispute(bytes32 id, bytes32 seed, uint nonce, uint bet, uint chance) active(channels[id]) {
        /*
            Only player can open the dispute.
            Player must update channel to actual state.
        */
        Channel memory c = channels[id];
        assert(nonce == c.nonce + 1);
        assert(bet <= c.playerBalance);
        if (c.endBlock - block.number < 10) {
            channels[id].endBlock += 10;
        }
        disputes[id] = Dispute(seed, bet, chance);
    }

    function ifZero(bytes32 id) internal {
        /* 
        Closing the channel when balance of player or bankroll = 0.
        */
        if (channels[id].playerBalance == 0 || channels[id].bankrollBalance == 0) {
            closeChannel(id);
        }
    }

    function updateGameState(bytes32 id, bytes32 seed, uint nonce, uint bet, uint chance, bytes sig, bytes sigseed) active(channels[id]) {
        /*
            bankroller can update game state if player don't sign new channel state/
        */
        address seedSigner = recoverSigner(seed, sigseed);
        address stateSigner = recoverSigner(sha3(id, seed, nonce, bet, chance), sig);

        Channel memory c = channels[id];

        assert(c.nonce < nonce);
        assert(stateSigner == c.player);
        assert(c.bankroller == seedSigner);
        assert(bet <= c.playerBalance);

        uint profit = (bet * (65536 - 1310) / chance) - bet;
        uint rnd = uint256(sha3(sigseed, nonce, id)) % 65536;

        if (c.endBlock - block.number < 10) {
            channels[id].endBlock += 10;
        }

        if (profit > c.bankrollBalance) {
            /* 
            Max profit is limited by bankroll balance.
            */
            profit = c.bankrollBalance;
        }

        if (rnd < chance) {
            // _________Player won!____________________
            channels[id].bankrollBalance -= profit;
            channels[id].playerBalance += profit;
        } else {
            // _________Player lose!___________________
            channels[id].playerBalance -= bet;
            channels[id].bankrollBalance += bet;
        }
        channels[id].nonce = nonce;
        delete disputes[id];
        ifZero(id);
    }

    function closeDispute(bytes32 id, bytes sigseed) active(channels[id]) {
        /*
            for closing dispute bankroller send signed seed.
        */

        Channel memory c = channels[id];
        Dispute memory d = disputes[id];
        assert(d.seed != 0);
        address signer = recoverSigner(d.seed, sigseed);
        assert(signer == c.bankroller);

        uint profit = (d.bet * (65536 - 1310) / d.chance) - d.bet;
        uint rnd = uint256(sha3(sigseed, c.nonce, id)) % 65536;
        if (profit > c.bankrollBalance) {
            profit = c.bankrollBalance;
        }
        if (rnd < d.chance) {
            channels[id].bankrollBalance -= profit;
            channels[id].playerBalance += profit;
        } else {
            channels[id].playerBalance -= d.bet;
            channels[id].bankrollBalance += d.bet;
        }
        closeChannel(id);
    }

    function closeChannel(bytes32 id) internal {
        /*
            internal function for closing channel
        */
        Channel memory c = channels[id];
        token.transfer(c.player, c.playerBalance);
        token.transfer(c.bankroller, c.bankrollBalance);
        if (c.playerDeposit > channels[id].playerBalance) {
            var profit = c.playerBalance - c.playerDeposit;
            serviceReward(c.player, profit);
        }
        totalMoneySend += c.playerBalance;
        channels[id].playerBalance = 0;
        channels[id].bankrollBalance = 0;

    }

    function closeByConsent(bytes32 id, uint playerBalance, uint bankrollBalance, uint nonce, bytes sig) active(channels[id]) {
        /*
            for quickly close the channel
        */
        address signer = recoverSigner(sha3(id, playerBalance, bankrollBalance, nonce), sig);
        Channel memory c = channels[id];
        assert(nonce == 0);
        assert(signer != msg.sender);
        assert(signer == c.player || signer == c.bankroller);
        channels[id].playerBalance = playerBalance;
        channels[id].bankrollBalance = bankrollBalance;
        closeChannel(id);
    }

    function closeByTime(bytes32 id) {
        /*
            function for dstirbute tokens after closing channel
        */
        Channel memory c = channels[id];
        Dispute memory d = disputes[id];
        assert(c.endBlock < block.number);
        if (d.seed != 0) {
            uint profit = (d.bet * (65536 - 1310) / d.chance) - d.bet;
            if (profit > c.bankrollBalance) {
                profit = c.bankrollBalance;
            }
            channels[id].playerBalance += profit;
            channels[id].bankrollBalance -= profit;
        }
        closeChannel(id);
    }

    function serviceReward(address _player, uint256 _value) internal {
        
        var profit = _value * 2 / 100;
        var reward = profit * 25 / 100;

        var operator = store.getOperator(_player);
        var adviser = store.getAdviser(_player);

        token.transfer(gameDeveloper, reward);
        token.transfer(operator, reward);
        token.transfer(adviser, reward);
    }

    function recoverSigner(bytes32 h, bytes signature) internal returns(address) {
        /*
            recover address form signature and hash
        */
        var (r, s, v) = signatureSplit(signature);
        return ecrecover(h, v, r, s);
    }

    function signatureSplit(bytes signature) internal returns(bytes32 r, bytes32 s, uint8 v) {
        /*
            split signature on v,r,s
        */
        assembly {
            r: = mload(add(signature, 32))
            s: = mload(add(signature, 64))
            v: = and(mload(add(signature, 65)), 0xff)
        }
        require(v == 27 || v == 28);
    }
}