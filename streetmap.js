var map;
var userPoly;
var path = [];
var gridCoord = [];
var streets = [];
var testLat = [];
var testLing = [];
var mem = {};
var seCorner;
var neCorner;
var swCorner;
var nwCorner;
var streetName;
var directionsDisplay;
var directionsService;
var public_spreadsheet_url = '0AhFZfsMCVP7rdGJOVm04LWRsanlIS1ZST3FpcllIdHc';


//extending our big A Array to provide easy min/max methods
Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.78370618798191,-122.408766746521),
    zoom: 14,
    styles: [{
      featureType: 'poi',
      elementType: 'labels',
      stylers: [ { visibility: 'off' } ]
    }]

  };

  directionsService = new google.maps.DirectionsService();

  directionsDisplay = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  Tabletop.init( { key: public_spreadsheet_url, callback: showInfo} );
}


google.maps.event.addDomListener(window, 'load', initialize);
  // <script type='text/javascript' src='http://spreadsheets.google.com/feeds/list/0AhFZfsMCVP7rdGJOVm04LWRsanlIS1ZST3FpcllIdHc/5/public/basic?alt=json-in-script&callback=myFunc'></script>


function showInfo(data, tabletop) {
  console.log('fuck you kill all cops');
  window.theData = data;

  window.entries = data['DeliveryData']['elements'];
  window.alexJobs = [];
  for (var i =0; i<entries.length; i++){
    // new google.maps.Marker({
    //   position: new google.maps.LatLng(window.entries[i].picklat,window.entries[i].picklng),
    //   title: 'pickup',
    //   map: map
    // });

    // new google.maps.Marker({
    //   position: new google.maps.LatLng(window.entries[i].dellat,window.entries[i].dellng),
    //   title: 'delivery',
    //   icon: goldStar,
    //   map: map

    if (window.entries[i].courier === 'Alex'){
      window.alexJobs.push(window.entries[i]);
    }
    //});
  }
  window.alexJobs = window.alexJobs.sort(function(a, b){
    if (Date.parse(a.completed) > Date.parse(b.completed)) {
      return 1;
    } else if (Date.parse(a.completed) < Date.parse(b.completed)) {
      return -1;
    } else {
      return 0;
    }
  });

  window.getJobsByZone = function(zone){
    var arrReturn = [];
    for (var i = 0; i < entries.length; i++){
      if (entries[i].merchcluster === zone){
        arrReturn.push(entries[i]);
      }
    }
    return arrReturn;
  }

  window.getJobsByObjProp = function(objKey, objVal){
    var arrReturn = [];
    for (var i = 0; i < entries.length; i++){
      if (entries[i][objKey] === objVal){
        arrReturn.push(entries[i]);
      }
    }
    return arrReturn; 
  }

  window.entries = window.entries.sort(function(a, b){
    if (Date.parse(a.completed) > Date.parse(b.completed)) {
      return 1;
    } else if (Date.parse(a.completed) < Date.parse(b.completed)) {
      return -1;
    } else {
      return 0;
    }
  });

  window.pathsOfTruth = [];
  function calcRoute(routeArray) {
    for (var i = 0; i < routeArray.length; i++){
      var start = routeArray[i].pickloc;
      var end = routeArray[i].delloc;
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.BICYCLING
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          for (var j = 0; j < result.routes[0].overview_path.length; j++) {
            window.pathsOfTruth.push(new google.maps.LatLng(
              result.routes[0].overview_path[j].k,
              result.routes[0].overview_path[j].A));

            if (i === routeArray.length) {
              var awesomePath = new google.maps.Polyline({
                path: pathsOfTruth,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });

              awesomePath.setMap(map);
            }
          }
        }
      });
    }
  }

  calcRoute(window.alexJobs);


}

/*
  var alexCords = [];
  for (var i = 0; i < window.alexJobs.length; i++) {
    alexCords.push(new google.maps.LatLng(parseFloat(window.alexJobs[i].dellat), parseFloat(window.alexJobs[i].dellng)));
  }
  console.log(alexCords);

  var alexPath = new google.maps.Polyline({
    path: alexCords,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  console.log(alexPath);

  alexPath.setMap(map);
*/

// }


//     //directionsDisplay.setMap(map);
//   }
// }
// http://maps.googleapis.com/maps/AIzaSyAMk9UfSIhH4R_X3ffpiQKSZUOGRMsXhlk/directions/json?origin=Adelaide,SA&destination=Adelaide,SA&waypoints=optimize:true|Barossa+Valley,SA|Clare,SA|Connawarra,SA|McLaren+Vale,SA&sensor=false&key=API_KEY
// function calcRoute(routeArray) {
//   var start = routeArray[0].pickloc;
//   var end = routeArray[routeArray.length-1].delloc;
//   var waypts = [];
//   var checkboxArray = routeArray;
//   for (var i = 0; i < checkboxArray.length; i++) {
//     // console.log('delivery', checkboxArray[i].delloc.split(' ').slice(0,2).join(' '));
//     waypts.push({
//       location:checkboxArray[i].delloc.split(' ').slice(0,3).join(' '),
//       stopover:true
//     });
//     // console.log('pickup', checkboxArray[i].pickloc.split(' ').slice(0,2).join(' '));
//     waypts.push({
//       location:checkboxArray[i].pickloc.split(' ').slice(0,3).join(' '),
//       stopover:false
//     });
//   }
//   console.log(waypts);
//   var request = {
//     origin: start,
//     destination: end,
//     waypoints: waypts,
//     optimizeWaypoints: true,
//     travelMode: google.maps.TravelMode.BICYCLING
//   };
//   directionsService.route(request, function(response, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       directionsDisplay.setDirections(response);
//       var route = response.routes[0];
//       var summaryPanel = document.getElementById("directions_panel");
//       summaryPanel.innerHTML = '';
//       // For each route, display summary information.
//       for (var i = 0; i < 4; i++) {
//         var routeSegment = i+1;
//         summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
//         summaryPanel.innerHTML += route.legs[i].start_address + " to ";
//         summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
//         summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
//       }
//     }
//   });
//   directionsDisplay.setMap(map);
// }
// var pathsOfTruth = [];
// for (var i = 0; i < directions.length; i++) {
//   for (var j = 0; j < directions[i].routes[0].overview_path.length; j++) {
//     pathsOfTruth.push(new google.maps.LatLng(directions[i].routes[0].overview_path[j].k, directions[i].routes[0].overview_path[j].A));
//   }
// }

// var awesomePath = new google.maps.Polyline({
//   path: pathsOfTruth,
//   geodesic: true,
//   strokeColor: '#FF0000',
//   strokeOpacity: 1.0,
//   strokeWeight: 2
// });
// console.log(awesomePath);

// awesomePath.setMap(map);
