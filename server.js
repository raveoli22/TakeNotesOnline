// server.js

var express        =   require('express');
var app            =   express();
var mongoose       =   require('mongoose');
var morgan         =   require('morgan');
var bodyParser     =   require('body-parser');
var methodOverride =   require('method-override');

// configuration =================

mongoose.connect('mongodb://leo:user123@ds113000.mlab.com:13000/todo');  // connect to mongoDB database

app.use(express.static(__dirname+'/public'));                   //tells express where static files will be
app.use(morgan('dev'));                                         //log every request to console
app.use(bodyParser.urlencoded({'extended':'true'}));            //parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     //parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//define model ===================================================
var Todo = mongoose.model('Todo', {
    text: String
});

//Express Routes ==================================================
//API ROUTES-------------------------------------------------------
//API ROUTES-------------------------------------------------------
// get all todos --------------------------------------------------
app.get('/api/todos', function(req,res){
        
        //find to get all todos in database
        Todo.find(function(err,todos){
        //if there is error retrieving, send error, nothing after error will execute
        if(err){
            res.send(err);
        }
        res.json(todos); //return all todos in JSON format
    });
});

//create a todo and send back all todos after creation
app.post('/api/todos',function(req,res){
    //create a todo, information comes from AJAX request from angular
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err,todo){
        if(err){
            res.send(err);
        }
        
        //get and return all the todos after you create another
        Todo.find(function(err,todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

//delete a todo
app.delete('/api/todos/:todo_id', function(req,res){
    Todo.remove({
        _id: req.params.todo_id
    }, function(err,todo){
        if(err){
            res.send(err);
        }
        
        //get and return all todos after you delete one
        Todo.find(function(err,todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});
//API ROUTES-------------------------------------------------------
//API ROUTES-------------------------------------------------------
//API ROUTES-------------------------------------------------------
app.get('*',function(req,res){
    res.sendfile('./public/index.html');
});




// listen (start app with node server.js) ======================================
app.listen(8000);
console.log("App listening on port 8000");