const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const bcrypt=require('bcryptjs');
const User=require('./models/User');
passport.serializeUser((user,done)=>done(null,user.id));

passport.deserializeUser(async (id,done)=>{
    const exists=await User.findById(id);
    done(null,exists);
});

passport.use(new LocalStrategy({
    usernameField:'email'
},
async (email,password,done)=>{
    const existingUser=await User.findOne({email});
    if(!existingUser ) return done(null,false);
    const isMatch=await bcrypt.compare(password,existingUser.password);
    return isMatch ? done(null,existingUser) : done(null,false);
}
))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://cookverse.onrender.com/auth/google/callback'
},
async(accessToken, refreshToken, profile, done)=>{
    try{
   
  let user  = await User.findOne({ googleId: profile.id });
  if (!user) {
      user  = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value
    });
  }
   return done(null, user);
}
catch(err){
     return done(err, null);
}
}))