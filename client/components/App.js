angular.module('app', ['moment-picker', 'ngSanitize', 'ngRoute', 'zxcvbn', 'ui.bootstrap', 'ngFileUpload'])
.controller('AppCtrl', function($scope, Caps) {
// .controller('AppCtrl', function($scope, $route, $routeParams, $location, Caps) {

  this.signedIn = false;
  this.userId = '';
  this.email = '';

  // All capsules belonging to a user.
  // Filtering done on backend.
  this.capsData = [];

  // Initial GET request upon successful sign in.
  // id passed from Landing.js signin
  this.init = (id) => {
    
    Caps.filterCaps('all', id, (err, allCaps) => {
  	  if (err) {
  	    throw new Error(err);
  	  } else {
        this.capsData = allCaps;
      }
    });

  }
})
.component('app', {
  controller: 'AppCtrl',
  templateUrl: '../templates/app.html'
})
.config(function($routeProvider) {
  $routeProvider
  .when('/signup', {
    templateUrl: '/templates/signup.htm',
    // template:'Will this display?',
    controller: 'SignupCtrl'
  })

    .when('/forgotPassword', {
      templateUrl: '/templates/forgotPassword.html',
      // template:'Will this display?',
      controller: 'ForgotPasswordCtrl'
  })

});

angular.module('app')
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });

angular.module('app')
  .directive('zxPasswordMeter', function() {
    return {
      scope: {
        value: "@",
        max: "@?"
      },
      templateUrl: "../templates/password-meter.html",
      link: function(scope) {
        scope.type = 'danger';
        scope.max = (!scope.max) ? 100 : scope.max;

        scope.$watch('value', function(newValue) {
          var strengthPercent = newValue / scope.max;
          
           if (strengthPercent <= 0.25) {
             scope.type = 'danger';
             scope.text = '';
          } else if (strengthPercent <= 0.50) {
            scope.type = 'warning';
            scope.text = '';
          } else if (strengthPercent <= 0.75) {
            scope.type = 'warning';
            scope.text = '';
          } else {
            scope.type = 'success';
            scope.text = 'Perfect';
          }

        });
      }
    }
  });

