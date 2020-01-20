//routes

const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const User     = require('../models/user')
const config   = require('../config/database')
//Register route

router.post('/register',(req,res,next)=>{
  let newUser = new User({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password
  });
  User.addUser(newUser,(err,user)=>{
    if (err) {
      res.json({success:false,msg:'Failed to register the user'})
    }else {
      res.json({success:true,msg:'User has registerd'})
    }
  });
})
//login route

router.post('/login',(req,res,next)=>{
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username,(err,user)=>{
    if (err) throw err;
    if (!user) {
      return res.json({success:false,msg:'user not found'})
    }else {
      User.comparePassword(password,user.password,(err,isMatch)=>{
        if(err) throw err;
        if (isMatch) {
          const token = jwt.sign({user},config.secret,{
            expiresIn:608200
          });
          res.json({
            success:true,
            msg:"Welcome back : " + user.name,
            token: "JWT " + token,
            user :{
              id:user._id,
              name:user.name,
              email:user.email,
              username:user.username
            }
          });
        }else {
          return res.json({success:false,msg:'password incorrect'})
        }
      })
    }
  })
})
//profile route

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
   res.json({user: req.user});
})
//validate route





module.exports = router
