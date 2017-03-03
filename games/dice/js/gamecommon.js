$(document).ready(function () {


    $(document).ready(function () {
        $('input').keypress(function (e) {
            if (!(e.which == 8 || e.which == 44 || e.which == 45 || e.which == 46 || (e.which > 47 && e.which < 58))) return false;
        });
    });
    $(document).ready(function () {
        $('input#less-than-wins').keypress(function (e) {
            if (!(e.which == 8 || (e.which > 47 && e.which < 58))) return false;
        });
    });



    checkMaxBet();

    /* SLIDER UI */
    $(function () {
        $('#less-than-wins').change(function () {
            var value = $("#less-than-wins").val();
            if (value > 9900) {
                value = 9900
            };
            if (value < 1) {
                value = 1
            };
            $("#less-than-wins").val(value);
            $("#slider-dice-two").slider("value", value);
            $("#amount-two").val(value / 100 + "%");
            chance = +value;
            Refresh();
        });
        $('#amount-one').change(function () {
            var value = $("#amount-one").val();

            if (value > maxBet / 1000) {
                value = maxBet / 1000
                betEth = maxBet / 1000
            };
            if (value < 0.1) {
                value = 0.1
                betEth = 0.1
            };
            $("#amount-one").val(value);
            $("#slider-dice-one").slider("value", value * 1000);
            betEth = +value;
            Refresh();
        });


        $("#slider-dice-one").slider({
            range: "min",
            value: maxBet / 2,
            min: 100,
            max: maxBet,
            slide: function (event, ui) {
                betEth = ui.value / 1000;
                //                CheckBet();
                if (betEth > _balance) {
                    EnableButton(false);
                    $("#label").text(" NO MONEY ");
                } else {
                    EnableButton(true);
                    $("#label").text("Click Roll Dice to place your bet:");
                }
                $("#amount-one").val(ui.value / 1000);
                Refresh();
            }
        });
        //        data("#slider-dice-two").slide();
        //        
        //		$( "#amount-one" ).val( $( "#slider-dice-one" ).slider( "value" ) );
        $("#slider-dice-two").slider({
            range: "min",
            value: 5000,
            min: 1,
            max: 9900,
            slide: function (event, ui) {
                chance = ui.value;
                $("#amount-two").val(ui.value / 100 + "%");
                $("#less-than-wins").val(ui.value);
                Refresh();
            }
        });
        $("#amount-two").val($("#slider-dice-two").slider("value") / 100 + "%");
        $("#amount-one").val($("#slider-dice-one").slider("value") / 1000);
        Refresh();
    });
    /* END SLIDER UI */
    /* POPUP */
    $('.open-register').click(function () {
        $('.window-open-registr').slideDown();
        $('#popup-open-text-before').slideDown();
        $('.window-seed').slideUp();
        $('.popup-button').slideUp();
        $('#popup-open-text-after').slideUp();
    });
    $('.dialog-window-cancel').click(function () {
        $('.popup-button').slideDown();
        $('.window-open-registr').slideDown();
        $('#popup-open-text-after').slideDown();
        $('.window-seed').slideDown();
        $('#popup-open-text-before').slideUp();
        $('.window-open-registr').slideUp();
    });
    $('.open-dialog-window').click(function () {
        $('.dialog-content').slideUp();
        $('.popup-button').slideUp();
        $('.dialog-window-two').slideDown();
    });
    $('.dialog-window-cancel-two').click(function () {
        $('.dialog-window-two').slideUp();
        $('.popup-button').slideDown();
    });
    /* END POPUP */
    $('.toggle-bg input').click(function () {
        if ($('input#checked-on:checked')) {
            $('.free-money').toggleClass('free-money__enable');
            $('.real-money').toggleClass('free-money__disabled');
        }
    });
    $('.open-menu').click(function () {
        $('.mobile-menu').toggleClass('open-mobile-menu');
        $('.mobile-menu-overlay').toggleClass('open-menu-overlay');
    });
    $('.mobile-menu-overlay, .closed-mnu').click(function () {
        $('.mobile-menu').removeClass('open-mobile-menu');
        $('.mobile-menu-overlay').removeClass('open-menu-overlay');
    });
    $(".cat-menu").click(function () {
        $(this).next().slideToggle();
    });
    // Popup window
    $('.popup-with-move-anim').magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });
});
/* TABLE */
// CONFIGS
var tableSelector = 'table';
var targetBreakpoint = 500;
var currentVisibleColumn = 1;
var nextButtonText = 'Compare Next';
// SETUP/SELECT REUSABLE ELEMENTS
var table = document.querySelector(tableSelector);
var allCells = table.querySelectorAll('th, td');
var columnHeaders = table.querySelectorAll('thead th:not(:empty)');
var rowHeaders = table.querySelectorAll('tbody th');
var nextButton = document.createElement('button');

function createButtons() {
    nextButton.textContent = nextButtonText;
    nextButton.style.display = 'none';
    table.parentNode.insertBefore(nextButton, table.nextSibling);
    nextButton.addEventListener('click', function () {
        currentVisibleColumn = currentVisibleColumn + 1 > columnHeaders.length ? 1 : currentVisibleColumn + 1;
        showCurrentlyVisible();
    });
}

function showCurrentlyVisible() {
    // Get the Items we're going to show. The :not(:empty) query here is because sometimes you have empty <th>s in <thead>
    var currentlyVisibleColHeader = document.querySelector('thead th:not(:empty):nth-of-type( ' + currentVisibleColumn + ')');
    var currentlyVisibleCells = document.querySelectorAll('tbody td:nth-of-type(' + currentVisibleColumn + ')');
    // Hide All The Cells
    for (var i = 0; i < allCells.length; i++) {
        allCells[i].style.display = 'none';
    }
    // Show Currently Visible Col Header
    currentlyVisibleColHeader.style.display = 'block';
    // Show Currently Visible Cells
    for (var i = 0; i < currentlyVisibleCells.length; i++) {
        currentlyVisibleCells[i].style.display = 'block';
    }
    // Show Row Headers
    for (var i = 0; i < rowHeaders.length; i++) {
        rowHeaders[i].style.display = 'block';
    }
}

function updateTable() {
    // Get the Table's Width. Might as well go FULL Container Query over here.
    var tableWidth = table.getBoundingClientRect().width;
    // If the table explodes off the viewport or is wider than the target breakpoint
    if (tableWidth > window.innerWidth || tableWidth < targetBreakpoint) {
        if (table.getAttribute('data-comparing') != 'active') {
            // Set the comparison state to "Active"
            table.setAttribute('data-comparing', 'active');
            // Show Next Button
            nextButton.style.display = 'block';
            // Show the currently visible column
            showCurrentlyVisible();
        }
    } else {
        if (table.getAttribute('data-comparing') == 'active') {
            // Turn off comparing    
            table.setAttribute('data-comparing', '');
            // Hide the next button
            nextButton.style.display = 'none';
            // Remove styles from all cells, ergo, show all the cells
            for (var i = 0; i < allCells.length; i++) {
                allCells[i].style.display = '';
            }
            // Remove styles from all row headers
            for (var i = 0; i < rowHeaders.length; i++) {
                rowHeaders[i].style.display = '';
            }
        }
    }
}
createButtons();
updateTable();
window.addEventListener('resize', updateTable);
/* END TABLE */