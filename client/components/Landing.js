angular.module('app')
  .controller('LandingCtrl', function($scope, Auth) {

  this.username = '';
  this.password = '';
  this.butnClicked = true;
  this.signup = true;
  this.error = false;
  this.sisu = 'Need to Sign Up?';

  this.getStarted = () => {
  	this.butnClicked = false;
  }

  this.handleSignUp = (username, password, email) => {

    this.error = false;
  	var obj = {username: username, password: password, email: email};

    Auth.signup(obj, (err, res) => {
      if (err) {
        this.error = true
      } else {
        $scope.$ctrl.userId = res;

        // Sign them in if successful sign up
        this.handleSignIn(email, password)
        setTimeout(this.toggle, 100);
      }
  	})
  }

  this.handleSignIn = (email, password) => {

    this.error = false;
  	var obj = {email: email, password: password};
    
  	Auth.signin(obj, (err, res) => {
      if (err) {
        this.error = true;
      } else {
        $scope.$ctrl.email = email;
        $scope.username = '';
        $scope.password = '';
        $scope.$ctrl.userId = res;
        $scope.$ctrl.signedIn = true;
        $scope.$ctrl.init(res);
      }
  	})
  }

  this.toggle = () => {
    this.error = false;
  	this.signup = !this.signup;
    this.style = !this.style;
  	if (this.signup) {
  	  this.sisu = 'Need to Sign Up?';
  	} else {
  	  this.sisu = 'Have an account? Sign In!';
  	}
  }

})
.component('landingPage', {
  controller: 'LandingCtrl',
  bindings: {
  	signedIn: '=',
    userId: '=',
    init: '=',
    email: '='
  },
  templateUrl: '../templates/landing.html'
})

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
          } else if (strengthPercent <= 0.50) {
            scope.type = 'warning';
          } else if (strengthPercent <= 0.75) {
            scope.type = 'warning';
          } else {
            scope.type = 'success';
            scope.text = 'Perfect';
          }

        });
      }
    }
  });

