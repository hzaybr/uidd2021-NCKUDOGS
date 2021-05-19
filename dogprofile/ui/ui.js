/*
$('.address_base64').attr('src','data:image/png;base64,' + this.attr('id'));
*/

var listDisplay = false;
var searchDisplay = false;
var markDisplay = false;
var profileDisplay = false;
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
  if(profileDisplay){
     profileClick();
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
function profileClick(){
  $('.profile').stop();
  if (profileDisplay){
    $('.profile').css('display','none');
    $('.profile').animate({'left':'105vw'},500);
  }
  else{
    displayCheck();
    $('.profile').animate({'left':'3.73vw'},500);
    $('.profile').css('display','block');
  }
  profileDisplay = !profileDisplay;

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
$('#profile-icon').click(function(){
  profileClick();
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
  $('.aboutdog-page').show();
  $('.home-page').hide();
})

$('#about-us').click(function(){
  $('.aboutus-page').show();
  $('.home-page').hide();
})

$('#adopt').click(function(){
  $('.Adopt-page').show();
  $('.home-page').hide();
})

$('#vote').click(function(){
  window.location.assign("https://luffy.ee.ncku.edu.tw/~hzaybr/uidd2020/aboutus_appv/aboutweb.html")  
})

$('#messenger-icon').click(function(){
  window.location.assign("https://www.facebook.com/ncku.vdogs")  
})

$('.profile-avatar').click(function() {
  window.location.assign('userprofile.html')
})
$('#observ').click(function(){
  $('#s2').fadeIn(0);
})

$('#manage').click(function(){
  $('#s2').fadeOut(0);
})





