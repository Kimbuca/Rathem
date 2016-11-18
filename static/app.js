'use strict';
angular.module('Authentication', []);
var main = angular.module('mainApp', ['ngRoute', 'ngCookies',  'Authentication']);

//ngRUTING
main.config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider){

        $locationProvider.hashPrefix('!');

        $routeProvider.when('/compare/:cat/:p1&:p2',{
          //individual category view
          templateUrl:'/views/compare/compare.html',
          controller :'CompareCtrl',

        }).when('/',{
        	 templateUrl:'/views/homepage/homepage.html',
         	 controller:'tabCtrl',
        }).when('/rating/:productID',{
        	templateUrl:'/views/rating/rating.html',
          controller: 'RatingController',
        }).when('/login',{
          templateUrl:'/views/login/login.html',
          controller: 'LoginController',
        }).when('/signup',{
          templateUrl:'/views/signup/signup.html',
          controller: 'SignupController',
        })
        .otherwise({redirectTo: '/'});

        //$locationProvider.html5Mode(true);
  }]).run(run);




  ///////////////// AUTHENTICATION EN FRONTEND /////////////

  run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService', '$window'];
  function run($rootScope, $location, $cookieStore, $http,  AuthenticationService, $window) {
        // keep user logged in after page refresh

        //ESTA es la parte que te sirve cesar
        $rootScope.globals = $cookieStore.get('globals') || {};
        console.log($rootScope.globals);
        console.log($rootScope.globals.currentUser);

        $rootScope.brand = 'Rathem';
        $rootScope.session = false;

        if ($rootScope.globals.currentUser) {
            //existe un usuario.
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $rootScope.brand = $rootScope.globals.currentUser.username;
            $rootScope.session = true;
        }

        $rootScope.logout = function(){
            AuthenticationService.ClearCredentials();
            $window.location.reload();

        };

    }




////FAIL
  main.service('userService', function() {

        var userData = [
            {yearSetCount: 0}
        ];

        return {
            user:function() {
                return userData;
            },
            setEmail: function(email) {
                userData.email = email;
            },
            getEmail: function() {
                return userData.email;
            },
            setSetCount: function(setCount) {
                userData.yearSetCount = setCount;
            },
            getSetCount: function() {
                return userData.yearSetCount;
            }
        };
  });









  /*
      -------------------------------------------------
        CONTROLADOR DE LA VISTA COMPARE
      -------------------------------------------------
  */

main.controller('CompareCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

    //Received from url, 'routeParams' is a must
    $scope.category = $routeParams.cat;
    $scope.product1 = $routeParams.p1;
    $scope.product2 = $routeParams.p2;
    $scope.descp1 =  '';
    $scope.descp2 = '';


    //Bring me all information and comentaries about these 2 products
    // 1) search whole info, it includes average so not worry Cesar handles that
    // 2)
    $http({
        method: 'POST',
        url   : '/api/compare',
        data  : {'p1': $scope.product1, 'p2': $scope.product2},
        headers: {'Content-Type': 'application/json; charset=utf-8 '}
      }).success(function (response) {

        //console.log(response.data[0]);
        //console.log(response.data[0].comments[0]);

        //harcodeando y ganando
        $scope.descp1 = response.data[0].desc;
        $scope.descp2 = response.data[1].desc;

        $scope.commentsP1 = response.data[0].comments;
        $scope.commentsP2 = response.data[1].comments;
        console.log(  $scope.commentsP2[0]);

        $scope.p1ID = response.data[0].id;
        $scope.p2ID = response.data[1].id;

        // 5.0 -> 100%
        $scope.percentageP1 = ((response.data[0].avg * 100)/5.0);
        $scope.percentageP2 = ((response.data[1].avg * 100)/5.0);

      }).error(function(response){

    })

}]);








/*
    -------------------------------------------------
      CONTROLADOR DE LA VISTA MAIN // TAB
    -------------------------------------------------
*/

