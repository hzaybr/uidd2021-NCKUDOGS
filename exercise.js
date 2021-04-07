$('.pic').click(function() {
  $('#dog').animate({'left':'0vw'}, 500);
  var pic = '#b'+$(this).attr('id');
  var intro = '#w'+$(this).attr('id');
  console.log(pic)
  $('.blur').fadeIn(500);
	$(pic).fadeIn(2000);
	$(intro).fadeIn(2000);

  $('.blur').click(function() {
    //add stop
    $('#dog').stop();
    $('.blur').stop();
	  $(pic).stop();
    $(intro).stop();
    //
    $('#dog').animate({'left':'-100vw'},500);
    $('.blur').fadeOut(500);
		$(pic).fadeOut(500);
		$(intro).fadeOut(500);
	})
})


