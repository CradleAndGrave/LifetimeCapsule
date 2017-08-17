angular.module('app')
  .controller('ProfileCtrl', function($scope, passwordChange) {
    this.newPassword = '';

    this.error = false;
    this.success = false;
      
    this.handlePasswordChange = (password, email) => {
      this.error = false;
      var obj = { password: password, email: email };

      passwordChange.changePassword(obj, (err, res) => {
        if (err) {
          this.error = true
          console.log(err)
        } else {
          this.success = true;
        }
      })
    }

  })

.component('profilePage', {
  controller: 'ProfileCtrl',

  bindings: {
    email: '='
  },

  
 templateUrl: '../templates/profile.html'

})
