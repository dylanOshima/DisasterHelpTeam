//DB
var mysql = require('mysql');

var settings = {
  host     : "uoe-hackathon.cchrymvmz7io.us-east-1.rds.amazonaws.com",
  user     : "jeffreycordero",
  port     : 3306,
  password : process.env.DB_PASSWORD,
  database : "UoE_Hackathon"
  // "connectTimeout": 30000
};

var connection = mysql.createConnection( settings );

//Check that it is connected
connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

module.exports.query = function( sql, args ) {
  console.log("QUERYING");
  return new Promise( ( resolve, reject ) => {
      connection.query( sql, args, ( err, rows ) => {
        if ( err )
            return reject( err );
        resolve( rows );
      });
  } );
}

module.exports.close = function() {
  console.log("CLOSING")
  return new Promise( ( resolve, reject ) => {
      connection.end( err => {
          if ( err )
              return reject( err );
         resolve();
      } );
  } );
}
