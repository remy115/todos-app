var mongoose=require('mongoose');

mongoose.Promise=global.Promise;

// mongodb://remy115:coragem9>@cluster0-shard-00-00-e5d73.mongodb.net:27017,cluster0-shard-00-01-e5d73.mongodb.net:27017,cluster0-shard-00-02-e5d73.mongodb.net:27017/TodoApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin

var url=process.env.PORT ? 'mongodb://remy115:coragem9@cluster0-shard-00-00-e5d73.mongodb.net:27017,cluster0-shard-00-01-e5d73.mongodb.net:27017,cluster0-shard-00-02-e5d73.mongodb.net:27017/TodoApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin' : 'mongodb://localhost:27017/TodoApp';

mongoose.connect(url);

module.exports={mongoose};
