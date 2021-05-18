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
var position_file="./map/position.json"
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
    map.addListener('zoom_changed',()=>{
      if(map.getZoom()!=19&&currentInfoWindow != ''){
        dogMarker_click(Markers[target_num]);
      }
      console.log('zoom'+map.getZoom());
    });
    //user mark
    userimg = document.createElement("img");
    // userimg.src = "https://cdn2.vectorstock.com/i/1000x1000/98/11/girl-icon-flat-single-avatarpeaople-icon-from-vector-14449811.jpg";
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
    //dog's mark 
    $.get(position_file,function(json){
			for(i=1;i<20;i++){
     	var marker_path = './map/mark_icon/dog_marker_'+i+'.png';
       addMarker(marker_path,{lat: json[i].lat, lng: json[i].lng})
     }	 
    })
    findposition(ownermarker);
    route_marker = new google.maps.Marker({
      position: route_uluru,
      map: map,
      icon:{
        url:'./map/button_icon/dog_icon_route.png',
        scaledSize: new google.maps.Size(60, 60)
      },
      zIndex:3
    });
    camera_marker = new google.maps.Marker({
      position: camera_uluru,
      map: map,
      icon:{
        url:'./map/button_icon/dog_icon_camera.png',
        scaledSize: new google.maps.Size(60, 60)
      },
      zIndex:3
    });
    more_marker = new google.maps.Marker({
      position: more_uluru,
      map: map,
      icon:{
        url:'./map/button_icon/dog_icon_more.png',
        scaledSize: new google.maps.Size(60, 60)
      },
      zIndex:3
    });
    route_marker.addListener('click',function(){
      route();
    });
    camera_marker.addListener('click',function(){
      //add camera function
      camera();
    });
    more_marker.addListener('click',function(){
      var user_name = $('.username').attr('id')
      var address_base64 = $('.address_base64').attr('id')
      console.log(`map name: ${user_name}`);
      window.location.assign("mixiang.html");
    });
    route_marker.setVisible(false);
    camera_marker.setVisible(false);
    more_marker.setVisible(false);
    btnshow = false;
}
function addMarker(icon_path,location) {
  count = count + 1;
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
  //reset all markers' zindex
  for(i=0;i<=count;i++){
    Markers[i].setZIndex(1);
  }
  target_marker.setZIndex(3);
  //reset map
  if(currentInfoWindow != ''){
    currentInfoWindow.close();   
    currentInfoWindow = '';
    route_marker.setVisible(false);
    camera_marker.setVisible(false);
    more_marker.setVisible(false);
  }
  //show other markers
  if(btnshow&&parseInt(target_marker.getTitle())==target_num){
    btnshow = false;
    var old_icon = {
      url: './map/mark_icon/dog_marker_'+(target_num+1)+'.png',
      scaledSize: new google.maps.Size(62,77)
    }
    target_marker.setIcon(old_icon);
  }else{
    route_marker.setVisible(true);
    camera_marker.setVisible(true);
    more_marker.setVisible(true);
    route_uluru = {lat: target_marker.getPosition().lat()-0.00015, lng: target_marker.getPosition().lng()-0.00025};
    route_marker.setPosition(route_uluru);
    camera_uluru = {lat: target_marker.getPosition().lat()-0.0003, lng: target_marker.getPosition().lng()};
    camera_marker.setPosition(camera_uluru);
    more_uluru = {lat: target_marker.getPosition().lat()-0.00015, lng: target_marker.getPosition().lng()+0.00025};
    more_marker.setPosition(more_uluru);
    var old_icon = {
      url: './map/mark_icon/dog_marker_'+(target_num+1)+'.png',
      scaledSize: new google.maps.Size(62,77)
    }
    Markers[target_num].setIcon(old_icon);
    target_num = parseInt(target_marker.getTitle());
    var new_icon = {
      url: './map/mark_icon_big/dog_marker_big_'+(target_num+1)+'.png',
      scaledSize: new google.maps.Size(130,130)
    }
    target_marker.setIcon(new_icon);
    var target_infowincontent = infowincontent;
    var avg_score = parseInt(localStorage.getItem("avg_score"));
    if(avg_score==NaN){
      avg_score = 4;
    }
    if(avg_score>=0&&avg_score<=5){
      for(i=1;i<=avg_score;i++){
        target_infowincontent = target_infowincontent.replace(`<img src="./map/love_icon/860757@3x.png" style="width : 5vw;" id = "${i}">`,`<img src="./map/love_icon/860758@3x.png" style="width : 5vw;" id = "${i}">`);
      }
    }
    var infowindow = new google.maps.InfoWindow({
      content: target_infowincontent.replace('CONTENT',dog_name[target_num])
    });
    infowindow.open(map, target_marker);   
    currentInfoWindow = infowindow;
    lat=target_marker.getPosition().lat();
    lng=target_marker.getPosition().lng();
    uluru = {lat: lat, lng: lng};
    map.setCenter(uluru);
    map.setZoom(19);
    btnshow = true;
  }
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
    findposition(ownermarker);
  }
  
});
$( "#sg1 img,#sg2 img" ).click(function() {
  
  var id_str = $(this).attr('id');
  var choose_num = parseInt(id_str.slice(3,id_str.length))-1;
  lat=Markers[choose_num].getPosition().lat();
  lng=Markers[choose_num].getPosition().lng();
  uluru = {lat: lat, lng: lng};
  map.setCenter(uluru);
  map.setZoom(19);
  dogMarker_click(Markers[choose_num]);
});

$( "#mg1 img" ).click(function() {
  var id_str = $(this).attr('id');
  var choose_num = parseInt(id_str.slice(4,id_str.length))-1;
  uluru = {lat: current_lat, lng: current_lng};
  console.log(current_lat);
  console.log(current_lng);
  Markers[choose_num].setPosition(uluru);
  map.setCenter(uluru);
  map.setZoom(19);
  btnshow = false;
  dogMarker_click(Markers[choose_num]);
  markClick();
  $.post('./update_position', {
    dogID:  choose_num+1,
    lat: 		current_lat,
		lng:		current_lng
	}, () => {});
});

function route(){
  if(routemode){
    directionsDisplay.setDirections({routes: []});
		var choose_num = target_num;
		showMarkers(choose_num);
  }else{
    // add route funtion
    directionsDisplay.setMap(map);
    var choose_num = target_num;
    console.log(choose_num)
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
function camera(){
  $( "#camera_btn" ).click();
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


//navigate from dogprofile page
var navig = "./map/navig.json"
$(document).ready(function() {
  $.get(navig, function(json) {
    var dogID = json["dogID"];
    console.log(`navig dogID: ${dogID}`);
  if (dogID<20) {
    setTimeout(function() {
      target_num = parseInt(Markers[dogID].getTitle());
      route();
      dogMarker_click(Markers[target_num]);
     }, 300);

    $.post('./navig', {
      dogID: 50
      },(data) =>{
      });

   };
  });
 });
