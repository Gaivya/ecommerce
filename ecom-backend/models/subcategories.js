const mongoose=require("mongoose");

const productSchema =new mongoose.Schema({
    "store_id": {
        type:String,
      
    },
    "name": {
        type:String,
        required:true,
    },
    "cover": {
        type:String,
        required:true,
    },
    "status":{
        type:String,
        required:true,
    },
    "category": {
        type:String,
        required:true,
    },
})

module.exports=mongoose.model("subcategory",productSchema);