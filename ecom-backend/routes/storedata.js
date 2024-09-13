const express = require("express");
const router = express.Router();
const storedata = require("../models/storedata");


router.post("/", async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await storedata.find();
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
})

router.post("/getstore",  async (req, res) => {
    try {
        const { uid } = req.body;

        const getbyid = await storedata.find({ uid: uid });

        if(getbyid.length === 0)
           return res.status(400).json({msg:"uid not found"})

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
