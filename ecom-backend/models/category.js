const mongoose =require("mongoose");

const productSchema=new mongoose.Schema({
   
    "name":{
        type:String,
        required: true
        
    },
    "cover":{
        type:String,
        required: true
    },
    "status":{
        type:String,
        
        
    }
})
// console.log(mongoose.model('Categories',productSchema))
module.exports=mongoose.model("category",productSchema);    
