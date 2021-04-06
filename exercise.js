$('.pic').click(function() {
  $('#dog').animate({'left':'0vw'}, 500);
  var id = '#b'+$(this).attr('id');
	$(id).fadeIn(1000);
  $('.blur').fadeIn(500);

	$('.blur').click(function() {
 		$('#dog').animate({'left':'-100vw'},500);
		$(id).fadeOut(500);
    $('.blur').fadeOut(500);
	})
})


