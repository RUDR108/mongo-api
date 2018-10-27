const {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to server.');
    }

    console.log('connected to server.');

    const db = client.db('TodoApp'); 

    db.collection('Todos').insertOne({
        text:"something I am trying after a lot of time."
    },(err,result)=>{
        if(err){
            return console.log('Unable to put data in database.')
        }else{
            return console.log(JSON.stringify(result.ops,undefined,2))
        }
    })    


client.close();
})