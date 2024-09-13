const mongoose=require("mongoose")

const productschema = new mongoose.Schema({

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


}

)


module.exports=mongoose.model("policies",productschema);