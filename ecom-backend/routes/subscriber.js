const express = require("express");
const router = express.Router();
const subscriber = require("../models/subscriber");


router.get("/", async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await subscriber.find();
       
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
})


router.post("/addsubscriber",async (req, res) => {
    const data = req.body;
    try {

      
        await subscriber.create({ ...data })
        res.send({ message: "Success" })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

module.exports = router;
