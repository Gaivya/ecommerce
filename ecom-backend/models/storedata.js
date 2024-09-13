const mongoose=require("mongoose")

const productschema = new mongoose.Schema({
    
    
        "uid": {
            type:String,
            required: true
        },
        "name":{
            type:String,
            required: true
        },
        "mobile": {
            type:String,
            required: true
        },
        "lat":{
            type:String,
            required: true
        },
        "lng": {
            type:String,
            required: true
        },
        "verified": {
            type:String,
            required: true
        },
        "address": {
            type:String,
            required: true
        },
        "descriptions": {
            type:String, 
            required: true
        },
        "images": {
            type:String,
            required: true
        },
        "cover": {
            type:String,
            required: true
        },
        "status":{
            type:String,
            required: true
        },
        "commission": {
            type:String,
            required: true
        },
        "open_time":{
            type:String,
            required: true
        },
        "close_time": {
            type:String,
            required: true
        },
        "isClosed": {
            type:String,
            required: true
        },
        "certificate_url": {
            type:String,
            required: true
        },
        "certificate_type":{
            type:String,
            required: true
        },
        "rating": {
            type:String,
            required: true
        },
        "total_rating":{
            type:String,
            required: true
        },
        "cid":{
            type:String,
            required: true
        },
    }

)


module.exports=mongoose.model("storedata",productschema);