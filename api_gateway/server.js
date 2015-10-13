var express      = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var path         = require("path");
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

router.route('/test')
  .post(function(req, res) {
    res.json({ message: 'Post Testing Echo' });
});

// Multiple record (query 'kind' allowed)
router.route('/:database/v2/:table')
  .get(function(req, res) {
    res.json({ message: 'Get/Database/V2/Table' });
   })
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
