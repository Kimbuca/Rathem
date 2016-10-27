var db = require("../../services/database.js");
var sess = require("../../../server.js");

exports.login = function(req, res) {


    console.log(req.body);

    db.query("SELECT COUNT(*) as found FROM users WHERE (username = ? OR email = ?) AND password = ?", [req.body.user, req.body.user, req.body.password],  function(err, results){
      //another query

        res.json({
           "valid"    : results[0].found === 1
        });
    });

    //	res.sendFile('static/views/login.html');
};



exports.session = function(req, res){
  console.log(sess);
  sess=req.session;

  db.query("SELECT userID, username FROM users WHERE (username = ? OR email = ?) AND password = ?", [req.body.user, req.body.user, req.body.password],  function(err, results){

      sess.userId =  results[0].userID;
      sess.username = results[0].username;
      console.log(sess);

      res.json({
        "userId"    : sess.userId,
        "username"  : sess.username
      });


  });


};
