app.controller('loginCtrl', function($scope, $state, $http, $ionicPopup, Firebase, $ionicLoading, md5, $window, $ionicLoading, UserService) {
  $scope.data = {};
  $scope.face = 'img/icon.png';

  var log = $window.localStorage.getItem("log");

  if(log == "true"){
    $state.go("app.dash");
  }
 
  $scope.login = function() {

    $ionicLoading.show({
      template: '<ion-spinner icon="dots"></ion-spinner>'
      //duration: 1000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
    var username = $scope.data.username;
    var password = $scope.data.password;

    if (username==null || password==null) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
            title: 'Login error!',
            template: "Username or password is undifined"
      });
    }else{

      console.log(md5.createHash(password));
      var usersRef = firebase.database().ref('users/'+username);
      // usersRef.orderByChild("password").equalTo(md5.createHash(password)).on("child_added", function(data) {
      //    console.log("Equal to filter: " + data.val().password);
      // });

      usersRef.on("value", function(snapshot){
       console.log(snapshot.val().password);

        if (snapshot.val().password == md5.createHash(password)) {
          $ionicLoading.hide();
          $state.go("app.dash");
          $window.localStorage.setItem("log", "true");

          UserService.setUser({
            userID: username,
            name: user_data.displayName,
            email: snapshot.val().email,
            picture: '',
            accessToken: '',
            idToken: ''
          });

          console.log(userLog);
        }else{
          var alertPopup = $ionicPopup.alert({
            title: 'Login error!',
            template: "Username or password is wrong"
          });
          $ionicLoading.hide();
        }
      }, function(error){
        console.log("Error: "+error.code);
      });

      //console.log("LOGIN user: " + userLog + " - PW: " + passLog);
    }

    // $state.go("reg");
  }

  $scope.regist = function(){
    console.log("registrasi");
    $state.go("reg");
  };

  $scope.forget = function(){
    console.log("forget");
  };

  $scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
        UserService.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
        });

        $ionicLoading.hide();
        $state.go('app.dash');
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
  };
});


app.controller('RegCtrl', function($scope, $ionicHistory, $window, $ionicPopup, Firebase, $state, $http, $ionicLoading,md5) {
  $scope.goBack = function(){
    // $ionicHistory.goBack();
    $state.go("login");
  }

  $scope.data = {};

  $scope.regist = function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
      //duration: 1000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
      //console.log(username);
      var ret = '';
      var uRef = firebase.database().ref('users/'+$scope.data.username);
      uRef.on("value", function(snapshot){      
        console.log(snapshot.val());
        ret = snapshot.val();

        if (ret == '' || ret == null) {
            var usersRef = firebase.database().ref('users/'+$scope.data.username);
            //var cek = cekdb($scope.data.username);

            //console.log("Cek :"+cek);
            usersRef.set({
              email: $scope.data.email,
              // username: $scope.data.username,
              user: $scope.data.name,
              password: md5.createHash($scope.data.password)
            });

            usersRef.on("child_added", function(data, prevChildKey){
              var newPlayer = data.val();
              // console.log("Name: "+newPlayer.name);
              // console.log("Age: "+newPlayer.age);
              // console.log("Number: "+newPlayer.number);
              // console.log("Previouse Player: "+prevChildKey);
              $window.localStorage.setItem("email", $scope.data.email);
              $window.localStorage.setItem("username", $scope.data.username);
              $window.localStorage.setItem("password", md5.createHash($scope.data.password));
              $ionicLoading.hide();

              var alertPopup = $ionicPopup.alert({
                  title: 'Register Success!',
                  template: "Username "+$scope.data.username
              });
              $ionicLoading.hide();
              //$state.go("login");

            }, function(error){
              var alertPopup = $ionicPopup.alert({
                  title: 'Register failed!',
                  template: "Harap terisi semua, format email harus benar"
              });
              $ionicLoading.hide();
              console.log("Error "+error.code)
            });
        }else{
          var alertPopup = $ionicPopup.alert({
            title: 'Register failed!',
            template: "Username sudah terdaftar"
          });
          $ionicLoading.hide();
        }
      }, function(error){
          console.log("Error: "+error.code);
      });
  }
})