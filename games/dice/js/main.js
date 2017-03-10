var balance = ".::::.";
var urlBalance = ""; //balance
//var addressContract = "0x7776ec25d1d676d8656fb79ab96054ba13bf70b3"; TESTNET
var addressContract = "NOOO";
//"0x0cf37d2d45427a1380db12c9b352d6f083143817"; // KOVAN
//0xba2f1399df21c75ce578630ff9ed9285b2146b8d  TESTNET ETHERSCAN
var betEth = 0.2; //0,2 ставка эфира
var mainnet, openkey, privkey, mainnetAddress, testnetAddress, kovanAddress;
var chance = 5000;
//var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var urlEtherscan = "https://kovan.etherscan.io/api";
var lastTx;
var count;
var game = false;
var sends;
var paids;
var contractTable;



// var maxBet = 2000;
/*
 * value - Дробное число.
 * precision - Количество знаков после запятой.
 */

//0x3b5d9ed79ca06fdb9759b2c39857bf2c76112051


function getGameContract() {
    var arr;
    $.ajax({
        type: "POST",
        url: "https://testnet.etherscan.io/api",
        data:{
        module: "proxy",
        action: "eth_call",
        data: "0x3d185fc500000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003",
        to:"0x3b5d9ed79ca06fdb9759b2c39857bf2c76112051"
        },
        success: function (d) {
            var contract = d.result;
           // console.log(d, d.result);
           // localStorage.setItem('testnetAddress', arr[2][1]);
            localStorage.setItem('kovanAddress',"0x"+contract.substr(26));
            //localStorage.setItem('mainnetAddress', arr[2][3]);
            
        }
    }) 
};
getGameContract();



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
        testnetAddress = localStorage.getItem(' testnetAddress')
        mainnetAddress = localStorage.getItem('mainnetAddress')
        kovanAddress = localStorage.getItem('kovanAddress')
        mainnet = localStorage.getItem('mainnet')
        openkey = localStorage.getItem('openkey')
        privkey = localStorage.getItem('privkey')
    }
    console.log("version 0.37 kovan") // VERSION !
    console.log("mainnet:", mainnet)
    console.log("openkey:", openkey)
    console.log("privkey:", privkey)
};

function setContract() {
    if (mainnet == "on") {
        urlEtherscan = "https://api.etherscan.io/api";
        addressContract = mainnetAddress;
    } else if (mainnet == "off") {
        urlEtherscan = "https://kovan.etherscan.io/api";
        addressContract = kovanAddress;
    }
};

function getCount() {
    if(openkey){
    $.ajax({
        type: "POST",
        url: urlEtherscan,
        data: {
            module: "proxy",
            action: "eth_call",
            // address: openkey,
            data: "0x9288cebc000000000000000000000000" + openkey.substr(2),
            to: addressContract,
            // tag: "latest"
        },
        success: function (d) {
            count = hexToNum(d.result);
            console.log("old_count", count);
        }
    });
}};

function getContractBalance() {
    $.ajax({
        type: "POST",
        url: urlEtherscan,
        data: {
            address: addressContract,
            module: "account",
            action: "balance",
            tag: "latest"

        },
        success: function (d) {
            $('#contractBalance').html((d.result / 1000000000000000000).toFixed(5));
        }
    });
};
// РАЗОБРАТЬСЯ С SHOWRND !!!!
function ShowRnd() {
    $.ajax({
        type: "POST",
        url: urlEtherscan,
        data: {
            module: "proxy",
            action: "eth_call",
            //address: openkey,
            data: "0xeb54cd4b000000000000000000000000" + openkey.substr(2),
            to: addressContract,
            // tag: "latest"
        },
        success: function (d) {
            count = hexToNum(d.result);
            console.log(count, d.result, d);
            $('#random').html(count);
        }
    });
}


function initGame() {
    getGameContract();
    Refresh();
    loadData();
    setContract();
    getCount();
    TotalRolls();
    TotalPaid();
    getContractBalance();
    GetLogs();
    $("#openkey").append(openkey);
     $("#contract").append('<a target="_blank" href="https://kovan.etherscan.io/address/' + addressContract + '">To contract</a>')
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

    // $.ajax({
    //     type: "POST",
    //     url: urlEtherscan,
    //     data: {
    //         module: "proxy",
    //         action: "eth_call",
    //         // address: openkey,
    //         data: "0x9288cebc000000000000000000000000" + openkey.substr(2),
    //         to: addressContract,
    //         // tag: "latest"
    //     },
    //     success: function (d) {
    //         count = hexToNum(d.result);
    //         console.log("old_count", count);
    //     }
    // });
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
        url: urlEtherscan,
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
        url: urlEtherscan,
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
            paids = (_count / 10000000000000000000).toFixed(6);
            $("#total-paid").html(paids + ' ETH');
            $.ajax({
                method: "POST",
                url: urlEtherscan,
                data: {
                    module: "proxy",
                    action: "eth_call",
                    address: openkey,
                    data: "0xf6353590",
                    to: addressContract,
                    tag: "latest"
                },
                success: function (d) {
                    var _count = hexToNum(d.result);
                    sends = (_count / 10000000000000000000).toFixed(6);
                    $("#total-send").html(sends + ' ETH (' + ((paids / sends) * 100).toFixed(2) + '%)');
                }
            });
        }
    });

};




setInterval(function () {
    // $.ajax({
    //     method: "POST",
    //     url: urlEtherscan,
    //     data: {
    //         module: "account",
    //         action: "balance",
    //         address: openkey,
    //         tag: "latest"
    //     }

    //     ,
    //     success: function (d) {
    //         // console.log(d.result);
    //         balance = d.result / 1000000000000000000;

    //     }
    // });
    balance = $('#balance').html();
    balance = +balance.substr(0, balance.length - 4);
    balance = +balance.toFixed(8);
    if (balance < 0.1 && !game) {
        disabled(true);
        $("#label").text(" NO MONEY ");
    } else if (balance > 0.1 && !game) {
        disabled(false);
        $("#label").text("Click Roll Dice to place your bet:");

    }
    $("#your-balance").val(balance);
    if(balance){
    $("#slider-dice-one").slider("option", "max", (balance * 1000) - 20);
    }
}, 1000);