$(document).ready(function () {

    $('#loading').hide();
    console.log("version 0.6 BET [game channel edition]"); // VERSION !
    if (!localStorage.getItem('keystore')) {
        var link = 'https://platform.dao.casino';
        $('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="' + link + '">Platform</a>');
    }
    var channelContract = '0xd7aa363a70866e6cf1f82089e4e2ec9a83c51c6a';

    window.Casino = new CasinoJS({
        network: 'ropsten'
    });
    window.lightwallet = Casino.Account.lightWallet;

    Casino.getAllowance(channelContract, function (bets) {
        console.log("wait", bets)
        if (bets > 10 ** 8) {
            $('#bg_popup.deposit').show();
            return;
        }
        $('#bg_popup.approve').show();
        Casino.approveContract(channelContract, 10000 * 10 ** 8, function () {
            var t = setInterval(function () {
                Casino.getAllowance(channelContract, function (bets) {
                    if (bets > 10 ** 8) {
                        console.log("approve complete:", bets)
                        $('#bg_popup.approve').hide();
                        clearInterval(t);
                        $('#bg_popup.deposit').show();
                    }
                })
            })
        })
    })
    Casino.Account.getBetsBalance(function (d) {
        window.balance = d;
    })

    var deposit, maxBetEth, lastTx, count, new_count,
        sends, paids, totalGames, password,
        Timer, animate, RndGen, addressDice, socket;

    var betEth = 0.01;
    var chance = 32768;
    var bankroll = 1000;

    readyUI();

    function initGame() {
        paids = 5;
        sends = 6;
        totalGames = 10;

        $("#total-rolls").html(totalGames);
        $("#total-paid").html(paids.toFixed(3) + ' BET');
        $("#total-send").html(sends.toFixed(3) + ' BET (' + ((paids / sends) * 100).toFixed(2) + '%)');

        Refresh();
        setInterval(checkEthAndBet, 5000);
        if (getAllowance(addressDice) < 1000000 && checkBalance()) {
            $('#bg_popup.allowance').show().find('#popup').html('<h1>Bankroll connect... Please, wait one minute...<br></h1><p> The "approve" function allows the contract to take a small number of tokens from the players purse. This is done in order not to cause the function to "approve" each time');
            animateTimer(60);
            approve(addressDice, 100000000000);
            window.approveT = setTimeout(function () {
                window.location.reload();
            }, 42000);
        }
    };

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
        status ? $("#roll-dice").css({
            background: 'gray'
        }) : $("#roll-dice").removeAttr('style');

    };

    function openChannel(){
    }

    function Refresh() {
        if (betEth == NaN) {
            betEth = 0;
        }
        if (balance != 0) {
            var _bet = ((bankroll / 100000000) / 10) / ((65536 - 1310) / chance);
            maxBetEth = Math.min(_bet, balance, 10);
            if (betEth > maxBetEth) {
                betEth = +maxBetEth.toFixed(4);
            }
            if (betEth < 0.001) {
                betEth = 0.001;
            }
            $("#profit-on-win").val(((betEth * (65536 - 1310) / chance) - betEth).toFixed(6));
            $("#payout").val("x" + ((65536 - 1310) / chance).toFixed(5));
            $("#slider-dice-one").slider("option", "max", maxBetEth * 1000);
            $("#amount-one").val(betEth);
            $("#slider-dice-one").slider("value", betEth * 1000);
        }
    };

    function addRow(idGame, tx, player, bet, playerNum, rnd, state) {
        var color;
        var chance = playerNum / (65536) * 100;
        var payout = (65536 - 1310) / playerNum;
        var profit = payout * bet - bet;

        if (state == 1) {
            state = "<div class=\"icon-w\">WIN</div>";
            color = "#d08c49";
        } else if (state == 2) {
            state = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
            profit = -bet;
            color = "gray";
        } else {
            state = "...pending...";
            color = "gray";
        }

        $(".dice-table#table").prepend([
            '<tr id="' + idGame + '">',
            '<td  aria-label="TRANSACTION"><a target="_blank" href="https://' + getNet() + '.etherscan.io/tx/' + tx + '">' + "0x" + player.slice(2, 12) + '...</a> <br></td>',

            '<td  aria-label="" class="progress">',
            '<div class="tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content" style="height:10px" >',
            '<div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width:' + chance + '%; background:' + color + ';margin:0px;"></div></div>',
            '<div class="tooltip" style="left:' + rnd / 65536 * 100 + '%">' + rnd + '</div>',
            '</td>',

            '<td class="state" aria-label="RESULT">' + state + '</td>',
            '<td  aria-label="BET">' + bet.toFixed(3) + ' BET</td><td  aria-label="PAYOUT">x' + payout.toFixed(3) + '</td><td  aria-label="PROFIT">' + profit.toFixed(3) + ' BET</td></tr>'
        ].join(''));
    };

    function updateRow(seed, rnd) {
        var chance = _arGames[seed];
        var color;
        var state;
        if (chance > rnd) {
            state = "<div class=\"icon-w\">WIN</div>";
            color = "#d08c49";
        } else {
            state = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
            color = "gray";
        }

        $('tr#' + seed.substr(0, 10) + ' td.state').html(state);
        $('tr#' + seed.substr(0, 10) + ' td.progress').html(
            ['<div class="tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content" style="height:10px" >',
                '<div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width:' + chance / 65536 * 100 + '%; background:' + color + ';margin:0px;"></div></div>',
                '<div class="tooltip" style="left:' + rnd / 65536 * 100 + '%">' + rnd + '</div>'
            ].join('')
        );

    }

    function showResult(value, rnd, seed) {
        switch (value) {
            case 1:
                // console.log("YOU WIN!");
                $("#randomnum").text("YOU WIN!");
                gameend();
                break;
            case 2:
                // console.log("LOSS");
                $("#randomnum").text("YOU LOSE");
                gameend();
                break;
            case 3:
                // console.log("Sorry, No money in the bank");
                $("#randomnum").text("Sorry, no money in the bank");
                gameend();
                break;
            default:
                // console.log("run game");
                break;
        }

        updateRow(seed, rnd);
    }

    function animateTimer(second) {
        var time = second;
        var t = setInterval(function () {
            $("#timer").html(time + " second");
            time--;
            if (time < 0) {
                clearInterval(t);
            }

        }, 1000)
    }
})