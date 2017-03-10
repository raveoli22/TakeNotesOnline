// server.js

var express        =   require('express');
var app            =   express();
var mongoose       =   require('mongoose');
var morgan         =   require('morgan');
var bodyParser     =   require('body-parser');
var methodOverride =   require('method-override');

// configuration =================

mongoose.connect('mongodb://yuxli066:user123@ds113660.mlab.com:13660/note_test');  // connect to mongoDB database

app.use(express.static(__dirname+'/public'));                   //tells express where static files will be
app.use(morgan('dev'));                                         //log every request to console
app.use(bodyParser.urlencoded({'extended':'true'}));            //parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     //parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//define model ===================================================
var NOTE = mongoose.model('NOTE', {
    subject: String,
    text: String
});

//Express Routes ==================================================
//API ROUTES-------------------------------------------------------
//API ROUTES-------------------------------------------------------

// get all notes --------------------------------------------------
app.get('/api/notes', function(req,res){ // <----- right here sends our notes to /api/notes 
        
        //find to get all notes in database
        NOTE.find(function(err,notes){
        //if there is error retrieving, send error, nothing after error will execute
        if(err){
            res.send(err);
        }
        res.json(notes); //return all notes in JSON format
    });
});

//create a note and send back all notes after creation
app.post('/api/notes',function(req,res){  //<--- right here creates a new note and then sends it to /api/notes                   
    //create a note, information comes from AJAX request from angular
    NOTE.create({
        subject: req.body.subject,
        text: req.body.text,
        done: false
    }, function(err,note){
        if(err){
            res.send(err);
        }
        
        //get and return all the notes after you create another
        NOTE.find(function(err,notes){
            if(err){
                res.send(err);
            }
            res.json(notes);
        });
    });
    console.log('hello');
    console.log(req.body);
});

//delete a note
app.delete('/api/notes/:note_id', function(req,res){ //<--- finds the id given by mongo and delete it
    NOTE.remove({
        _id: req.params.note_id
    }, function(err,note){
        if(err){
            res.send(err);
        }
        
        //get and return all notes after you delete one
        NOTE.find(function(err,notes){
            if(err){
                res.send(err);
            }
            res.json(notes);
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