var db = require("../../services/database.js");

exports.rating = function(req, res) {
    var pList = {};

    console.log("Data enviado para el query: ");
    console.log(req.body);
    console.log("Tipo de query: ");
    console.log(req.body.rCode);

    switch(req.body.rCode){
      case 1:
        console.log("Quiero score update info");
        if(req.body.usf == 1){
          console.log("UPDATE score");

          db.query('UPDATE grades SET grade = ? WHERE (productID = ? AND userID = ?)', [req.body.nscore, req.body.id, req.body.uid], function(err, results){
            if (err) throw err;
            console.log('changed ' + results.changedRows + ' rows');
            console.log("Cambiando average");

            var nAverage = 0.0;
            db.query('SELECT * FROM grades WHERE productID = ?', req.body.id,function(err, results){

              for (var i = 0; i < results.length; i++) {
                nAverage += results[i].grade;
              }

              nAverage = nAverage / results.length;
              console.log("Tu nuevo Average es: " + nAverage);

              db.query('UPDATE product SET aveRating = ? WHERE productID = ?', [nAverage, req.body.id], function(err,results){
                if (err) throw err;
                console.log('changed ' + results.changedRows + ' rows');
              });

            });

          });
        }else{
          console.log("INSERT score");

          var gradein = { userID:req.body.uid, grade:req.body.nscore, productID:req.body.id};

          db.query('INSERT INTO grades SET ?', gradein, function(err, results){
            if (err) throw err;
            console.log("Se inserto " + results.insertId);
            res.json({
              "valid": results.insertId
            });
          });
        }

        break;
      case 2:
        console.log("Quiero review info");

        console.log("INSERT review");

          var reviewin = { body:req.body.content, type:req.body.type };

          db.query('INSERT INTO reviews SET ?', reviewin, function(err, results){
            if (err) throw err;
            console.log("Se inserto " + results.insertId);

            var reviewMapin = {userID:req.body.uid, productID:req.body.id, reviewID:results.insertId};
            
            db.query('INSERT INTO mapreview SET ?', reviewMapin, function(err, results){
              if (err) throw err;
              console.log("Review completado");

            });

          });


        break;
      default:
        console.log("Quiero producto info");
        db.query('SELECT * FROM product WHERE productID = ?', [req.body.id], function(err, results){

          if(err) throw err;

          pList = {
                'name' : results[0].pName,
                'id'   : results[0].productID,
                'uscore' : 0.0,
                'usfound' : 0,
                'desc' : results[0].pDescription,
                'category'  :  results[0].category,
                'avg'  : results[0].aveRating,
                'comments' : []
            };

          var rvs = [];

          db.query('SELECT body, type FROM reviews WHERE reviewID IN (SELECT reviewID FROM mapreview WHERE (productID = ? AND userID = ?))', [req.body.id, req.body.uid], function(err, results){

            if(err) throw err;

            for (var i = 0; i < results.length; i++) {
              row = {
                "body" : results[i].body,
                "type" : results[i].type
              };

              rvs.push(row);
            };

            pList.comments = rvs;

            db.query('SELECT grade FROM grades WHERE (productID = ? AND userID = ?)', [req.body.id, req.body.uid], function(err, results){
              if(err) throw err;

              if(results.length > 0){
                pList.uscore = results[0].grade;
                pList.usfound = 1;
              }
              
              console.log("intentare enviar");
              console.log(pList);

              res.json({
               "product"  : pList
              });

            });

          });

        });
    }



    


};
