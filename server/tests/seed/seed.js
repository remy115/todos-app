const {ObjectID}=require('mongodb');
const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');
const jwt=require('jsonwebtoken');

const todos=[
    {
        _id:new ObjectID(),
        text:'first test todo!'
    },
    {
        _id:new ObjectID(),
        text:'second test todo!',
        completed:true,
        completedAt:3345
    }
];

const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const users=[{
_id:userOneId,
email:'email1@email.com',
password:'userOnePass',
tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId.toHexString(),access:'auth'},'abc123')
}]
},{
    id:userTwoId,
    email:'email2@email.com',
    password:'userTwoPass'
}];

const populateTodos=(done)=>{
    Todo.deleteMany({}).then(()=>{
        Todo.insertMany(todos).then((res)=>{
            done();
        },(err)=>done(err));
    },done);
};

const populateUsers=(done)=>{
    User.remove({}).then(()=>{
        var user1=new User(users[0]).save();
        var user2=new User(users[1]).save();
        return Promise.all([user1,user2]);
    }).then(()=>done());
}

module.exports={todos,populateTodos,users,populateUsers};