const jwt=require('jsonwebtoken');
const validator=require('validator');
const mongoose=require('mongoose');
const _=require('lodash');

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
    var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});

    return user.save().then(()=>{
        return token;
    });
}

UserSchema.statics.findOneByToken=function(token) {
    var decoded;
    // console.log('token',token);
    try {
        decoded=jwt.verify(token,'abc123');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':decoded.access
    })
};

var User=mongoose.model('User',UserSchema);

module.exports={User};
