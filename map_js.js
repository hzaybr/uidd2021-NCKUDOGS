function initMap() {
    var uluru = {lat: 23.0, lng: 120.21986287979763};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: uluru
    });
    var infowincontent = '<div style="width:200px">CONTENT</div>';
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
    var infowindow0 = new google.maps.InfoWindow({
      content: infowincontent.replace('CONTENT',
        'library'
      )
    });
    marker.addListener('click', function() {
        infowindow0.open(map, marker);
    });
}
// function initMap() {
//     var mapOpts = {
//         center: {lat: 23.0, lng: 120.21},
//         zoom: 20,
//         mapTypeId: google.maps.MapTypeId.TERRAIN,
//         styles: 
//         [
//           {
//             "featureType": "road.local",
//             "stylers": [
//               {
//                 "weight": 4.5
//               }
//             ]
//           }
//         ]
//     };
    
//     var map = new google.maps.Map(document.getElementById('map'), mapOpts);
    
//     // var bicyclayer = new google.maps.BicyclingLayer();
//     // bicyclayer.setMap(map);
    
//     // var infowincontent = '<div style="width:200px">CONTENT</div>';
    
//     // Highway 80 Overpass marker
//     // var marker0 = new google.maps.Marker({
//     //     position: {lat: 32.344902, lng: -90.352267},
//     //     map: map,
//     //     title: 'Old Highway 80 Overpass',
//     //     animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow0 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT',
//     //     'Be careful of traffic on 80. Visibility is poor around the bends, but there are good shoulders further on. Clinton has gas stations, restaurants, and hotels. Loads of people commute on the Trace from Clinton to Ridgeland, so don\'t bike this during rush hour.'
//     //   )
//     // });
    
//     // marker0.addListener('click', function() {
//     //   infowindow0.open(map, marker0);
//     // });
    
//     // // Clinton Pullout Marker
//     // var marker1 = new google.maps.Marker({
//     //   position: {lat: 32.334517, lng: -90.357348},
//     //   map: map,
//     //   title: 'Clinton Pullout',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow1 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT',
//     //     'There is a parking pullout here with a trash bin.'
//     //   )
//     // });
    
//     // marker1.addListener('click', function() {
//     //   infowindow1.open(map, marker1);
//     // });
    
//     // // Airplane Road Marker 
//     // var marker2 = new google.maps.Marker({
//     //   position: {lat: 32.289223, lng: -90.430624},
//     //   map: map,
//     //   title: 'Airplane Road',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow2 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT',
//     //     'Airport Road is probably the best way to get to Raymond from the Trace in that it has less traffic than the alternatives. Raymond lacks hotels, but it has gas stations and restaurants.')
//     // });
    
//     // marker2.addListener('click', function() {
//     //   infowindow2.open(map, marker2);
//     // });
    
//     // // Battle of Raymond Marker
//     // var marker3 = new google.maps.Marker({
//     //   position: {lat: 32.277619, lng: -90.475709},
//     //   map: map,
//     //   title: 'Battle of Raymond',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow3 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT','The Battle of Raymond has a picnic table under a pretty tree.')
//     // });
    
//     // marker3.addListener('click', function() {
//     //   infowindow3.open(map, marker3);
//     // });
    
//     // // Bed and Breakfast Marker
//     // var marker4 = new google.maps.Marker({
//     //   position: {lat: 32.259441, lng: -90.504122},
//     //   map: map,
//     //   title: 'Mamie\'s Cottage',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow4 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT','You can walk 150 yards from the Parkway to <a href="https://www.natcheztracetravel.com/raymond-bedandbreakfasts/mamies-cottage/558-comments.html">Mamie\'s Cottage Bed and Breakfast</a> 601.955.5777')
//     // });
    
//     // marker4.addListener('click', function() {
//     //   infowindow4.open(map, marker4);
//     // });
    
//     // // Dean Stand Marker
//     // var marker5 = new google.maps.Marker({
//     //   position: {lat: 32.236025, lng: -90.543005},
//     //   map: map,
//     //   title: 'Dean Stand ',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow5 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT','Dean Stand has trash bins, a picnic table, and a little creek.')
//     // });
    
//     // marker5.addListener('click', function() {
//     //   infowindow5.open(map, marker5);
//     // });
    
//     // // Learned 
//     // var marker6 = new google.maps.Marker({
//     //   position: {lat: 32.221740, lng: -90.561419},
//     //   map: map,
//     //   title: 'Old Port Gibson Overpass',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow6 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT','Learned is close to the Trace and the roads around it have relatively little traffic. <a href="https://www.yelp.com/biz/h-d-gibbes-and-sons-learned">H D Gibbes & Sons</a> is an old country general store in Learned that sells snacks, water, steak, and whiskey, but they only take cash.')
//     // });
    
//     // marker6.addListener('click', function() {
//     //   infowindow6.open(map, marker6);
//     // });
    
//     // // Highway 27
//     // var marker7 = new google.maps.Marker({
//     //   position: {lat: 32.182592, lng: -90.639203},
//     //   map: map,
//     //   title: 'Highway 27',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow7 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT','27 has no shoulders, lots of traffic, and poor visibility - not good for bicycles.')
//     // });
    
//     // marker7.addListener('click', function() {
//     //   infowindow7.open(map, marker7);
//     // });
     
//     // // Lower Choctaw Boundary
//     // var marker8 = new google.maps.Marker({
//     //   position: {lat: 32.147850, lng: -90.724840},
//     //   map: map,
//     //   title: 'Lower Choctaw Boundary',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow8 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT',
//     //     'There is a pullout with a sign here that says something about Choctaw Indians. People sometimes stop and read the sign. ...moving right along.'
//     //   )
//     // });
    
//     // marker8.addListener('click', function() {
//     //   infowindow8.open(map, marker8);
//     // });
    
//     // // Big Sand Creek Trail Marker
//     // var marker9 = new google.maps.Marker({
//     //   position: {lat: 32.129957, lng: -90.745468},
//     //   map: map,
//     //   title: 'Big Sand Creek Trail',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow9 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT',
//     //     'Here is a short walking trail ending at Big Sand Creek, a very peaceful place to stretch your legs and have a snack.'
//     //   )
//     // });
    
//     // marker9.addListener('click', function() {
//     //   infowindow9.open(map, marker9);
//     // });
    
//     // // Rocky Springs Marker
//     // var marker10 = new google.maps.Marker({
//     //   position: {lat: 32.086399, lng: -90.798741},
//     //   map: map,
//     //   title: 'Rocky Springs',
//     //   animation: google.maps.Animation.DROP
//     // });
    
//     // var infowindow10 = new google.maps.InfoWindow({
//     //   content: infowincontent.replace('CONTENT',
//     //     'Rocky Springs has running water, toilets, and hiking trails. It is quite popular with RV campers, tent campers, and day hikers.'
//     //   )
//     // });
    
//     // marker10.addListener('click', function() {
//     //   infowindow10.open(map, marker10);
//     // });
//   }