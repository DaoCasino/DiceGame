var abi = [{
    "constant": true,
    "inputs": [{
        "name": "player",
        "type": "address"
    }],
    "name": "getStateByAddress",
    "outputs": [{
        "name": "",
        "type": "uint8"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "value",
        "type": "uint256"
    }],
    "name": "roll",
    "outputs": [],
    "payable": true,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "amount",
        "type": "uint256"
    }],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "maxBet",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getTotalEthSended",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "games",
    "outputs": [{
        "name": "player",
        "type": "address"
    }, {
        "name": "bet",
        "type": "uint256"
    }, {
        "name": "chance",
        "type": "uint256"
    }, {
        "name": "rnd",
        "type": "uint256"
    }, {
        "name": "state",
        "type": "uint8"
    }, {
        "name": "seed",
        "type": "uint8"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "totalRollsByUser",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "ownerStoped",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "minBet",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getTotalRollMade",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getCount",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "Stop",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "player",
        "type": "address"
    }],
    "name": "getShowRnd",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getTotalEthPaid",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "payable": true,
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "str",
        "type": "address"
    }],
    "name": "logAdr",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "str",
        "type": "string"
    }],
    "name": "logStr",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "value",
        "type": "uint8"
    }],
    "name": "log8",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "value",
        "type": "uint32"
    }],
    "name": "log32",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "log256",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "str",
        "type": "string"
    }, {
        "indexed": false,
        "name": "value",
        "type": "address"
    }],
    "name": "logClassic",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "str",
        "type": "string"
    }, {
        "indexed": false,
        "name": "state",
        "type": "uint8"
    }],
    "name": "logState",
    "type": "event"
}];
newMode = true;
var ks = localStorage.getItem('keystore');
ks = lightwallet.keystore.deserialize(ks);
var sendingAddr;


var balance = 1;
var urlBalance = ""; //balance
// 6 ETH var addressContract = "0x1c864f1851698ec6b292c936acfa5ac5288a9d27";
var addressContract = "0xe061a411d69853155d221edc7c837b338f23730d";
var betEth = 1; //0,2 ставка эфира
var mainnet, openkey, privkey, mainnetAddress, testnetAddress;
var chance = 32768;
//var urlInfura = "http://46.101.244.101:8545";
var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var lastTx, count, new_count, sends, paids, password;
var game = false;
var Timer, animate;
maxBetEth = 1;
bankroll = 1000;

function toFixed(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
};

function numToHex(num) {
    return num.toString(16);
};

function hexToNum(str) {
    return parseInt(str, 16);
};

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        console.log("localStorage_failed:", e);
        return false;
    }
};

function loadData() {
    if (isLocalStorageAvailable()) {
        testnetAddress = localStorage.getItem(' testnetAddress')
        mainnetAddress = localStorage.getItem('mainnetAddress')
        kovanAddress = localStorage.getItem('kovanAddress')
        mainnet = localStorage.getItem('mainnet')
        openkey = localStorage.getItem('openkey')
        privkey = localStorage.getItem('privkey')
        sendingAddr = openkey.substr(2);
    }
    console.log("version 0.44a Infura") // VERSION !
    console.log("mainnet:", mainnet)
    console.log("openkey:", openkey)
    console.log("privkey:", privkey)
};

function call(callname) {
    var result;
    var callData;
    switch (callname) {
        case "totalRollsByUser":
            callData = "0x9288cebc";
            break;
        case "getShowRnd":
            callData = "0xdb571498";
            break;
        case "getTotalRollMade":
            callData = "0x9e92c991";
            break;
        case "getTotalEthSended":
            callData = "0x46f76648";
            break;
        case "getTotalEthPaid":
            callData = "0xf6353590";
            break;
        case "getStateByAddress":
            callData = "0x08199931"
            break;
    }
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [{
                "from": openkey,
                "to": addressContract,
                "data": callData + pad(numToHex(openkey.substr(2)), 64)
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
};

function getContract(game, network) {
    var result;
    var gameid;
    var networkid;
    switch (game) {
        case "HackDAO":
            gameid = "1";
            break;
        case "Dice":
            gameid = "2";
            break;
        case "Blackjack":
            gameid = "3";
            break;
    }
    switch (network) {
        case "testnet":
            networkid = "1";
            break;
        case "mainnet":
            networkid = "2";
            break;
    }
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [{
                "from": openkey,
                "to": "0x3b5d9ed79ca06fdb9759b2c39857bf2c76112051",
                "data": "0x3d185fc5" + pad(numToHex(gameid), 64) + pad(numToHex(networkid), 64)
            }, "latest"]
        }),
        success: function (d) {
            result = "0x" + d.result.substr(26);
        }
    });
    return result;
};

