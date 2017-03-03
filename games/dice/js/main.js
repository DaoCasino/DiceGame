var _balance = 0;
var _idGame = "";
var urlBalance = ""; //balance
var addressContract = "0x4c3b529b0e8983a006ab589c21ea8a74b439025e"; // cotract //0x5af6988f3d44bfbe3580d25ac4f5d187486b007f
var betEth = 1; //0,2 ставка эфира
var mainet, openkey, privkey;
var chance = 5000;
var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var lastTx;
var startRoll = true;
var count;
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
    console.log("version 0.05c") // VERSION !
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
    if (betEth > _balance) {
        EnableButton(false);
        $("#label").text(" NO MONEY ");
    } else {
        EnableButton(true);
        $("#label").text("Click Roll Dice to place your bet:");
    }
    TotalRolls();
    Refresh();
    loadData();
    GetLogs();
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": 'eth_getBalance',
            "params": [openkey, "latest"]
        }),
        success: function (d) {
            console.log("balance!: ", d.result, toFixed((Number(d.result) / 1000000000000000000), 4));
            _balance = toFixed((Number(d.result) / 1000000000000000000), 4);
            $("#balance").html(_balance);
            $("#your-balance").val(_balance);
        }
    })
    var data = "0xa87d942c";
    var params = {
        "from": openkey,
        "to": addressContract,
        "data": data
    };
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [params, "latest"]
        }),
        success: function (d) {
            count = hexToNum(d.result);
            console.log("old_count", count);
        }
    });
};
// function sendUrlRequest(url, name) {
//     // console.log("sendRequest:", name, url) 
//     var xhr = new XMLHttpRequest();
//     var str = url;
//     xhr.open("GET", str, true);
//     xhr.send(null);
//     xhr.onreadystatechange = function () { // (3)
//         if (xhr.readyState != 4) return;
//         if (xhr.status != 200) {
//             console.log("err:" + xhr.status + ': ' + xhr.statusText);
//         }
//         else {
//             response(name, xhr.responseText)
//         }
//     }
// }

// function response(command, value) {
//     if (value == undefined) {
//         return false;
//     }
//     console.log("response:", command, value)
//     if (command == "getBalance") {
//         var obj = JSON.parse(value);
//         _balance = toFixed((Number(obj.result) / 1000000000000000000), 4);
//         //        CheckBalance();
//     }
//     else if (command == "idGame") {
//         _idGame = value;
//     }
// //    CheckBet();
// }

function disabled(status) {
    $("#slider-dice-one").slider({
        disabled: status
    });
    $("#slider-dice-two").slider({
        disabled: status
    });
    $("#amount-one").attr('readonly', status);
    $("#less-than-wins").attr('readonly', status);

}

function Check() {
    if (betEth > _balance) {
        EnableButton(false);

    } else {
        EnableButton(true);
    }
};

setInterval
function TotalRolls() {
    var data = "0x9e92c991";
    var params = {
        "from": openkey,
        "to": addressContract,
        "data": data
    };
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [params, "latest"]
        }),
        success: function (d) {
            count = hexToNum(d.result);
            $("#total-rolls").html(count);
        }
    });

};