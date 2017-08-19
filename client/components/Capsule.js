angular.module('app')
.controller('CapsuleCtrl', function($scope, $route, $routeParams, $location, Caps) {
  this.capsuleId = $location.$$absUrl.split('/')[4];
  $scope.capsule = {
    capsuleName: 'Either you\'re lost or we\'ve shortcircuited.',
    contents: [{
      name: '',
      input: `
        <image style="height: 400px; width: 700px; margin: 0 auto; display: block" src="https://cdn.balibart.com/31039-large_default/capsule-corp-dragon-ball-z.jpg">`
    }, {
      name: 'Terribly sorry for the missed connection.',
      input: ``
    }]
  };
  $scope.createDate = null;
  $scope.unearthedDate = '?';
  Caps.retrieveCap(this.capsuleId, function(err, res) {
    if(err){
      console.log(err);
    } else {
      // console.log(res[0]);
      $scope.capsule = res[0];
      let createDate = new Date($scope.capsule.createdAt.substring(0,10));
      let unearthedDate = new Date($scope.capsule.unearthDate.substring(0,10));
      $scope.createDate = createDate.toDateString();
      $scope.unearthedDate = unearthedDate.toDateString();
      // console.log($scope.createDate);
      // console.log($scope.unearthedDate);
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
