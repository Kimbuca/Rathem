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


//LoginController.$inject = ['todas las directivas y modulos que deseee']
