const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

var {app}=require('./../server');
var {Todo}=require('./../models/todo');
var {User}=require('./../models/user');
var {todos,populateTodos,users,populateUsers}=require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


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
        .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err) return done(err);
            // console.log('res',res.error);
            if(res.error) done();

        })
    })
});



describe('GET /todos',()=>{

    it('should load todos',(done)=>{
        request(app)
            .get('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todos.length).toBe(1);
            }).end(()=>done());
    });
});

describe('GET /todos/:id',()=>{
    it('should return a todo',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for an invalid id',(done)=>{
        request(app)
            .get('/todos/2j23cc')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:id',()=>{
    it('should delete a todo',(done)=>{
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todo._id).toBe(todos[0]._id.toHexString());
            }).end((err,resp)=>{
                if(err) return done(err);

                Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
                    expect(todo).toNotExist();
                    done();
                }).catch(done);
            });
    });

    it('should not delete a todo not owned',(done)=>{
        var todo1=todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${todo1}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(401)
            .end((err,resp)=>{
                Todo.findById(todo1).then((todo)=>{
                    expect(todo).toExist();
                    done();
                }).catch(done);
            });
    });

    it('should return 404 for a valid id but inexistant',(done)=>{
        var id=new ObjectID('123oijfken28');
        // var id=todos[0]._id.toHexString();
        // console.log(id.toHexString());
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for an invalid id',(done)=>{
        request(app)
            .delete('/todos/2j23cc')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});


describe('PATCH /todos/:id',()=>{
    it('should update todo, also with completed\'s values',(done)=>{
        var id=todos[0]._id.toHexString();
        var newText='new text of first todo';
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth',users[0].tokens[0].token)
            .send({text:newText,completed:true})
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todo.text).toBe(newText);
                expect(resp.body.todo.completed).toExist();
                expect(resp.body.todo.completedAt).toBeA('number');
            }).end(done);
    });

    it('should update second to setting completedAt to null and completed to false',(done)=>{
        var id=todos[1]._id.toHexString();
        var newText='new text of second todo';
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth',users[1].tokens[0].token)
            .send({text:newText,completed:false})
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todo.text).toBe(newText);
                expect(resp.body.todo.completed).toNotExist();
                expect(resp.body.todo.completedAt).toNotExist();
            }).end(done);
    });
});


// USERS
describe('POST /users',()=>{

    it('should return a user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .send()
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toBe(users[0].email);
            expect(res.body._id).toBe(users[0]._id.toHexString());
        }).end(done);
    });

    it('should not return a user if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .send()
            .expect(401)
            .expect((resp)=>{
                expect(resp.body).toEqual({});
            }).end(done);
    });


    it('should create a user and its token and return it',(done)=>{
        var newUser={
            email:'newuser@testing.com',
            password:'test123'
        };
        request(app)
        .post('/users')
        .send(newUser)
        .expect(200)
        .expect((resp)=>{
            // console.log('resp',resp);
            expect(resp.body.user.email).toBe(newUser.email);
            var newId=resp.body.user._id;
            var x_auth=resp.headers['x-auth'];
            var token=jwt.sign({_id:newId,access:'auth'},'abc123');
            expect(token).toBe(x_auth);
        }).end(done);
    });

    it('should return validation errors',(done)=>{
        request(app)
            .post('/users')
            .send({
                email:'invalid@email',
                password:'2j3j4j'
            })
            .expect(406)
            .end(done);
    });

    it('should not create user if email is duplicated',(done)=>{
        // var email=users[0].email.replace('email1','email333');
        var email=users[0].email;
        request(app)
            .post('/users')
            .send({
                email:email,
                password:'2j3j4j5'
            })
            .expect(406)
            .expect((resp)=>{
                // console.log(resp.body);
                expect(resp.body).toEqual({});
                return true;
            }).end((e)=>done(e));
    });
});


describe('POST /users/login',()=>{
    var user=users[0];
    it('should authenticate successfully',(done)=>{
        request(app)
            .post('/users/login')
            .send(user)
            .expect(200)
            .expect((resp)=>{
                expect(resp.headers['x-auth']).toExist();
                expect(user.email).toBe(resp.body.user.email);
            }).end((err,resp)=>{
                if(err) return done(err);
                return User.findById(resp.body.user._id).then((user)=>{
                    expect(user.tokens).toInclude({token:resp.headers['x-auth'],access:'auth'},(a,b)=>{
                        /* console.log('aaaaaaaaaaaaa',a);
                        console.log('bbbbbbbbbbbbbbbb',b); */
                        return a.token === b.token && a.access === b.access
                    });
                    done();
                }).catch((e)=>done(e));
            });
    });

    it('should not authenticate',(done)=>{
        request(app)
            .post('/users/login')
            .send({email:user.email,password:'22j2j'})
            .expect(400)
            .expect((resp)=>{
                expect(resp.body.email).toNotExist();
            }).end((err,resp)=>{
                if(err) return done(err);
                User.findById(user._id.toHexString()).then((user)=>{
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e)=>{
                    done(e);
                });
            });
    });
});


describe('DELETE /users/me/token',()=>{
    var user=users[0];
    it('should delete a token',(done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth',user.tokens[0].token)
            // .send()
            .expect(200)
            .end((err,resp)=>{
                User.findOne({_id:user._id,"tokens.token":user.tokens[0].token}).then((user)=>{
                    if(user) {
                        return done('failed333!');
                    }
                    done();
                }).catch((e)=>{
                    console.log('###########',e,'#################');
                    done();
                });
            });
    });

    it('should deny for a non-logged access',(done)=>{
        request(app)
            .delete('/users/me/token')
            .send()
            .expect(401)
            .end(done);
    });

});