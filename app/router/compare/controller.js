var db = require("../../services/database.js");

exports.compare = function(req, res) {

    console.log(req.body);

    db.query('SELECT * FROM product WHERE pName IN (?, ?)', [req.body.p1,req.body.p2], function(err, results){

      var pList = [];

      // BUILD RETURN OBJECTS
      for (var i = 0; i < results.length; i++) {
        //pList.push(results[i].productID);

        pList.push({
            'name' : results[i].pName,
            'id'   : results[i].productID,
            'desc' : results[i].pDescription,
            'avg'  : results[i].aveRating,
            'comments' : []
        });

      };

      db.query('SELECT r.body, r.type, u.username FROM (users AS u INNER JOIN mapreview AS m ON u.userID = m.userID INNER JOIN reviews AS r ON r.reviewID = m.reviewID) WHERE r.reviewID IN (SELECT reviewID FROM mapreview WHERE productID = ?)', [pList[0].id], function(err, results){

          console.log(results[0]);
          var commList = [];

          for (var i = 0; i < results.length; i++){
              commList.push({
                    'author': results[i].username,
                    'body' : results[i].body,
                    'type' : results[i].type
              });

          };

          pList[0].comments = commList;
          console.log(pList[0]);

          db.query('SELECT r.body, r.type, u.username FROM (users AS u INNER JOIN mapreview AS m ON u.userID = m.userID INNER JOIN reviews AS r ON r.reviewID = m.reviewID) WHERE r.reviewID IN (SELECT reviewID FROM mapreview WHERE productID = ?)', [pList[1].id], function(err, results){

              console.log("ARE THERE ANY RESULTS FOR" +results[0]);
              var commList = [];

              for (var i = 0; i < results.length; i++){
                  commList.push({
                      'author': results[i].username,
                      'body' : results[i].body,
                      'type' : results[i].type
                  });

              };

              pList[1].comments = commList;
              console.log(pList[1]);

              //otro query
              res.json({
                  'data' : pList
              });

          });


      });









  });


};
