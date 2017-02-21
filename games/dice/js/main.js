var _balance = 0;
var _idGame = "";
var urlSite = "https://api.etherscan.io/";
urlSite = "https://testnet.etherscan.io/";
var urlBalance = ""; //balance
var optionsTo = "0x517d81ed7e87f4ccca98066eeb5133d18616fed9"; // cotract
var betEth = 200000000000000000; //0,2 ставка эфира
var mainet, openkey, privkey;
var FirstRequest = true;
var OldBalance;

/*
* value - Дробное число.
* precision - Количество знаков после запятой.
*/
function toFixed(value, precision){
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
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
		console.log("localStorage_failed:",e);
        return false;
    }
}

function initGame() {
    loadData();
    
    if (openkey) {
        var adress = openkey.replace('0x', '');
        urlBalance = urlSite + "api?module=account&action=balance&address=" + adress + "&tag=latest&apikey=YourApiKeyToken"
        var str = urlBalance;
        this.sendUrlRequest(str, "getBalance");
    }
}

function loadData() {
	if(isLocalStorageAvailable()){
		mainet = localStorage.getItem('mainnet')
		openkey = localStorage.getItem('openkey')
		privkey = localStorage.getItem('privkey')
	}
	console.log("mainet:", mainet)
	console.log("openkey:", openkey)
	console.log("privkey:", privkey)
}

function sendUrlRequest(url, name) {
    // console.log("sendRequest:", name, url) 
    var xhr = new XMLHttpRequest();
    var str = url;
    xhr.open("GET", str, true);
    xhr.send(null);
    xhr.onreadystatechange = function () { // (3)
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            console.log("err:" + xhr.status + ': ' + xhr.statusText);
        }
        else {
           response(name, xhr.responseText)
        }
    }
}


function response(command, value) {
    if (value == undefined) {
        return false;
    }
    console.log("response:", command, value)
    if (command == "getBalance") {
        var obj = JSON.parse(value);
       _balance = toFixed((Number(obj.result) / 1000000000000000000), 4);
        CheckBalance();
        FirstRequest = false;
        
    }
    else if (command=="idGame"){
        _idGame = value;
    }
}