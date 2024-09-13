const mongoose = require("mongoose");

const { Schema } = mongoose;

const paymentDetailsSchema = new Schema({
    sales_count: {
        type: Number,
        required: true
    },
    sub_total: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    surcharge: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
   
}, { _id: false }); 

const dailySummarySchema = new Schema({
    eftpos: {
        type: paymentDetailsSchema,
        required: true
    },
    cash: {
        type: paymentDetailsSchema,
        required: true
    },
    split_payment: {
        type: paymentDetailsSchema,
        required: true
    },
    all: {
        type: paymentDetailsSchema,
        required: true
    }
}, );

module.exports = mongoose.model("DailySummary", dailySummarySchema);
