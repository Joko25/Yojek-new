app.controller('yorideCtrl', function($scope, $state, $http, $cordovaGeolocation, $ionicModal, $ionicPopup) {
 var options = {timeout: 10000, enableHighAccuracy: true};
 $scope.tarif = 'Rp. 0';

 var marker;

 var map;

 var latLng;

 $scope.goBack = function(){
  $state.go('app.dash');
 };

  $scope.disableTap = function() {
    //alert("as");
    var container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    var backdrop = document.getElementsByClassName('backdrop');
    angular.element(backdrop).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function() {
      document.getElementById('pac-input').blur();
    });
  };

  $scope.disableTap2 = function() {
    //alert("as");
    var container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    var backdrop = document.getElementsByClassName('backdrop');
    angular.element(backdrop).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function() {
      document.getElementById('tuj-input').blur();
    });
  };

  $ionicModal.fromTemplateUrl('templates/modal-yoride.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
    id1 = "not";
  };

 var id1 = "not";

 $scope.onSearchChange1 = function(){
    // if (id1 == "not") {
      console.log("popup");
      $scope.modal.show();
      id1="yes";

      var inpurdari = document.getElementById('inpurdari');
      var searchDari = new google.maps.places.SearchBox(inpurdari);
      //var latLng = {lat: -33.866, lng: 151.196};

      //console.log(latLng);

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: latLng,
        radius: 500//,
        //type: ['store']
      }, processResults);

      function processResults(results, status, pagination) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        } else {
          createMarkers(results);

          if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
              moreButton.disabled = true;
              pagination.nextPage();
            });
          }
        }
      }

      function createMarkers(places) {
        console.log(places);
        //var bounds = new google.maps.LatLngBounds();
        var placesList = document.getElementById('places');

        $scope.place = [];
        for (var i = 0, place; place = places[i]; i++) {

          placesList.innerHTML += "<a class='item item-avatar'> <img src='"+place.icon+"' /> <h2>" + place.name + "</h2> <p>"+place.vicinity+" </p></a>";
          
          //bounds.extend(place.geometry.location);
          //sc
        }
        //map.fitBounds(bounds);
      }
    // }
 };

 $scope.modalData = {};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    //$scope.tarif = 'ter';
 
    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var service = new google.maps.DistanceMatrixService();
    //var countryRestrict = {'country': 'us'};
 
    var mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 15,
      // streetViewControl: false,
      draggable: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      
    };

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    // var inpurdari = document.getElementById('inpurdari');

    //console.log(inpurdari);
    var search = document.getElementById('search');
    var inputtuj = document.getElementById('tuj-input');
    var marker_inv = document.getElementById('marker');
    var tocenter = document.getElementById('tocenter');
    //var searchDari = new google.maps.places.SearchBox(inpurdari);
    var searchBox = new google.maps.places.SearchBox(input);
    var autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "ID" }
    });
    // var searchBoxtuj = new google.maps.places.SearchBox(inputtuj);
    var searchBoxtuj = new google.maps.places.Autocomplete(inputtuj, {
      componentRestrictions: { country: "ID" }
    });



    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    map = $scope.map;
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(search);
    $scope.map.controls[google.maps.ControlPosition.CENTER].push(marker_inv);
    $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(tocenter);
    directionsDisplay.setMap($scope.map);

    //$scope.map.setMyLocationEnabled(true);

    var onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
      //console.log(directionsService+' '+directionsDisplay);
    };

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      console.log(places);
    });


    var makeMark = function(){
      // alert();
       var start = document.getElementById('pac-input').value;
      // var places = searchBox.getPlaces();
      // console.log(start.place.geometry.location);


      // console.log(start);
    }
    //document.getElementById('pac-input').addEventListener('change', makeMark);
    //document.getElementById('tuj-input').addEventListener('change', onChangeHandler);

    $scope.goMap = function(){
      
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    }
    var start='';
    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
      //start = document.getElementById('pac-input').value;
      var end = document.getElementById('tuj-input').value;

      if (start == '') {
        start = latLng;
      }

      //console.log(start+' '+end);

      directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
        drivingOptions: {
          departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
          trafficModel: 'optimistic'
        }
      }, function(response, status) {
        if (status === 'OK') {
          console.log(response);
          directionsDisplay.setDirections(response);
          calculateDistances(start, end);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }

    var harga = 0;

    

    function callback(response, status) {
      console.log(response);
      if (status != google.maps.DistanceMatrixStatus.OK) {
        alert('Error was: ' + status);
      } else {
        console.log(response);
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;
          // var outputDiv = document.getElementById('outputDiv');
          //outputDiv.innerHTML = '';
          //deleteOverlays();
          // $scope.tarif = response.rows[0].elements[0].distance.text;
          // console.log($scope.tarif);
          var jrk = response.rows[0].elements[0].distance.text;
          var jarak = parseFloat(jrk.replace(/km/g,''));
          var jarak_awal = 5;
          
          var harga_awal = 8000;

          if (jarak > jarak_awal) {
            var sisa_jarak = jarak - jarak_awal;
            harga = parseFloat(sisa_jarak*2000) + harga_awal;
          }else{
            harga = 8000;
          }

          harga = harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");            
          document.getElementById("tarif").innerHTML = "Rp. "+harga+";("+jrk+")";
          console.log(response.rows[0].elements[0].duration.text);
          console.log(response.rows[0].elements[0].distance.text); 
      }
    }

    function calculateDistances(start, end) {
      // var start = document.getElementById('pac-input').value; 
      // var end = document.getElementById('tuj-input').value;
      service.getDistanceMatrix(
      { 
          origins: [start],
          destinations: [end],
          travelMode: google.maps.TravelMode.DRIVING, 
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: true,
          avoidTolls: true
      }, callback);
    }
 
    //$scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(inputtuj);

    var icon = {
      url: 'img/marker.png', // url
      scaledSize: new google.maps.Size(35, 40)
    };

    // google.maps.event.addListener($scope.map, 'drag', function (event) {
    //     marker.setPosition($scope.map.getCenter());
    // });

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

      // $scope.map.removeOverlay(marker);
      marker = new google.maps.Marker({
          map: $scope.map,
          // animation: google.maps.Animation.DROP,
          position: latLng,
          // icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
          //                                               new google.maps.Size(22,22),
          //                                               new google.maps.Point(0,18),
          //                                               new google.maps.Point(11,11)),
          icon:icon,
          shadow: 100,
          zIndex: 999,
          optimized: false,
          visible: false
      });

      marker.addListener('click', function() {
        // map.setZoom(8);
        // map.setCenter(marker.getPosition());
        marker.setVisible(false);
        marker_inv.style.display = "block";
        setmap = 'false';
      });

      
     
    });

    google.maps.event.addListener($scope.map, 'drag', function (event) {
          //marker.setPosition($scope.map.getCenter());
          //console.log($scope.map.getCenter().lat());
          var latitude = $scope.map.getCenter().lat();
          var longitude = $scope.map.getCenter().lng();
          
          params = {
            coords: [latitude, longitude]
             //addr: 'dunes.inherit.riper'
          };

          straddr = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+params.coords+'&sensor=true';
          $http.get(straddr)
          .success(function(response){
            //$scope.title1 = response.results[0].formatted_address;

            if (setmap == 'false') {
              console.log(response.results[0].formatted_address);
              $scope.search1 = response.results[0].formatted_address;
              start = response.results[0].formatted_address;
            }
          })
          .error(function(){
            var alertPopup = $ionicPopup.alert({
              title: 'Fild!',
              template: 'Please check your connection!'
            });
          });

          //w3w.reverse(params, callback);
    });
    var setmap = 'false';
    var service_place = new google.maps.places.PlacesService($scope.map);

    $scope.setMap = function(){


      var cntr = $scope.map.getCenter();
      if (marker.visible == true) {
        console.log(marker);
        console.log(cntr.lng());
      }else{
        console.log(marker);
        marker.setVisible(true);
        marker.setPosition($scope.map.getCenter());
        marker_inv.style.display = "none";
        var latitude = $scope.map.getCenter().lat();
        var longitude = $scope.map.getCenter().lng();
          
        params = {
          coords: [latitude, longitude]
             //addr: 'dunes.inherit.riper'
        };


        straddr = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+params.coords+'&sensor=true';
          $http.get(straddr)
          .success(function(response){
            //$scope.title1 = response.results[0].formatted_address;
            //console.log(setmap);
              // console.log(response.results[0].formatted_address);

            if (setmap == 'false') {
              $scope.search1 = response.results[0].formatted_address;
              setmap = 'true';
              var place = searchBox.getPlaces();
              start = response.results[0].formatted_address;
              // if (!place.geometry) {
              //   return;
              // }

              // console.log(place.place_id);
            }
          })
          .error(function(){
            var alertPopup = $ionicPopup.alert({
              title: 'Fild!',
              template: 'Please check your connection!'
            });
        });
      }
    }

    $scope.toCenter = function(){
      $scope.map.setCenter(latLng);
      // google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      //   var latitude = latLng.lat();
      //   var longitude = latLng.lng();

      // });

      console.log(latLng.lat()+' , '+latLng.lng());
    }

    $scope.orderRide = function(){
      var alertPopup = $ionicPopup.alert({
        title: 'Information',
        template: 'YOJEK DRIVER under maintanance, Please try again letter!'
      });
    }

    
 
  }, function(error){
    console.log("Could not get location");
  });
});