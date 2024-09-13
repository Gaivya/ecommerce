const mongoose=require("mongoose")

const productschema = new mongoose.Schema({

    "currencySymbol":{
        type:String
    },
    "currencySide":{
        type:String
    },
    "appDirection":{
        type:String
    },
    "logo":{
        type:String
    },
    "twillo":{
        type:String
    },
    "creds":{
        type:String
    },
    "delivery":{
        type:String
    },
    "reset_pwd":{
        type:String
    },
    "user_login":{
        type:String
    },
    "store_login":{
        type:String
    },
    "driver_login":{
        type:String
    },
    "web_login":{
        type:String
    },
    "web_category":{
        type:String
    },
}

)


module.exports=mongoose.model("setting",productschema);