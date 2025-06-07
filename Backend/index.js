const express=require('express')
const app=express();
require('dotenv').config();
const db=require('./db');
db();
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cors=require('cors');
const corsOptions = {
  origin: ['http://localhost:5173','https://cookverse.vercel.app'], 
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
const passport=require('passport');
const session=require('express-session');
require('./passport');

app.use(session({
  secret:process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
   store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL, 
    ttl:24 * 60 * 60
  }),
   cookie: {
    httpOnly: true,
    secure: true,             
    sameSite: 'none',           
    maxAge: 24 * 60 * 60 * 1000  
  }
}));

app.use(passport.initialize());
app.use(passport.session());

 
const authRoute=require('./routes/auth');
const dishRoute=require('./routes/dish')
const communityRoute=require('./routes/community')
app.use('/auth',authRoute);
app.use('/dish',dishRoute);
app.use('/community',communityRoute);
const port=3000;
app.listen(port,(req,res)=>{
    console.log(`listening on  port no. ${port}`)
})
