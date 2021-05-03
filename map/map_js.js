var map;
var ownermarker;
var owner_uluru = {lat: 23, lng: 120.2};
var infowincontent = '<div style="width:200px">CONTENT <button onclick="route()">路徑</button><button onclick="camera()">拍照</button><button onclick="more()">更多</button></div>';
var Markers=[];
var count = -1;
var dog_name = ['豆皮','小小乖','跳跳','皮蛋','白米','麵線'];
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
    addMarker("./map/mark_icon/Group 189@3x.png",{lat: 22.997873, lng: 120.2155521})
    addMarker("./map/mark_icon/Group 189@3x.png",{lat: 22.997340, lng: 120.2175155})
    
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
  window.location.assign("https://luffy.ee.ncku.edu.tw/~hzaybr/uidd2020/dogprofile/mianxian.html")
}