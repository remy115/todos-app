const jwt=require('jsonwebtoken');
const validator=require('validator');
const mongoose=require('mongoose');
const _=require('lodash');
const bcrypt=require('bcryptjs');

var UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:4
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON=function() {
    var user=this;
    var userObj=user.toObject();
    return _.pick(userObj,['_id','email']);
}

UserSchema.methods.generateAuthToken=function() {
    var user=this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
    user.tokens.push({access,token});

    return user.save().then(()=>{
        return token;
    });
}

UserSchema.methods.removeToken=function(token){
    var user=this;
    return user.update({
        $pull:{tokens:{token}}
    });
}

UserSchema.statics.findOneByToken=function(token) {
    var decoded;
    // console.log('token',token);
    try {
        decoded=jwt.verify(token,process.env.JWT_SECRET);
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':decoded.access
    })
};

UserSchema.statics.findByCredentials=function(email,pass) {
    var User=this;
    return User.findOne({email}).then((user)=>{
        if(!user) {
            return Promise.reject('User not found!');
        }
        return new Promise((res,rej)=>{
            bcrypt.compare(pass,user.password,(err,comp)=>{
                if(err) {
                    return rej(err);
                }
                if(!comp) {
                    return rej('Invalid Password22!');
                }
                res(user);
            });
        });
    });
}

UserSchema.pre('save',function(next) {
    var user=this;
    // console.log(`$$$$$$$$ saving - email: ${user.email} ===> _id: ${user._id.toHexString()}`);
    if(user.isModified('password')) {
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User=mongoose.model('User',UserSchema);

module.exports={User};
