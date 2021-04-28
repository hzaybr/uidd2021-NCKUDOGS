var map;
var ownermarker;
var owner_uluru = {lat: 23, lng: 120.2};
var infowincontent = '<div style="width:200px">CONTENT</div>';
var Markers=[];
var count = -1;
var dog_name = ['豆皮','小小乖','跳跳','皮蛋','白米','麵線'];
function initMap() {
    var uluru = {lat: 23.0, lng: 120.21986287979763};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru,
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
    addMarker("./aboutus_appv/image/Group 327@3x.png",{lat: 22.997873, lng: 120.2155521})
    addMarker("./aboutus_appv/image/Group 326@3x.png",{lat: 22.997340, lng: 120.2175155})
    // var infowindow0 = new google.maps.InfoWindow({
    //   content: infowincontent.replace('CONTENT',
    //     'library'
    //   )
    // });
    // marker_old.addListener('click', function() {
    //     infowindow0.open(map, marker_old);
    // });
    
}
function addMarker(icon_path,location) {
  count = count + 1;
  var marker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: location,
    map: map,
    icon:{
      url:icon_path,
      scaledSize: new google.maps.Size(80, 80)
    } 
    });
  var infowindow = new google.maps.InfoWindow({
    content: infowincontent.replace('CONTENT',
      dog_name[count]
    )
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
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
  findposition(ownermarker);
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