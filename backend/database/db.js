var settings = {
  host     : "uoe-hackathon.cchrymvmz7io.us-east-1.rds.amazonaws.com",
  user     : "jeffreycordero",
  port     : 3306,
  password : process.env.DB_PASSWORD
};

var mysql = require('mysql');

console.log("Settings: ", settings);

var connection = mysql.createConnection(settings);

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

connection.end();

module.exports = connection;
