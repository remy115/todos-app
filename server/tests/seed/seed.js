const {ObjectID}=require('mongodb');
const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');
const jwt=require('jsonwebtoken');

const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const todos=[
    {
        _id:new ObjectID(),
        text:'first test todo!',
        _creator:userOneId
    },
    {
        _id:new ObjectID(),
        text:'second test todo!',
        completed:true,
        completedAt:3345,
        _creator:userTwoId
    }
];

const users=[{
_id:userOneId,
email:'email1@email.com',
password:'userOnePass',
tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId.toHexString(),access:'auth'},process.env.JWT_SECRET)
}]
},{
    _id:userTwoId,
    email:'email2@email.com',
    password:'userTwoPass',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userTwoId.toHexString(),access:'auth'},process.env.JWT_SECRET)
}]
}];

const populateTodos=(done)=>{
    // console.log('TODOS -- userOneId',userOneId.toHexString());
    // console.log('TODOS -- userTwoId',userTwoId.toHexString());
    Todo.deleteMany({}).then(()=>{
        Todo.insertMany(todos).then((res)=>{
            done();
        },(err)=>done(err));
    },done);
};

const populateUsers=(done)=>{
    // console.log('USERS @@@ userOneId',userOneId.toHexString());
    // console.log('USERS @@@ userTwoId',userTwoId.toHexString());
    // console.log('##################################### POPULATEUSER!! ###################################################');
    User.remove({}).then(()=>{
        var user1=new User(users[0]).save();
        var user2=new User(users[1]).save();
        return Promise.all([user1,user2]);
    }).then(()=>done());
}

module.exports={todos,populateTodos,users,populateUsers};