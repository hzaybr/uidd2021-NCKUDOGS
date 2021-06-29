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
  if(document.getElementById('edit-pg').style.display != 'none'){
    $('.profile').css({height:'auto',top:'24.6vw'})
    $('#view-pg').css('display','block')
    $('#edit-pg').css('display','none')
  }
  $('.profile').stop();
  if (profileDisplay){
    $('.profile').animate({'left':'105vw'},500,function(){$('.profile').css('display','none');})
  }
  else{
    displayCheck();
    $('.profile').css('display','block');
    $('.profile').animate({'left':'5vw'},500);
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
		$('.btn_navigation').animate({'top':'32vw','left':'29vw'},500);
		$('.btn_marked').animate({'top':'32vw'},500);
		$('.btn_detail').animate({'top':'32vw','right':'29vw'},500);
    //$('.dog_markerinfo').css('display','none');
		$('.dog_markerinfo').fadeOut(500);
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
   // $('.dog_markedmode').css('display','none');
    $('.markeddog_photo').animate({'top':'55vw'},250);
		$('.dog_markedmode').fadeOut(500);
		
		//$('.markeddog_photo').animate({'top':'34vw'},500);
    ownermarker.setMap(map);
		for (var i = 0; i< marked_markers.length; i++) {
      marked_markers[i].setMap(null);
    }
    marked_markers = [];
		showMarkers(-1);
		/*console.log(dogID);
		lat=Markers[dogID].getPosition().lat();
  	lng=Markers[dogID].getPosition().lng();
  	uluru = {lat: lat, lng: lng};
  	map.setCenter(uluru);
  	map.setZoom(19);
    markerinfoShow = true;*/
  }else{
    //displayCheck();
    $('.dog_markedmode').fadeIn(100);
    $('.markeddog_photo').attr("src",`./map/mark_icon_big/dog_marker_big_${dogID+1}.png`);
    $('.markeddog_photo').animate({'top':'34vw'},50);
		$('.btn_X').attr('id',dogID);
    clearMarkers(-1);
    ownermarker.setMap(null);
		$.post("./marked_position", {
      dog_id: dogID
    }, (json) => {
      /*marked_data = JSON.parse(json);
      console.log(marked_data);
      for(i=1;i<=Object.keys(marked_data).length;i++){
        add_markedMarker({lat: parseFloat(marked_data[i].lat), lng: parseFloat(marked_data[i].lng)})
      }*/
			marked_data = JSON.parse(json);
      if(Object.keys(marked_data).length>0){
        for(i=1;i<=Object.keys(marked_data).length;i++){
          add_markedMarker({lat: parseFloat(marked_data[i].lat), lng: parseFloat(marked_data[i].lng)})
        }
        map.setCenter({lat: parseFloat(marked_data[1].lat)+0.001, lng: parseFloat(marked_data[1].lng)});
        map.setZoom(17);
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
      scaledSize: new google.maps.Size(40, 50)
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
  $('.dog_markerinfo').fadeIn(500);
	$('.btn_navigation').animate({'top':'57vw','left':'9vw'},500);
	$('.btn_marked').animate({'top':'65vw'},500);
	$('.btn_detail').animate({'top':'57vw','right':'9vw'},500);
  markerinfoShow = true;
	lat=Markers[$(this).attr('id')].getPosition().lat();
  lng=Markers[$(this).attr('id')].getPosition().lng();
  uluru = {lat: lat, lng: lng};
  map.setCenter(uluru);
  map.setZoom(19);
	clearMarkers(-1);
})

$('#mark-icon').click(function(){
  if(login_status){
    if(ispositionFind){
			markClick();
		}else{
			$('#markmode-blur').fadeIn(500);
		}
  }
  else{
    $('.unlogin').fadeIn(500);
  }
})
$('#markmode-confirm-btn').click(function(){
	$('#markmode-blur').fadeOut(500);
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
  window.location.assign("./aboutus_appv/aboutweb.html")  
})

$('#messenger-icon').click(function(){
  window.location.assign("https://www.facebook.com/ncku.vdogs")  
})

$('#view-pg .profile-avatar, .username').click(function() {
  window.location.assign('userprofile.html')
})

$('.uscore-container p, #user-title').click(function() {
  $('.title-container').fadeIn(300)
})
$('#title-cancel').click(function() {
  $('.title-container').hide()
})
$('#signout-btn').click(function(){
	$('#signout-blur').fadeIn(500);
})

$('#signout-cancel-btn').click(function(){
	$('#signout-blur').fadeOut(500);
})

$('#signout-confirm-btn').click(function(){
	signOut();
})

$('#edit-btn').click(function(){
  $('#view-pg').css('display','none')
  $('.profile').css({'height':'auto','top':'2.44vh'})
  $('#edit-pg').css('display','block')
	document.getElementById('edit-name').value = $('.username').attr('id')
})
document.getElementById("edit-name").addEventListener("focusin", function (){
  var originHeight = $('.profile').css('height')
  $('.profile').css('height', `${originHeight}`)  
})

document.getElementById("edit-name").addEventListener("focusout", function (){
  $('.profile').css('height','auto')  
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

$('#cancel-btn').click(function(){
  $('.profile').css({height:'auto',top:'24.6vw'})
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
    border_color = $('.profile-avatar').css('border-color')
		$(this).css('border',`5px solid ${border_color}`)
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
  //check if existing special character
	let editName = document.getElementById('edit-name').value
  let re = /[\~\!\@\#\$\%\^\&\*\(\)\_\+\?\>\<\"\:\}\{\\\/\[\]\'\;\.\,\=\-，？！。：；‧．、「「」《》（）｜｛｝…［］—¥⋯·‘£|·€～]/g
  let exist_special_char = re.test(editName)

  if(exist_special_char){
	  $('#checkedit-blur').fadeIn(500);
  }
  else{
    //change username
    $('.username').attr('id',editName)
    $('.username').html(editName)

    //change avatar
    var editedAvatarSrc =  $('#edit-pg .profile-avatar').attr('src') 
    $('#view-pg .profile-avatar').attr('src', editedAvatarSrc) 
    $('#map-profile-avatar').attr('src', editedAvatarSrc) 
    
    $('.profile').css({height:'auto',top:'24.6vw'})
    $('#view-pg').css('display','block')
    $('#edit-pg').css('display','none')

    //pass to db
    $.post('./update_user_profile', {
      id: 		USER_ID,
      name:		editName,
      profile:	editedAvatarSrc
    });
  }
})
$('#checkedit-btn').click(function() {
	$('#checkedit-blur').fadeOut(500);
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
/* load comments, photos, positions count, user title */
var comments
var photos
const user_scores = [10, 80, 200, 500, Infinity]
const user_titles = ["狗狗觀察員", "狗狗好鄰居", "狗狗好朋友", "狗狗摯友"]
const bgcolor = ["#bc6d3f", "#a6a6a6", "#ffbc00", "#9441FF"]

function load_profile_num() {
  const p1 = new Promise(function(resolve, reject){
    $.post('/load_profile_cmt', {
      userID: USER_ID
      }, (data) =>{
        let cmt = Object.keys(data).length
        $('#comment-count').html(cmt);
        resolve(cmt)
    })
  })
  const p2 = new Promise(function(resolve, reject){
    $.post('/load_profile_img', {
      userID: USER_ID
      }, (data) =>{
        let img = Object.keys(data).length
        $('#upload-count').html(img);
        likes = 0
        for(var i=0; i<img; i++){
          likes += data[i].likes
          console.log(data[i].likes)
        }
        resolve(5*img+likes)
    })
  })
  const p3 = new Promise(function(resolve, reject){
    $.post('/load_profile_position', {
      userID: USER_ID
      }, (data) =>{
        let lct = Object.keys(data).length
        $('#locate-count').html(lct);
        resolve(lct)
      })
  })
  Promise.all([p1, p2, p3]).then(value =>{
    console.log(value)
    var user_title = ""
    let user_score = value[0] + value[1] + 8*value[2]
    console.log(user_score)
		$("#user-score").html(user_score)
    for(i=0; i<4; i++){
      if(user_score >= user_scores[i]){
        user_title = user_titles[i]
        $(".profile-avatar").css("border-color", bgcolor[i])
        $(".profile-container").css("border",bgcolor[i])
        $("#edit-btn").attr('src',`./image/editpen/${i+2}.svg`)
        $("#user-title").html(`<img width=100% src="image/usertitle/${i}.svg">`)

      }else{
        break
      }
    }
    //save title to db
    console.log(user_title)
    $.post('/save_title', {
      user_title: user_title,
      userID: USER_ID
      }, ()=>{}
    )
  })

}
