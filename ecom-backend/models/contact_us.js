const mongoose =require("mongoose");

const contactusSchema=new mongoose.Schema({
   
    "name":{
        type:String,
        required: true
        
    },
    "email":{
        type:String,
        required: true
    },
    "message":{
        type:String,
        required: true
    },
    "created_at": {
        type: Date,
        default: Date.now,
        required:true,
    }

})

module.exports=mongoose.model("contact_us",contactusSchema);    
