angular.module('app')
  .controller('ForgotPasswordCtrl', function($scope, $routeParams, $location, sendNewAfterForgottenPassword) {
    $scope.$routeParams = $routeParams;
    
    $scope.email = $scope.$routeParams.email
    $scope.token = $scope.$routeParams.token

    this.newPassword = '';
    $scope.badEmail = false;
    $scope.expired = false;
    $scope.success = false;
    
    $scope.handlePasswordChange = (password, email, token) => {

      var obj = { password: password, email: email, token: token };

      sendNewAfterForgottenPassword.forgotPassword(obj, (res) => {
        console.log(res.status)
        if (res.status === '404') {
          $scope.badEmail = true
          console.log('bad email')
        } else if (res.status ==='400') {
          $scope.expired = true
          console.log('token expired')
        } else {
          $scope.success = true;
          setTimeout(function() {
            $scope.$ctrl.userId = res.data;
            $scope.$ctrl.init(res.data);
            $scope.$ctrl.signedIn = true;
            $scope.$ctrl.email = email;
            $location.path('');
          }, 2000)
        }
      })
    }
    
  })
  .component('forgotpassword', {
    controller: 'ForgotPasswordCtrl',
    templateUrl: '../templates/forgotPassword.html',
    bindings: {}
  })
