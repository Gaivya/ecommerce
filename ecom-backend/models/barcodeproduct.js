const mongoose = require("mongoose");

const { Schema } = mongoose;

const barcodeproductSchema = new Schema({
    "barcode": {
        type: String,
        required: true
    },
    "stock_quantity": {
        type: Number,
        required: true
    },
    "store_id": {
        type:String,
      
    },
    "cover": {
        type:String,
     
    },
    "name": {
        type:String,
      
    },
    "images": {
        type:String,
     
    },
    "original_price": {
        type:String,
      
    },
    "sell_price": {
        type:String,
       
    },
    "discount": {
        type:String
     
    },
    "descriptions": {
        type:String},
       
    "exp_date": {
        type:String
     
    },
    "type_of": {
        type:String
       
    },
    "rating": {
        type:String
       
    },
    "status": {
        type:String
     
    },
    "in_offer": {
        type:String
       
    },
    "variations": {
        type:String
      
    },
    "size": {
        type:String
       
    },
    "category": {
        type:String
       
    },
    "in_stock": {
        type:String
       
    },
    "unit": {
        type:String
        
    },
    "quantity": {
        type:String
      
    },
    "sub_category": {
        type:String
        
    },

  
});

module.exports = mongoose.model("Barcode_product", barcodeproductSchema);
