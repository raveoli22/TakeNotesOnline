var app = angular.module('noteTake',[]);

app.controller('mainController',['$scope','$http',function($scope,$http){
    $scope.formData = {};
    
    //when landing on the page, get all todos and show
    $http.get('/api/todos')
        .success(function(data){
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data){
            console.log("Error: " + data);
        });
    
    //when submitting the add form, send the text to node API
    $scope.createTodo = function(){
        $http.post('/api/todos',$scope.formData)
            .success(function(data){
            $scope.formData = {};
            $scope.todos = data;
            console.log(data);
            })
            .error(function(data){
                console.log("Error: " + data);
            });
    };

    //deleting a todo after checking it
    $scope.deleteTodo = function(id){
        $http.delete('/api/todos/'+id)
            .success(function(data){
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data){
                console.log("Error" + data);
            });
    };
}]);

app.directive('notepad',function(notesFactory) {
    return {
        restrict: 'AE',
        scope: {},
        link: function(scope,elem,attrs) {
            scope.restore = function(){
                scope.editMode = false; //if editMode is false, we are in display mode
                scope.index = -1;       //track which note is being edited, new note is -1 index
                scope.noteText = '';    //string containing is in the Note
            };
            
            scope.openEditor = function(index) {
                scope.editMode = true;
                if (index !== undefined){
                    scope.noteText = notesFactory.get(index).content;
                    scope.index = index;
                } else {
                    scope.noteText = undefined; 
                }
            };
            
            scope.save = function() {
                if (scope.noteText !== ''){
                    var note = {};
                    note.title = scope.noteText.length > 10 ? scope.noteText.substring(0,10) + '...' : scope.noteText;
                    note.content = scope.noteText;
                    note.id = scope.index != -1 ? scope.index : localStorage.length;
                    scope.ntes = notesFactory.put(note);
                }
                scope.restore();
            };
        },
        templateUrl: "./templates/notepad.html";
    };
});