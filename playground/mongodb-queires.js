const {mongoose}=require('./../server/db/mongoose');
const {User}=require('./../server/models/user');


var id='592451358823db77b5d86f39kk';

User.findById(id).then((res)=>{
    if( ! res) {
        return console.log('User not found!');
    }
    console.log(res);
},(err)=>console.log('ERROR HERE!'));
