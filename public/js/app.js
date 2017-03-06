var app = angular.module('noteTake',[]);

app.controller('mainController',['$scope','$http',function($scope,$http){
    $scope.btnShow = false; 
    
    $scope.formData = {};
    
    //when landing on the page, get all todos and show
    $http.get('/api/notes')
        .success(function(data){
            $scope.allNotes = data;
            console.log(data);
        })
        .error(function(data){
            console.log("Error: " + data);
        });
    
    //when submitting the add form, send the text to node API
    $scope.createNote = function(){
        $http.post('/api/notes',$scope.formData)
            .success(function(data){
            $scope.formData = {};
            $scope.allNotes = data;
            console.log(data);
            })
            .error(function(data){
                console.log("Error: " + data);
            });
    };

    //deleting a todo after checking it
    $scope.deleteNote = function(id){
        $http.delete('/api/notes/'+id)
            .success(function(data){
                $scope.allNotes = data;
                console.log(data);
                $scope.hovering = false; 
            })
            .error(function(data){
                console.log("Error" + data);
            });
    };
}]);

app.directive('deleteArea',function(){
  return{
    scope:{
      btnShow:'@buttonShow',
        color: '=color2'
    },
    restrict: 'AE',
    replace: true,
    template: '<div  ng-hide="btnShow" style="border: 1px solid black; display: inline-block;"><button>{{btnShow}}</button></div>',
    link: function(scope,elem,attrs){
      elem.bind('mouseover',function(){
        elem.css('cursor','pointer');
        scope.$apply(function(){
            scope.btnShow = "true"; 
        });
      });
      elem.bind('mouseleave',function(){
          scope.$apply(function(){
              scope.btnShow = "false";
          });
      });
      
    }
  }
});
