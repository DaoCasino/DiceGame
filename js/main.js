var channelContract = '0xd7aa363a70866e6cf1f82089e4e2ec9a83c51c6a';
var GAME_CODE = 'dice_gamechannel'
var deposit, lastTx, count, new_count,
    sends, paids, totalGames, password,
    Timer, animate, RndGen, addressDice, socket;
deposit = 0.1;
var maxuser_bet = 0.0001;
var user_bet = 0.01;
var chance = 32768;
var bankroll = 1000;


paids = 5;
sends = 6;
totalGames = 10;

const GameLogic = function (deposit) {
    var balance = deposit * 1
    var history = []

    if (!window.bigInt) {
        window.bigInt = Casino.bigInt
    }

    var roll = function (user_bet, user_num, random_hash) {
        let profit = -user_bet
        const random_num = bigInt(random_hash, 16).divmod(65536).remainder.value
        if (user_num > random_num) {
            profit = (user_bet * (65536 - 1310) / user_num) - user_bet
        }
        if (user_num == random_num) {
            profit = user_bet
        }

        balance += profit * 1

        const roll_item = {
            timestamp: new Date().getTime(),
            user_bet: user_bet,
            profit: profit,
            user_num: user_num,
            balance: balance,
            random_hash: random_hash,
            random_num: random_num,
        }

        history.push(roll_item)

        return roll_item
    }

    return {
        history: history,
        roll: roll,
        deposit: deposit,
        balance: function () {
            return balance
        },
    }
}

$("#total-rolls").html(totalGames);
$("#total-paid").html(paids + ' BET');
$("#total-send").html(sends + ' BET (' + ((paids / sends) * 100) + '%)');

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

function startGame() {
    Casino.callChannelGameFunc(
        'roll', [user_bet * 10 ** 8, chance, Casino.getChannelGameRandom()],
        function (res) {
            window.Game.roll(user_bet * 10 ** 8, chance, res.random_hash)
            var b = Casino.Utils.toFixed(window.Game.balance() / 10 ** 8,8)
            $('#inChannel').html(b + " BET")
            $('#your-balance').val(b)
            addRow(res)
        },
        function (log) {
            console.log('log:', log)
        }
    )
    Refresh();
}

function openChannel() {
    $('#contractAdr').html('<a target="_blank" href="https://ropsten.etherscan.io/address/'+channelContract+'">Contract</a>')  
    $('#bg_popup.deposit').hide();
    $('#isreg').show();
    $('#balance').html(betsBalance + ' BET')
    $('#playerBal').html('Player: '+ deposit + ' BET')
    $('#bankrollBal').html('Bankroll: '+ deposit * 2 + ' BET') 
    $('#inChannel').html(deposit + " BET")
    $('#your-balance').val(deposit)
    

    Casino.startChannelGame(
        GAME_CODE, deposit * 10 ** 8,
        function (result) {
            window.Game = new GameLogic(deposit * 10 ** 8)
            
            console.log('openGamechannel res:', result)
            $('#openingTx').html('<a target="_blank" href="https://ropsten.etherscan.io/tx/'+result+'">Opening tx</a>')
            $('body').removeClass( "loading");
             
        },
        function (log) {
            $('#loadlog').html(log)
        }
    )

    var t = setInterval(function () {
        Casino.getAllowance(channelContract, function (bets) {
            if (bets > 10 ** 8) {
                console.log("approve complete:", bets)
                $('#bg_popup.approve').hide();
                clearInterval(t);
            }
        })
    }, 1000)
    
}

function closeChannel(){
    Casino.closeGameChannel(Game.balance(), function (result) {
        console.log('result', result);
        $('body').addClass("loading");
        $('#loadlog').html('<a target="_blank" href="https://ropsten.etherscan.io/tx/' + result + '">closing tx</a>');
    })
}

var b = setInterval(function () {
    Casino.Account.getBetsBalance(function (d) {
        betsBalance = d;
        $('#balance').html(d + ' BET');
        if(betsBalance == 0){
            closeChannel();
            $('#loadlog').html('Sorry, you dont have BET!');
        }
    })
}, 3000)

function Refresh() {
    var bal = window.Game.balance() / 10 ** 8;
    var p = bal - deposit;
    if (user_bet == NaN) {
        user_bet = 0;
    }
    if (bal != 0) {
        var _bet = ((deposit * 2 + p)) / ((65536 - 1310) / chance);
        maxuser_bet = Math.min(_bet, bal, 10);
        if (user_bet > maxuser_bet) {
            user_bet = +Casino.Utils.toFixed(maxuser_bet, 4);
        }
        if (user_bet < 0.001) {
            user_bet = 0.001;
        }
        $("#profit-on-win").val( Casino.Utils.toFixed( user_bet * (65536 - 1310) / chance - user_bet,3) );
        $("#payout").val("x" +  Casino.Utils.toFixed( (65536 - 1310) / chance, 5) );
        $("#slider-dice-one").slider("option", "max", maxuser_bet * 1000);
        $("#amount-one").val(user_bet);
        $("#slider-dice-one").slider("value", user_bet * 1000);
    }
};



function addRow(res) {
    var color;
    var state;
    var chance = res.user_num / (65536) * 100;
    res.profit > 0 ? state = 1 : state = 2
    if (state == 1) {
        state = "<div class=\"icon-w\">WIN</div>";
        color = "#d08c49";
    } else if (state == 2) {
        state = "<div class=\"icon-w\" style='background:gray'>LOSE</div>";
        color = "gray";
    } else {
        state = "...pending...";
        color = "gray";
    }

    $(".dice-table#table").prepend([
        '<tr>',
        '<td  aria-label="TIME">' + res.timestamp + '</td>',
        '<td  aria-label="" class="progress">',
        '<div class="tablebar ui-progressbar ui-corner-all ui-widget ui-widget-content" style="height:10px" >',
        '<div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width:' +  chance + '%; background:' + color + ';margin:0px;"></div></div>',
        '<div class="tooltip" style="left:' + res.random_num / 65536 * 100 + '%">' +  res.random_num + '</div>',
        '</td>',
        '<td class="state" aria-label="RESULT">' + state + '</td>',
        '<td  aria-label="BET">' + Casino.Utils.toFixed(res.user_bet,  3) + ' BET</td>',
        '<td  aria-label="PROFIT">' + Casino.Utils.toFixed(res.profit/10**8,3) + ' BET</td>',
        '<td  aria-label="ACTION"> UPDATE </td></tr>',
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

window.Casino = new CasinoJS({
    network: 'ropsten'
});

$(document).ready(function () {
    if (!localStorage.getItem('keystore')) {
        var link = 'https://platform.dao.casino';
        $('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="' + link + '">Platform</a>');
        return;
    }

    window.lightwallet = Casino.Account.lightWallet;

    Casino.Account.getBetsBalance(function (d) {
        window.betsBalance = d;
        readyUI();
    })
    $('#loading').hide();
    console.log("version 0.61 GC"); // VERSION !
    $('#bg_popup.deposit').show();
})