const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');
const {User} = require('./../models/user')

beforeEach(populateUsers)
beforeEach(populateTodos);

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text)
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text)
                done();
        }).catch((e)=>done(e))
    })
    })

    it('should not create todo with invalid body data',(done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2)
                done()
            }).catch((e)=>done(e))
        })
    })


describe('GET/todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2)
        })
        .end(done);
    })
})
})

describe('GET/todos/:id',()=>{
    it('should return todo doc',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    })

    it('should not return doc if todo not found',(done)=>{

        request(app)
        .get(`/todos/${(new ObjectID()).toHexString()}`)
        .expect(404)
        .end(done)
    })

    it('should return 404 for non-object ids',(done)=>{
        request(app)
        .get('/todos/123abc')
        .expect(404) 
        .end(done)
    })
})

describe('DELETE/todo/:id',()=>{
    it('should remove a todo',(done)=>{
        var id=todos[1]._id.toHexString()
        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.docs._id).toBe(id)
        })
        .end((err,res)=>{if(err){
            return done(err)}
          
            Todo.findById(id).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((e)=>{
                return done();
            })
        })
    })

    it('should return 404 if todo not found',(done)=>{
        const Id=new ObjectID().toHexString()

        request(app)
        .delete(`/todos/${Id}`)
        .expect(404)
        .end(done);        
    })

    it('should return 404 for non-objects id',(done)=>{
        request(app)
        .delete(`/todos/123abc`)
        .expect(404)
        .end(done)
    })
})

describe('UPDATE/todos/:id',()=>{
    it('should return updated document',(done)=>{
        
        const id = todos[0]._id.toHexString()
        var text = {text:"this is updated",completed:true,completedAt:333}
        
        request(app)
        .patch(`/todos/${id}`)
        .send(text)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text.text)
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toBe(text.completedAt)
        })
        .end(done)
    })

    it('should clear completedAt when todo is not completed',(done)=>{
        var id = todos[1]._id.toHexString()

    const text = {text:"this is changed text",completed:false}

    request(app)
    .patch(`/todos/${id}`)
    .send(text)
    .expect((res)=>{
        expect(res.body.todo.text).toBe(text.text)
        expect(res.body.todo.completed).toBe(false)
    })
    .end(done)
    })
})

describe('GET/users/me',()=>{
    it('should return user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)                })
        .end(done)
    })

    it('should return user if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })
        .end(done)
    })
})

describe('POST/users',()=>{
    it('should create a user',(done)=>{
        const email='asdf@g.com'
        const password='12345678'
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist()   //'x-auth' --- has '-' with it so [] notation is used not . notation.
            expect(res.body._id).toExist() 
            expect(res.body.email).toBe(email)
         })
        .end((err)=>{
            if(err){
                return done(err)
            }
            User.findOne({email}).then((user)=>{
                expect(user).toExist()
                expect(user.password).toNotBe(password)
                done()
            }).catch((e)=>{
                done(e)
            })
        })
    })

    it('should return validation error if request invalid',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:'asd',
            password:'assd'
        })
        .expect(400)
   
        .end(done)
    })

    it('should not create user if email in use',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:users[0].email,
            password:'ascasdc'
            })
        .expect(400)
        .end(done);
        
    })
})

