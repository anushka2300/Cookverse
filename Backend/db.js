const mongoose=require('mongoose');
require('dotenv').config();
const db=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected");             
    }
    catch(err){
        console.log("not connected:"+err)
    }
}

module.exports=db;