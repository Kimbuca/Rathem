var db = require("../../services/database.js");

exports.signup = function(req, res) {

    console.log(req.body);
    console.log("Se va a intentar insertar");
     // db.query("SELECT COUNT(*) as found FROM users WHERE (username = ? OR email = ?) AND password = ?", [req.body.user, req.body.user, req.body.password],  function(err, results){

     //  console.log(results[0].found);
     //  console.log(err);
      
      // res.json({
      //   "valid": results[0].found === 1
      // });

     // });

     var userin = { firstname: req.body.firstname, lastname:req.body.lastname, email:req.body.email, password:req.body.password, username:req.body.user};
     db.query('INSERT INTO users SET ?',userin, function(err, results){
     	console.log("Se inserto " + results.insertId);

      res.json({
        "valid": results.insertId
      });

     });


};
