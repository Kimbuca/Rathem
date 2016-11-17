var db = require("../../services/database.js");

exports.homepage = function(req, res) {

    console.log(req.body);

    db.query('SELECT pName FROM product WHERE category = ?', [req.body.cat], function(err, results){

      if(err) throw err;
      var list = [];


      for (var i = 0; i < results.length; i++) {
        list.push(results[i].pName);
      };

      console.log(list);

      res.json({
         "products"  : list
     });


  });


};
