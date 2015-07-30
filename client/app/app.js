'use strict';

angular.module('lorenjonesApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'angular.filter',
  'ui.sortable',
  'uiGmapgoogle-maps',
  'youtube-embed',
  'plangular',
  'xeditable',
  'ngAnimate',
  'ngFitText',
  'bootstrapLightbox',
  'duScroll',
  'duParallax',
  'ngMessages',
  'angularRipple'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, LightboxProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    LightboxProvider.templateUrl = 'app/about/aboutModal.html';
    LightboxProvider.calculateModalDimensions = function(dimensions) {
      // 400px = arbitrary min width
      // 32px = 2 * (1px border of .modal-content
      //             + 15px padding of .modal-body)
      var width = Math.max(400, dimensions.imageDisplayWidth + 32);

      // 200px = arbitrary min height
      // 66px = 32px as above
      //        + 34px outer height of .lightbox-nav
      var height = Math.max(200, dimensions.imageDisplayHeight + 108);

      // first case:  the modal width cannot be larger than the window width
      //              20px = arbitrary value larger than the vertical scrollbar
      //                     width in order to avoid having a horizontal scrollbar
      // second case: Bootstrap modals are not centered below 768px
      if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
        width = 'auto';
      }

      // the modal height cannot be larger than the window height
      if (height >= dimensions.windowHeight) {
        height = 'auto';
      }

      return {
        'width': width,
        'height': height
      };
    };
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, editableOptions, works) {
    editableOptions.theme = 'bs3';
    $rootScope.defaultTrack = works.defaultTrack;
    $rootScope.allWorks = works.works;
    $rootScope.allTracks = works.tracks;
    $rootScope.cleanUrl = function(url) {
      var u = url;
      if (u.indexOf('https') !== -1) {
        u = u.replace('https', 'http');
      }
      return u;
    };

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
