// const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to Server');
    }
    console.log('connected to MongoDB Server');
    
    const db=client.db('TodoApp') 

    // db.collection('Todos').insertOne({
    //     text:'something to do',
    //     completed:false
    // },(err,result)=>{
    //     if(err){
    //        return  console.log('Unable to insert',err);
    //     }else{
    //         console.log(JSON.stringify(result.ops,undefined,2))
    //     }
    // });

    // db.collection('Users').insertOne({
    //     name:'My name',
    //     age:25,
    //     location:'world'
    // },(err,result)=>{
    //     if(err){
    //         console.log('It is an error');
    //     }else{
    //         console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2))
    //     }
    // })
    client.close();

});