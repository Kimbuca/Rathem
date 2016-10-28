var db = require("../../services/database.js");

exports.signup = function(req, res) {

    console.log(req.body);
     // db.query("SELECT COUNT(*) as found FROM users WHERE (username = ? OR email = ?) AND password = ?", [req.body.user, req.body.user, req.body.password],  function(err, results){

     //  console.log(results[0].found);
     //  console.log(err);
      
     //  res.json({
     //    "valid": results[0].found === 1
     //  });

     // });

     db.query("INSERT INTO 'users' ('userID', 'firstname', 'lastname', 'email', 'password', 'username') VALUES (NULL, ?, ?, ?, ?, ?);",[req.body.firstname,req.body.lastname,req.body.email,req.body.password,req.body.user], function(err, results){
     	console.log(results.insertID);


     });


};
