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
    $('.list-grid').animate({'left':'-61vw'},500);
  }
  else{
    displayCheck();
    $('.list-grid').animate({'left':'1vw'},500);
  }
  listDisplay = !listDisplay;
}

function searchClick(){
  $('#search-icon').stop();
  $('.search').stop();
  if (searchDisplay){
    $('#search-icon').animate({'left':'1vw','width':'10vw'},500);
    $('.search').animate({'left':'-100vw'},500);
  }
  else{
    displayCheck();
	  $('#search-icon').animate({'left':'42vw','width':'16vw'},500);
    $('.search').animate({'left':'0vw'},500);
  }
  searchDisplay = !searchDisplay;
}


$('#list-icon').click(function(){
    listClick();
  }
)
$('#search-icon').click(function(){
    searchClick();
  }
)

$('#map').click(function(){
    displayCheck();
  }
)
