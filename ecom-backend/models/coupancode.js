const mongoose =require("mongoose");

const productSchema=new mongoose.Schema({
   
    "coupan_code":{
        type:String,
        required:true,
       
    },
    "description":{
        type:String,
        required:true,
       
    },
    "discount_type":{
        type:String,
        required:true,
        
    },
    "discount_value":{
        type:String,
        required:true,
        
    },
    "status":{
        type:String,
        required:true,
        
    },
    "exp_date":{
        type:String,

        
    },
    "created_at": {
        type: Date,
        default: Date.now,
        required:true,
    }
})

module.exports=mongoose.model("coupon",productSchema);    