/*
$('.address_base64').attr('src','data:image/png;base64,' + this.attr('id'));
*/

var listDisplay = false;
var searchDisplay = false;
var markDisplay = false;
var profileDisplay = false;
var markmode = false;
var markerinfoShow = false;
var findmarkedDisplay = false;
var marked_data;
var marked_markers = [];

function displayCheck(){
  if(listDisplay){
    listClick();
  }
  if(searchDisplay){
    searchClick();
  }
  // if(markDisplay){
  //   if(!markmode){
  //     markClick();
  //   }
  // }
  if(profileDisplay){
     profileClick();
  }
  if(markmode){
    $('.mark_tip').animate({'top':'-100vh'},10);
    $('.mark').animate({'right': '4vw'},500);
    document.getElementById('m1').style.display="block";
    markmode = !markmode;
  }
  if(findmarkedDisplay){
    findmarked($('.btn_X').attr('id'));
  }
}

function listClick(){
	if(markerinfoShow){
    markerUnclick();
  }
  $('.list-grid').stop();
  if (listDisplay){
    $('.list-grid').animate({'left':'-77vw'},500);
  }
  else{
    displayCheck();
    $('.list-grid').animate({'left':'0'},500);
  }
  listDisplay = !listDisplay;
}
function profileClick(){
	if(markerinfoShow){
    markerUnclick();
  }
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
	if(markerinfoShow){
    markerUnclick();
  }
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
	if(markerinfoShow){
    markerUnclick();
  }
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

function markerUnclick(){
  if(!routemode){
    $('.dog_markerinfo').css('display','none');
    clearMarkers(-1);
    showMarkers(-1);
    map.setZoom(17);
    markerinfoShow = false;
    map.setOptions({draggable: true});
    console.log(`map`)
  }
  if(findmarkedDisplay){
    clearMarkers(-1);
  }
}

function findmarked(dogID){
  console.log(dogID);
  if(findmarkedDisplay){
    $('.dog_markedmode').css('display','none');
    $('.dog_markerinfo').css('display','block');
    ownermarker.setMap(map);
		for (var i = 0; i< marked_markers.length; i++) {
      marked_markers[i].setMap(null);
    }
    marked_markers = [];
		console.log(dogID);
		lat=Markers[dogID].getPosition().lat();
  	lng=Markers[dogID].getPosition().lng();
  	uluru = {lat: lat, lng: lng};
  	map.setCenter(uluru);
  	map.setZoom(19);
		markerinfoShow = true;
  }else{
    //displayCheck();
    $('.dog_markedmode').css('display','block');
    $('.markeddog_photo').attr("src",`./map/mark_icon_big/dog_marker_big_${dogID+1}.png`);
    $('.btn_X').attr('id',dogID);
    clearMarkers(-1);
    ownermarker.setMap(null);
		$.post("./marked_position", {
      dog_id: dogID
    }, (json) => {
      marked_data = JSON.parse(json);
      console.log(marked_data);
      for(i=1;i<=Object.keys(marked_data).length;i++){
        add_markedMarker({lat: parseFloat(marked_data[i].lat), lng: parseFloat(marked_data[i].lng)})
      }
    });
		
  }
  findmarkedDisplay = !findmarkedDisplay;
}
function add_markedMarker(location) {
  var marker = new google.maps.Marker({
    draggable: false,
    animation: google.maps.Animation.DROP,
    position: location,
    map: map,
    icon:{
      url:'./map/mark_icon_big/dog_marker_marked.png',
      scaledSize: new google.maps.Size(62, 77)
    },
    zIndex:9
    });
  marked_markers.push(marker);
}
$('#list-icon').click(function(){
  listClick();
})
$('#profile-icon').click(function(){
  if(login_status){
    profileClick();
  }
  else{
    $('.unlogin').fadeIn(500);
  }
})

$('.unlogin').click(function(){
  $('.unlogin').fadeOut(500);
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

$('.dog_markerinfo').click(function(){
  markerUnclick();
})

$('.btn_X').click(function(){
  findmarked($(this).attr('id'));
})

$('#mark-icon').click(function(){
  if(login_status){
    markClick();
  }
  else{
    $('.unlogin').fadeIn(500);
  }
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

$('#view-pg .profile-avatar').click(function() {
  window.location.assign('userprofile.html')
})

$('#edit-btn').click(function(){
  $('#view-pg').css('display','none')
  $('.profile').css({'height':'85vh','top':'3.44vh'})
  $('#edit-pg').css('display','block')
	document.getElementById('edit-name').value = $('.username').attr('id')
})
document.getElementById("edit-name").addEventListener("focusin", function (){
  var originHeight = $('.profile').css('height')
  $('.profile').css('height', `${originHeight}`)  
})

document.getElementById("edit-name").addEventListener("focusout", function (){
  $('.profile').css('height','85vh')  
})

function uploadAvatar(evt) {
  var tgt = evt.target || window.event.srcElement,
	files = tgt.files;
	console.log('onchage')
	// FileReader support
	if (FileReader && files && files.length) {
		var fr = new FileReader();
		fr.onload = function () {
    	$('#edit-pg .profile-avatar').attr('src', fr.result);
      console.log('change')
  		$('.avatar-choose').attr('id','')
	  	$('.avatar-choose').css('border','none')
		}
		fr.readAsDataURL(files[0]);
		}

	else {
    console.log("File Reader not support")  
  }
}

$('#save-btn,#cancel-btn').click(function(){
  $('.profile').css({height:'111.2vw',top:'21.6vw'})
  $('#view-pg').css('display','block')
  $('#edit-pg').css('display','none')
})

$('.avatar-choose').click(function(){
  $('.upload-pic input').val('')
	if ($(this).attr('id') == ''){
		$('.avatar-choose').attr('id','')
    $('.avatar-choose').css('border','none')
    $('#edit-pg .profile-avatar').attr('src', $(this).attr('src'))
		$(this).attr('id','chosen')
		$(this).css('border','5px solid #9441FF')
	}
  else{
    $('#edit-pg .profile-avatar').attr('src', PROFILE_PIC)
		$('.avatar-choose').attr('id','')
    $('.avatar-choose').css('border','none')
    console.log('clicked choosed')
	}
})




//save change 
$('#save-btn').click(function(){
  //change avatar
  var editedAvatarSrc =  $('#edit-pg .profile-avatar').attr('src') 
  $('#view-pg .profile-avatar').attr('src', editedAvatarSrc) 
  $('#map-profile-avatar').attr('src', editedAvatarSrc) 
  //change username
	let editName = document.getElementById('edit-name').value
	$('.username').attr('id',editName)
  $('.username').html(editName)
  
  //pass to db
	$.post('./update_user_profile', {
		id: 		USER_ID,
		name:		editName,
		profile:	editedAvatarSrc
  });
})

$('#cancel-btn').click(function(){
  $('#edit-pg .profile-avatar').attr('src', PROFILE_PIC)
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
/* load comments, photos, positions count */
var comments
var photos

function load_profile_num() {
  $.post('/load_profile_cmt', {
    userID: USER_ID
    }, (data) =>{
      let com_cnt = Object.keys(data).length
      $('#comment-count').html(com_cnt);
  })
  $.post('/load_profile_img', {
    userID: USER_ID
    }, (data) =>{
      let pic_cnt = Object.keys(data).length
      $('#upload-count').html(pic_cnt);
  })
  $.post('/load_profile_position', {
    userID: USER_ID
    }, (data) =>{
      let p_cnt = Object.keys(data).length
      $('#locate-count').html(p_cnt);
  })
}
