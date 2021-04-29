var listDisplay = false;
var searchDisplay = false;

function displayCheck(){
  if(listDisplay){
    listClick();
  }
  if(searchDisplay){
    searchClick();
  }
}

function listClick(){
  $('.list-grid').stop();
  if (listDisplay){
    $('.list-grid').animate({'left':'-65vw'},500);
  }
  else{
    displayCheck();
    $('.list-grid').animate({'left':'5vw'},500);
  }
  listDisplay = !listDisplay;
}

function searchClick(){
  $('#search-icon').stop();
  $('.search').stop();
  if (searchDisplay){
    $('#search-icon').animate({'left':'5vw','width':'20vw'},500);
    $('.search').animate({'left':'-92vw'},500);
  }
  else{
    displayCheck();
	  $('#search-icon').animate({'left':'37vw','width':'26vw'},500);
    $('.search').animate({'left': '4vw'},500);
  }
  searchDisplay = !searchDisplay;
}

$('#list-icon').click(function(){
  listClick();
})
$('#search-icon').click(function(){
  searchClick();
})

$('#map').click(function(){
  displayCheck();
})

$('#mark-icon').click(function(){
  displayCheck();
})

$('.search-grid img').click(function(){
  searchClick();
})

$('#about-dog').click(function(){
  window.location.assign('./aboutus_appv/aboutdog.html')
})

$('#about-us').click(function(){
  window.location.assign('./aboutus_appv/aboutus.html')
})

$('#messenger-icon').click(function(){
  window.location.assign("https://www.facebook.com/ncku.vdogs")  
})

$('#observ').click(function(){
  $('#s2').fadeIn(0);
})

$('#manage').click(function(){
  $('#s2').fadeOut(0);
})





