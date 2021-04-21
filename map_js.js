var map;
var marker;
// var Markers=[];
function initMap() {
    var uluru = {lat: 23.0, lng: 120.21986287979763};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru
      
    });
    map.addListener('click', function(event){
        addMarker(event.latLng);
    });
    var infowincontent = '<div style="width:200px">CONTENT</div>';
    var marker_old = new google.maps.Marker({
      position: uluru,
      map: map
    });
    var infowindow0 = new google.maps.InfoWindow({
      content: infowincontent.replace('CONTENT',
        'library'
      )
    });
    marker_old.addListener('click', function() {
        infowindow0.open(map, marker_old);
    });
    
}
function addMarker(location) {
    marker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: location,
    map: map
    });
}
