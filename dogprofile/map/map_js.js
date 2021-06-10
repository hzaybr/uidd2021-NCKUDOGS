var map;
var directionsService;
var directionsDisplay;
var routemode = false;
var btnshow = false;
var current_lat = 22.996923587079912; 
var current_lng = 120.22256354362793;
var ownermarker;
var owner_uluru = {lat: current_lat, lng: current_lng};
var camera_marker;
var camera_uluru = {lat: current_lat, lng: current_lng};
var route_marker;
var route_uluru = {lat: current_lat, lng: current_lng};
var more_marker;
var more_uluru = {lat: current_lat, lng: current_lng};
var infowincontent = '<div style="width:30vw" id="infowindow">\
                      <p style="text-align:center; margin:0px;width : 30vw;">CONTENT</p>\
                      <img src="./map/love_icon/860757@3x.png" style="width : 5vw;" id = "1">\
                      <img src="./map/love_icon/860757@3x.png" style="width : 5vw;" id = "2">\
                      <img src="./map/love_icon/860757@3x.png" style="width : 5vw;" id = "3">\
                      <img src="./map/love_icon/860757@3x.png" style="width : 5vw;" id = "4">\
                      <img src="./map/love_icon/860757@3x.png" style="width : 5vw;" id = "5"></div>';
var Markers=[];
var Infowincontents=[];
var count = -1;
var target_num = 0;
var previous_num;
// var redir_url = location.href.match(/.html(\W|\w|\z)*&/)[0].slice(6).slice(0,-1);;
var dog_name = ['豆皮','小小乖','跳跳','皮蛋','白米','米香','麵線','呆呆','阿勇','小武','阿貴','奶茶','豆豆','仙草','黑熊','豆腐','北極熊','棕熊','拉拉'];
//var position_file="./map/position.json";
var position_file;
var currentInfoWindow = '';
const MAP_BOUNDS = {
  north: 22.95441,
  south: 22.99035,
  west: 120.21060,
  east: 120.22808,
};
var userimg;
function initMap() {
    var uluru = {lat: 23.0, lng: 120.21986287979763};
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru,
      restriction: {
        latLngBounds: MAP_BOUNDS,
        strictBounds: false,
      },
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false,
      mapId: '892f444c9eaa9e2'
    });
    //user mark
    userimg = document.createElement("img");
    userimg.id = "map-profile-avatar";
    userimg.src = PROFILE_PIC;
    ownermarker = new MarkerWithLabel({
      position: owner_uluru,
      map: map,
      icon: {
        url:'./map/mark_icon/dog_marker_good.png',
        scaledSize: new google.maps.Size(62, 77)
      },
      labelContent: userimg, 
      labelAnchor: new google.maps.Point(-25.5, -71.5),
      labelClass: "labels", 
      labelStyle: { opacity: 1.0 }
    });
    findposition(ownermarker);
    //dog's mark
   	$(document).ready(function() {
      $.get("/dog_position", function(json){
        position_file = JSON.parse(json);
        for(i=1;i<20;i++){
            count = i-1;
            var marker_path = './map/mark_icon/dog_marker_'+i+'.png';
            addMarker(marker_path,{lat: position_file[i].lat, lng: position_file[i].lng})
        } 
    	});
		});
    
}
function addMarker(icon_path,location) {
  //count = count + 1;
  var marker = new google.maps.Marker({
    draggable: false,
    animation: google.maps.Animation.DROP,
    position: location,
    title: ''+count,
    map: map,
    icon:{
      url:icon_path,
      scaledSize: new google.maps.Size(62, 77)
    },
    zIndex:1
    });
  marker.addListener('click', function() {
    dogMarker_click(marker);
  });
  Markers.push(marker);
}
function dogMarker_click(target_marker){
	lat=target_marker.getPosition().lat();
  lng=target_marker.getPosition().lng();
  uluru = {lat: lat, lng: lng};
  map.setCenter(uluru);
  map.setZoom(19);
  target_num = parseInt(target_marker.getTitle());
  displayCheck();
  clearMarkers(target_num);
  $('.dog_markerinfo').css('display','block');
	markerinfoShow = true;
  $('#dog_name').html(dog_name[target_num]);
  $('#dog_photo').attr("src",`./map/mark_icon_big/dog_marker_big_${target_num+1}.png`);
  $('.btn_navigation').attr('id',target_num);
  $('.btn_marked').attr('id',target_num);
  $('.btn_detail').attr('id',target_num);
}
function findposition(target_marker){
  navigator.geolocation.getCurrentPosition((position) =>{
    console.log(position.coords);
    current_lat=position.coords.latitude;
    current_lng=position.coords.longitude;
    uluru = {lat: current_lat, lng: current_lng};
    target_marker.setPosition(uluru);
    map.setCenter(uluru);
    map.setZoom(17);
  });
}
$( "#mark-icon" ).click(function() {
  if(markDisplay){
    
  }else{
		if(routemode){
			route();
		}
    findposition(ownermarker);
  }
  
});
$( "#sg1 img,#sg2 img" ).click(function() {
	var id_str = $(this).attr('id');
  var choose_num = parseInt(id_str.slice(3,id_str.length))-1;
	if(routemode){
		route();
  }
	dogMarker_click(Markers[choose_num]);
});

