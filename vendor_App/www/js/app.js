// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'] ,function ($httpProvider) {

            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            //http://stackoverflow.com/questions/19254029/angularjs-http-post-does-not-send-data

            var param = function(obj) {
                var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

                for(name in obj) {
                    value = obj[name];

                    if(value instanceof Array) {
                        for(i=0; i<value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if(value instanceof Object) {
                        for(subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if(value !== undefined && value !== null)
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function(data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];
        } )

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by  (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.style();
    }
  });
}).service('MyService', function(){

    this.selection = []; 

}).config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider){
  $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller : 'AppCtrl'
  }).state('register',{
    url: '/register',
    templateUrl : 'templates/register.html',
    controller : 'AppCtrl'

  }).state('tabs',{
    url : "/tab",
    abstract : true,
    templateUrl : 'templates/tabs.html',
    controller : 'AppCtrl'
  }).state('tabs.dashboard',{
    url : '/dashboard',
    views : {
      'dashboard.tab' : {
        templateUrl : 'templates/dashboard.html'
      }
    }
  }).state('tabs.profile',{
    url : '/profile',
    views : {
      'profile.tab' : {
        templateUrl : 'templates/profile.html'
      }
    }
  }).state('tabs.addVendor',{
    url : '/addVendor',
    views : {
      'addVendor.tab' : {
        templateUrl : 'templates/addVendor.html'
      }
    }
  }).state('tabs.placeOrder',{
    url : '/placeOrder',
    views : {
      'placeOrder.tab' : {
        templateUrl : 'templates/placeOrder.html',
        controller : 'AppCtrl'
      }
    }
  }).state('tabs.order',{

    url : '/order',
    views : {
      'placeOrder.tab' : {
        templateUrl : 'templates/order.html',
        controller : 'AppCtrl'
      }
    }
 

  }).state('tabs.checkOrder',{
    
    url : '/checkOrder',
    views : {
      'placeOrder.tab' : {
        templateUrl : 'templates/checkOrder.html',
        controller : 'AppCtrl'
      }
    }
  }).state('tabs.orderStatus',{
    url : '/orderStatus',
    views :  {
      'orderStatus.tab' : {
        templateUrl : 'templates/orderStatus.html'
      }
    }
  });

  $urlRouterProvider.otherwise("/login");

  $ionicConfigProvider.platform.android.tabs.position('bottom');

}).controller('AppCtrl', function($scope,$q, $rootScope,$ionicPlatform, $state,$cordovaGoogleAnalytics, $http, $ionicPopup, $ionicModal, MyService){
  
 // function _waitForAnalytics(){
    if(typeof analytics !== 'undefined'){
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-81275661-1');
        $cordovaGoogleAnalytics.trackView('My Application');
    }
//     else{
//         setTimeout(function(){
//             _waitForAnalytics();
//         },250);
//     }
// };
    
  //  _waitForAnalytics();

     var statesLink = "https://api.orderline.com.ng/api/states";
        $scope.getStates = function(){

        $http.get(statesLink).success(function(res){

          $scope.states = res.data;
        

        }).error(function(error){

          console.log(error);
        })
 
      };

      $ionicPlatform.ready(function(){
        $scope.getStates();
      })
   
    $scope.data = {};
    var link1 = "https://api.orderline.com.ng/api/signup";

      $scope.doRegister = function(){
        if(window.Connection){
          if(navigator.connection.type == Connection.NONE){
            $scope.showAlert = function() {
              var alertPopup = $ionicPopup.alert({
                 title: 'Connection',
                 template: 'No Internet Connection. Please turn on your Mobile Data or WLAN'
              });

                alertPopup.then(function(res) {
              });
            };
            return $scope.showAlert();
            
          }else{
              $http.post(link1, $scope.data).success(function(){
                console.log($scope.data);
              $scope.showAlert = function() {
                var alertPopup = $ionicPopup.alert({
                 title: 'Success',
                 template: 'Account Successfully Created'
             });

                 alertPopup.then(function(res) {
                  $state.go('login');
               });
              };
              return $scope.showAlert();
          
        }).error(function(failureRespose){
          $scope.showAlert = function() {
                var alertPopup = $ionicPopup.alert({
                 title: 'Error',
                 template: failureRespose.message
             });

                 alertPopup.then(function(res) {
               });
              };
             return $scope.showAlert(); 
        })
          }
        }
       };
       $scope.edit = {}
       var editLink = "https://api.orderline.com.ng/api/editProfile";
       $scope.editProfile = function(){

        $http.post(editLink, $scope.edit, {params : {"phone": $rootScope.phone, "name" : $rootScope.name, "email" : $rootScope.email, "address" : $rootScope.location}}).success(function(res){
          $ionicPopup.alert({
            title : 'Success', 
            template : res.message
          });
        }).error(function(err){
          console.log(err);
        })

       }

 
      $scope.loginData = {};
      var dashboard = "https://api.orderline.com.ng/api/dashboard"
      var url = "https://orderline.com.ng/api/api/vendors";
      var link = "https://orderline.com.ng/api/api/signin";
      var profileLink = "https://api.orderline.com.ng/api/profile";
      $scope.doLogin = function(){ 
        //  if(window.Connection){
        //    if(navigator.connection.type == Connection.NONE){
          //    $scope.showAlert = function() {
          //     var alertPopup = $ionicPopup.alert({
          //        title: 'Internet Connection',
          //        template: 'No Internet Connection. Please turn on your Mobile Data or WLAN'
          //     });

          //       alertPopup.then(function(res) {
          //     })
          //  };
          //    return $scope.showAlert();

     //    }else{
            $http.post(link, $scope.loginData).success(function(response){
                $rootScope.phone = response.data.customer[0].phone;
                $rootScope.email = response.data.customer[0].email;
                $rootScope.name = response.data.customer[0].name;
                
              $http.get(url, {params:{"phone": $rootScope.phone}}).success(function(response){
                $rootScope.vendors = response.data;
              }).error(function(error){
              })
              
                $http.get(getOrderlink, {params:{"phone": $rootScope.phone}}).success(function(response){
                $rootScope.getOrders =  response.data;
                console.log("I am here");
                console.log(response.data);
              }).error(function(error){
                  console.log(error);
              });

               $http.get(dashboard, {params : {"phone":$rootScope.phone}}).success(function(res){
                $scope.dash = res;
                $rootScope.total_vendor = $scope.dash.total_vendor;
                $rootScope.total_order = $scope.dash.total_order;
                $rootScope.status = $scope.dash.last_order_status;
                $rootScope.order_delivery = $scope.dash.last_order_delivery_date;
                console.log($scope.dash)
              }).error(function(err){
               console.log('network error we have here');
               console.log($rootScope.phone);
              })

              $http.get(profileLink, {params : {"phone":$rootScope.phone}}).success(function(res){
                $rootScope.location = res.data.profile[0].address;
                $rootScope.name = res.data.profile[0].name;
                $rootScope.email = res.data.profile[0].email;
                console.log(res);
              }).error(function(err){
                console.log(err);
              })


              $state.go('tabs.placeOrder');

            }).error(function(error){
              console.log(error);
              $ionicPopup.alert({
                title: 'Error',
                template : error
              })
            //     $scope.showAlert = function() {
            //     var alertPopup = $ionicPopup.alert({
            //      title: 'Error!',
            //      template: error.message
            //  });

            //      alertPopup.then(function(res) {
            //    });
            //   };
            //   return $scope.showAlert();
            })
        
      }
  //   }
  // }

     var getOrderlink = "https://api.orderline.com.ng/api/getorders"; 
      $scope.doRefresh = function(){

         if(window.Connection){
          if(navigator.connection.type == Connection.NONE){
           $scope.showAlert = function() {
              var alertPopup = $ionicPopup.alert({
                 title: 'Internet Connection',
                 template: 'No Internet Connection. Please turn on your Mobile Data or WLAN'
              });

                alertPopup.then(function(res) {
              });
            };
            return $scope.showAlert();

          }else{

        $http.get(getOrderlink, {params:{"phone": $rootScope.phone}}).success(function(response){

                $scope.getOrders =  response.data;

                console.log("I am here");
                $state.go('tabs.orderStatus');
                console.log(response.data);
              }).error(function(response){
              })

          }
        }
      }
      
    $scope.vendor = {};
    var link2 = "https://api.orderline.com.ng/api/add_vendor";
    $scope.addVendor = function (){

      if(window.Connection){
          if(navigator.connection.type == Connection.NONE){
             $scope.showAlert = function() {
              var alertPopup = $ionicPopup.alert({
                 title: 'Internet Connection',
                 template: 'No Internet Connection. Please turn on your Mobile Data or WLAN'
              });

                alertPopup.then(function(res) {
              });
            };
            return $scope.showAlert();

          }else{
             $scope.vendor.customer_id = $scope.phone;
        $http.post(link2, $scope.vendor).success(function(response){
            $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: 'Vendor Successfully Added'
          });

            alertPopup.then(function(res) {
         });
         return $scope.showAlert();
        };
         }).error(function(error){
          $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: error.message
          });

          alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
           });
        };
             return $scope.showAlert();
         })

          }
       
       }
       
    }
    
    $scope.selectedValue = function(select){
        $rootScope.myVendorid = select;
    }
    $scope.selectVendor = function(){

       if(window.Connection){
          if(navigator.connection.type == Connection.NONE){
             $scope.showAlert = function() {
              var alertPopup = $ionicPopup.alert({
                 title: 'Internet Connection',
                 template: 'No Internet Connection. Please turn on your Mobile Data or WLAN'
              });

                alertPopup.then(function(res) {
              });
            };
            return $scope.showAlert();

          }else{

            $http.get("https://api.orderline.com.ng/api/price_list", {params:{"vendor_id": $rootScope.myVendorid, "phone": $rootScope.phone}})
          .success(function(response2){ 
            $rootScope.products = response2.data;
              $state.go('tabs.order');
            }).error(function(){
            $scope.showAlert =  function(){
             var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please check your internet connection'
            })
                alertPopup.then(function(res) {
            })
          
            }          
             return $scope.showAlert();
                  
            });
       
          }
        }
        
    }; 
    
    $scope.numbers = [];
      var i;
       for(i =1; i <= 50; i++)
       {
         $scope.numbers.push(i);
       };
      
      
       $scope.product = {};
       $rootScope.selection = MyService.selection;
       $scope.addToCart = function addToCart(product){

       if(product.quantity == undefined){
            $scope.showAlert = function() {
              var alertPopup = $ionicPopup.alert({
              title: 'Warning!',
               template: 'Please Choose Quantity'
            });

             alertPopup.then(function(res) {
             });
         };
         return $scope.showAlert();
       }else{
           
           $rootScope.selection.push(product);
           console.log($rootScope.selection)
              $scope.showAlert = function() {
           var alertPopup = $ionicPopup.alert({
               title: 'Success',
               template: 'Product Added to Cart'
           });

            alertPopup.then(function(res) {   
           });
         };
         
         return  $scope.showAlert();
       }
    };
      $scope.placeMyOrder = function(){
        if($rootScope.selection == ""){
        $scope.cartAlert = function(){
             var alertPopup = $ionicPopup.alert({
                title: 'Warning',
                template: 'Cart Cannot be left empty\t Please Place an Order'
             });

             alertPopup.then(function(res){

            })
        }
          return $scope.cartAlert();
        }else{
              $state.go('tabs.checkOrder');
      }      
    };

     $scope.removeOrder = function(index) {
       $rootScope.selection.splice(index, 1);
     }
     
    $scope.getTotal = function(){
        var i;
        var total = 0;
      for(i = 0; i < $rootScope.selection.length; i++)
      {
        total+= ($rootScope.selection[i].quantity * $rootScope.selection[i].price);
      }
       return total;
      } 

           
    var placeOrderLink = "https://api.orderline.com.ng/api/placeorder";


      $scope.finalOrder = [];

     $scope.placeFinalOrder = function(){

       if(window.Connection){
          if(navigator.connection.type == Connection.NONE){
             $scope.showAlert = function() {
              var alertPopup = $ionicPopup.alert({
                 title: 'Internet Connection',
                 template: 'No Internet Connection. Please turn on your Mobile Data or WLAN'
              });

                alertPopup.then(function(res) {
                  $rootScope.selection = [];
              });
            };
            return $scope.showAlert();

          }else{
         angular.forEach($rootScope.selection, function(orderItem) {

        $scope.finalOrder.push({
             vendor_id : $rootScope.myVendorid, 
             product_id : orderItem.product_id,
             quantity : orderItem.quantity,
             customer_id : $rootScope.phone,
             price : orderItem.price 
        })
       })
       $scope.items = {items : $scope.finalOrder};
        console.log($scope.items);
           $http.post(placeOrderLink, $scope.items).success(function(response){
            console.log(response);
                $scope.finalOrder = [];
               MyService.selection = [];
          $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: 'Order Successfully Placed'
           });

          alertPopup.then(function(res) {
          $state.go('tabs.placeOrder');
          $rootScope.selection = [];   
           });
        };
        return $scope.showAlert();
        
             }).error(function(){
               
          })

        }
     } 

     
}

    $scope.back = function(){
      $state.go('tabs.placeOrder');
    };
    

      $ionicModal.fromTemplateUrl('templates/modal-view.html', 
      {
        scope : $scope
      }).then(function(modal){
        $scope.modal = modal;
      })

      var orderedItemsLink = "https://api.orderline.com.ng/api/items_ordered";

       $scope.openModal = function(receipt, totalAmount,message,date, status) {
         if(window.Connection){
          if(navigator.connection.type == Connection.NONE){
             $scope.showAlert = function() {
              var alertPopup = $ionicPopup.alert({
                 title: 'Internet Connection',
                 template: 'No Internet Connection. Please turn on your Mobile Data or WLAN'
              });

                alertPopup.then(function(res) {
              });
            };
            return $scope.showAlert();
          }else{
        $scope.receipt = receipt;
        $scope.totalAmount = totalAmount;
        $scope.message = message;
        $scope.date = date;
        $scope.status = status

        if($scope.status == -1){
          $scope.dis_status = "Declined"
        }else if($scope.status == 0){
          $scope.dis_status = "Pending"
        }else if($scope.status == 1){
          $scope.dis_status = "Approved"
        }else if($scope.status == 2){
          $scope.dis_status = "Delivered"
        }
       
        $http.get(orderedItemsLink, {params : {'receipt': receipt, 'phone': $rootScope.phone}}).success(function(result){
          console.log(result.data);
         $scope.orderedItems = result.data;
        }).error(function(error){
        });
         $scope.orderedItems;

      $scope.totalAmount = function(){
        var i;
        var total = 0;
          for(i = 0; i < $scope.orderedItems.length; i++)
          {
            total+= ($scope.orderedItems[i].quantity * $scope.orderedItems[i].price);
          }
         return total;
        } 

      }
    }

          $scope.modal.show();
        };
       $scope.closeModal = function() {
          $scope.modal.hide();
       };
      
      $scope.logOut = function(){
       window.localStorage.removeItem("username");
       $state.go('login');
    };

      $scope.backOrder = function(){
       $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Warning',
          template: 'Are you sure you want to go back?'
         });

       confirmPopup.then(function(res) {
         if(res) {
          $rootScope.selection = [];
          $state.go('tabs.placeOrder');
          console.log($rootScope.selection);
         } else {
          console.log('You are not sure');
         }
      });
    };
      return $scope.showConfirm();
   }

})
