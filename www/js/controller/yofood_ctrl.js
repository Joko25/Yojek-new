app.controller('yofoodCtrl', function($scope, $state, $cordovaGeolocation, $ionicModal) {
  var latLng='';
  var options = {timeout: 10000, enableHighAccuracy: true};
  var map;
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
      type: ['food']
    }, processResults);

    function processResults(results, status, pagination) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        } else {
          createMarkers(results);
          //console.log(results);

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
        //var bounds = new google.maps.LatLngBounds();
      var placesList = document.getElementById('places');

      $scope.place = [];
      for (var i = 0, place; place = places[i]; i++) {
        var poto = place.photos;

        if (poto == 'undefined' || poto == undefined) {
          poto = "<a class='item item-avatar'> <img src='"+place.icon+"' /> <h2>" + place.name + "</h2> <p>"+place.vicinity+" </p></a>";
        }else{
          console.log(place);
          //poto = place.photos[0].getUrl;//place.photos[0].getUrl["[[BoundArgs]]"];//["0"].photos["0"].getUrl["[[BoundArgs]]"]["0"]=["0"].photos["0"].getUrl["[[TargetFunction]]"]
          var potoUrl = place.photos[0].getUrl({maxWidth: 400, maxHeight: 400});
          poto = "<a class='item item-avatar'> <img src='"+potoUrl+"' /> <h2>" + place.name + "</h2> <p>"+place.vicinity+" </p></a>";
          console.log(poto);
        }

        placesList.innerHTML += poto;//"<a class='item item-avatar'> <img src='"+place.icon+"' /> <h2>" + place.name + "</h2> <p>"+poto+" </p></a>";
          
          //bounds.extend(place.geometry.location);
          //sc
      }
        //map.fitBounds(bounds);
    }

  });
});