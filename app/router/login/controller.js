var db = require("../../services/database.js");

exports.login = function(req, res) {

    console.log(req.body);
    db.query("SELECT COUNT(*) as found FROM users WHERE (username = ? OR email = ?) AND password = ?", [req.body.user, req.body.user, req.body.password],  function(err, results){
  
      //another query
        res.json({
           "valid"    : results[0].found === 1
        });
    });
};
