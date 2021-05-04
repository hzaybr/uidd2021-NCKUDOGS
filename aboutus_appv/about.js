var pic
var intro

$('.avatar').click(function() {
  pic = '#b'+$(this).attr('id');
  intro = '#w'+$(this).attr('id');
  console.log(pic,intro)
  $('.blur').fadeIn(300);
  $(pic).fadeIn(500);
  $(intro).fadeIn(500);
})
$('.blur').click(function() {
  $('.blur').fadeOut(500);
  $(pic).fadeOut(500);
  $(intro).fadeOut(500);
})

$('.backicon').click(function(){
	window.location.assign('../index.html')
})

$('#mes-icon').click(function() {
  console.log('direct')
	window.open('https://www.facebook.com/ncku.vdogs')
})
