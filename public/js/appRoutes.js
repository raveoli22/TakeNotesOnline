angular.module('appRoutes',[])
    
    .config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
        
        $routeProvider
            //home page
            .when('/',{
                templateUrl:'views/editor.html',
                controller: 'mainController'
            })
        
            //Login page
            .when('/login',{
                templateUrl: 'views/login.html',
                controller: 'loginController'
            });
        $locationProvider.html5Mode(true);
    
    }])
    
    .run(['$rootScope', '$location', '$cookieStore', '$http',function($rootScope,$location,$cookieStore,$http){
    
    }]);