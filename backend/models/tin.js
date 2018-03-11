var db = require('../db');

// const Model = {
//   tableName: 'tin',
//   fields: {
//     id: 'FaceBook_ID',
//     first_name: 'first_name',
//     last_name: 'last_name',
//     lng: 'latitude',
//     lat: 'longitude',
//   }
// }
//
// exports.Model = Model

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

    await db.query("INSERT INTO TIN (first_name, last_name, id) VALUES " + values)
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

const reqMakePair = async function(req, res) {
    let pairData = req.body;
    console.log("pairing >> ", pairData);

    var values = "(";
    for (var property in pairData) {
      if (pairData.hasOwnProperty(property)) {
        values += "'" + pairData[property] + "',";
      }
    }
    values = values.slice(0,-1) + ")";

    await db.query("INSERT INTO RespondPairs (id, responder_id, tin_id) VALUES " + values)
      .then( result => {
        console.log("Inserted, ", result);
        res.send(pairData)
      }).catch( err => {
        console.error("Query Failed: ", err);
        db.close();
      });

    res.send("Error")
}

module.exports.reqMakePair = reqMakePair;
