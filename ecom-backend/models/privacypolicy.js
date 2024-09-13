const mongoose =require("mongoose");

const privacySchema=new mongoose.Schema({
   
    "name":{
        type:String,
        required: true
        
    },
    "content":{
        type:String,
        required: true
    },
    "status":{
        type:String,
        required: true
        
        
    }
})

module.exports=mongoose.model("privacy",privacySchema);    
