require('./config/config');
const  _=require('lodash');
const {ObjectID} = require('mongodb');
const express=require('express');
const bodyParser=require('body-parser');
const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/todos');
const {User}=require('./models/user');
const {authenticate} = require('./middleware/authenticate')

const app = express();
const port=process.env.PORT||3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
 var todo = new Todo({
     text:req.body.text
 })

 todo.save().then((docs)=>{
     res.send(docs);
 },(e)=>{
     res.status(400).send(e);
 });
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;

    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send()
        }
        res.send({todo})
    }).catch((e)=>{
        res.status(404).send();
    })
    })

     app.delete('/todos/:id',(req,res)=>{
        const id=req.params.id

        if(!ObjectID.isValid(id)){
            return res.status(404).send()
        }

        Todo.findByIdAndRemove(id).then((docs)=>{
            if(!docs){
                res.status(404).send()
            }
            res.send({docs})
        }).catch((e)=>{
            res.status(404).send()
        })
     })

     app.patch('/todos/:id',(req,res)=>{
         const id=req.params.id
         var body = _.pick(req.body,['text','completed','completedAt'])

         if(!ObjectID.isValid(id)){
            return res.status(404).send()
         }

         Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
            if(!todo){
                return res.status(404).send()
            }

            res.send({todo});
         }).catch((e)=>{
             res.status(404).send()
         })
     })

    app.post('/users',(req,res)=>{
         var body = _.pick(req.body,['email','password'])
         var user = new User(body); 
         //generateAuthToken
         //findByToken
         user.save().then(() => {
             return user.generateAuthToken();
             //res.send(user);
         }).then((token)=>{
            res.header('x-auth',token).send(user)
         }).catch((e)=>{
            res.status(400).send(e)
         })
     })

    app.get('/users/me',authenticate,(req,res)=>{
       res.send(req.user)  
    })

    //POST/user/login {email,password}
    app.post('/users/login',(req,res)=>{
        var body = _.pick(req.body,['email','password'])

        User.findByCredentials(body.email,body.password).then((user)=>{
           return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user)
           })
        }).catch((e)=>{
            res.status(400).send(e)
        })
    })


app.listen(port,()=>{//listening at port 3000
    console.log(`Started on port ${port}`);
});

module.exports={app};      