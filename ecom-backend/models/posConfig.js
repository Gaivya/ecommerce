const mongoose =require("mongoose");

const productSchema=new mongoose.Schema({
   
    "store_ip":{
        type:String,
       
    },
    "mac_address":{
        type:String,
       
    },
    "weight_scale_port":{
        type:String,  
    },
    "store":{
        type:String,  
    },
    "boud_rate":{
        type:Number,  
    },
    "data_bits":{
        type:Number,  
    },
    "parity":{
        type:String,  
    },
    "stop_bits":{
        type:Number,  
    },
    "flow_type":{
        type:Boolean,  
    },
    "printer_ip":{
        type:String,  
    },
    "printer_port":{
        type:Number,  
    },
    "surcharge":{
        type:Number,  
    },
    "status":{
        type:String,  
    },
    "pos_name":{
        type:String,  
    }
})

module.exports=mongoose.model("posconfig",productSchema);    