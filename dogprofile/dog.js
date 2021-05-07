var hide_class
const container_list = ['.intro-container', '.pic-container', '.comment-container', '.report-container']
const scrollbar_position = ['10vw', '32.5vw', '55vw', '77.5vw']

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

var score
$('.heart').click(function() {
  $('.pop-com').fadeIn();

  score = $(this).attr('id')[1];
  console.log(`score: ${score}`);
  for (i=1; i<=5; i++){
    //heart in comment
    hid = `.heart:nth-child(${i+1})`;
    if(i<=score){
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
  
  console.log(`score: ${score}`);
  for (i=1; i<=5; i++){
    //heart in writing
    hid = `.w-heart:nth-child(${i})`;
    if(i<=score){
    $(hid).attr('src','./image/red_heart.png');
    }
    else {
    $(hid).attr('src','./image/heart.png');
    }
  };
});

$('#writing-cancel-btn').click(function() {
  $('.comment-container').fadeIn();
  $('.writing-container').hide();
  $('.w-heart').attr('src','./image/heart.png');
  $('.heart').attr('src','./image/heart.png');
  $('.pop-com').hide();
});

$('.w-heart').click(function() {
  score = $(this).attr('id')[2];
  console.log(`score: ${score}`);
  for (i=1; i<=5; i++){
    hid = `.w-heart:nth-child(${i})`;
    if(i<=score){
    $(hid).attr('src','./image/red_heart.png');
    }
    else {
    $(hid).attr('src','./image/heart.png');
    }
  };
});
