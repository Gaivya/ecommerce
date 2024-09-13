const mongoose=require("mongoose")

const productschema = new mongoose.Schema({

    "name":{
        type:String,
        required: true
    },
    "env":{
        type:String,
        required: true
    },
    "creds":{
        type:String,
        required: true
    },
    "status":{
        type:String,
        required: true
    }


}

)


module.exports=mongoose.model("payment",productschema);