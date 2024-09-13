const mongoose=require("mongoose")

const productschema = new mongoose.Schema({

        "first_name":{
            type:String
        },
        "last_name":{
            type:String
        },
        "email":{
            type:String
        },
        "password":{
            type:String
        },
        "gender":{
            type:String
        },
        "city":{
            type:String
        },
        "address":{
            type:String
        },
        "mobile":{
            type:String
        },
        "status":{
            type:String
        },
        "cover":{
            type:String
        },
        "current":{
            type:String
        },
        "others":{
            type:String
        },
        "date":{
            type:String
        },
        "country_code":{
         type:String
        }


}

)


module.exports=mongoose.model("driver",productschema);