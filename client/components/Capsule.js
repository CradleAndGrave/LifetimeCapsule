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
    }],
    unearthed: true
  };
  $scope.createDate = null;
  $scope.unearthedDate = '?';
  $scope.unearthCountdown = '';
  Caps.retrieveCap(this.capsuleId, function(err, res) {
    if(err){
      console.log(err);
    } else {
      for (let momento of res[0].contents) {
        if(momento.file){
          Caps.fetchFiles(momento.file[0], (fileUrl) => {
            momento.fileUrl = fileUrl;
            console.log(momento.fileUrl)
          })
        }
      }
      $scope.capsule = res[0];
      $scope.createDate = moment($scope.capsule.createdAt).format('LL');
      $scope.unearthedDate = moment($scope.capsule.unearthDate).format('LL');
      $scope.unearthCountdown = moment($scope.capsule.unearthDate).toNow();
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
