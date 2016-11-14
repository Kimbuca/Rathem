'use strict';


var main = angular.module('mainApp', ['ngRoute']);

//ngRUTING
main.config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider){

        //$locationProvider.hashPrefix('!');

        $routeProvider.when('/compare',{
          //individual category view
          templateUrl:'/views/compare/compare.html',
        }).when('/',{
        	 templateUrl:'/views/homepage/homepage.html',
         	 controller:'tabCtrl'
        }).when('/rating',{
        	templateUrl:'/views/rating/rating.html',
        }).when('/login',{
          templateUrl:'/views/login/login.html',
          controller: 'LoginController',
        }).when('/signup',{
          templateUrl:'/views/signup/signup.html',
          controller: 'SignupController',
        })
        .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);
  }]);




/*

  //factorydata for comunication inbetween views
  main.factory('comparison', function($scope){
      //return the obect

      var data = {
              selectedCategory: ''
      };
      return {

              getCat: function () {
                  return data.selectedCategory
              },
              setCat: function (cat) {
                  data.selectedCategory = cat;
              }
            };
  });*/






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








main.controller('tabCtrl',  ['$scope', 'userService', function ($scope, userService){



    $scope.tab = 0;
    $scope.p1 ="";
    $scope.p2 ="";
    //comparison.setCat('dsasadsadasd')
    //$scope.compar.selectedCategory="dfsdfsdsf";
    //$scope.comparison = comparison;
    //$scope.compa.selectedCategory = $scope.currentSection;

    $scope.tec_products = ['Xperia', 'Iphone', 'Laptop Toshiba', 'Samsung Galaxy', 'Htc', 'Motorola'];
    $scope.home_products = ['Raid', 'Suavitel', 'Aspiradora', 'Masageador', 'Mueble', 'fsdfdf '];
    $scope.allProducts = [{
                            catName:'Tecnologia',
                            inventary: $scope.tec_products
                          }, {
                            catName:'Casa y Hogar',
                            inventary: $scope.home_products
                          }];


    //function that sets dropdowns selection
    $scope.setProduct = function(n, selection){
        if(n!=2){
          $scope.p1 =selection;
        }else{
          $scope.p2 =selection;
        }
    };

     $scope.setTab = function(selectedTab){
       $scope.tab = selectedTab;
       //console.log(selectedTab);
       //for the dropdown
       $scope.selectedListProducts = $scope.allProducts[selectedTab-1].inventary;
       $scope.selectedCategory = $scope.allProducts[selectedTab-1].catName;
       $scope.currentSection = $scope.$selectedCategory;
       console.log($scope.currentSection);
     };

     $scope.isSet = function(currentTab){
       console.log(userService.getEmail());
       $scope.user =  userService.getEmail();

       return $scope.tab === currentTab;
    };

    angular.element(document).ready(function () {
         console.log(userService.getEmail());
    });

    //$scope.brand = 'Rathem';
    $scope.user =  userService.getEmail();





}]);












/*
  -------------------------------------------------
    CONTROLADOR QUE SE LE PASA A LA VISTA LOGIN
  -------------------------------------------------
*/
main.controller('LoginController', ['$scope', '$http', '$location', 'userService', function($scope, $http, $location, userService){


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

                      console.log("Received! " +response.userId);
                      userService.setEmail(response.userId);
                      console.log("Received! " +userService.getEmail());
                      //alert("In init userId: " +userService.getEmail());

                });


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
main.controller('FormController', function(){

  this.review = {};

  this.addReview = function(phone){
    phone.reviews.push(this.review);
    this.review = {};
  };

});

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
