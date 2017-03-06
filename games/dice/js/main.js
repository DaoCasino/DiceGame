var balance = 2;
var _idGame = "";
var urlBalance = ""; //balance
//var addressContract = "0x7776ec25d1d676d8656fb79ab96054ba13bf70b3";
var addressContract = "0x7f17ce46069c05e85eee74a2ff56fb6513377389"; // cotract //0x5af6988f3d44bfbe3580d25ac4f5d187486b007f
var betEth = 0.2; //0,2 ставка эфира
var mainet, openkey, privkey;
var chance = 5000;
var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var lastTx;
var startRoll = true;
var count;
var game = false;
// var maxBet = 2000;
/*
 * value - Дробное число.
 * precision - Количество знаков после запятой.
 */
function toFixed(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
}

function numToHex(num) {
    return num.toString(16);
}

function hexToNum(str) {
    return parseInt(str, 16);
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        console.log("localStorage_failed:", e);
        return false;
    }
}

function loadData() {
    if (isLocalStorageAvailable()) {
        mainet = localStorage.getItem('mainnet')
        openkey = localStorage.getItem('openkey')
        privkey = localStorage.getItem('privkey')
    }
    console.log("version 0.2a kovan") // VERSION !
    console.log("mainet:", mainet)
    console.log("openkey:", openkey)
    console.log("privkey:", privkey)
}

function setContract() {
    if (mainnet == "on") {
        urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = "0xb7c90df0888fee75ecfc8e85ed35fcd6ea1f3370";
    }
}

function initGame() {
    $("#contract").append('<a target="_blank" href="https://kovan.etherscan.io/address/' + addressContract + '">To contract</a>')
   
    TotalRolls();
    TotalPaid();
    Refresh();
    loadData();
    GetLogs();
    $("#openkey").append("openkey: "+ openkey);
    // $.ajax({
    //     type: "POST",
    //     url: urlInfura,
    //     dataType: 'json',
    //     async: false,
    //     data: JSON.stringify({
    //         "id": 0,
    //         "jsonrpc": '2.0',
    //         "method": 'eth_getBalance',
    //         "params": [openkey, "latest"]
    //     }),
    //     success: function (d) {
    //         console.log("balance!: ", d.result, toFixed((Number(d.result) / 1000000000000000000), 4));
    //         //_balance = toFixed((Number(d.result) / 1000000000000000000), 4);
    //         //$("#balance").html(_balance);
    //         //$("#your-balance").val(_balance);
    //     }
    // })

    $.ajax({
        type: "POST",
        url: "http://kovan.etherscan.io/api",
        data: {
            module: "proxy",
            action: "eth_call",
           // address: openkey,
            data: "0x9288cebc00000000000000000000000036918df28343de6791c239b5d9aa913d20a24b00",
            to: addressContract,
            // tag: "latest"
        },
        success: function (d) {
            count = hexToNum(d.result);
            console.log("old_count", count);
        }
    });
};

function button(status) {
    if (status) {
        $("#roll-dice").css({
            background: 'gray'
        });
    } else {
        $("#roll-dice").removeAttr('style');
    }
}

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
    button(status);

}

function TotalRolls() {
    $.ajax({
        method: "POST",
        url: "http://kovan.etherscan.io/api",
        data: {
            module: "proxy",
            action: "eth_call",
            //address: openkey,
            data: "0x9e92c991",
            to: addressContract,
            tag: "latest"
        },
        success: function (d) {
            var _count = hexToNum(d.result);
            $("#total-rolls").html(_count);
        }
    });

};


function TotalPaid() {
    $.ajax({
        method: "POST",
        url: "http://kovan.etherscan.io/api",
        data: {
            module: "proxy",
            action: "eth_call",
            address: openkey,
            data: "0x46f76648",
            to: addressContract,
            tag: "latest"
        },
        success: function (d) {
            var _count = hexToNum(d.result);
            $("#total-paid").html((_count / 10000000000000000000).toFixed(6) + ' ETH');
        }
    });

};


setInterval(function () {
    $.ajax({
        method: "POST",
        url: "http://kovan.etherscan.io/api",
        data: {
            module: "account",
            action: "balance",
            address: openkey,
            tag: "latest"
        }
    
    , success: function (d) {
       // console.log(d.result);
        balance = d.result/1000000000000000000;

    }});
    //balance = +balance.substr(0, balance.length - 4);
    //balance = +balance.toFixed(6);
    if (balance < 0.1 && !game) {
        disabled(true);
        $("#label").text(" NO MONEY ");
    } else if (balance > 0.1 && !game) {
        disabled(false);
        //$("#label").text("Click Roll Dice to place your bet:");

    }
    $("#your-balance").val(balance);
    $("#slider-dice-one").slider("option", "max", (balance * 1000) - 20);
    //console.log(balance);
}, 3000);



