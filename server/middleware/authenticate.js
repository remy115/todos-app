const {User} = require('./../models/user');

var authenticate=(req,resp,next)=>{
    var token=req.header('x-auth');
    User.findOneByToken(token).then((user)=>{
        if(!user) {
            return Promise.reject();
        }
        req.user=user;
        req.token=token;
        next();
    }).catch((e)=>resp.status(401).send());
}

module.exports={authenticate};