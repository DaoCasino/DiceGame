var Web3 = require('web3');
//var keythereum = require('keythereum');




function createCookie(name,value,days) {
    if (localStorage) {
        localStorage.setItem(name, value);
    } else {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
}

function readCookie(name) {
    if (localStorage) {
        return localStorage.getItem(name);
    } else {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
}

function eraseCookie(name) {
    if (localStorage) {
        localStorage.removeItem(name);
    } else {
        createCookie(name,"",-1);
    }
}


function createAccount() {
    var dk = keythereum.create();
    var privateKey = dk.privateKey;
    var address = ethUtil.privateToAddress(privateKey);
    address = ethUtil.toChecksumAddress(address.toString('hex'));
    privateKey = privateKey.toString('hex');
    return {address: address, privateKey: privateKey};
}
