var map;
var ownermarker;
var owner_uluru = {lat: 23, lng: 120.2};
var infowincontent = '<div style="width:200px">CONTENT <button onclick="route()">路徑</button><button onclick="camera()">拍照</button><button onclick="more()">更多</button></div>';
var Markers=[];
var count = -1;
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
    // var infowincontent = '<div style="width:200px">CONTENT</div>';
    //user mark
    ownermarker = new google.maps.Marker({
      position: owner_uluru,
      map: map
      
    });
    //dog's mark 
    for(i=1;i<20;i++){
      addMarker("./map/mark_icon/Group 189@3x.png",{lat: position[i].lat, lng: position[i].lng})
    }
    
    // addMarker("./map/mark_icon/Group 189@3x.png",{lat: 22.997340, lng: 120.2175155})
    
}
function addMarker(icon_path,location) {
  count = count + 1;
  var marker = new google.maps.Marker({
    draggable: false,
    animation: google.maps.Animation.DROP,
    position: location,
    map: map,
    icon:{
      url:icon_path,
      scaledSize: new google.maps.Size(53, 73)
    } 
    });
  var infowindow = new google.maps.InfoWindow({
    content: infowincontent.replace('CONTENT',
      dog_name[count]
    )
  });
  marker.addListener('click', function() {
    // currentInfoWindow.close();
    if(currentInfoWindow != '')   
    {    
      currentInfoWindow.close();   
      currentInfoWindow = '';   
    }   
    infowindow.open(map, marker);   
    currentInfoWindow = infowindow; 
  });
  Markers.push(marker);
}
function findposition(target_marker){
  navigator.geolocation.getCurrentPosition((position) =>{
    console.log(position.coords);
    lat=position.coords.latitude;
    lng=position.coords.longitude;
    uluru = {lat: lat, lng: lng};
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
$( "#dog1" ).click(function() {
  lat=Markers[0].getPosition().lat();
  lng=Markers[0].getPosition().lng();
  uluru = {lat: lat, lng: lng};
  map.setCenter(uluru);
  map.setZoom(17);
});
$( "#dog2" ).click(function() {
  lat=Markers[1].getPosition().lat();
  lng=Markers[1].getPosition().lng();
  uluru = {lat: lat, lng: lng};
  map.setCenter(uluru);
  map.setZoom(17);
});
function route(){
  // add route funtion
}
function camera(){
  // add camera function
}
function more(){
  window.location.assign("../dogprofile/mixiang.html")
}
