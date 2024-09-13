const express = require("express");
const router = express.Router();
const {fetchAllPaymentData}  = require("../controller/AdminPosControl");



router.get("/", async (req, res) => {
    try {
        const { startDate, endDate } = req.body
        console.log(req.body)
        const paymentDataArray = await fetchAllPaymentData(startDate, endDate);
        res.json(paymentDataArray);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching payment data' });
    }
});

module.exports = router;
