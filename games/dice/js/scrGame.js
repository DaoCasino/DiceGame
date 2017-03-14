$(document).ready(initGame());
function Refresh() {
    $("#profit-on-win").val(((betEth * 9920 / chance) - betEth).toFixed(4));
    $("#payout").val("x" + (9920 / chance).toFixed(3));
};
$("#roll-dice").click(function () {
    startGame();
 });