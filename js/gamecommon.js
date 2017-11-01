function readyUI() {

    var url = (function () {
        var params = {};
        if (window.location.href.split('?').length < 2) {
            return params;
        }
        var parts = window.location.href.split('?')[1].split('&');
        for (var k in parts) {
            var kv = parts[k].split('=');
            params[kv[0]] = kv[1];
        }
        return params;
    }());

    localStorage.setItem('referrer' , url.ref);

    var clipboard = new Clipboard('#openkey');
    $("#slider-dice-one").slider({
        range: "min",
        step: 0.5,
        value: 10,
        min: 1,
        max: 100000,
        slide: function (event, ui) {
            user_bet = ui.value / 1000;
            $("#amount-one").val(ui.value / 1000);
            Refresh();
        }
    });

    $("#slider-deposit").slider({
        range: "min",
        step: 0.1,
        value: 0.1,
        min: 0.1,
        max: window.betsBalance,
        slide: function (event, ui) {
            window.deposit = +ui.value;
            $("#your-deposit").html(ui.value);
        }
    });


    $('#deposit-btn').click(function(){
        openChannel();
        console.log('selected deposit:', deposit);
    })
    
    $("input#checked-on").prop('disabled', true);
    

    $('#closeChannel').click(function () {
        closeChannel();
    });

    $("#roll-dice").click(function () {
        startGame();
    });

    $(".toggle-bg").click(function () {
        start();
        getAllLogs();
    });

    $('#your-balance').click(function () {
        user_bet = $(this).val();
        Refresh();
    });

    $('input#amount-one').keypress(function (e) {
        if (e.which == 13) {
            //Refresh();
            $(this).blur();
        }
    });

    $('input#amount-one').keypress(function (e) {
        //Refresh();
        if (!(e.which == 8 || e.which == 44 || e.which == 45 || e.which == 46 || (e.which > 47 && e.which < 58))) return false;
    });

    $('input#less-than-wins').keypress(function (e) {
        if (e.which == 13) {
            Refresh();
            $(this).blur();
        }
    });

    $('input#less-than-wins').keypress(function (e) {
        Refresh();
        if (!(e.which == 8 || (e.which > 47 && e.which < 58))) return false;

    });

    // $('input#less-than-wins').on('input keyup change', function () {
 
    //     var value = this.value;
    //     Refresh();
    //     if (value < 1000 || value > 64224){
    //         this.value = value.slice(0, -1);
    //     }
    //     else {Refresh();}

    // });

    $('input#less-than-wins').change(function () {
        var value = +$("input#less-than-wins").val();

        if (value < 1000) {
            value = 1000;
        };

        if (value > 64224) {
            value  = 64224;
        };
       
        $("input#less-than-wins").val(value);
        Refresh();
    });

    $('input#amount-one').change( function () {
        var value = this.value;
        //Refresh();
        if (value < 0.001 || value > maxuser_bet){
            this.value = value.slice(0, -1);
        } else {
            user_bet = +value;
            Refresh();
        }
    });

    /* SLIDER UI */
    $('#less-than-wins').change(function () {
        var value = $("#less-than-wins").val();
        if (value > 64224) {
            value = 64224;
        };
        if (value < 1) {
            value = 1;
        };
        $("#less-than-wins").val(value);
        $("#slider-dice-two").slider("value", value);
        $("#amount-two").val((value / 65536 * 100).toFixed(2) + "%");
        chance = +value;
        Refresh();
    });

    $('#amount-one').change(function () {
        var value = $("#amount-one").val();

        if (value > maxuser_bet) {
            value  =  Casino.Utils.toFixed(maxuser_bet, 4);
            user_bet = value;
        };

        if (value < 0.001) {
            value  = 0.001;
            user_bet = 0.001;
        };
       
        $("#amount-one").val(value);
        $("#slider-dice-one").slider("value", value * 1000);
       
        user_bet = +value;
        //Refresh();
    });

    $("#slider-dice-two").slider({
        range: "min",
        value: 32768,
        min:   1000,
        max:   64224,
        slide: function (event, ui) {
            chance = ui.value;
            $("#amount-two").val((ui.value / 65536 * 100).toFixed(2) + "%");
            $("#less-than-wins").val(ui.value);
            Refresh();
        }
    });
    
    $("#amount-two").val(($("#slider-dice-two").slider("value") / 65536 * 100).toFixed(2) + "%");
    $("#amount-one").val(user_bet);
    


};