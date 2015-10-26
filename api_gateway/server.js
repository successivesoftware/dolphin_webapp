var express      = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var path         = require("path");
var fs           = require('fs');
var app          = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser("secret", {"path": "/"}));
app.use(express.static(path.join(__dirname, '../dolphin_webapp/api_gateway')));

/*
app.use(express.static(path.join(__dirname, '../app')));
app.use(express.static(path.join(__dirname, '../')));
*/



var port = process.env.PORT || 9000;
var router = express.Router();

// middleware for every route
router.use(function(req, res, next) {
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'Any Kind of get request' });
});
router.get('/user', function(req, res) {
  fs.readFile('files/users.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    res.json(data);
  });


});

router.route('/test')
  .post(function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    fs.readFile('files/users.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      if(username == data.username) {
        if(password == data.password){
          res.send(data);
        } else {
          res.status(400).send({message: 'Sorry username is not found'})
        }
      } else {
        res.status(400).send({message: 'Sorry password does not match'})
      }
    });
});
router.route('/auth')
  .post(function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    fs.readFile('files/users.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = JSON.parse(data);
      if(username == data.userName) {
        if(password == data.password){
          res.send(data);
        } else {
          res.status(400).send({message: 'Sorry username is not found'})
        }
      } else {
        res.status(400).send({message: 'Sorry password does not match'})
      }
    });
});

// Multiple record (query 'kind' allowed)
router.route('/:database/v2/:table')
  .get(function(req, res) {
    var database = req.params.database;
    var table = req.params.table;
    var kind = req.query.kind;
    var maxResult = req.query.maxResults;
    fs.readFile('files/reports.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      data = JSON.parse(data);
      data.length = 25;
      res.jsonp(data);
    });
   })
//res.status(400).send({message: 'Sorry password does not match'})
  .post(function(req, res) {
    res.json({ message: 'Post/Database/V2/Table' });
   })
  .put(function(req, res) {
    res.json({ message: 'Put/Database/V2/Table' });
});

// Single record by id
router.route('/:database/v2/:table/:id')
  .get(function(req, res) {
    res.json({ message: 'Get/Database/V2/Table/Id' });
  })
  .patch(function(req, res) {
    res.json({ message: 'Patch/Database/V2/Table/Id' });
  })
  .delete(function(req, res) {
    res.json({ message: 'Delete/Database/V2/Table/Id' });
});

// Undelete a single deleted record
router.route('/:database/v2/:table/:id/undelete')
  .post(function(req, res) {
    res.json({ message: 'Post/Database/V2/Table/Id/Undelete' });
});

module.exports = router;
app.use('/api', router);
app.listen(port);
console.log('node server runing at  ' + port);
