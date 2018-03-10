var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET users listing. */
router.get('/', function(req, res, next) {

  //START TEST QUERY
  db.query('SELECT *', function (err, rows, fields) {
    if (err) throw err;

    console.log(fields);
    console.log(rows);
  })
  //END TEST QUERY

  res.send(fields, rows);
});

module.exports = router;
