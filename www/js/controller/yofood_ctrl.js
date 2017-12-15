app.controller('yofoodCtrl', function($scope, $state, $cordovaGeolocation, $ionicModal) {
  var latLng='';
  var options = {timeout: 10000, enableHighAccuracy: true};
  var map;
  // $scope.place = [];
  $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
      autoplay:3500
  };
  
  $scope.slide = [{
    background: 'light-bg',
    title: 'Selamat datang di YOJEK',
    desc: 'Terimakasih telah menggunakan layanan kami.',
    face: 'img/food1.jpg'
  },{
    background: 'positive-bg',
    title: 'Promo hari ini',
    desc: 'dapatkan 100poin setiap 1 kali menggunakan layanan Yojek',
    face: 'img/food2.jpg'
  },{
    background: 'light-bg',
    title: 'Layanan kami',
    desc: 'Description',
    face: 'img/food3.jpg'
  }];

  $scope.data = [{
    bg: 'img/food1.jpg',
    title: 'One cafe',
    desc: 'ini adalah deskripsinya',
    link:'id=01'
  },{
    bg: 'img/food2.jpg',
    title: 'Two cafe',
    desc: 'ini adalah deskripsinya ke 2',
    link:'id=02'
  },{
    bg: 'img/food3.jpg',
    title: 'three cafe',
    desc: 'ini adalah deskripsinya ke 3',
    link:'id=03'
  }];

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 15,
      draggable: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapfood"), mapOptions);
    
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      type: ['restaurant']
    }, processResults);

    function processResults(results, status, pagination) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        } else {
          createMarkers(results);
          //console.log(results);
          // $scope.place = results;

          if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
              moreButton.disabled = true;
              pagination.nextPage();
              // $scope.place+=results;

              console.log($scope.place);
            });
          }
        }
    }

    $scope.place = [];
    function createMarkers(places) {

      for (var i = 0, place; place = places[i]; i++) {
        // var poto = place.photos;
        $scope.place.push(place);
        console.log(place);
      }
    }

  });


  $scope.yoFood = function(id){
    console.log(id);

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
      placeId: id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
       // var marker = new google.maps.Marker({
       //   map: map,
       //   position: place.geometry.location
       // });
       console.log(place.photos);
     }
    });

  }
});