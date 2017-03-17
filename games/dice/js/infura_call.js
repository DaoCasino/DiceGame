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
                "data": callData +  pad(numToHex(openkey.substr(2)), 64)
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
};