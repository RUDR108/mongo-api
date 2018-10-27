const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
if(err){
    return console.log("You can not connect to MongoDB server");
}

const db=client.db('TodoApp');


// db.collection('Users').deleteMany({name:'My name'}).then((result)=> {
//     console.log(result);
// })

// db.collection('Todos').deleteOne({text:'something I am trying after a lot of time.'}).then((result)=>{
//     console.log(result);
// })

db.collection('Users').findOneAndDelete({text:'Something to do'}).then((result)=>{
   console.log(result);
})

client.close();
});