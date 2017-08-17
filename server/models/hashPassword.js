const SALT_FACTOR = 10;
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const User = require('./user.js');

// this code is kind of horrific

const gen = Promise.promisify(bcrypt.genSalt);
const hashy = Promise.promisify(bcrypt.hash);

const hasher = function(newPassword, email, res) {
  gen(SALT_FACTOR)
    .catch((err) => console.log ("the hashing function errored, ", err))
    .then((salt) => hashy(newPassword, salt))
    .catch((err) => console.log ("the hashing function errored, ", err))
    .then((hash) =>
          User.findOneAndUpdate({ email: email }, { password: hash }, (err, user) => {
            if (err) {
              console.error(`ERROR: ${err}`);
              res.sendStatus(404);
            } else if (!user) {
              console.log(`Could not find user with email ${req.body.email}`);
              res.sendStatus(404);
            } else {
              res.send(user);
            }
          })
         )
}

const hashPassword = Promise.promisify(hasher);

module.exports = hashPassword;
