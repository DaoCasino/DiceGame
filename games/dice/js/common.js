$(document).ready(function() {

	/* SLIDER UI */

	$( function() {
		$( "#slider-dice-one" ).slider({
			range: "min",
			value: 37,
			min: 1,
			max: 700,
			slide: function( event, ui ) {
				$( "#amount-one" ).val( ui.value );
			}
		});
		$( "#amount-one" ).val( $( "#slider-dice-one" ).slider( "value" ) );

		$( "#slider-dice-two" ).slider({
			range: "min",
			value: 37,
			min: 1,
			max: 700,
			slide: function( event, ui ) {
				$( "#amount-two" ).val( ui.value + "%" );
			}
		});
		$( "#amount-two" ).val( $( "#slider-dice-two" ).slider( "value" ) + "%" );
	});

	/* END SLIDER UI */

	/* POPUP */

	$('.open-register').click(function(){
		$('.window-open-registr').slideDown();
		$('#popup-open-text-before').slideDown();
		$('.window-seed').slideUp();
		$('.popup-button').slideUp();
		$('#popup-open-text-after').slideUp();
	});

	$('.dialog-window-cancel').click(function(){
		$('.popup-button').slideDown();
		$('.window-open-registr').slideDown();
		$('#popup-open-text-after').slideDown();
		$('.window-seed').slideDown();
		$('#popup-open-text-before').slideUp();
		$('.window-open-registr').slideUp();
	});

	$('.open-dialog-window').click(function(){
		$('.dialog-content').slideUp();
		$('.popup-button').slideUp();
		$('.dialog-window-two').slideDown();
	}); 

	$('.dialog-window-cancel-two').click(function(){
		$('.dialog-window-two').slideUp();
		$('.popup-button').slideDown();
	});

	/* END POPUP */

	$('.toggle-bg input').click(function(){
		if($('input#checked-on:checked')){
			$('.free-money').toggleClass('free-money__enable');
			$('.real-money').toggleClass('free-money__disabled');
		}
	});

	$('.open-menu').click(function(){
		$('.mobile-menu').toggleClass('open-mobile-menu');
		$('.mobile-menu-overlay').toggleClass('open-menu-overlay');
	});

	$('.mobile-menu-overlay, .closed-mnu').click(function(){
		$('.mobile-menu').removeClass('open-mobile-menu');
		$('.mobile-menu-overlay').removeClass('open-menu-overlay');
	});

	$(".cat-menu").click(function(){
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


