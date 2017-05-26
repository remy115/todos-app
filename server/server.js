require('./config/config')
const _ =require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');
// const bcrypt=require('bcryptjs');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
var {authenticate}=require('./middleware/authenticate.js');

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



app.post('/users',(req,resp)=>{
    var userObj=_.pick(req.body,['email','password']);
    var user=new User(userObj);
    user.save().then(()=>{
        var token1=user.generateAuthToken();
        return token1;
        // resp.send(user);
    }).then((token)=>{
        resp.header('x-auth',token).send({user});
    }).catch((e)=>{
        // console.log('erro em POST /users',typeof(e),e.toString());
        resp.status(406).send(e.toString());
    });
});


// LOGIN
app.post('/users/login',(req,resp)=>{
    var email=req.body.email;
    var pass=req.body.password;
    // console.log(`email: ${email}, pass: ${pass}`);
    // resp.send({email,pass});
    User.findByCredentials(email,pass).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            return resp.header('x-auth',token).send({user});
        });
    }).catch((e)=>{
        resp.status(400).send(e);
    });
});


// LOGOUT
app.delete('/users/me/token',authenticate,(req,resp)=>{
    req.user.removeToken(req.token).then(()=>{
        resp.status(200).send();
    },()=>{
        resp.status(400).send();
    });
});


app.get('/users/me',authenticate,(req,resp)=>{
    resp.send(req.user);
});


app.listen(port,()=>{
    console.log(`App started up at port ${port}`);
});

module.exports={app};
