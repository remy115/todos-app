// const MongoClient=require('mongodb').MongoClient;
const {MongoClient}=require('mongodb');

var url='mongodb://localhost:27017/TodoApp';

MongoClient.connect(url,(err,db)=>{
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected!!!');

    // db.collection('Users').insertOne({
    //     name:'Remy',
    //     age:35,
    //     location:'Sao Paulo'
    // },(err,result)=>{
    //     if(err) {
    //         return console.log('Unable to connect',err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
    // });


    db.close();
});