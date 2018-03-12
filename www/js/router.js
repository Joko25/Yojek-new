app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
    
  })
    .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
    
  })

  .state('yoride', {
    url: '/yoride',
    templateUrl: 'templates/yoride.html',
    controller: 'yorideCtrl'
    
  })

  .state('yogood', {
    url: '/yogood',
    templateUrl: 'templates/yogood.html',
    controller: 'yogoodCtrl'
    
  })

  .state('yomart', {
    url: '/yomart',
    templateUrl: 'templates/yomart.html',
    controller: 'yomartCtrl'
    
  })

    .state('reg', {
    url: '/reg',
    templateUrl: 'templates/reg.html',
    controller: 'RegCtrl'
  })

  .state('app.yomart', {
    url: '/yomart',
    views: {
      'menuContent': {
        templateUrl: 'templates/yomart.html'
      }
    }
  })

  .state('app.yogood', {
    url: '/yogood',
    views: {
      'menuContent': {
        templateUrl: 'templates/yogood.html'
      }
    }
  })

  .state('app.dash', {
      url: '/dash',
      views: {
        'menuContent': {
          templateUrl: 'templates/dash.html',
          controller: 'dashCtrl'
        }
      }
    })
  .state('app.yoride', {
      url: '/yoride',
      views: {
        'menuContent': {
          templateUrl: 'templates/yoride.html',
          controller: 'yorideCtrl'
        }
      }
    })
  .state('app.yofood', {
      url: '/yofood',
      views: {
        'menuContent': {
          templateUrl: 'templates/yofood.html',
          controller: 'yofoodCtrl'
        }
      }
    })

  .state('app.yofood_view', {
      url: '/yofood_view',
      views: {
        'menuContent': {
          templateUrl: 'templates/yofood_view.html',
          controller: 'yofoodviewCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.user', {
      url: '/user',
      views: {
        'menuContent': {
          templateUrl: 'templates/user.html',
          controller: 'userCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
});
