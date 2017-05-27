var mongoose=require('mongoose');

mongoose.Promise=global.Promise;

var url=process.env.MONGODB_URI;
// console.log('url******',url);

mongoose.connect(url);

module.exports={mongoose};
