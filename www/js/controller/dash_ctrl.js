app.controller('dashCtrl', function($scope, $state, $cordovaGeolocation, $window, UserService) {
  $scope.yoRide  = function(){
    $state.go("yoride");
    $window.location.reload(true);
  }
  $scope.yoGood  = function(){
    $state.go("yogood");
  }
  $scope.yoFood  = function(){
    $state.go("app.yofood");
    // $window.location.reload(true);
  }
  $scope.yoMart  = function(){
    $state.go("app.yomart");
  }

  // console.log(UserService.getUser());

	$scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
      autoplay:3500
  };
  
  $scope.slide = [{
    background: 'img/4.jpeg',
    title: 'Selamat datang di YOJEK',
    desc: 'Terimakasih telah menggunakan layanan kami.',
    face: '#'
  },{
    background: 'img/1.jpeg',
    title: 'Promo hari ini',
    desc: 'dapatkan 100poin setiap 1 kali menggunakan layanan Yojek',
    face: 'img/lg2.png'
  },{
    background: 'img/2.jpeg',
    title: 'Layanan kami',
    desc: 'Description',
    face: 'img/lg.png'
  },{
    background: 'img/3.jpeg',
    title: 'Layanan kami',
    desc: 'Description',
    face: 'img/lg.png'
  }];


   // console.log(log);


    $scope.face = 'img/lg.png';
    $scope.face2 = 'img/lg2.png';

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
      //console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      // note: the indexes are 0-based
      $scope.activeIndex = data.slider.activeIndex;
      $scope.previousIndex = data.slider.previousIndex;
    });
});