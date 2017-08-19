const Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const db = require('./db/config.js');
const User = require('./models/user.js');
const Capsule = require('./models/capsule.js');
const util = require('./utility.js')

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const fs = require('fs')
var mongoose = require('mongoose');
var _ = require('lodash');

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

const emailService = require('./email.js');
const cronScan = require('./cronScan.js');
const hashPassword = require('./models/hashPassword.js');
const jwt = require('jwt-simple');
const moment = require('moment');

const app = express();

app.set('jwtTokenSecret', 'youwillneverguess');

app.use('/bower_components',  express.static( path.join(__dirname, '../bower_components')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('client'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/upload/:capId', multipartMiddleware, (req, res) => {
  capId = req.params.capId
  console.log(req.files.file.name)
  var writestream = gfs.createWriteStream({
    filename: req.files.file.name,
    metadata: {
      capsuleId: capId,
      filename: req.files.file.name
    }
  });

  fs.createReadStream(req.files.file.path).pipe(writestream);

  writestream.on('close', function(file) {
    Capsule.findById(req.params.capId, function(err, capsule) {
      // handle error
      console.log('contents', capsule.contents)
      capsule.files.push(mongoose.Types.ObjectId(file._id));
      capsule.save(function(err, updatedCapsule) {
        // handle error
        if (err) {
          console.log(err)
        }
        return res.status(200).json(file._id)
      })
    })

    fs.unlink(req.files.file.path, function(err) {
      // handle error
      console.log('success!')
    });
  });

  // res.json({fileId: file._id})
});

app.get('/download/:fileId', function(req, res) {
  gfs.exist({ _id: req.params.fileId }, function(err, found) {
      if (err) {
        handleError(err); 
        return;
      }

      if (!found) {
        res.send('Error on the database looking for the file.')
        return;
      }
      // We only get here if the file actually exists, so pipe it to the response
      var readstream = gfs.createReadStream({ _id: req.params.fileId })
      console.log('RS', readstream)
      readstream.pipe(res);
  });
});

app.get('/', (req, res) => {
  console.log(req);
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/capsule', (req, res) => {
  console.log(`Served: GET request for "/capsule"`);
  res.sendFile(path.join(__dirname, '../client/capsuleView.html'));
});

app.get('/capsule/:id', (req, res) => {
  const requestedCapsule = req.params.id;
  console.log(`Served: GET request for "/capsule/${requestedCapsule}"`);
  res.sendFile(path.join(__dirname, '../client/capsuleView.html'));
});

app.get('/capsules/:id', function(req, res) {
  const requestedCapsule = req.params.id;
  Capsule.find({ _id: requestedCapsule }, (err, capsule) => {
    if (err) {
      console.error(`Error retrieving Capsule ${requestedCapsule}: ${err}`);
      res.sendStatus(404);
    } else {
      console.log(`GET request for Capsule ${requestedCapsule} successful`);
      res.send(capsule);
    }
  });
});

app.post('/signup', (req, res) => {
  let newUser = User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  // the password will be hashed in the user file before save gets called
  newUser.save((err) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
    } else {
      console.log('New user created');
      res.sendStatus(201);
    }
  });
});

app.post('/signin', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.error(`ERROR: ${err}`);
      res.sendStatus(404);
    } else if (!user) {
      console.log(`Could not find user with email ${req.body.email}`);
      res.sendStatus(404);
    } else {
      user.comparePassword(req.body.password, (err, matches) => {
        if (err) {
          console.error(`Signin error: ${err}`)
          res.sendStatus(404);
        } else if (!matches) {
          console.log('Password did not match');
          res.sendStatus(404);
        } else {
          console.log(`Successful user signin for email ${req.body.email}`);
          res.send(user._id);
        }
      });
    }
  });
});

app.post('/capsules/all', (req, res) => {
  console.log('req body userId', req.body);
  Capsule.find({ _user: req.body.userId }, (err, capsules) => {
    if (err) {
      console.error(`All capsules retrieval error: ${err}`);
      res.sendStatus(404);
    } else if (!capsules) {
      console.log('Could not retrieve all capsules');
      res.sendStatus(404);
    } else {
      console.log(`Successfully retrieved all capsules for user ${req.body.userId}`);
      res.send(capsules);
    }
  });
});

app.post('/capsules/buried', (req, res) => {
  Capsule.find({ _user: req.body.userId, buried: true }, (err, capsules) => {
    if (err) {
      console.error(`Buried capsules retrieval error: ${err}`);
      res.sendStatus(404);
    } else if (!capsules) {
      console.log('Could not retrieve buried capsules');
      res.sendStatus(404);
    } else {
      console.log(`Successfully retrieved buried capsules for user ${req.body.userId}`);
      res.send(capsules);
    }
  });
});

