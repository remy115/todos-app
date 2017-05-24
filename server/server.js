require('./config/config')
const _ =require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');

const port=process.env.PORT || 3000;

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
        return resp.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        if(!todo) {
            return resp.status(404).send();
        }
        resp.send({todo});
    },(err)=>{
        console.log(`error fetching id: ${id}`);
        return resp.status(400).send();
    });

});


app.delete('/todos/:id',(req,resp)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)) {
        return resp.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo) {
            return resp.status(404).send();
        }
        resp.status(200).send({todo});
    },()=>resp.status(400).send());
});


app.patch('/todos/:id',(req,resp)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)) {
        return resp.status(404).send();
    }
    var body=_.pick(req.body,['completed','text']);
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt=new Date().getTime();
    } else {
        body.completed=false;
        body.completedAt=null;
    }
    Todo.findByIdAndUpdate(id,{
        $set:body
    },{new:true}).then((todo)=>{
        if(!todo) {
            return resp.status(404).send();
        }
        resp.send({todo});
    }).catch(()=>resp.status(400).send());
    // console.log('body',body);
    // resp.send('ok');
});


app.listen(port,()=>{
    console.log(`App started up at port ${port}`);
});

module.exports={app};
