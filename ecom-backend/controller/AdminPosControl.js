const express = require("express");
const router = express.Router();
const order = require("../models/order");



async function getPaymentModeData(mode, startDate, endDate) {
    try {
        const start =startDate;
        const end = endDate
       
        const result = await order.aggregate([
            { $match: { payment_mode: mode,
                date_time: { $gte: start, $lte: end }
            } }, 
            {
                $group: {
                    _id: null,
                    totalSale: {$sum: 1},
                    totalSubTotal: { $sum: "$sub_total" },
                    totalDiscount: { $sum: "$discount" },
                    totalSurcharge: { $sum: "$surcharge" },
                    totalprice: { $sum: "$grand_total" }
                }
            }
        ]);
        console.log(result)
        if (result.length === 0) {
            return {
                totalSale: 0,
                totalSubTotal: 0,
                totalDiscount: 0,
                totalSurcharge: 0,
                totalDeliveryCharge: 0,
                totalQuantity: 0
            };
        }

        return result[0];
    } catch (err) {
        console.error("Error aggregating data: ", err);
        throw err;
    }
}

async function fetchAllPaymentData(startDate, endDate) {
    console.log(startDate+"ra")
    try {
        const eftposData = await getPaymentModeData('eftpos',startDate, endDate);
        console.log('EFTPOS Data:', eftposData);
        
        const cashData = await getPaymentModeData('cash',startDate, endDate);
        console.log('Cash Data:', cashData);
        
        const splitPaymentData = await getPaymentModeData('split_payment',startDate, endDate);
        console.log('Split Payment Data:', splitPaymentData);
        
        const paymentDataArray = [
            { mode: 'eftpos', data: eftposData },
            { mode: 'cash', data: cashData },
            { mode: 'split_payment', data: splitPaymentData }
        ];
        
        return paymentDataArray;
    } catch (err) {
        console.error('Error fetching payment mode data:', err);
        throw err;
    }
}

module.exports = {getPaymentModeData,fetchAllPaymentData };
