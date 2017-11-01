var channelContract = '0xd7aa363a70866e6cf1f82089e4e2ec9a83c51c6a';

var GAME_CODE = 'dice_gamechannel'

var deposit, count, Timer, animate;

var maxuser_bet = 0.1;
var deposit  = 0.1;
var user_bet = 0.001;;
var chance = 32768;
var bankroll;
var game = false;
var paids = 0;
var totalGames = 0;

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
    if(!game){
        return;
    }

    disabled(true);

    if(window.Game.balance() + (user_bet * (65536 - 1310) / chance - user_bet) > bankroll){
        return;

    }

    var old = window.Game.balance()

    var send_bet = Math.floor(user_bet * Math.pow(10,8));
    
    Casino.callChannelGameFunc(
        'roll', [send_bet, chance, Casino.getChannelGameRandom()],
        function (res) {
            
            window.Game.roll(user_bet * Math.pow(10,8), chance, res.random_hash)
            var b = Casino.Utils.toFixed(window.Game.balance() / Math.pow(10,8), 8)
            
            $('#inChannel').html(b + " BET")
            $('#your-balance').val(b)
            
            addRow(res)
            
            if (old > window.Game.balance()) {
                $('#inChannel').css('color', 'red')
            } else {
                $('#inChannel').css('color', 'green')
            }
            
            if(window.Game.balance() >= bankroll*0.95 || window.Game.balance() == 0 || window.Game.balance() < 0.001 * Math.pow(10,8)){
                closeChannel(); 
            }         
            Refresh();
        },
        function (log) {
            console.log('log:', log)
        }
    )
    totalGames++;
    paids += user_bet;
    $("#total-rolls").html(totalGames);
    $("#total-paid").html(Casino.Utils.toFixed(paids,3) + ' BET');
    setTimeout(function(){disabled(false)},3000)
}

function openChannel() {
    $('#contractAdr').html('<a target="_blank" href="https://ropsten.etherscan.io/address/' + channelContract + '">Contract</a>')
    $('#bg_popup.deposit').hide();
    $('#isreg').show();
    $('#balance').html('? BET')
    $('#playerBal').html('Player: ' + deposit + ' BET')
    $('#bankrollBal').html('Bankroll: ' + deposit * 2 + ' BET')
    $('#inChannel').html(deposit + " BET")
    $('#your-balance').val(deposit)

    Casino.startChannelGame(
        GAME_CODE, deposit * Math.pow(10,8),
        function (result) {
            window.Game = new GameLogic(deposit * Math.pow(10,8))
            console.log('openGamechannel res:', result)
            $('#openingTx').html('<a target="_blank" href="https://ropsten.etherscan.io/tx/' + result + '">Opening tx</a>')
            $('body').removeClass("loading");
            game = true;
            Refresh();
        },
        function (log) {
            $('#loadlog').html(log)
        }
    )
    bankroll = deposit * Math.pow(10,8) * 3;
    var t = setInterval(function () {
        Casino.getAllowance(channelContract, function (bets) {
            if (bets > Math.pow(10,8)) {
                console.log("approve complete:", bets)
                $('#bg_popup.approve').hide();
                clearInterval(t);
            }
        })
    }, 1000)
}

function closeChannel() {
    console.log("Close channel");
    Casino.closeGameChannel(Game.balance(), function (result) {
        console.log('result', result);
        $('body').addClass("loading");
        $('#loadlog').html('The channel was a closed. <a target="_blank" href="https://ropsten.etherscan.io/tx/' + result + '">transaction.</a>');
        setTimeout(function(){location.reload()},30000)
    })
}

var b = setInterval(function () {
    Casino.Account.getBetsBalance(function (d) {
        betsBalance = d;
        $('#balance').html(d + ' BET');
        if (betsBalance == 0) {
            closeChannel();
            $('#loadlog').html('Sorry, you dont have BET!');
        }
    })
}, 30000)

function Refresh() {
    var balance = window.Game.balance();
    var maxProfit = bankroll - balance;
    var maxProfitBet = (bankroll - balance) / Math.pow(10,8) / ((65536-1310)/chance - 1); 
    //var maxBet = ((bankroll - balance)/ * chance)/(65536 - 1310);
    maxuser_bet = Math.min( balance/Math.pow(10,8) , 10, maxProfitBet);  
    if (user_bet > maxuser_bet) {
        user_bet = Casino.Utils.toFixed(maxuser_bet, 4);
    }
    if (user_bet < 0.001 || user_bet == NaN) {
        user_bet = 0.001;
    }

    $("#profit-on-win").val((Casino.Utils.toFixed(user_bet * (65536 - 1310) / chance - user_bet, 8).toFixed(8)));
    $("#payout").val("x" + Casino.Utils.toFixed((65536 - 1310) / chance, 5));
    $("#slider-dice-one").slider("option", "max", maxuser_bet * 1000);
    $("#amount-one").val(user_bet);
    $("#slider-dice-one").slider("value", user_bet * 1000);
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
        '<div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width:' + chance + '%; background:' + color + ';margin:0px;"></div></div>',
        '<div class="tooltip" style="left:' + res.random_num / 65536 * 100 + '%">' + res.random_num + '</div>',
        '</td>',
        '<td class="state" aria-label="RESULT">' + state + '</td>',
        '<td  aria-label="BET">' + Casino.Utils.toFixed(res.user_bet/100000000, 3) + ' BET</td>',
        '<td  aria-label="PROFIT">' + Casino.Utils.toFixed(res.profit / Math.pow(10,8), 3) + ' BET</td>',
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
