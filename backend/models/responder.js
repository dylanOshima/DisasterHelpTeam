var db = require('../db');

// const Model = {
//   tableName: 'responder',
//   fields: {
//     id: 'FaceBook_ID',
//     first_name: 'first_name',
//     last_name: 'last_name',
//     lng: 'latitude',
//     lat: 'longitude',
//   }
// }
//
// module.exports.Model = Model

//CREATE A NEW RESPONDER
const reqPost = async function(req, res) {
    let responder = req.body;

    var values = "(";
    for (var property in responder) {
      if (responder.hasOwnProperty(property)) {
        values += "'" + responder[property] + "',";
      }
    }
    values = values.slice(0,-1) + ")";
    console.log("responder >> ", values);

    await db.query("INSERT INTO Responders (first_name, last_name, id) VALUES " + values)
      .then( result => {
        console.log("Inserted, ", result);
        res.send(responder)
      }).catch( err => {
        console.error("Query Failed: ", err);
        db.close();
      });

    res.send("Error")
}

module.exports.reqPost = reqPost;

//GETS ALL RESPONDERS
const reqGet = async function(req, res) {
  let data;

  await db.query("SELECT * FROM Responders")
    .then( rows => {
      data = rows
    }).catch( err => {
      console.error("Query Failed: ", err);
      db.close();
    });

  res.send(data);
}

module.exports.reqGet = reqGet;
