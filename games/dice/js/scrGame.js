$(document).ready(initGame());

function Refresh() {
    $("#profit-on-win").val(((betEth * 10000 / chance) - betEth).toFixed(4));
    $("#payout").val("x" + (9900 / chance).toFixed(3));

};

$("#roll-dice").click(function () {
    startGame();
    if (lastTx == undefined) {
        $("#label").text("Sorry, transaction failed");
    } else {
        $("#Tx").html('<a target="_blank" href="https://testnet.etherscan.io/tx/' + lastTx + '">'+ lastTx +'</a>')
        disabled(true);
        $("#label").text("Please, wait . . . ");
        game = true;
        var Timer = setInterval(function () {
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
                    console.log("new_count", hexToNum(d.result));
                    var new_count = hexToNum(d.result);
                    if (new_count != count) {

                        var data = "0x1865c57d";
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
                                var result = hexToNum(d.result);
                                console.log(result);
                                if (result == 0) {
                                    console.log("идет игра");
                                } else if (result == 1) {
                                    console.log("YOU WIN!");
                                    disabled(false);
                                    game = false;
                                    GetLogs();
                                    TotalRolls();
                                    $("#label").text("YOU WIN!!! ");
                                    clearInterval(Timer);
                                } else if (result == 2) {
                                    console.log("YOU LOSER!");
                                    disabled(false);
                                    game = false;
                                    GetLogs();
                                    TotalRolls();
                                    $("#label").text("YOU LOSE!!! ");
                                    clearInterval(Timer);
                                } else if (result == 3) {
                                    console.log("Sorry, dont money in bank");
                                    game = false;
                                    disabled(false);
                                    GetLogs();
                                    TotalRolls();
                                    $("#label").text("Sorry, dont money in bank");
                                    clearInterval(Timer);
                                }
                            }
                        })
                        count = new_count;
                    }
                }
            });
        }, 5000);
    }
});