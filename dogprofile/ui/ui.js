/*
$('.address_base64').attr('src','data:image/png;base64,' + this.attr('id'));
*/

var listDisplay = false;
var searchDisplay = false;
var markDisplay = false;
var profileDisplay = false;
var markmode = false;
var markerinfoShow = false;

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
  if(markerinfoShow){
    markerClick();
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
    $('.profile').animate({'left':'105vw'},500,function(){$('.profile').css('display','none');})
  }
  else{
    displayCheck();
    $('.profile').css('display','block');
    $('.profile').animate({'left':'3.73vw'},500);
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

function markerClick(){
  $('.dog_markerinfo').stop();
  if (markerinfoShow){
    $('.dog_markerinfo').css('display','none');
		map.setOptions({draggable: true});
    showMarkers();
		map.setZoom(17);
  }
  else{
    displayCheck();
    $('.dog_markerinfo').css('display','block');
  }
  markerinfoShow = !markerinfoShow;
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

$('#edit-btn').click(function(){
  $('#view-pg').css('display','none')
  $('#edit-pg').css('display','block')
	document.getElementById('edit-name').value = $('.username').attr('id')
})

$('#edit-pg button').click(function(){
  $('#view-pg').css('display','block')
  $('#edit-pg').css('display','none')
})

$('.avatar-choose').click(function(){
	if ($(this).attr('id') == ''){
		$('.avatar-choose').attr('id','')
		$('.avatar-choose').css('border','none')
		$(this).attr('id','chosen')
		$(this).css('border','3px solid lightblue')
	}
	else{
		$('.avatar-choose').attr('id','')
		$('.avatar-choose').css('border','none')	
	}
})

/***********************************************************/
//save change 

$('#save-btn').click(function(){
  //change avatar
  /*
  if (document.getElementById('chosen')!= null){
		let chosenAvatarSrc = $('#chosen').attr('src')
		let avatars = document.getElementsByClassName('profile-avatar');
		for (let i = 0; i < avatars.length; ++i) {
  		avatars[i].src = chosenAvatarSrc;
		}
  }
  */
  if (document.getElementById('chosen')!= null){
    let PROFILE_PIC = $('#chosen').attr('src')
  }

	//change username
	let USER_NAME = document.getElementById('edit-name').value
	console.log('editName',editName)
	$('.username').attr('id',editName)
  $('.username').html(editName)
  
	$.post('./update_users', {
		id: 		USER_ID,
		name:		USER_NAME,
		profile:	PROFILE_PIC,
		score:		""
	}, () => {});

})
/**************************************************************/

$('#cancel-btn').click(function(){
	$('.avatar-choose').attr('id','')
	$('.avatar-choose').css('border','none')
})

$('#observ').click(function(){
  $('#s2').fadeIn(0);
})

$('#manage').click(function(){
  $('#s2').fadeOut(0);
})

/**********************************************************/
const usrfile = "./data/users.json"
var comments
var photos

//$(document).ready(function() {
  $.get(usrfile, function(usr_json){
    comments =  usr_json[USER_ID]["comments"];
    photos =  usr_json[USER_ID]["photos"];
    var com_cnt = Object.keys(comments).length
    var pic_cnt = Object.keys(photos).length
    console.log(`com: ${com_cnt}, pic: ${pic_cnt}`);

    $('#comment-count').html(com_cnt);
    $('#upload-count').html(pic_cnt);
  })

//});