main.controller('tabCtrl',  ['$scope', '$http', '$window',
function ($scope, $http, userService, $window){


    $scope.tab = 0;
    $scope.p1 ="";
    $scope.p2 ="";

    $scope.tec_products = ['Xperia', 'Iphone', 'Laptop Toshiba', 'Samsung Galaxy', 'Htc', 'Motorola'];
    $scope.home_products = ['Raid', 'Suavitel', 'Aspiradora', 'Masageador', 'Mueble', 'fsdfdf '];
    $scope.allProducts = [{
                            catName:'Tecnología',
                            inventary: $scope.tec_products
                          }, {
                            catName:'Casa y Hogar',
                            inventary: $scope.home_products
                          }];


    $scope.getProductList = function(category){

      $http({
            method : 'POST',
            url    : '/api/homepage',
            data   :  {'cat':category},
            headers: {'Content-Type': 'application/json; charset=utf-8 '}
      }).success(function (response) {

            console.log("algo salio muy bien");
            console.log(response.products);
            $scope.selectedListProducts = response.products;


      }).error(function (response){
            console.log("algo salio mal");
      });
    };

    //function that sets dropdowns selection
    $scope.setProduct = function(n, selection){
        if(n!=2){
          $scope.p1 =selection;
          console.log("selection " +selection);
        }else{
          $scope.p2 =selection;
          console.log("selection " +selection);
        }
    };

     $scope.setTab = function(selectedTab){
       $scope.tab = selectedTab;
       console.log(selectedTab);
       //for the dropdown

       $scope.selectedCategory = $scope.allProducts[selectedTab-1].catName;
       //$scope.currentSection = $scope.$selectedCategory;
       console.log($scope.selectedCategory);
       $scope.getProductList($scope.selectedCategory);



     };

     $scope.isSet = function(currentTab){
       return $scope.tab === currentTab;
    };

}]);












/*
  -------------------------------------------------
    CONTROLADOR QUE SE LE PASA A LA VISTA LOGIN
  -------------------------------------------------
*/
main.controller('LoginController', ['$scope', '$http', '$location', '$rootScope', 'AuthenticationService', '$window', '$route',
 function($scope, $http, $location, $rootScope, AuthenticationService, $window, $route){

  AuthenticationService.ClearCredentials();

  $scope.login = function(){

    console.log($scope.form);

    $http({
          method : 'POST',
          url    : '/api/login',
          data   : $scope.form,
          headers: {'Content-Type': 'application/json; charset=utf-8 '}
    }).success(function (response) {
          console.log("no error!");
          console.log(response);

          console.log(response.valid);

          if(!response.valid){

            swal({
              title: "Error",
              text: "Nombre de usuario o contraseña incorrecto, intentelo de nuevo",
              type: "error",
              confirmButtonText: "OK"
            });
          }else {
              swal({
                title: "Bienvenido",
                text: "En un momento te redireccionaremos a la página de inicio",
                type: "success",
                showConfirmButton: false,
                timer: 2000
              },
              function(){

                //another req
                $http({
                      method : 'POST',
                      url    : '/api/login/session',
                      data   : $scope.form,
                      headers: {'Content-Type': 'application/json; charset=utf-8 '}
                }).success(function (response) {

                      console.log("Received! " +response.username);
                      AuthenticationService.SetCredentials(response.username, response.userId);
                });


                swal.close();
                $location.path('/');
                $rootScope.$apply();
                //$window.location.href = '/';
                //$window.location.reload();



              });
          }

    }).error(function(response){
          console.log("error");
          console.log(response);
    });

  }

}]);


//LoginController.$inject = ['todas las directivas y modulos que deseee']






