// const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected!!!');

    /* db.collection('Todos').findOneAndUpdate({_id:new ObjectID('59239b47ea54faa0de96fdbb')},{
        $set:{
            completed:true
        }
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
    }); */

    db.collection('Users').findOneAndUpdate({_id: new ObjectID('59238c7436cdbc100737bd73')},{
        $set:{
            name:'Remy'
        },
        $inc:{
            age:1
        }
    },{
        returnOriginal:false
    }).then((res)=>{
        console.log(res);
    });

});