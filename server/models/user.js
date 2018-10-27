var mongoose=require('mongoose');

//user model
var User = mongoose.model('User',{
    email:{
        type:String,
        trim:true,
        required:true,
        minlength:1
    }
})

module.exports={User};