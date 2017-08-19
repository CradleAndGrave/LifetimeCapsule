angular.module('app')
.controller('SignupCtrl', function($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  console.log('signup controller loaded');
})
.component('signup', {
  controller: 'SignupCtrl',
  templateUrl: '../templates/signup.htm',
  bindings: {}
})
