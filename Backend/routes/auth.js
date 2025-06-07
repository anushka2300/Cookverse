const passport = require('passport');
const router=require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

 
router.post('/signup',async(req,res)=>{
  try{
    const {name,email,password}=req.body;
     const existingUser = await User.findOne({ email });
        if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    
    const hash=await bcrypt.hash(password,10);
    const user=new User({name,email,password:hash});
    await user.save();
    res.status(201).json({msg:'user registered'});
  }
  catch(err){
    res.status(500).json({error:err})
  }
})

router.post('/login',passport.authenticate('local'),(req,res)=>{
  
    res.json(req.user);
})

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    successRedirect: `${process.env.CLIENT_URL}/`
  })
);
 

router.get('/logout', async (req, res, next) => {
  try {
    req.logout(function(err) {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie('connect.sid');  
        res.redirect(process.env.CLIENT_URL);
      });
    });
  } catch (err) {
    next(err);
  }
});

router.get('/user', (req, res) => {
  console.log("user in fetch:"+(req.user));
  res.json(req.user || null);
});

module.exports=router;