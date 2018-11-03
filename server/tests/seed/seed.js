const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken')
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id:userOneId,
    email:'asdf@ail.com',
    password:'userOnePass',
    tokens:[{
        access:'auth',
        token: jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
    }]
},{
    _id:userTwoId,
    email:'asdfg@ail.com',
    password:'userTwoPass',
  
}]

const todos=[{
    _id:new ObjectID(),
    text:"first test todo"
},{
    _id:new ObjectID(),
    text:"second test case",
    completed:true,
    completedAt:333
}]

const populateTodos = (done)=>{
        Todo.remove({}).then(()=>{
            return Todo.insertMany(todos);
        }).then(()=>done())
}

const populateUsers=(done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();            //insertMany dont support middleware so to save password hashed we have to do it this way.
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne,userTwo])
    }).then(()=>done())
    .catch((e)=>{

    });
}

module.exports={
    todos,
    populateTodos,
    users,
    populateUsers
}