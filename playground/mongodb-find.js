// const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected!!!');


    /* db.collection('Todos').find({_id:new ObjectID('5923556137cb6b6e52413892')}).toArray().then((docs)=>{
        console.log('Todos list');
        console.log(JSON.stringify(docs,undefined,2));

    },(err)=>{
        console.log('Error fetching data!');
    }); */
    /* db.collection('Todos').find().count().then((count)=>{
        console.log('Todos count: '+count);

    },(err)=>{
        console.log('Error counting data!');
    }); */

    db.collection('Users').find({name:'Remy'}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs,undefined,2));
    });

});