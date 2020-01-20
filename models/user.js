//models

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


//User Schema
const userSchema = mongoose.Schema({
  name:{
    type:String
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  username:{
    type:String,
    required:true,
    max:10,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  regdate:{
    type:Date,
    default:Date.now
  }
})


const User = module.exports = mongoose.model("User",userSchema)

//find by id
module.exports.getUserById = (id,callback)=>{
  User.findById(id,callback)
}

//find by username or Email

module.exports.getUserByUsername = (username,callback)=>{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)) {
    const query = {email:username}
    User.findOne(query,callback)
  }else{
    const query = {username}
    User.findOne(query,callback)
  }
}


//add user
module.exports.addUser = (newUser,callback)=>{
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(newUser.password,salt,(err,hash)=>{
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback)
    });
  });
}


//comparePassword
module.exports.comparePassword = (password,hash,callback)=>{
  bcrypt.compare(password,hash,(err,isMatch)=>{
    if (err) throw err;
    callback(null,isMatch)
  });
};
