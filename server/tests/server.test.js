const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

var {app}=require('./../server');
var {Todo}=require('./../models/todo');

describe('POST /todos',()=>{
    var text='testing todo insertion';
    beforeEach((done)=>{
        Todo.deleteMany({text}).then((result)=>{
            console.log('beforeEach - result',result.result);
            done();
        }).catch((err)=>{
            if(err) throw err;
        });
    });
    it('should insert a todo',(done)=>{
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((resp)=>{
            expect(resp.body.text).toBe(text);
        }).end((err,resp)=>{
            if(err) return done(err);

            function delete1() {
                return true;
                /* Todo.deleteMany({text},(err)=>{
                    done(err);
                }); */
            }


            Todo.find({text}).then((res)=>{
                if(res.length === 1 && res[0].text === text) {
                    delete1();
                    done();
                } else {
                    delete1();
                    done(new Error(`Qtd: ${res.length} -- Original Text: ${text}`));
                }
            }).catch(done);

        });
    });

    it('should not insert a todo',(done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err) return done(err);
            // console.log('res',res.error);
            if(res.error) done();

        })
    })
});

const todos=[
    {
        _id:new ObjectID(),
        text:'first test todo!'
    },
    {
        _id:new ObjectID(),
        text:'second test todo!'
    }
];

describe('GET /todos',()=>{
    beforeEach((done)=>{
        Todo.deleteMany({}).then(()=>{
            Todo.insertMany(todos).then((res)=>{
                done();
            },(err)=>done(err));
        },done);
    });

    it('should load todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todos.length).toBe(2);
            }).end(()=>done());
    });
});

describe('GET /todos/:id',()=>{
    it('should return a todo',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should return 404 for a valid id but inexistant',(done)=>{
        var id=new ObjectID('123oijfken28');
        // var id=todos[0]._id.toHexString();
        // console.log(id.toHexString());
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for an invalid id',(done)=>{
        request(app)
            .get('/todos/2j23cc')
            .expect(404)
            .end(done);
    });
});
