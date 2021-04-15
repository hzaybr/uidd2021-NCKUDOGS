$('.pic').on('click',function() {
    $('#dog').animate({'left':'0vw'}, 500);
    let pic = '#b'+$(this).attr('id');
    let intro = '#w'+$(this).attr('id');
    console.log(pic)
    $('.blur').fadeIn(500);
    $(pic).fadeIn(2000);
    $(intro).fadeIn(2000);
    $('.blur').on('click',function() {
        $('#dog').animate({'left':'-100vw'},500);
        $('.blur').fadeOut(500);
        $(pic).fadeOut(500);
        $(intro).fadeOut(500);
    })
  })