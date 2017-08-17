angular.module('app')
.factory('passwordChange', function($http) {

  var STORE_URL = 'http://127.0.0.1:3000';

  const change = function(userObj) {

    var header = {'Content-Type': 'application/json'};

    $http({
      url: `${STORE_URL}/passwordchange`,
      method: 'PUT',
      data: userObj,
      headers: header
    })
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log('whoops', err)
      });
  }

  return {
    changePassword: change
  };
})
