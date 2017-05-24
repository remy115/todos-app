var {SHA256}=require('crypto-js');
var jwt=require('jsonwebtoken');

var data={
    id:10
}

var token=jwt.sign(data,'abc123');

var decode=jwt.verify(token,'abc123');
console.log('token',token);
console.log('decode',decode);
