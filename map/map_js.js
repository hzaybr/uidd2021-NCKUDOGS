var map;
var ownermarker;
var owner_uluru = {lat: 23, lng: 120.2};
// var Markers=[];
function initMap() {
    var uluru = {lat: 23.0, lng: 120.21986287979763};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false
    });
    map.addListener('click', function(event){
        addMarker(event.latLng);
    });
    // var infowincontent = '<div style="width:200px">CONTENT</div>';
    ownermarker = new google.maps.Marker({
      position: owner_uluru,
      map: map
    });
    // var infowindow0 = new google.maps.InfoWindow({
    //   content: infowincontent.replace('CONTENT',
    //     'library'
    //   )
    // });
    // marker_old.addListener('click', function() {
    //     infowindow0.open(map, marker_old);
    // });
    
}
function addMarker(location) {
    marker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: location,
    map: map
    });
}
function findposition(target_marker){
  navigator.geolocation.getCurrentPosition((position) =>{
    console.log(position.coords);
    lat=position.coords.latitude;
    lng=position.coords.longitude;
    uluru = {lat: lat, lng: lng};
    target_marker.setPosition(uluru);
    map.setCenter(uluru);
    map.setZoom(18);
  });
}
$( "#mark-icon" ).click(function() {
  // var pick=$(this).attr('id');
  // console.log($(this).attr('id'));
  findposition(ownermarker);
});