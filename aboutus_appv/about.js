$('.avatar').click(function() {
  var pic = '#b'+$(this).attr('id');
  var intro = '#w'+$(this).attr('id');
  console.log(pic,intro)
  $('.blur').fadeIn(500);
	$(pic).fadeIn(500);
	$(intro).fadeIn(500);

	$('.blur').click(function() {
    $('.blur').fadeOut(500);
		$(pic).fadeOut(500);
		$(intro).fadeOut(500);
	})
})


