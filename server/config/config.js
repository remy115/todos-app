var env=process.env.NODE_ENV;
// console.log('env******',env);
if(env === 'dev' || ! env) {
    process.env.MONGO_URI='mongodb://localhost:27017/TodoApp';
} else if(env === 'test') {
    process.env.MONGO_URI='mongodb://localhost:27017/TodoAppTest';
} else {
    process.env.MONGO_URI='mongodb://remy115:coragem9@cluster0-shard-00-00-e5d73.mongodb.net:27017,cluster0-shard-00-01-e5d73.mongodb.net:27017,cluster0-shard-00-02-e5d73.mongodb.net:27017/TodoApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
}