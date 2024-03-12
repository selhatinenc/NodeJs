const {default: mongoose} = require('mongoose');

const dcConnect= ()=>{
    try{  
        const conn=mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected successfully`)
    }catch(err){
    
        console.log("Database connection failed");
    }
}
module.exports=dcConnect;