//// El controlador que se le pasa a la vista del signup
main.controller('SignupController', ['$scope', '$http', '$location', 'userService', function($scope, $http, $location, userService){


  $scope.signup = function(){

    console.log($scope.form);

    $http({
          method : 'POST',
          url    : '/api/signup',
          data   : $scope.form,
          headers: {'Content-Type': 'application/json; charset=utf-8 '}
    }).success(function (response) {
          console.log("no error!");
          console.log(response);

          console.log(response.valid);

          if(!response.valid){

            swal({
              title: "Error",
              text: "Existio un error al crear el usuario, revisar los campos",
              type: "error",
              confirmButtonText: "OK"
            });
          }else {
              swal({
              title: "Listo",
              text: "Usuario creado, redireccionando",
              type: "success",
              showConfirmButton: false,
              timer: 2000,
            },function(){
              swal.close();
              $location.url('/');
              $scope.$apply();
            });
          }

    }).error(function(response){
          console.log("error");
          console.log(response);
    });

  }

}]);









  main.factory('dataShare', function($rootScope){
    var service = {};
    service.data = false;

    service.sendData = function(data){
        this.data = data;
        $rootScope.$broadcast('data_shared');
    };
    service.getData = function(){
       return this.data;
    };
    return service;
  });




//Controlador de la forma para reseñas
main.controller('FormController', ['$rootScope', '$cookieStore', function($rootScope, $cookieStore){

  this.review = {};
  $rootScope.globals = $cookieStore.get('globals') || {};

  this.addReview = function(phone){
    phone.reviews.push(this.review);
    this.review = {};
    console.log($rootScope.globals.currentUser.username);
  };

}]);

//Controlador de la forma para temporal
main.controller('FormControllerT', function(){

  this.getIcon = function(type){
    if(type){
      return 'thumb_up';
    }else{
      return 'thumb_down';
    }
  };

  this.review = {};
  this.reviewsT = [];

  this.addReview = function(phone){
    this.reviewsT.push(this.review);
    this.review = {};

    this.review.type = true;
  };

  this.sendReview = function(phone){
    angular.forEach(this.reviewsT, function(rev){
      if(rev.body){
        console.log(rev.body);
        phone.reviews.push(rev);
      }

    });


    this.review = {};
    this.reviewsT = [];
    this.review.type = true;
  };

});

//Controlador de la puntuacion del usuario
main.controller('ScorerController', function(){

  this.uScore = 0.0;
  this.nScore = 0.0;

  this.setScore = function(){
    this.uScore = this.nScore;
    console.log(this.uScore);
  }

});

