var express=require('express');
var bodyParser=require('body-parser');

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




app.listen(3000,()=>{
    console.log('App started on port 3000');
});

module.exports={app};
