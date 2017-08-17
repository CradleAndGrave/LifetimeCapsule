angular.module('app')
  .controller('ProfileCtrl', function($scope) {
    this.password = '';
  })

.component('profilePage', {
  controller: 'ProfileCtrl',

  bindings: {
    email: '=',
    userId: '='
  },

  
 templateUrl: '../templates/profile.html'

})
