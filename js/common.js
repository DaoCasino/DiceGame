$(document).ready(function() {

	/* POPUP */

	$('.open-dialog-window').click(function(){
		$('.dialog-content').slideUp();
		$('.popup-button').slideUp();
		$('.dialog-window').slideDown();
	});

	$('.dialog-window-cancel').click(function(){
		$('.dialog-content').slideDown();
		$('.popup-button').slideDown();
		$('.dialog-window').slideUp();
	}); 

	$('.dialog-window-cancel-two').click(function(){
		$('.dialog-window-two').slideUp();
		$('.dialog-window').slideDown();
	});

	$('#restore-from').click(function(){
		$('.dialog-window-two').slideDown();
		$('.dialog-window').slideUp();
	});

	/* AND POPUP */

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


