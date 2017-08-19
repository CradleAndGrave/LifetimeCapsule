angular.module('app')
.factory('sendNewAfterForgottenPassword', function($http) {

  var STORE_URL = 'http://127.0.0.1:3000';

  const change = function(userObj, cb) {

    var header = {'Content-Type': 'application/json'};

    $http({
      url: `${STORE_URL}/forgotPassword`,
      method: 'PUT',
      data: userObj,
      headers: header
    })
      .then(function(res) {
        cb(res);
      })
      .catch(function(err) {
        console.log('whoops', err)
        cb(err);
      });
  }

  return {
    forgotPassword: change
  };
})
