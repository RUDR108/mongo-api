const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('You can not connect to database');
    }
    console.log('Connected to MongoDB server');

    const db=client.db('TodoApp');
    
    // db.collection('Todos').find({
    //     _id:new ObjectID('5bc2df6a430c6c2176de5e1e')
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log('Cant connect to database');
    // });

    db.collection('Todos').find().count().then((count)=>{
        console.log(`Todos count:${count}`);
        // console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log('Cant connect to database');
    });
    
    
    // db.close();
});