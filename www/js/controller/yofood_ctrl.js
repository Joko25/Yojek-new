app.controller('yofoodCtrl', function($scope, $state, $cordovaGeolocation, $ionicModal, $ionicLoading, $ionicScrollDelegate, $cordovaInAppBrowser) {
  var latLng='';
  var options = {timeout: 10000, enableHighAccuracy: true};
  var map;
  var service;
  $scope.sttButton=false;
  var top = 0;
  $scope.noMoreItemsAvailable = false;
  var totalLoad = 0;
  var status = '';

  $scope.closeq = function(){
    //alert('asdf');
  };


$scope.linkfood = function(link){
      console.log(link);
      $state.go('app.yofood_view');
      status = link;
    }

  // $scope.place = [];
  $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
      autoplay:3500
  };

  $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
      //duration: 1000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
  });
  
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

  $scope.category = [{
    bg: 'ion-icecream',
    title: 'Bakery',
    desc: 'bakery',
    link:'id=01'
  },{
    bg: 'ion-pizza',
    title: 'Fast Food',
    desc: 'food',
    link:'id=02'
  },{
    bg: 'ion-coffee',
    title: 'Cafe', 
    desc: 'cafe',
    link:'id=03'
  },{
    bg: 'ion-soup-can-outline',
    title: 'Meal Delivery',
    desc: 'meal_delivery',
    link:'id=03'
  },{
    bg: 'ion-soup-can',
    title: 'Meal Takeaway',
    desc: 'meal_takeway',
    link:'id=03'
  },{
    bg: 'ion-android-restaurant',
    title: 'Restaurant',
    desc: 'restaurant',
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
    
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: latLng,
      radius: 100,
      type: ['restaurant']
    }, processResults);

    

  });

  var page;

  function processResults(results, status, pagination) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      } else {
        var res = results;
        createMarkers(res);
        //console.log(pagination);
        // $scope.place = results;
       if (pagination.hasNextPage) {
        page = pagination;
        }
      }
  }

  $scope.place = [];
  function createMarkers(places) {
    //console.log(places);
    for (var i = 0, place; place = places[i]; i++) {
        // var poto = place.photos;
      $scope.place.push(place);
        // console.log(place);
        // console.log($scope.place.length+' '+i);
        // if (i == $scope.place.length) {
        $ionicLoading.hide();
        // }
        // console.log($scope.place.length-1);
      if (i == ($scope.place.length-1)) {
        $scope.noMoreItemsAvailable = true;
      }
    }
    console.log($scope.place);
  };

  $scope.yoFood = function(id){
    console.log(id);

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
      placeId: id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
       $scope.title = place.name;
       $scope.slide = place.photos;

       if ($scope.slide == undefined) {
        $scope.slide = [];
       }

       // console.log($scope.slide);

       $scope.address = place.formatted_address;
       $scope.phone = place.formatted_phone_number;
       $scope.website = place.website;
       $scope.opening = place.opening_hours;
       $scope.review = place.reviews;

       if ($scope.review == undefined) {
        $scope.review = [];
       }

       console.log($scope.review);

       // for (var i = 0; i < place.photos.length; i++) {
       //  // console.log(place.photos[i].getUrl({maxWidth: 1000, maxHeight: 400}));
       // }
       $scope.modal.show();
      $scope.toWeb = function(link){
        console.log(link);
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'no'
        };

        $cordovaInAppBrowser.open(link, '_blank', options)
        .then(function(event) {
          // success
        })
        .catch(function(event) {
          // error
        });
      }
     }
    });

  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    console.log();
  };
  $ionicModal.fromTemplateUrl('templates/modal-yofood.html', {
     scope: $scope
   }).then(function(modal) {
     $scope.modal = modal;
   });
});