app.post('/capsules/inProgress', (req, res) => {
  Capsule.find({ _user: req.body.userId, buried: false }, (err, capsules) => {
    if (err) {
      console.error(`In progress capsules retrieval error: ${err}`);
      res.sendStatus(404);
    } else if (!capsules) {
      console.log('Could not retrieve in progress capsules');
      res.sendStatus(404);
    } else {
      console.log(`Successfully retrieved in progress capsules for user ${req.body.userId}`);
      res.send(capsules);
    }
  });
});

app.post('/create', (req, res) => {
  let newCapsule = Capsule({
    _user: req.body.userId,
    capsuleName: '',
    contents: [],
    buried: false,
    unearthed: false,
    unearthDate: null,
    createdAt: Date.now(),
    unearthMessage: ''
  });

  newCapsule.save((err) => {
    if (err) {
      console.error(`ERROR creating capsule in database: ${err}`)
    } else {
      console.log(`New empty capsule created for user ${req.body.userId}`);
      res.send(newCapsule._id);
    }
  });
});

app.put('/edit', (req, res) => {
  let newName = req.body.capsuleName;
  let capsuleId = req.body.capsuleId;
  let newContents = req.body.capsuleContent;
  console.log('server capsuleId', capsuleId)
  Capsule.findOne({ _id: capsuleId }, (err, capsule) => {
    if (err) {
      console.error(`ERROR: ${err}`);
      res.sendStatus(404);
    } else if (!capsule) {
      console.log(`Could not find capsule with id ${capsuleId}`);
      res.sendStatus(404);
    } else {
      capsule.capsuleName = newName;
      capsule.contents = newContents;
      capsule.save((err) => {
        if (err) {
          console.error(`ERROR editing capsule ${capsuleId}: ${err}`);
          res.sendStatus(504);
        } else {
          console.log(`Capsule ${capsuleId} successfully edited`);
          res.sendStatus(200);
        }
      });
    }
  });
});

app.post('/delete', (req, res) => {
  Capsule.remove({ _id: req.body.capsuleId }, (err) => {
    if (err) {
      console.error(`Failed to remove capsule ${req.body.capsuleId} from the database`);
      res.sendStatus(504);
    } else {
      console.log(`Successfully removed capsule ${req.body.capsuleId} from the database`);
      res.sendStatus(204);
    }
  });
});

app.put('/bury', (req, res) => {
  let capsuleId = req.body.capsuleId;
  let unearthDate = req.body.unearthDate;

  Capsule.findOne({ _id: capsuleId })
    .populate('_user')
    .exec((err, capsule) => {
      if (err) {
        console.error(`ERROR: ${err}`);
        res.sendStatus(404);
      } else if (!capsule) {
        console.log(`Could not find capsule with id ${capsuleId}`);
        res.sendStatus(404);
      } else {
        capsule.buried = true;
        capsule.unearthDate = unearthDate;
        // let year = capsule.unearthDate.getFullYear();
        // let month = capsule.unearthDate.getMonth() + 1;
        // let day = capsule.unearthDate.getDate();
        capsule.unearthMessage =
          `
          You may open this capsule on ${unearthDate}!!!
          `;
        capsule.save((err) => {
          if (err) {
            console.error(`ERROR burying capsule ${capsuleId}: ${err}`);
            res.sendStatus(504);
          } else {
            console.log(`Capsule ${capsuleId} successfully buried`);
            res.sendStatus(200);
          }
        });
      }
    });
});

app.put('/emailPassword', (req, res) => {
  let email = req.body.email;

  let expires = moment().add('days', 1).valueOf();
  let timedToken = jwt.encode({
    exp: expires
  }, app.get('jwtTokenSecret'));
  
  let message = `Hi there, someone said you forgot your password.
If that was you, click the link below to reset your password. If not, have a chilled out day!

http://localhost:3000/#/forgotPassword?email=${email}&token=${timedToken}`

emailService.sendEmail(email, message, ((err, info) => {
  if (err) {
    res.sendStatus(404);
  } else if (info) {
    res.send('hello');
  }
}));
});

app.put('/forgotPassword', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  let token = req.body.token
  
  let decoded = jwt.decode(token, app.get('jwtTokenSecret'))

  if (decoded.exp <= Date.now()) {
    res.end('Access token has expired', 400);
  } else {
    hashPassword(req.body.password, req.body.email, res);
  }

  
});

app.put('/passwordchange', (req, res) => {
  hashPassword(req.body.password, req.body.email, res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
