angular.module('app')
.controller('CapsuleCtrl', function($scope, $location, Caps) {
  this.capsuleId = $location.$$absUrl.split('/')[4];
  $scope.capsule;
  $scope.createDate;
  $scope.unearthedDate;
  Caps.retrieveCap(this.capsuleId, function(err, res) {
    if(err){
      console.log(err);
    } else {
      console.log(res[0].unearthed);
      $scope.capsule = res[0];
      console.log($scope.capsule.createdAt);
      console.log($scope.capsule.unearthDate);
      let createDate = new Date($scope.capsule.createdAt.substring(0,10));
      let unearthedDate = new Date($scope.capsule.unearthDate.substring(0,10));
      $scope.createDate = createDate.toDateString();
      $scope.unearthedDate = unearthedDate.toDateString();
      // $scope.createDate = new Date($scope.capsule.createdAt.substring(0,16)+'Z');
      // $scope.unearthedDate = new Date($scope.capsule.unearthDate.substring(0,16)+'Z');
      console.log($scope.createDate);
      console.log($scope.unearthedDate);
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
