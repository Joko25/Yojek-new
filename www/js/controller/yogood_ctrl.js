app.controller('yogoodCtrl', function($scope, $state, $cordovaGeolocation, $ionicModal) {
 var options = {timeout: 10000, enableHighAccuracy: true};
 $scope.tarif = 'Rp. 0';

  $scope.goBack = function(){
  $state.go('app.dash');
 };

 var marker;

 var map;

 var latLng;

 $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    //$scope.tarif = 'ter';
 
    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    // var directionsDisplay = new google.maps.DirectionsRenderer;
    // var directionsService = new google.maps.DirectionsService;
    // var service = new google.maps.DistanceMatrixService();
    //var countryRestrict = {'country': 'us'};

    console.log(latLng);
 
    var mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 15,
      // streetViewControl: false,
      draggable: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // var autocomplete = new google.maps.places.Autocomplete(input, {
    //   componentRestrictions: { country: "ID" }
    // });
    // // var searchBoxtuj = new google.maps.places.SearchBox(inputtuj);
    // var searchBoxtuj = new google.maps.places.Autocomplete(inputtuj, {
    //   componentRestrictions: { country: "ID" }
    // });



    $scope.map = new google.maps.Map(document.getElementById("mapGoods"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var latitude = latLng.lat();
      var longitude = latLng.lng();

      // straddr = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
      // console.log(straddr);
      // $http.get(straddr)
      // .success(function(response){
      //     console.log(response.results[0].formatted_address);
      //     $scope.search1 = response.results[0].formatted_address;
      // })
      // .error(function(){
      //   var alertPopup = $ionicPopup.alert({
      //     title: 'Fild!',
      //     template: 'Please check your connection!'
      //   });
      // });

      marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          // icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
          //                                               new google.maps.Size(22,22),
          //                                               new google.maps.Point(0,18),
          //                                               new google.maps.Point(11,11)),
          //icon:icon,
          shadow: 100,
          zIndex: 999,
          optimized: false
      });
     
    });

    map = $scope.map; 
  }, function(error){
    console.log("Could not get location");
  });
});