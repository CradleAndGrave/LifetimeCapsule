angular.module('app', ['moment-picker', 'ngSanitize', 'ngRoute', 'zxcvbn', 'ui.bootstrap'])
.controller('AppCtrl', function($scope, $route, $routeParams, $location, Caps) {

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
});
