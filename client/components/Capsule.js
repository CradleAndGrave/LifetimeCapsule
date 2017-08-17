angular.module('app')
.controller('CapsuleCtrl', function($scope, $location, Caps) {
  this.capsuleId = $location.$$absUrl.split('/')[4];
  $scope.capsule;
  Caps.retrieveCap(this.capsuleId, function(err, res) {
    if(err){console.log(err);} else {
      $scope.capsule = res[0];
    }
    // $scope.$apply();
  });
  // $scope.$watch('capsule');
})
.component('capsule', {
  controller: 'CapsuleCtrl',
  templateUrl: '../templates/capsule.html',
  bindings: {}
})
