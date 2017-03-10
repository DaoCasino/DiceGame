$(document).ready(initGame());
function Refresh() {
    $("#profit-on-win").val(((betEth * 9920 / chance) - betEth).toFixed(4));
    $("#payout").val("x" + (9920 / chance).toFixed(3));
};
$("#roll-dice").click(function () {
    startGame();
//     if (startGame == undefined) {
//         $("#label").text("Sorry, transaction failed");
//     } else {
//         $("#Tx").html('<a target="_blank" href="https://testnet.etherscan.io/tx/' + lastTx + '">' + lastTx + '</a>')
//         disabled(true);
//         $("#label").text("Please, wait . . . ");
//         game = true;
//         var Timer = setInterval(function () {
//             $.ajax({
//                 method: "POST",
//                 url: "http://kovan.etherscan.io/api",
//                 data: {
//                     module: "proxy",
//                     action: "eth_call",
//                     address: openkey,
//                     data: "0xa87d942c",
//                     to: addressContract,
//                     //tag: "latest"
//                 },
//                 success: function (d) {
//                     console.log("new_count", hexToNum(d.result));
//                     var new_count = hexToNum(d.result);
//                     if (new_count != count) {
//                         $.ajax({
//                             method: "POST",
//                             url: "http://kovan.etherscan.io/api",
//                             data: {
//                                 module: "proxy",
//                                 action: "eth_call",
//                                 address: openkey,
//                                 data: "0xa87d942c",
//                                 to: addressContract,
//                                 tag: "latest"
//                             },
//                             success: function (d) {
//                                 var result = hexToNum(d.result);
//                                 console.log(result);
//                                 if (result == 0) {
//                                     console.log("идет игра");
//                                 } else if (result == 1) {
//                                     console.log("YOU WIN!");
//                                     disabled(false);
//                                     game = false;
//                                     GetLogs();
//                                     TotalRolls();
//                                     TotalPaid();
//                                     $("#label").text("YOU WIN!!! ");
//                                     clearInterval(Timer);
//                                 } else if (result == 2) {
//                                     console.log("YOU LOSER!");
//                                     disabled(false);
//                                     game = false;
//                                     GetLogs();
//                                     TotalRolls();
//                                     TotalPaid();
//                                     $("#label").text("YOU LOSE!!! ");
//                                     clearInterval(Timer);
//                                 } else if (result == 3) {
//                                     console.log("Sorry, dont money in bank");
//                                     game = false;
//                                     disabled(false);
//                                     GetLogs();
//                                     TotalRolls();
//                                     TotalPaid();
//                                     $("#label").text("Sorry, dont money in bank");
//                                     clearInterval(Timer);
//                                 }
//                             }
//                         })
//                         count = new_count;
//                     }
//                 }
//             });
//         }, 5000);
//     }
 });