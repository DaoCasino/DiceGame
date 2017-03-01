var _balance = 0;
var _idGame = "";
var urlBalance = ""; //balance
var addressContract = "0xb7c90df0888fee75ecfc8e85ed35fcd6ea1f3370"; // cotract
var betEth = 1; //0,2 ставка эфира
var mainet, openkey, privkey;
var chance = 50;
var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var lastTx;
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
    }
    catch (e) {
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
    console.log("version 0.04")// VERSION !
    console.log("mainet:", mainet)
    console.log("openkey:", openkey)
    console.log("privkey:", privkey)
}

function setContract(){
    if(mainnet == "on"){
        urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = "0x93eeabbe86d19bda39ea2d1049baf2c0878ded23";
    }
}

function initGame() {
    if (betEth > _balance) {
                    EnableButton(false);
                }
                else {
                    EnableButton(true);
                }
    Refresh();
    loadData();
    GetLogs();
    $.ajax({
        type: "POST"
        , url: urlInfura
        , dataType: 'json'
        , async: false
        , data: JSON.stringify({
            "id": 0
            , "jsonrpc": '2.0'
            , "method": 'eth_getBalance'
            , "params": [openkey, "latest"]
        })
        , success: function (d) {
            console.log("balance!: ", d.result, toFixed((Number(d.result) / 1000000000000000000), 4));
            _balance = toFixed((Number(d.result) / 1000000000000000000), 4);
            $("#balance").html(_balance);
            $("#your-balance").val(_balance);
        }
    })
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







