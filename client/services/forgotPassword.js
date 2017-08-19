angular.module('app')
.factory('forgotPasswordEmail', function($http) {

  var STORE_URL = 'http://127.0.0.1:3000';

  const change = function(userObj, cb) {

    var header = {'Content-Type': 'application/json'};

    $http({
      url: `${STORE_URL}/emailPassword`,
      method: 'PUT',
      data: userObj,
      headers: header
    })
      .then(function(res) {
        cb(true);
      })
      .catch(function(err) {
        console.log('whoops', err)
        cb(false);
      });
  }

  return {
    forgotPassword: change
  };
})
