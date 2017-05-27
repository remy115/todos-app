var {SHA256}=require('crypto-js');
var jwt=require('jsonwebtoken');

const bcrypt=require('bcryptjs');

var pass=process.env.JWT_SECRET;
var hashed;
/* bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(pass,salt,(err,hash)=>{
        console.log(hash);
    });
});


hashed='$2a$10$jRmAnvjhkkWHQxfErJ6DaucwCSj..m5Olp8h5qcoq4PDLviQbGAeG';
hashed='$2a$10$y.ivNKWQwMfyYaTLM8w0gOgL2cTOjxsMVliZvceE.uZKgGuVyfHde';
hashed='$2a$10$jGjF8sXnVZ7lYLnyOtxGP.oKAungPLGCVxux2XMk/aqWYuUEoo43y';
hashed='$2a$10$l7vY.YlkKBr6gM9Japl1feUwZVKc5vWUAnzNbrQPPCgBdcqBpw5ei';
hashed='$2a$10$gktBWen04NvnBiKtygCrce3q7t/clq5L4MtlxrOPrZQyakos3Fc/6';
*/
hashed='$2a$10$t3sH0.YDKILkzuhu.GSldOCDPKT2NCjlUHSrJFyZcyo0xmh6GsHNy';

bcrypt.compare(pass,hashed,(err,res)=>{
    console.log('res',res);
});

/*
var data={id:10};
var token=jwt.sign(data,process.env.JWT_SECRET);
var decode=jwt.verify(token,process.env.JWT_SECRET);
console.log('token',token);
console.log('decode',decode);
*/