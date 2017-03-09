var app = angular.module('noteTake',[]);

app.controller('mainController',['$scope','$http','$document','$window',function($scope,$http,$document,$window){
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
        
        $( "#dialog" ).dialog();
        var theNote = document.getElementById("noteEditor");
       
        var text = document.getElementById("theTextArea");
        
        text.value = window.frames['richTextField'].document.body.innerHTML;
        console.log(text.value);
        $scope.formData.text = text.value;
        
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
    
    $scope.insertImage = function(){
        var imageURL = prompt("Enter the image URL");
        if (imageURL != ""){
            $scope.doFormat('insertImage',imageURL);
        }
        else {
            alert("Image Error");
        }
    };
    
    $scope.insertLink = function(){
      var linkURL = prompt("Enter the Link URL");
      if (linkURL != ""){
          $scope.doFormat('createLink',linkURL);
      }
      else {
          alert("Link Error");
      }
    };
    
}]);

//scope is inherited from parent scope 
app.directive('editor',function(){
   return{
       restrict: 'E',
       templateUrl:"/js/templates/editor.html",
       replace: true,
       link: function(scope,elem,attrs){
            richTextField.document.designMode = 'on';
            scope.doFormat = function(cmd,val) {
                richTextField.document.execCommand(cmd,false,val);
            };
       }
   }; 
});

//directive to remove HTML 
app.filter('removeHTML', function(){
    return function(text){
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
});
