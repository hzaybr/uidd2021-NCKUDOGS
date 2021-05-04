var listDisplay = false;
var searchDisplay = false;
var markDisplay = false;
var markmode = false;

function displayCheck(){
  if(listDisplay){
    listClick();
  }
  if(searchDisplay){
    searchClick();
  }
  if(markDisplay){
    if(!markmode){
      markClick();
    }
  }
  if(markmode){
    $('.mark_tip').animate({'top':'-100vh'},10);
    $('.mark').animate({'right': '4vw'},500);
    document.getElementById('m1').style.display="block";
    markmode = !markmode;
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

function markClick(){
  $('#mark-icon').stop();
  $('.mark_tip').stop();
  if (markDisplay){
    $('#mark-icon').animate({'right':'5vw','width':'20vw'},500);
    $('.mark_tip').animate({'top':'-100vh'},10);
    $('.mark').animate({'right': '-92vw'},500);
    document.getElementById('m1').style.display="none";
  }
  else{
    displayCheck();
	  $('#mark-icon').animate({'right':'37vw','width':'26vw'},500);
    $('.mark_tip').animate({'top':'0vh'},10);
    
  }
  markDisplay = !markDisplay;
  markmode = markDisplay;
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

$('.mark_tip').click(function(){
  displayCheck();
})

$('#mark-icon').click(function(){
  markClick();
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

$('#adopt').click(function(){
  window.location.assign('./aboutus_appv/adopt.html')
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