main.controller('RatingController', ['$rootScope', '$cookieStore', '$scope', '$http', '$routeParams', function($rootScope, $cookieStore, $scope, $http, $routeParams){

    //Received from url, 'routeParams' is a must
    $scope.pID = $routeParams.productID;
    $rootScope.globals = $cookieStore.get('globals') || {};
    $scope.uID = $rootScope.globals.currentUser.userid;

    //Bring me all information and comentaries about these 2 products
    $http({
        method: 'POST',
        url   : '/api/rating',
        data  : {'rCode': 0, 'id': $scope.pID, 'uid': $scope.uID},
        headers: {'Content-Type': 'application/json; charset=utf-8 '}
      }).success(function (response) {

        console.log("Entre a success");
        console.log(response.product);
        $scope.prod = response.product;

      }).error(function(response){



    });

    $scope.getPercentage = function(score){
      return score * 100 / 5;
    };

    $scope.getIcon = function(type){
      if(type == 'pos'){
        return 'thumb_up';
      }else{
        return 'thumb_down';
      }
    };

    //Aqui empieza la parte de reviewsT

    $scope.review = {};
    $scope.reviewsT = [];

    $scope.addReview = function(){
      //console.log($scope.review.type);
      $scope.reviewsT.push($scope.review);
      $scope.review = {};

      $scope.review.type = 'pos';
    };

    $scope.sendReview = function(){
      angular.forEach($scope.reviewsT, function(rev){
        if(rev.body){
          //console.log(rev.body);
          ///////phone.reviews.push(rev);
          $scope.prod.comments.push(rev);
          //Falta el query!!!!!!!

          //QUERY INSERT cada review
          //Bring me all information and comentaries about these 2 products
          $http({
              method: 'POST',
              url   : '/api/rating',
              data  : {'rCode': 2, 'id': $scope.pID, 'uid': $scope.uID, 'content': rev.body, 'type': rev.type},
              headers: {'Content-Type': 'application/json; charset=utf-8 '}
            }).success(function (response) {


            }).error(function(response){



          });


        }

      });


      $scope.review = {};
      $scope.reviewsT = [];
      $scope.review.type = 'pos';
    };


    //Aqui empieza la parte de Score
    $scope.nScore = 0.0;

    $scope.setScore = function(nScore){
      //console.log(nScore)
      $scope.prod.uscore = nScore;
      //console.log("Tu score de user es: "+$scope.prod.uscore);
      
      //QUERY
      //Bring me all information and comentaries about these 2 products
      $http({
          method: 'POST',
          url   : '/api/rating',
          data  : {'rCode': 1, 'usf': $scope.prod.usfound, 'id': $scope.pID, 'uid': $scope.uID, 'nscore': $scope.prod.uscore},
          headers: {'Content-Type': 'application/json; charset=utf-8 '}
        }).success(function (response) {

          console.log("Entre a success");
          //$scope.prod = response.product;
          if($scope.prod.usfound == 0){
            $scope.prod.usfound = 1;
          }

          console.log("Ahora tu usfound es: " + $scope.prod.usfound);

        }).error(function(response){



      });


    };

}]);

main.controller('ListController', function(){

  //id de item seleccionado y su index o age en este caso
 this.selectedItem = "asus-laptop-rog";
 this.index = 1;

 this.isSelected = function(item){
  return item === this.selectedItem;
 };

 this.setSelect = function(item, age){
  this.selectedItem = item;
  this.index = age;
 };

 this.getIcon = function(type){
    if(type){
      return 'thumb_up';
    }else{
      return 'thumb_down';
    }
  };

  this.getPercentage = function(score){
    return score * 100 / 5;
  };

 this.phones = [
    {
        "age": 0,
        "id": "motorola-xoom-with-wi-fi",
        "imageUrl": "img/motorola-xoom-with-wi-fi.1.jpg",
        "name": "Motorola XOOM\u2122 with Wi-Fi",
        "score": "2.1",
        "snippet": "The Next, Next Generation\r\n\r\nExperience the future with Motorola XOOM with Wi-Fi, the world's first tablet powered by Android 3.0 (Honeycomb).",
        "reviews":[
          {
            body: "Such a good model",
            //author: "kim@itesm.mx",
            type: true,
          }
        ]
    },
    {
        "age": 1,
        "id": "asus-laptop-rog",
        "imageUrl": "http://pngimg.com/upload/laptop_PNG5938.png",
        "name": "Asus - Laptop ROG GL552VW-CN704T",
        "score": "4.8",
        "snippet": "Todo el almacenamiento y la velocidad que necesita con 1 TB de almacenamiento en disco duro tiene la velocidad y el almacenamiento necesario. Almacenar todo lo que necesita, y cumplir con su deseo de velocidad. Con una gran pantalla de 15.6'', LED Back-lit, Ultra Slim 300nits, FHD 1920x1080 16:9. Audio de alta fidelidad cristalina con la mejor tecnología. Sistema operativo Windows 10.",
        "reviews":[
          {
            body: "Buena computadora para trabajar en programas de renderizado.",
            //author: "Cesar@itesm.mx",
            type: true,
          },
          {
            body: "Demasiado pesada, provoca dolor de espalda después de traerla durante la tarde.",
            //author: "Roberto@itesm.mx",
            type: false,
          }
        ]
    }
];

});