function setContract() {
    if (mainnet == "on") {
        urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = getContract("Dice", "mainnet");
        disabled(true);
        $('#randomnum').text("Coming soon")
    } else if (mainnet == "off") {
        urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = getContract("Dice", "testnet");
        $('#randomnum').text("");
    }
};

function getContractBalance() {
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": 'eth_getBalance',
            "params": [addressContract, "latest"]
        }),
        success: function (d) {
            bankroll = +(d.result / 1000000000000000000).toFixed(5)
            $('#contractBalance').html("CONTRACT ( " + bankroll + " ETH )");
        }
    });
};

setInterval(function () {
    if (openkey) {

        balance = $('#balance').html();
        balance = +balance.substr(0, balance.length - 4);
        balance = +balance.toFixed(8);
        // if(balance = NaN){
        //     console.log("NaN");
        //     balance = 0;
        // }
        if (balance < 0.02 && !game) {
            disabled(true);
            $("#label").text(" NO MONEY ");
            $('#randomnum').text("Please, top up balance")
        } else if (balance > 0.01 && !game) {
            disabled(false);
            $("#label").text("Click Roll Dice to place your bet:");
        }
        $("#your-balance").val(balance);
        if (balance) {
            // $("#slider-dice-one").slider("option", "max", (balance * 1000) - 20);
        }
    } else {
        $("#label").text("Please, sign in");
        disabled(true);
    }
}, 100);

function initGame() {
    loadData();
    setContract();
    paids = (call("getTotalEthSended") / 10000000000000000000).toFixed(6);
    sends = (call("getTotalEthPaid") / 10000000000000000000).toFixed(6);
    setContract();
    count = call("totalRollsByUser")
    console.log("old_count", count);
    $("#total-rolls").html(call("getTotalRollMade"));
    $("#total-paid").html(paids + ' ETH');
    $("#total-send").html(sends + ' ETH (' + ((paids / sends) * 100).toFixed(2) + '%)');
    getContractBalance();
    $("#contract").html('<a target="_blank" href="https://ropsten.etherscan.io/address/' + addressContract + '">' + addressContract.slice(0, 24) + '...</a>')
    GetLogs();
    $('#all').click();
    Refresh();
};

function disabled(status) {
    $("#slider-dice-one").slider({
        disabled: status
    });
    $("#slider-dice-two").slider({
        disabled: status
    });
    $("#amount-one").attr('readonly', status);
    $("#less-than-wins").attr('readonly', status);
    $("#roll-dice").attr('disabled', status);
    status ? $("#roll-dice").css({
        background: 'gray'
    }) : $("#roll-dice").removeAttr('style');

};

function Refresh() {
    maxBetEth = (bankroll/11+betEth)/((65536 - 1310) / chance);
    if(maxBetEth > 3){

        maxBetEth = 3;
        $("#slider-dice-one").slider("option", "max", maxBetEth*1000);
        $("#amount-one").val(betEth);
    }
    if( maxBetEth < balance -0.02){
        $("#slider-dice-one").slider("option", "max", maxBetEth*1000);
        $("#amount-one").val(betEth);
        if(betEth > maxBetEth){
            betEth = +maxBetEth.toFixed(4);
            $("#amount-one").val(betEth);
        }
        if(betEth < 0.0001){
            betEth = 0.0001;
            $("#amount-one").val(betEth);
        }
        if(betEth > balance  - 0.02){
            betEth = +(balance  - 0.02).toFixed(4);
            $("#amount-one").val(betEth);
        }
    }
    else{
        maxBetEth = balance -0.02;
       // console.log(maxBetEth, balance, bankroll, chance, betEth)
      $("#slider-dice-one").slider("option", "max", maxBetEth*1000);  
    }
    $("#profit-on-win").val(((betEth * (65536 - 1310) / chance) - betEth).toFixed(6));
    $("#payout").val("x" + ((65536 - 1310) / chance).toFixed(5));

};

