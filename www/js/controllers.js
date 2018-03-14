app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $state, UserService, $ionicActionSheet, $ionicLoading) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  
  $scope.userData = UserService.getUser();
  var name = UserService.getUser().name;
  $scope.initimg = name.substr(0, 1);
  console.log($scope.userData);

  $scope.alert = function(){
    alert();
  }

  $scope.reload = function(){
    $scope.userData = UserService.getUser();
    var name = UserService.getUser().name;
    $scope.initimg = name.substr(0, 1);
  }

  $scope.OtherShare = function(){
    console.log('ahay');
    window.plugins.socialsharing.share('Ayo Gabung dengan Yori!', null, null, 'Link yori');
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.logout = function() {

    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        return true;
      },
      destructiveButtonClicked: function(){
        $ionicLoading.show({
          template: 'Logging out...'
        });

         $window.localStorage.setItem("log", "false");
         $state.go("home");
         $window.location.reload(true);
        
        // Google logout
        window.plugins.googleplus.logout(
          function (msg) {
            console.log(msg);
            $ionicLoading.hide();
            $state.go('login');
          },
          function(fail){
            console.log(fail);
          }
        );
      }
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});

app.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
});

app.controller('homeCtrl', function($scope, $state, $window, $stateParams, $ionicSlideBoxDelegate) {
  var log = $window.localStorage.getItem("log");
  if(log == "true"){
    $state.go("app.dash");
    console.log("LOGGED");
  }else{
    $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 500,
      autoplay:3500
    };


   // console.log(log);


    $scope.face = 'img/lg.png';
    $scope.face2 = 'img/lg2.png';
    $scope.face3 = 'img/yori_icon.png';

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

    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    }

    $scope.login = function(){
        $state.go("login");
    }

    $scope.regist = function(){
        $state.go("reg");
    }
    
  }

});

app.controller('userCtrl', function($scope, $state, $ionicPopup, $window, $stateParams, $ionicSlideBoxDelegate, UserService, Firebase) {
  $scope.userData = UserService.getUser();
  var name = UserService.getUser().name;
  $scope.initimg = name.substr(0, 1);

  $scope.data = {};

  $scope.data.name=$scope.userData.name;
  $scope.data.username=$scope.userData.userID;
  $scope.data.email=$scope.userData.email;
  $scope.data.phone=$scope.userData.phone;

  var uRef = firebase.database().ref('users/'+$scope.userData.userID);

  if ($scope.data.phone=='') {
    $scope.data.phone = 0
  }

  $scope.ubah = function(){
    //console.log($scope.data);
    // uRef.on("value", function(snapshot){ 
      uRef.update({
        email: $scope.data.email,
        // username: $scope.data.username,
        user: $scope.data.name,
        // password: md5.createHash($scope.data.password),
        access: 'user',
        phone: $scope.data.phone,
        point: 0
      }, function(success){
        console.log(success);
      });
        UserService.setUser({
          userID: $scope.userData.userID,
          name: $scope.data.name,
          email: $scope.data.email,
          picture: '',
          accessToken: 'user',
          idToken: $scope.userData.password,
          point: $scope.userData.point,
          phone: $scope.data.phone
        });
        var alertPopup = $ionicPopup.alert({
          title: 'Update Success!',
          template: "Data berhasil di perbaharui"
        });

        $scope.userData = UserService.getUser();
        var name = UserService.getUser().name;
        $scope.initimg = name.substr(0, 1);
        console.log($scope.userData);
        var uRef_ = firebase.database().ref('users/');

      uRef_.on("child_changed", function(data) {
        var user = data.val();
        console.log("The updated is " + user);
      }, function(error){
        var alertPopup = $ionicPopup.alert({
          title: 'Register failed!',
          template: "Harap terisi semua, format email harus benar"
        });
        $ionicLoading.hide();
        console.log("Error "+error.code)
      });

  }
});