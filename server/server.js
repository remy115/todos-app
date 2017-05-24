var express=require('express');
var bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');


var app=express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo=new Todo({
        text:req.body.text,
        completed: req.body.completed === true
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});


app.get('/todos',(req,resp)=>{
    Todo.find().then((todos)=>{
        resp.send({todos});
    },(e)=>{
        throw e;
    });
});


app.get('/todos/:id',(req,resp)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)) {
        resp.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        if(!todo) {
            return resp.status(404).send();
        }
        resp.send({todo});
    },(err)=>{
        console.log(`error fetching id: ${id}`);
        resp.status(400).send();
    });

});




app.listen(3000,()=>{
    console.log('App started on port 3000');
});

module.exports={app};
