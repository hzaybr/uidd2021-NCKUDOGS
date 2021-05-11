var map;
var directionsService;
var directionsDisplay;
var routemode = false;
var btnshow = false;
var current_lat = 23;
var current_lng = 120.2;
var ownermarker;
var owner_uluru = {lat: current_lat, lng: current_lng};
var camera_marker;
var camera_uluru = {lat: current_lat, lng: current_lng};
var route_marker;
var route_uluru = {lat: current_lat, lng: current_lng};
var more_marker;
var more_uluru = {lat: current_lat, lng: current_lng};
// var infowincontent = '<div style="width:200px" id="infowindow">CONTENT <button onclick="route(this.id)" id="route_btn">路徑</button><button onclick="camera()" id="camera_btn">拍照</button><button onclick="more()" id="more_btn">更多</button></div>';
var infowincontent = '<div style="width:30vw" id="infowindow"><p style="text-align:center; margin:0px;width : 30vw;">CONTENT</p><img src="./map/love_icon/Group 420@3x.png" style="width : 30vw;"></div>';
var Markers=[];
var Infowincontents=[];
var count = -1;
var target_num;
var redir_url = location.href.match(/.html(\W|\w|\z)*&/)[0].slice(6).slice(0,-1);;
var dog_name = ['豆皮','小小乖','跳跳','皮蛋','白米','米香','麵線','呆呆','阿勇','小武','阿貴','奶茶','豆豆','仙草','黑熊','豆腐','北極熊','棕熊','拉拉'];
var position = {
  "1":{
    "lat":22.997873,
    "lng":120.2155521
  },
  "2":{
    "lat":22.997340,
    "lng":120.2175155
  },
  "3":{
    "lat":23.0011589,
    "lng":120.2164173
  },
  "4":{
    "lat":22.9995377,
    "lng":120.2182113
  },
  "5":{
    "lat":22.994086,
    "lng":120.219479
  },
  "6":{
    "lat":22.996243,
    "lng":120.222444
  },
  "7":{
    "lat":22.996789,
    "lng":120.222536
  },
  "8":{
    "lat":22.996482,
    "lng":120.222846
  },
  "9":{
    "lat":23.000051,
    "lng":120.220173
  },
  "10":{
    "lat":22.999999,
    "lng":120.219700
  },
  "11":{
    "lat":22.999479,
    "lng":120.220138
  },
  "12":{
    "lat":22.998903,
    "lng":120.217897
  },
  "13":{
    "lat":22.999694,
    "lng":120.223491
  },
  "14":{
    "lat":22.994540,
    "lng":120.219915
  },
  "15":{
    "lat":23.000149,
    "lng":120.222751
  },
  "16":{
    "lat":22.997400,
    "lng":120.219653
  },
  "17":{
    "lat":23.000601,
    "lng":120.220002
  },
  "18":{
    "lat":22.999582,
    "lng":120.220224
  },
  "19":{
    "lat":22.999265,
    "lng":120.219805
  }
}
var currentInfoWindow = '';
const MAP_BOUNDS = {
  north: 22.95441,
  south: 22.99035,
  west: 120.21060,
  east: 120.22808,
};
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
    map.addListener('click', function(event){
        addMarker(event.latLng);
    });
    //user mark
    ownermarker = new google.maps.Marker({
      position: owner_uluru,
      map: map
      
    });
    //dog's mark 
    for(i=1;i<20;i++){
      var marker_path = './map/mark_icon/dog_marker_'+i+'.png';
      addMarker(marker_path,{lat: position[i].lat, lng: position[i].lng})
    }
    findposition(ownermarker);
    route_marker = new google.maps.Marker({
      position: route_uluru,
      map: map,
      icon:{
        url:'./map/button_icon/dog_icon_route.png',
        scaledSize: new google.maps.Size(38, 38)
      },
      zIndex:3
    });
    camera_marker = new google.maps.Marker({
      position: camera_uluru,
      map: map,
      icon:{
        url:'./map/button_icon/dog_icon_camera.png',
        scaledSize: new google.maps.Size(38, 38)
      },
      zIndex:3
    });
    more_marker = new google.maps.Marker({
      position: more_uluru,
      map: map,
      icon:{
        url:'./map/button_icon/dog_icon_more.png',
        scaledSize: new google.maps.Size(38, 38)
      },
      zIndex:3
    });
    route_marker.addListener('click',function(){
      if(routemode){
        directionsDisplay.setDirections({routes: []});
      }else{
        // add route funtion
        directionsDisplay.setMap(map);
        var choose_num = target_num;
        console.log(choose_num)
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
    });
    camera_marker.addListener('click',function(){
      //add camera function
    });
    more_marker.addListener('click',function(){
      var user_name = $('.username').attr('id')
      var address_base64 = $('.address_base64').attr('id')
      console.log(`map name: ${user_name}`);
      window.location.assign(`http://luffy.ee.ncku.edu.tw:15038/mixiang.html?${redir_url}`);
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
  // var new_infowincontent = infowincontent.replace('id="infowindow"','id="'+count+'"');
  // new_infowincontent = new_infowincontent.replace('id="route_btn"','id="'+'route_'+count+'"');
  // new_infowincontent = new_infowincontent.replace('id="camera_btn"','id="'+'camera_'+count+'"');
  // new_infowincontent = new_infowincontent.replace('id="more_btn"','id="'+'more_'+count+'"');
  // console.log(infowincontent)
  var infowindow = new google.maps.InfoWindow({
    content: infowincontent.replace('CONTENT',dog_name[count])
  });
  
  marker.addListener('click', function() {
    for(i=0;i<=count;i++){
      Markers[i].setZIndex(1);
    }
    marker.setZIndex(3);
    if(currentInfoWindow != ''){
      currentInfoWindow.close();   
      currentInfoWindow = '';
      route_marker.setVisible(false);
      camera_marker.setVisible(false);
      more_marker.setVisible(false);
    }
    if(btnshow&&parseInt(marker.getTitle())==target_num){
      btnshow = false;
    }else{
      route_marker.setVisible(true);
      camera_marker.setVisible(true);
      more_marker.setVisible(true);
      route_uluru = {lat: marker.getPosition().lat()-0.0002, lng: marker.getPosition().lng()-0.0007};
      route_marker.setPosition(route_uluru);
      camera_uluru = {lat: marker.getPosition().lat()-0.0005, lng: marker.getPosition().lng()};
      camera_marker.setPosition(camera_uluru);
      more_uluru = {lat: marker.getPosition().lat()-0.0002, lng: marker.getPosition().lng()+0.0007};
      more_marker.setPosition(more_uluru);
      target_num = parseInt(marker.getTitle());
      console.log(target_num)
      infowindow.open(map, marker);   
      currentInfoWindow = infowindow;
      btnshow = true;
    }
  });
  Markers.push(marker);
  Infowincontents.push(infowindow);
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
  // console.log(choose_num)
  lat=Markers[choose_num].getPosition().lat();
  lng=Markers[choose_num].getPosition().lng();
  uluru = {lat: lat, lng: lng};
  map.setCenter(uluru);
  map.setZoom(17);
  var infowindow = Infowincontents[choose_num];
  for(i=0;i<=count;i++){
    Markers[i].setZIndex(1);
  }
  Markers[choose_num].setZIndex(3);
  route_marker.setVisible(true);
  camera_marker.setVisible(true);
  more_marker.setVisible(true);
  route_uluru = {lat: Markers[choose_num].getPosition().lat()-0.0002, lng: Markers[choose_num].getPosition().lng()-0.0007};
  route_marker.setPosition(route_uluru);
  camera_uluru = {lat: Markers[choose_num].getPosition().lat()-0.0005, lng: Markers[choose_num].getPosition().lng()};
  camera_marker.setPosition(camera_uluru);
  more_uluru = {lat: Markers[choose_num].getPosition().lat()-0.0002, lng: Markers[choose_num].getPosition().lng()+0.0007};
  more_marker.setPosition(more_uluru);
  target_num = parseInt(Markers[choose_num].getTitle());
  if(currentInfoWindow != '')   
  {    
    currentInfoWindow.close();   
    currentInfoWindow = '';   
  }   
  infowindow.open(map, Markers[choose_num]);   
  currentInfoWindow = infowindow;
  btnshow = true;
});

$( "#mg1 img" ).click(function() {
  var id_str = $(this).attr('id');
  var choose_num = parseInt(id_str.slice(4,id_str.length))-1;
  uluru = {lat: current_lat, lng: current_lng};
  console.log(current_lat);
  console.log(current_lng);
  Markers[choose_num].setPosition(uluru);
  map.setCenter(uluru);
  map.setZoom(17);
  var infowindow = Infowincontents[choose_num];
  if(currentInfoWindow != '')   
  {    
      currentInfoWindow.close();   
      currentInfoWindow = '';   
  }   
  infowindow.open(map, Markers[choose_num]);   
  currentInfoWindow = infowindow;
  markClick();
});

// $('#map').click(function(){
//   if(currentInfoWindow != ''){
//     currentInfoWindow.close();   
//     currentInfoWindow = '';
//     route_marker.setVisible(false);
//     camera_marker.setVisible(false);
//     more_marker.setVisible(false);
//   }
// })
function route(){
  if(routemode){
    directionsDisplay.setDirections({routes: []});
  }else{
    // add route funtion
    directionsDisplay.setMap(map);
    var choose_num = target_num;
    console.log(choose_num)
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
  // if(routemode){
  //   directionsDisplay.setDirections({routes: []});
  // }else{
  //   // add route funtion
  //   directionsDisplay.setMap(map);
  //   var choose_num = parseInt(id_str.slice(6,id_str.length));
  //   console.log(choose_num)
  //   var target_lat = Markers[choose_num].getPosition().lat();;
  //   var target_lng = Markers[choose_num].getPosition().lng();;
  //   var request = {
  //     origin: { lat: current_lat, lng: current_lng },
  //     destination: { lat: target_lat, lng: target_lng },
  //     travelMode: 'WALKING'
  //   };
  //   directionsService.route(request, function (result, status) {
  //     if (status == 'OK') {
  //         console.log(result.routes[0].legs[0].steps);
  //         directionsDisplay.setDirections(result);
  //     } else {
  //         console.log(status);
  //     }
  //   });
  // }
  // routemode = !routemode;
}
// function camera(){
//   // add camera function
// }

// function more(){
//   var user_name = $('.username').attr('id')
//   var address_base64 = $('.address_base64').attr('id')
//   console.log(`map name: ${user_name}`);
//   window.location.assign(`./dogprofile/mixiang.html?user=${user_name}&pic=${address_base64}`);
// }

var user_name
var address_base64
var now_address

$('.navig').click(function() {
  var dog_page_route = `route_${$(this).attr('id')}`;
  window.location.assign("https://hzaybr.github.io/uidd2020/index.html?"+redir_url+"&navig="+dog_page_route);
});

$('.XXicon').click(function() {
  window.location.assign("https://hzaybr.github.io/uidd2020/index.html?"+redir_url);
});

//navigate from dogprofile page
$(document).ready(function() {
  user_name = $('.username').attr('id')
  address_base64 = $('.address_base64').attr('id')
  now_address = location.href
  //find if navig is in address or not
  var navig = now_address.search(/navig/)
  console.log(navig);
  if (navig!=-1){
    setTimeout(function() {
      var route_id = now_address.match(/route_([1-9])/)[0].slice(6);
      console.log(route_id);
      target_num = parseInt(Markers[route_id].getTitle());
      route();
      Markers[target_num].click();
      // route(route_id);
     }, 300);

   };
 });
