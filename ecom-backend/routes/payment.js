const express = require("express");
const router = express.Router();
const payment = require("../models/Payment");


router.get("/", async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await payment.find();
       
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
})




module.exports = router;
