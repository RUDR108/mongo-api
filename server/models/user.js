const mongoose=require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const _ =require('lodash');
const bcrypt=require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email:{
    type:String,
    trim:true,
    required:true,
    minlength:1,
    unique:true,
    validate:{
        validator:validator.isEmail,
        message:'{VALUE} is not valid email'
    }
},
password:{
    type:String,
    require:true,
    minLength:6
},
tokens:[{
  access:{
    type:String,
    required:true
  } ,
  token:{
    type:String,
    required:true
  } 
}]
});

UserSchema.methods.toJSON= function(){
  var user=this;
  var userObject = user.toObject()

  return _.pick(userObject,['_id','email'])
}

//UserSchema.model --- to add functions to schema(instance methods)

UserSchema.methods.generateAuthToken=function(){
  var user = this//this denotes to indivisual token
  var access =  'auth';
  var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

 user.tokens= user.tokens.concat([{access,token}]);
 return  user.save().then(()=>{
    return token
  })
}

//UserSchema.statics --- (sets up model method)

UserSchema.statics.findByToken = function(token){
  var User=this//this denotes model
  var decoded

  try{
    decoded=jwt.verify(token,'abc123')
  }catch(e){
    return Promise.reject();
  }
 
  return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  })
}

UserSchema.statics.findByCredentials=function(email,password){
  var User = this

  return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject()
    }

    return new Promise((resolve,reject)=>{
       bcrypt.compare(password,user.password,(err,res)=>{
         if(res){
           resolve(user);
         }
         else{
           reject()
         }
       })
    })
  })
}


UserSchema.pre('save',function(next){
var user = this

if(user.isModified('password')){
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(user.password,salt,(err,hash)=>{
      user.password=hash
      next()
    })
  })
}else{
  next()
}
})

//user model
var User = mongoose.model('Users',UserSchema)

module.exports={User};






















