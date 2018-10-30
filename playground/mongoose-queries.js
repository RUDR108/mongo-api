const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user');

// var id="5bd5f3c79e0b7f702ecdfde7";

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

// Todo.find({
//     _id:id
// }).then((todos)=>{
//     console.log('Todos:',todos)
// });
                                    
// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log('Todos:',todo)
// })

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todos:',todo)
// }).catch((e)=>console.log(e))

id="5bd40853827050480ab718f4";

if(!ObjectID.isValid(id)){
    return console.log('ID not valid.');
}

User.findById(id).then((todo)=>{
    if(!todo){
        return console.log('ID not found')
    }
    console.log(JSON.stringify(todo,undefined,2))
}).catch((e)=>console.log(e))
















