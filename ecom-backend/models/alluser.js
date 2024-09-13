const mongoose=require("mongoose")

const productschema = new mongoose.Schema({

        "first_name": {
            type:String,
         
        },
        "last_name": {
            type:String,
          
        },
        "email": {
            type:String,
         
        },
        "password": {
            type:String,
          
        },
        "gender": {
            type:String,
           
        },
        "type": {
            type:String
         
        },
        "status": {
            type:String
        },
           
        "cover": {
            type:String
           
        },
        "mobile": {
            type:String
           
        },
        "created_at": {
            type:String
            
        },
        "country_code": {
            type:String
            
        },
        "address": {
            type:String
            
        }
      

})


module.exports=mongoose.model("alluser",productschema);