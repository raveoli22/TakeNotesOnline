var app = angular.module('noteTake',[]);

app.controller('mainController',['$scope','$http','$document','$window',function($scope,$http,$document,$window){
    $scope.btnShow = false;  //default delete button not showing
    $scope.index = -1; //index of current note selected by user
    $scope.noteExists = false; //boolean for whether or not a note exists
    
    $scope.open = function(i,index){
        $scope.editMode = true; 
        window.frames['richTextField'].document.body.innerHTML = i.text;
        $scope.index = index; 
        $scope.noteExists = true; 
        //console.log(index);
        //console.log($scope.allNotes.length);
    };
    
    $scope.backToMenu = function(){
        $scope.editMode = false; 
        $scope.noteExists = false; 
    };
    
    $scope.selected = 'normal'; //default font size
    $scope.selectedFont = 'Times New Roman'; //default font text
    
    $scope.formData = { //notes model we are passing in
        subject: "",
        text: ""
    };
    
    $scope.editMode = false; 
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
    //use http put or patch
    $scope.createNote = function(){
        
        if ($scope.noteExists){
            //todo: http put to specific id and body
            console.log('note exists');
            $( "#dialog" ).dialog('close');
            
            var text = document.getElementById("theTextArea");
            text.value = window.frames['richTextField'].document.body.innerHTML; //transfers rich text field to text area
            window.frames['richTextField'].document.body.innerHTML = "";         //clears field after it is saved
            
            $scope.formData.text = text.value;
            $scope.formData.subject = $scope.noteSubject;            
            console.log($scope.index);
            
            $http.put('/api/notes/'+$scope.allNotes[$scope.index]._id,$scope.formData)
                .success(function(data){
                $scope.formData = {};
                $scope.allNotes = data;
                console.log(data);
                })
                .error(function(data){
                    console.log("Error: " + data);
                });
            $scope.noteExists = false; 
            $scope.editMode = false;
        }
        else {
            $( "#dialog" ).dialog('close');
            $scope.editMode = false;
            
            var text = document.getElementById("theTextArea");
            text.value = window.frames['richTextField'].document.body.innerHTML; //transfers rich text field to text area
            window.frames['richTextField'].document.body.innerHTML = ""; //clears field after it is saved
            //console.log(text.value);
            $scope.formData.text = text.value;
            $scope.formData.subject = $scope.noteSubject;
            //console.log($scope.noteSubject);
            $http.post('/api/notes',$scope.formData)
                .success(function(data){
                $scope.formData = {};
                $scope.allNotes = data;
                console.log(data);
                })
                .error(function(data){
                    console.log("Error: " + data);
                });
                noteExist = false; 
        }
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
    
    $scope.popUp = function() {          //popup function
        $( "#dialog" ).dialog();
        var theNote = document.getElementById("noteEditor");
    };
    
    
    $scope.insertImage = function(){     //insert image function
        var imageURL = prompt("Enter the image URL");
        if (imageURL != ""){
            $scope.doFormat('insertImage',imageURL);
        }
        else {
            alert("Image Error");
        }
    };
    
    $scope.insertLink = function(){        //insert link function
      var linkURL = prompt("Enter the Link URL");
      if (linkURL != ""){
          $scope.doFormat('createLink',linkURL);
      }
      else {
          alert("Link Error");
      }
    };
    
    
    $scope.changeFontSize = function (){      //font sizes
        switch($scope.selected){
            case 'xlarge':
                $scope.doFormat('fontSize',6);
                break;
            case 'xxlarge':
                $scope.doFormat('fontSize',7);
                break;
            case 'large':
                $scope.doFormat('fontSize',5);
                break;
            case 'small':
                $scope.doFormat('fontSize',3);
                break;
            case 'xsmall':
                $scope.doFormat('fontSize',2);
                break;
            case 'xxsmall':
                $scope.doFormat('fontSize',1);
                break;
            default: 
                $scope.doFormat('fontSize',4);
                break;
        };
    };
    
    $scope.changeFontType = function(){           //font types
        switch($scope.selectedFont){
            case 'Times New Roman': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Palatino Linotype': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Georgia': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Arial': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Arial Black': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Comic Sans MS': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Impact': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Lucida Sans Unicode': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Tahoma': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Verdana': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Helvetica': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Lucida Console': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            case 'Courier New': 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
            default: 
                $scope.doFormat('fontName',$scope.selectedFont);
                break;
        };
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
