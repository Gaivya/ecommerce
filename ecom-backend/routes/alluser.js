const express = require("express");
const router = express.Router();
const alluser = require("../models/alluser");
const order = require("../models/order");


router.get("/", async (req, res) => {
    try {
        const { url } = req;
        if (url.includes('#') || url.includes('?') || url.includes('&')) {
            return res.status(404).json({ "error": "Invalid API request" });
        }
        const data = await alluser.find();
        
        res.send(data)

    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong")
    }
})



router.post("/getuserbyid", async (req, res) => {
        try {
            const { _id } = req.body;
    
            const getbyid = await alluser.find({ _id: _id });
    
            res.status(200).json(getbyid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post("/updateuseraddress",async (req, res) => {
        const { _id, address } = req.body;
        try {
            if (!_id || !address) {
                return res.status(400).send({ success: false, message: "id and address are required" });
            }
    
            const updatedConfig = await alluser.findOneAndUpdate(
                { _id: _id },
                { $set: { address: address } },
                { new: true }
            );
    
            if (!updatedConfig) {
                return res.status(404).send({ msg: "User not found" });
            }
    
            res.status(200).send({ success: true, msg: updatedConfig });
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    })


    
    router.post("/updateuser",async (req, res) => {
    const { _id } = req.body;
    try {

        const updatedConfig = await alluser.findOneAndUpdate(
            { _id: _id },
            { $set: req.body },
            { new: true }
        );
        console.log(updatedConfig)
        if (!updatedConfig) {
            res.status(404).send({ msg: "not found" });
        }
        res.status(200).send({ success: true, msg: updatedConfig });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

})



router.post("/getorderbyuserid",async (req, res) => {
    try {
        const { user_id } = req.body;

        const getbyid = await order.find({ user_id: user_id });

        res.status(200).json(getbyid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
