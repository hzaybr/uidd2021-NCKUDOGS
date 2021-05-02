var hide_class
var container_list = ['.intro-container', '.pic-container', '.comment-container', '.report-container']
var scrollbar_position = ['10vw', '32.5vw', '55vw', '77.5vw']

//id: from, to
$('.start-button').click(function() {
  $(this).css('color','black');
  to = $(this).attr('id')[1];
  show = container_list[to];
  console.log(`show ${show}`);
  yellow = `#${to+to}`;

  $('.scroll-bar').animate({'left': scrollbar_position[to]}, 150);
  setTimeout(function() {
    $(yellow).css('color','#ffbc00'); }, 100
    );
  $('.start').hide();
  $(show).show();
  $(show).animate({'top':'0'}, 200);
  container_list.forEach(function(item, i) {
    $(item).css({'top':'0'});
  });
})

$('.button').click(function() {
  $(this).css('color','black');
  from = $(this).attr('id')[0];
  to = $(this).attr('id')[1];
  hide = container_list[from];
  show = container_list[to];
  console.log(`hide ${hide}, show ${show}`);
  yellow = `#${to+to}`;
  console.log(yellow);

  $('.scroll-bar').animate({'left': scrollbar_position[to]}, 150);
  setTimeout(function() {
    $(yellow).css('color','#ffbc00'); }, 100 
    );
  $(hide).hide();
  $(show).show();
})

$('.arrow').click(function() {
  now = $(this).attr('id')[1];
  $(container_list[now]).animate({'top':'60vw'}, 150);
  $('.scroll-bar').animate({'left': '10vw'}, 150);

  setTimeout(function() {
    $(container_list[now]).hide();
    $('.start').show(); 
    $('#s0').css('color','#ffbc00'); 
    container_list.forEach(function(item, i) {
      $(item).css({'top':'60vw'});
      $(item).hide();
    });
  }, 150);
});

$('.heart').click(function() {
  score = $(this).attr('id')[1];
  console.log(score);
  for (i=1; i<=5; i++){
    hid = `.heart:nth-child(${i+1})`;
    if(i<=score){
    console.log($(hid).attr('id'));
    $(hid).attr('src','./image/red_heart.png');
    }
    else {
    $(hid).attr('src','./image/heart.png');
    }
  };


});