$( "#mg1 img" ).click(function() {
	var id_str = $(this).attr('id');
  var choose_num = parseInt(id_str.slice(4,id_str.length))-1;
  Markers[choose_num].setPosition(uluru);
  btnshow = false;
  dogMarker_click(Markers[choose_num]);
  markClick();
  //console.log(USER_ID);
  $.post('./update_position', {
    user_id: USER_ID,
    dog_id:  choose_num,
    lat: 		current_lat,
		lng:		current_lng
	}, () => {});
});

function route(){
  if(routemode){
		directionsDisplay.setDirections({routes: []});
		var choose_num = target_num;
		showMarkers(choose_num);
		lat=Markers[choose_num].getPosition().lat();
  	lng=Markers[choose_num].getPosition().lng();
  	uluru = {lat: lat, lng: lng};
  	map.setCenter(uluru);
		markerUnclick();
  }else{
    // add route funtion
    directionsDisplay.setMap(map);
    var choose_num = target_num;
		markerUnclick();
		clearMarkers(choose_num);
    var target_lat = Markers[choose_num].getPosition().lat();;
    var target_lng = Markers[choose_num].getPosition().lng();;
    var request = {
      origin: { lat: current_lat, lng: current_lng },
      destination: { lat: target_lat, lng: target_lng },
      travelMode: 'WALKING'
    };
    directionsService.route(request, function (result, status) {
      if (status == 'OK') {
          console.log(result.routes[0].legs[0].steps);
          directionsDisplay.setDirections(result);
      } else {
          console.log(status);
      }
    });
  }
  routemode = !routemode;
}

function setMapOnAll(target_number,map){
  for (var i = 0; i< Markers.length; i++) {
    if(i!=target_number){
      Markers[i].setMap(map);
    }
  }
}
function clearMarkers(target_number){
  setMapOnAll(target_number,null);
}
function showMarkers(target_number){
  setMapOnAll(target_number,map);
}
$( ".btn_navigation" ).click(function() {
	route();
});
$( ".btn_marked" ).click(function() {
  if(routemode){
		route();
  }
	findmarked(parseInt($(this).attr('id')));
});
$( ".btn_detail" ).click(function() {
  var dog_page_id = $(this).attr('id')
  /*
  console.log(dog_page_id)
  $.post('./dogpage',{
    dog_page_id: dog_page_id
    },() => {}
  );
  */
  localStorage.setItem("dog page id", dog_page_id);
  setTimeout(function() {
    window.location.assign("dog.html");
  }, 200);
});

//navigate from dogprofile page
let dogID = localStorage.getItem("dog page id")
$(document).ready(function() {
  setTimeout(function() {
    if (dogID<20) {
      target_num = parseInt(Markers[dogID].getTitle());
      route();
      localStorage.setItem("dog page id", 50);
      
     };

  }, 500)
});

