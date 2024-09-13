const mongoose=require("mongoose")

const productschema = new mongoose.Schema({

    "cover":{
        type:String,
        required: true
    },
    "link":{
        type:String,
        required: true
    },
    "type":{
        type:String,
        required: true
    },
    "message":{
        type:String,
        required: true
    },
    "status":{
        type:String,
        required: true
    },
    "position":{
        type:String,
        required: true
    },


}

)


module.exports=mongoose.model("banner",productschema);