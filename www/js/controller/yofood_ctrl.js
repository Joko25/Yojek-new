app.controller('yofoodCtrl', function($scope, $state, $cordovaGeolocation, $ionicModal, $ionicLoading, $ionicScrollDelegate) {
  var latLng='';
  var options = {timeout: 10000, enableHighAccuracy: true};
  var map;
  var service;
  $scope.sttButton=false;
  var top = 0;
  $scope.noMoreItemsAvailable = false;
  var totalLoad = 0;

  $scope.closeq = function(){
    //alert('asdf');
  };



  $scope.getScrollPosition = function() {
    //monitor the scroll
    var moveData = $ionicScrollDelegate.getScrollPosition();
    var currentTop = $ionicScrollDelegate.getScrollPosition().top;
    var maxTop = $ionicScrollDelegate.getScrollView(); //.__maxScrollTop
    //console.log(maxTop);

      if(top>20){
          $scope.sttButton=true;
          //console.log($scope.sttButton);
        $scope.$apply(function(){
        });//apply
      }else{
          $scope.sttButton=false;
        $scope.$apply(function(){
        });//apply
      }

      //console.log(top);

      top = top + 1;
  };

  $scope.scrollToTop = function() { //ng-click for back to top button
    $ionicScrollDelegate.scrollTop();
    $scope.sttButton=false;  //hide the button when reached top
    top = 0;
  };



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
      radius: 5000,
      type: ['restaurant']
    }, processResults);

    

  });

  var page;

  function processResults(results, status, pagination) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      } else {
        createMarkers(results);
        //console.log(pagination);
        // $scope.place = results;
       if (pagination.hasNextPage) {
        page = pagination;

        // totalLoad = totalLoad + $scope.place.length;
        // console.log(totalLoad);

        

          // $scope.loadMore = function(){
          //   //alert('asdf');
          //   console.log('more');
          //    pagination.nextPage();
          //   // $scope.$broadcast('scroll.infiniteScrollComplete');
          // };
          // $scope.$broadcast('scroll.infiniteScrollComplete');
          // $scope.place = [];
        // var moreButton = document.getElementById('more');
        //  moreButton.disabled = false;
        //  moreButton.addEventListener('click', function() {
        //     moreButton.disabled = true;
        //     pagination.nextPage();
        //     // $scope.place+=results;
        //    console.log($scope.place);
        //   });
        }
      }
  }

  $scope.place = [];
  function createMarkers(places) {

    for (var i = 0, place; place = places[i]; i++) {
        // var poto = place.photos;
      $scope.place.push(place);
        // console.log(place);
        // console.log($scope.place.length+' '+i);
        // if (i == $scope.place.length) {
        $ionicLoading.hide();
        // }
        console.log($scope.place.length-1);
      if (i == ($scope.place.length-1)) {
        $scope.noMoreItemsAvailable = true;
      }
    }
  };


  $scope.yoFood = function(id){
    console.log(id);

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
      placeId: id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
       console.log(place);
       $scope.title = place.name;
       $scope.slide = place.photos;
       $scope.address = place.formatted_address;
       $scope.phone = place.formatted_phone_number;
       $scope.website = place.website;
       $scope.opening = place.opening_hours;
       $scope.review = place.reviews;

       // for (var i = 0; i < place.photos.length; i++) {
       //  // console.log(place.photos[i].getUrl({maxWidth: 1000, maxHeight: 400}));
       // }
       $scope.modal.show();
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

  $scope.doRefresh = function() {

    $scope.place = [];
        
    console.log('Refreshing!');
    service.nearbySearch({
      location: latLng,
      radius: 5000,
      type: ['restaurant']
    }, processResults);
    //$timeout( function() {
        $scope.$broadcast('scroll.refreshComplete');
    //}, 1000);
        
  };

  // if ( $scope.place.length == totalLoad ) {
  //   $scope.noMoreItemsAvailable = true;
  // }

  $scope.loadMore = function(){
    //alert('asdf');
    console.log('more');
    page.nextPage();
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
});