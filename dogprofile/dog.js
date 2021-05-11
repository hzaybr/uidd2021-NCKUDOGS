var hide_class
const container_list = ['.intro-container', '.pic-container', '.comment-container', '.report-container']
const scrollbar_position = ['10vw', '32.5vw', '55vw', '77.5vw']
var SCORE = 0;

//id: from, to
$('.start-button').click(function() {
  $(this).css('color','black');
  to = $(this).attr('id')[1];
  show = container_list[to];
  console.log(`show ${show}`);
  yellow = `#${to+to}`;

  $('.start').hide();
  $(show).show();
  $(show).animate({'top':'0'}, 150);

  $('.scroll-bar').animate({'left': scrollbar_position[to]}, 150);
  setTimeout(function() {
    $(yellow).css('color','#ff8b2c'); 
    container_list.forEach(function(item, i) {
      $(item).css({'top':'0'});
    });
  }, 150);
})

$('.d-all').click(function() {
  $('.start').hide();
  $('.intro-container').show();
  $('.intro-container').animate({'top':'0'}, 150);

  setTimeout(function() {
    $('#00').css('color','#ff8b2c'); 
    container_list.forEach(function(item, i) {
      $(item).css({'top':'0'});
    });
  }, 150);
})
$('.button').click(function() {
  from = $(this).attr('id')[0];
  to = $(this).attr('id')[1];

  if(from!=to){
    $(this).css('color','black');
    hide = container_list[from];
    show = container_list[to];
    console.log(`hide ${hide}, show ${show}`);
    yellow = `#${to+to}`;
    console.log(yellow);

    $('.scroll-bar').animate({'left': scrollbar_position[to]}, 150);
    setTimeout(function() {
      $(yellow).css('color','#ff8b2c'); }, 100 
      );
    $(hide).hide();
    $(show).show();
  };
})

$('.arrow').click(function() {
  now = $(this).attr('id')[1];
  $(container_list[now]).animate({'top':'65vw'}, 150);
  $('.scroll-bar').animate({'left': '10vw'}, 150);

  setTimeout(function() {
    $(container_list[now]).hide();
    $('.start').show(); 
    $('#s0').css('color','#ff8b2c'); 
    container_list.forEach(function(item, i) {
      $(item).css({'top':'65vw'});
      $(item).hide();
    });
  }, 150);
});

$('.heart').click(function() {
  $('.pop-com').fadeIn();

  SCORE = $(this).attr('id')[1];
  console.log(`score: ${SCORE}`);
  for (i=1; i<=5; i++){
    //heart in comment
    hid = `.heart:nth-child(${i+1})`;
    if(i<=SCORE){
    $(hid).attr('src','./image/red_heart.png');
    }
    else {
    $(hid).attr('src','./image/heart.png');
    }
  };
});

$('#cancel-btn').click(function() {
  $('.pop-com').hide();
  $('.heart').attr('src','./image/heart.png');
});

$('.write-com').click(function() {
  $('.comment-container').hide();
  $('.writing-container').show();
  
  for (i=1; i<=5; i++){
    hid = `.w-heart:nth-child(${i})`;
    if(i<=SCORE){
      // console.log($(hid).attr('id'));
      $(hid).attr('src','./image/red_heart.png');
    }
    else {
      $(hid).attr('src','./image/heart.png');
    }
  }
});

$('#writing-cancel-btn').click(function() {
  IS_EDITING = false;
  $('.commentBox').val('');
  $('.comment-container').fadeIn();
  $('.writing-container').hide();
  $('.w-heart').attr('src','./image/heart.png');
  $('.heart').attr('src','./image/heart.png');
  $('.pop-com').hide();
});

$('.w-heart').click(function() {
  SCORE = $(this).attr('id')[2];
  console.log(`score: ${SCORE}`);
  for (i=1; i<=5; i++){
    hid = `.w-heart:nth-child(${i})`;
    if(i<=SCORE){
    $(hid).attr('src','./image/red_heart.png');
    }
    else {
    $(hid).attr('src','./image/heart.png');
    }
  };
});
