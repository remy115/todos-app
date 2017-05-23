// const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected!!!');

    /* db.collection('Todos').deleteMany({text:'Eat lunch'}).then((res)=>{
        console.log('deleted!',res);
    }); */

    /* db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
        console.log(result);
    }); */
    /* db.collection('Users').deleteMany({name:'Remy'}).then((res)=>{
        console.log(res.result);
    }); */

    db.collection('Users').findOneAndDelete({_id:new ObjectID('59238c767c05f31012590fe2')}).then((res)=>{
        console.log(res);
    });
});