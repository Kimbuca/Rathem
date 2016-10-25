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



    if(localStorage.getItem('username') != null){
      console.log("ya hay un valor");
    }

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









/*
  -------------------------------------------------
    CONTROLADOR QUE SE LE PASA A LA VISTA LOGIN
  -------------------------------------------------
*/
main.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location){

  $scope.name = 'HOLA';
  $scope.grant_access = function(){
    $location.url('/');

  }


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
                timer: 2500
              },
              function(){


                swal.close();
                localStorage.clear();
                //localStorage.removeItem("name");
                localStorage.setItem('username', $scope.form.user);
                console.log(localStorage.getItem('username'));
                $location.url('/');
                //$scope.grant_access();

                /*
                setTimeout(function(){

                   console.log("ve atras");
                   $window.history.back();
                }, 500);*/
              });
          }

    }).error(function(response){
          console.log("error");
          console.log(response);
    });

  }

}]);


//LoginController.$inject = ['todas las directivas y modulos que deseee']
