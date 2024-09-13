const mongoose =require("mongoose");

const menuSchema=new mongoose.Schema({
   
    "menu":{
        type:String,
        required: true
        
    },

})
// console.log(mongoose.model('Categories',productSchema))
module.exports=mongoose.model("menu",menuSchema);    
