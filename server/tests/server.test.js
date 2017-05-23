const expect=require('expect');
const request=require('supertest');

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
        text:'first test todo!'
    },
    {
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