function startGame() {
    if (!password) {
        password = prompt('Enter password');
    }
    game = true;
    if (openkey) {
        $.ajax({
            type: "POST",
            url: urlInfura,
            dataType: 'json',
            async: false,
            data: JSON.stringify({
                "id": 0,
                "jsonrpc": '2.0',
                "method": "eth_getTransactionCount",
                "params": [openkey, "latest"]
            }),
            success: function (d) {
                console.log("urlInfura:", urlInfura);
                console.log("get nonce action " + d.result);
                //var callData = "0x1f7b4f30";
                var options = {};
                options.nonce = d.result;
                options.to = addressContract;
                //options.data = callData + pad(numToHex(chance), 64); // method from contact
                options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
                options.gasLimit = "0x927c0"; //web3.toHex('600000');
                options.value = betEth * 1000000000000000000;
                // if (privkey) {
                //     if (buf == undefined) {
                //         console.log("ERROR_TRANSACTION");
                //     } else {
                        //приватный ключ игрока, подписываем транзакцию

                        // var tx = new EthereumTx(options);
                        // tx.sign(new buf(privkey, 'hex'));
                        // var serializedTx = tx.serialize().toString('hex');
                        // console.log("The transaction was signed: " + serializedTx);
                        ks.keyFromPassword(password, function (err, pwDerivedKey) {
                            var args = [chance];
                            var registerTx = lightwallet.txutils.functionTx(abi, 'roll', args, options)
                            var signedTx = lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, sendingAddr)
                            console.log("lightWallet sign:", signedTx)
                        
                        $.ajax({
                            type: "POST",
                            url: urlInfura,
                            dataType: 'json',
                            async: false,
                            data: JSON.stringify({
                                "id": 0,
                                "jsonrpc": '2.0',
                                "method": "eth_sendRawTransaction",
                                "params": ["0x" + signedTx]
                            }),
                            success: function (d) {
                                console.log("Транзакция отправлена в сеть:", d.result);
                                lastTx = d.result;
                                if (lastTx == undefined) {
                                    $("#randomnum").text("Sorry, transaction failed");
                                    gameend();
                                } else {
                                    $("#Tx").html('<a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + '">' + lastTx.slice(0, 24) + '...</a>')
                                    $(".dice-table#table").prepend('<tr><td><a target="_blank" href="https://ropsten.etherscan.io/tx/' + lastTx + ' "> ' + openkey.slice(0, 12) + '...</a> <br></td><td colspan="5" style="height: 63px"> ...pending... </td></tr>');
                                    disabled(true);
                                    $("#randomnum").text("Please, wait . . . ");
                                    Timer = setInterval(function () {
                                        new_count = call("totalRollsByUser");
                                        console.log("detected count:", new_count, count);
                                        if (new_count != count) {
                                            console.log("getStatusGame");
                                            var result = call("getStateByAddress");
                                            switch (result) {
                                                case 1:
                                                    console.log("YOU WIN!");
                                                    $("#randomnum").text("YOU WIN!");
                                                    gameend();
                                                    break;
                                                case 2:
                                                    console.log("LOSS");
                                                    $("#randomnum").text("YOU LOSE");
                                                    gameend();
                                                    break;
                                                case 3:
                                                    console.log("Sorry, No money in the bank");
                                                    $("#randomnum").text("Sorry, no money in the bank");
                                                    gameend();
                                                    break;
                                                default:
                                                    console.log("идет игра");
                                            }
                                        }
                                    }, 3000);
                                }

                            }
                        })
                    //}
              })  //}
            }
        })
    }
};

function gameend() {
    disabled(false);
    GetLogs();
    clearInterval(Timer);
    clearInterval(animate);
    count = new_count;
    game = false;
    $('.active').click();
    //$('#amount-one').val(balance/2);
    $('#amount-one').change();
    $("#randomnum").fadeIn("slow", 1)
    Refresh();
};