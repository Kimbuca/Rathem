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
  });




main.controller('tabCtrl',  ['$scope', function ($scope, comparison){

    $scope.tab = 0;
    $scope.p1 ="";
    $scope.p2 ="";
    $scope.currentSection = 'Rathem';
    $scope.compar = comparison;
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
      return $scope.tab === currentTab;
    };


    $scope.makeComparison = function(){

      //$scope.comparison.p2 = $scope.p2;
      //$scope.comparison.selectedCategory = $scope.$selectedCategory;

    };
}]);



//// El controlador que se le pasa a la vista del login
main.controller('LoginController', ['$scope', '$http', function($scope, $http){

  $scope.name = 'HOLA';
  $scope.login = function(){

    console.log("makiing login");
    console.log($scope.form);


    /*
    var data = $.param({
         json: JSON.stringify({
             name: $scope.form.user,
             pasw: $scope.form.password
         })
    });*/

    //  console.log(data.json);

    $http({
          method : 'POST',
          url    : '/api/login',
          data   : $scope.form,
          headers: {'Content-Type': 'application/json; charset=utf-8 '}
    }).success(function (response) {
          console.log("no error!");
          console.log(response);
    }).error(function(response){
          console.log("error");
          console.log(response);
    });



    //$http.post("/login", data)



    /*
    $http.post('/post', $scope.form, config)
            .success(function ($scope.form, status, headers, config) {
                $scope.PostDataResponse = $scope.form;
            })
            .error(function ($scope.form, status, header, config) {
                alert("error!");
            });
    /*    var posting = $http({
            method: 'POST',
            url: '/post',
            data: $scope.form,
            processData: false
     });*/
  }


}]);

//// El controlador que se le pasa a la vista del signup
main.controller('SignupController', ['$scope', '$http', function($scope, $http){

  $scope.name = 'HOLA';
  $scope.login = function(){

    console.log("making signup");
    console.log($scope.form);


    $http({
          method : 'POST',
          url    : '/api/signup',
          data   : $scope.form,
          headers: {'Content-Type': 'application/json; charset=utf-8 '}
    }).success(function (response) {
          console.log("no error!");
          console.log(response);
    }).error(function(response){
          console.log("error");
          console.log(response);
    });

  }


}]);

//LoginController.$inject = ['todas las directivas y modulos que deseee']

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
  
  this.review = {};
  this.reviewsT = {};

  this.addReview = function(phone){
    this.reviewsT.push(this.review);
    this.review = {};
  };

  this.sendReview = function(phone){
    angular.forEach(reviewsT, function(rev){
      phone.reviews.push(rev);
    });

    this.reviewsT = {};
    this.review = {};
  };

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

 this.phones = [
    {
        "age": 0, 
        "id": "motorola-xoom-with-wi-fi", 
        "imageUrl": "img/motorola-xoom-with-wi-fi.1.jpg", 
        "name": "Motorola XOOM\u2122 with Wi-Fi", 
        "snippet": "The Next, Next Generation\r\n\r\nExperience the future with Motorola XOOM with Wi-Fi, the world's first tablet powered by Android 3.0 (Honeycomb).",
        "reviews":[
          {
            body: "Such a good model",
            author: "kim@itesm.mx"
          }
        ]
    }, 
    {
        "age": 1, 
        "id": "asus-laptop-rog", 
        "imageUrl": "http://pngimg.com/upload/laptop_PNG5938.png", 
        "name": "Asus - Laptop ROG GL552VW-CN704T", 
        "snippet": "Todo el almacenamiento y la velocidad que necesita con 1 TB de almacenamiento en disco duro tiene la velocidad y el almacenamiento necesario. Almacenar todo lo que necesita, y cumplir con su deseo de velocidad. Con una gran pantalla de 15.6'', LED Back-lit, Ultra Slim 300nits, FHD 1920x1080 16:9. Audio de alta fidelidad cristalina con la mejor tecnología. Sistema operativo Windows 10.",
        "reviews":[
          {
            body: "Buena computadora para trabajar en programas de renderizado.",
            author: "Cesar@itesm.mx"
          },
          {
            body: "Demasiado pesada, provoca dolor de espalda después de traerla durante la tarde.",
            author: "Roberto@itesm.mx"
          }
        ]
    }
];

});