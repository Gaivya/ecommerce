const mongoose = require("mongoose");

const { Schema } = mongoose;

const productschema = new Schema({
    "store_id": {
        type: Number,
        required: true
    },
    "user_id": {
        type: String,
        required: true
    },
    "date_time": {
        type: Date,
       
    },
    "payment_mode": {
        type: String,
        required: true
    },
    "order_number": {
        type: String,
        required: true
    },
    "product_details": {
        type: String,
        required: true
    },
    "notes": {
        type: String,
        required: true
    },
    "address": {
        type: String,
        required: true
    },
    "driver_id": {
        type: String,
        required: true
    },
    "sub_total": {
        type: Number,
        required: true
    },
    "surcharge": {
        type: Number,
        required: true
    },
    "delivery_charge": {
        type: Number,
        required: true
    },
    "coupon_code": {
        type: String,
        required: true
    },
    "discount": {
        type: Number,
        required: true
    },
    "order_type": {
        type: String,
        required: true
    },
    "quantities": {
        type: String,
        required: true
    },
    "change": {
        type: Number,
        required: true
    },
    "tender_amount": {
        type: Number,
        required: true
    },
    "split_payment": {
        type: String,
        required: true
    },
    "reference_id": {
        type: String,
        required: true
    },
    "status": {
        type: String,
        required: true
    },
    "grand_total": {
        type: Number,
        required: true
    },
    "uid": {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Order", productschema);
